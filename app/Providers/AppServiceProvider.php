<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Http\Request;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
{
    // Force HTTPS in production
    if (config('app.env') === 'production') {
        \URL::forceScheme('https');
    }

    // Define rate limiters
    RateLimiter::for('login', function (Request $request) {
        return Limit::perMinute(5)->by($request->input('email') . '|' . $request->ip());
    });

    Inertia::share([
        // Data yang selalu dikirim ke semua halaman React
        'auth' => function () {
            $user = Auth::user();

            return [
                'isLoggedIn' => Auth::check(),
                'user' => $user,
                'role' => $user?->role ?? 'Guest',
            ];
        },

        // Contoh tambahan: setting global lain
        'app' => [
            'name' => config('app.name'),
        ],
    ]);
}

}
