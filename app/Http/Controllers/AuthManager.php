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
        $request->validate([
            'email' => 'required',
            'password' => 'required',
            'role' => 'required'
        ]);

        $user = User::where('email', $request->email)->first();
        if(!$user){
            return redirect()->route('SignUp')->with('error', 'Your Account Have not Registered yet, Please Sign Up');
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

        Auth::login($user);
        $request->session()->put('role', $user->role);

        if ($user->role === "Buyer") {
            return Inertia::location('/Buyer');
        } else {
            return Inertia::location('/Seller');
        }
    }
}
