<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\File;

class SetLocale extends Middleware
{
    protected $rootView = 'app';

    // 1. TAMBAHKAN METHOD INI untuk mengubah bahasa aplikasi sebelum controller jalan
    public function handle(Request $request, Closure $next)
    {
        $locale = $request->route('locale');

        // Cek apakah locale didukung (misal: id atau en)
        if (!$locale || !in_array($locale, ['en', 'id'])) {
            // Jika tidak ada di URL atau tidak valid, gunakan default
            $locale = $locale && in_array($locale, ['en', 'id']) ? $locale : config('app.locale', 'id');
        }

        App::setLocale($locale);

        return parent::handle($request, $next);
    }

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'locale' => fn () => App::getLocale(),

            'translations' => function () {
                $locale = App::getLocale();
                $path = base_path("lang/{$locale}");

                $translations = [];

                foreach (glob($path . '/*.php') as $file) {
                    $translations = array_merge($translations, include $file);
                }


                return $translations;
            },
        ]);
    }
}
