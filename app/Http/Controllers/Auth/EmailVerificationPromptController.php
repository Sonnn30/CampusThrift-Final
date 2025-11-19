<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmailVerificationPromptController extends Controller
{
    /**
     * Show the email verification prompt page.
     */
    public function __invoke(Request $request): Response|RedirectResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            $locale = $request->route('locale') ?? 'id';
            $userRole = $request->user()->role ?? 'Buyer';
            if ($userRole === 'Buyer') {
                return redirect()->intended(route('BuyerHome', ['locale' => $locale], absolute: false));
            } elseif ($userRole === 'Seller') {
                return redirect()->intended(route('SellerHome', ['locale' => $locale], absolute: false));
            }
            return redirect()->intended(route('home', ['locale' => $locale], absolute: false));
        }
        return Inertia::render('auth/verify-email', ['status' => $request->session()->get('status')]);
    }
}
