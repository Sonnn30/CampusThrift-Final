<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class EmailVerificationNotificationController extends Controller
{
    /**
     * Send a new email verification notification.
     */
    public function store(Request $request): RedirectResponse
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

        $request->user()->sendEmailVerificationNotification();

        return back()->with('status', 'verification-link-sent');
    }
}
