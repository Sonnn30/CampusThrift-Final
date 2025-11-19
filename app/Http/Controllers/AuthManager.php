<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Product;
use Illuminate\Support\Facades\Log;

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

        $locale = $request->route('locale') ?? 'id';
        return redirect()->route('home', ['locale' => $locale]);
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
                'category' => is_string($product->category) ? strtolower($product->category) : ($product->category ?? null),
                'images' => $product->getMedia('product_images')->map(fn($m) => $m->getUrl()),
                'user_id' => $product->user_id,
                'seller_id' => $product->user_id,
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
        $request->validate([
            'email' => 'required',
            'password' => 'required',
            'role' => 'required'
        ]);

        $user = User::where('email', $request->email)->first();
        $locale = $request->route('locale') ?? 'id';
        if(!$user){
            return redirect()->route('SignUp', ['locale' => $locale])->with('error', 'Your Account Have not Registered yet, Please Sign Up');
        }
        $credentials = $request->only('email', 'password');
        if(Auth::attempt($credentials)){
            $request->session()->regenerate();


            // redirect sesuai role
            if($request->role === 'Buyer'){
                return redirect()->route('BuyerHome', ['locale' => $locale]);
            } elseif($request->role === 'Seller'){
                return redirect()->route('SellerHome', ['locale' => $locale]);
            } else {
                return redirect()->route('home', ['locale' => $locale]);
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

        Auth::login($user);
        $request->session()->put('role', $user->role);

        $locale = $request->route('locale') ?? 'id';
        if ($user->role === "Buyer") {
            return redirect()->route('BuyerHome', ['locale' => $locale]);
        } else {
            return redirect()->route('SellerHome', ['locale' => $locale]);
        }
    }
}
