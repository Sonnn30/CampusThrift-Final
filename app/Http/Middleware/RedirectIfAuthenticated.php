<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RedirectIfAuthenticated
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$guards): Response
    {
        $guards = empty($guards) ? [null] : $guards;

        foreach ($guards as $guard) {
            if (Auth::guard($guard)->check()) {
                // Try to get locale from route parameter, URL path, or default to 'id'
                $locale = $request->route('locale');
                if (!$locale) {
                    // Try to extract from URL path
                    $path = $request->path();
                    if (preg_match('/^([a-z]{2})\//', $path, $matches)) {
                        $locale = $matches[1];
                    } else {
                        $locale = 'id';
                    }
                }

                $user = Auth::guard($guard)->user();
                $userRole = $user->role ?? 'Buyer';

                if ($userRole === 'Buyer') {
                    return redirect()->route('BuyerHome', ['locale' => $locale]);
                } elseif ($userRole === 'Seller') {
                    return redirect()->route('SellerHome', ['locale' => $locale]);
                }
                return redirect()->route('home', ['locale' => $locale]);
            }
        }

        return $next($request);
    }
}

