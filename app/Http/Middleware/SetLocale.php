<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $locale = $this->determineLocale($request);

        // Validate locale against available locales
        $availableLocales = config('localization.available', ['en', 'nl']);
        if (! in_array($locale, $availableLocales)) {
            $locale = config('app.locale', 'en');
        }

        App::setLocale($locale);

        // Store in session for guests
        if (! $request->user() && $locale !== session('locale')) {
            session(['locale' => $locale]);
        }

        return $next($request);
    }

    /**
     * Determine the locale to use for the request.
     */
    protected function determineLocale(Request $request): string
    {
        // Priority 1: Authenticated user's preference
        if ($request->user() && $request->user()->preferred_locale) {
            return $request->user()->preferred_locale;
        }

        // Priority 2: Session stored locale (for guests)
        if (session()->has('locale')) {
            return session('locale');
        }

        // Priority 3: Browser's Accept-Language header
        $browserLocale = $request->getPreferredLanguage(config('localization.available', ['en', 'nl']));
        if ($browserLocale) {
            // Extract just the language code (e.g., 'en' from 'en-US')
            return substr($browserLocale, 0, 2);
        }

        // Priority 4: Default locale from config
        return config('app.locale', 'en');
    }
}
