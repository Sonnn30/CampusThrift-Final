<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Cache;
use Carbon\Carbon;
use App\Models\User;
use App\Models\Product;

class AuthManager extends Controller
{
    function login(){
        return Inertia::render('login');
    }
    function SignUp(){
        return Inertia::render("SignUp");
    }

    function logout(Request $request) {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }

public function UserDashboard()
{
    $user = Auth::user();
    $isLoggedIn = Auth::check();

    // Ambil semua produk
    $products = Product::with('media', 'user')
        ->get()
        ->map(function ($product) {
            return [
                'id' => $product->id,
                'product_name' => $product->product_name,
                'product_price' => $product->product_price,
                'description' => $product->description,
                'seller_name' => $product->user->name ?? 'Unknown Seller',
                'images' => $product->getMedia('product_images')->map(fn($m) => $m->getUrl()),
            ];
        });

    return Inertia::render('ProductCatalog', [
        'user' => $user,
        'isLoggedIn' => $isLoggedIn,
        'role' => $user?->role ?? 'Guest',
        'products' => $products,
    ]);
}

    function loginPost(Request $request){
        // Role-based email validation using regex
        $role = $request->input('role');
        $sellerPattern = '/^[A-Za-z0-9._%+-]+@binus\\.ac\\.id$/i';
        $buyerPattern  = '/^[A-Za-z0-9._%+-]+@(gmail\\.com|yahoo\\.com|binus\\.ac\\.id)$/i';

        $emailRegex = $role === 'Seller' ? $sellerPattern : $buyerPattern;

        $request->validate([
            'email' => ['required', 'string', 'max:255', 'regex:' . $emailRegex],
            'password' => 'required',
            'role' => 'required|in:Buyer,Seller'
        ]);

        $user = User::where('email', $request->email)->first();
        if(!$user){
            return redirect()->route('SignUp')->with('error', 'Your Account Have not Registered yet, Please Sign Up');
        }

        // block login if email not verified
        if (is_null($user->email_verified_at)) {
            // ensure a code exists and (re)send if needed
            $this->sendOrResendVerificationCode($user);
            return back()->withErrors([
                'email' => 'Please verify your email. A verification code has been sent.'
            ])->onlyInput('email');
        }
        $credentials = $request->only('email', 'password');
        if(Auth::attempt($credentials)){
            $request->session()->regenerate();

            // redirect sesuai role
            if($request->role === 'Buyer'){
                return redirect()->route('BuyerHome');
            } elseif($request->role === 'Seller'){
                return redirect()->route('SellerHome');
            } else {
                return redirect()->intended('/');
            }
        }
        return back()->withErrors([
            'email' => "Email or Password Wrong"
        ])->onlyInput('email');
    }

    function SignUpPost(Request $request){
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
            'role' => 'required|in:Buyer,Seller',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'role' => $request->role
        ]);

        // send verification code and redirect to verification page
        $this->sendOrResendVerificationCode($user);
        $request->session()->put('pending_verification_user_id', $user->id);

        return redirect()->route('verification.notice')
            ->with('status', 'Verification code sent to your email. Please enter the code to verify.');
    }

    // Show verify email page
    public function showVerifyEmail(Request $request)
    {
        $userId = $request->session()->get('pending_verification_user_id');
        if (!$userId) {
            return redirect()->route('login');
        }
        return Inertia::render('VerifyEmail', [
            'email' => optional(User::find($userId))->email,
        ]);
    }

    // Verify email by code
    public function verifyEmailPost(Request $request)
    {
        $request->validate([
            'code' => ['required', 'digits:6'],
        ]);

        $userId = $request->session()->get('pending_verification_user_id');
        if (!$userId) {
            return redirect()->route('login')->with('error', 'No verification in progress.');
        }

        $cached = Cache::get($this->verificationCacheKey($userId));
        if (!$cached) {
            return back()->withErrors(['code' => 'Verification code expired. Please resend.']);
        }

        if ($cached['code'] !== $request->input('code')) {
            return back()->withErrors(['code' => 'Invalid verification code.']);
        }

        $user = User::find($userId);
        if (!$user) {
            return redirect()->route('login')->with('error', 'User not found.');
        }

        $user->email_verified_at = Carbon::now();
        $user->save();

        Cache::forget($this->verificationCacheKey($userId));
        $request->session()->forget('pending_verification_user_id');

        Auth::login($user);
        $request->session()->put('role', $user->role);

        if ($user->role === "Buyer") {
            return Inertia::location('/Buyer');
        } else {
            return Inertia::location('/Seller');
        }
    }

    // Resend code
    public function resendVerification(Request $request)
    {
        $userId = $request->session()->get('pending_verification_user_id');
        if (!$userId) {
            return redirect()->route('login')->with('error', 'No verification in progress.');
        }
        $user = User::find($userId);
        if (!$user) {
            return redirect()->route('login')->with('error', 'User not found.');
        }
        $this->sendOrResendVerificationCode($user);
        return back()->with('status', 'Verification code resent.');
    }

    private function sendOrResendVerificationCode(User $user): void
    {
        $key = $this->verificationCacheKey($user->id);
        $existing = Cache::get($key);
        if ($existing && isset($existing['expires_at']) && Carbon::parse($existing['expires_at'])->isFuture()) {
            // keep existing valid code to avoid spamming
            $code = $existing['code'];
            $expiresAt = Carbon::parse($existing['expires_at']);
        } else {
            $code = str_pad((string)random_int(0, 999999), 6, '0', STR_PAD_LEFT);
            $expiresAt = Carbon::now()->addMinutes(15);
            Cache::put($key, ['code' => $code, 'expires_at' => $expiresAt->toIso8601String()], $expiresAt);
        }

        // simple mail sending without a dedicated Mailable
        try {
            Mail::raw("Your CampusThrift verification code is: {$code}. It expires at {$expiresAt->toDateTimeString()}.", function ($message) use ($user) {
                $message->to($user->email)
                    ->subject('Verify your email');
            });
        } catch (\Throwable $e) {
            // swallow to avoid exposing errors to users; logs will capture
        }
    }

    private function verificationCacheKey(int $userId): string
    {
        return 'verify_code_' . $userId;
    }
}
