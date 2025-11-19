<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\RedirectResponse;

class VerifyEmailController extends Controller
{
    /**
     * Mark the authenticated user's email address as verified.
     */
    public function __invoke(EmailVerificationRequest $request): RedirectResponse
    {
        $locale = $request->route('locale') ?? 'id';
        $user = $request->user();
        $userRole = $user->role ?? 'Buyer';

        if ($request->user()->hasVerifiedEmail()) {
            if ($userRole === 'Buyer') {
                return redirect()->intended(route('BuyerHome', ['locale' => $locale], absolute: false).'?verified=1');
            } elseif ($userRole === 'Seller') {
                return redirect()->intended(route('SellerHome', ['locale' => $locale], absolute: false).'?verified=1');
            }
            return redirect()->intended(route('home', ['locale' => $locale], absolute: false).'?verified=1');
        }

        $request->fulfill();

        if ($userRole === 'Buyer') {
            return redirect()->intended(route('BuyerHome', ['locale' => $locale], absolute: false).'?verified=1');
        } elseif ($userRole === 'Seller') {
            return redirect()->intended(route('SellerHome', ['locale' => $locale], absolute: false).'?verified=1');
        }
        return redirect()->intended(route('home', ['locale' => $locale], absolute: false).'?verified=1');
    }
}
