<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

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
