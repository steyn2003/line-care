<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;

class LocaleController extends Controller
{
    /**
     * Update the user's locale preference.
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'locale' => ['required', 'string', 'in:'.implode(',', config('localization.available', ['en', 'nl']))],
        ]);

        $locale = $validated['locale'];

        // Update authenticated user's preference
        if ($request->user()) {
            $request->user()->update(['preferred_locale' => $locale]);
        }

        // Store in session (for guests and as backup for authenticated users)
        session(['locale' => $locale]);

        // Set the locale for the current request
        App::setLocale($locale);

        return back();
    }

    /**
     * Update locale for guests (no auth required).
     */
    public function updateGuest(Request $request)
    {
        $validated = $request->validate([
            'locale' => ['required', 'string', 'in:'.implode(',', config('localization.available', ['en', 'nl']))],
        ]);

        $locale = $validated['locale'];

        // Store in session
        session(['locale' => $locale]);

        // Set the locale for the current request
        App::setLocale($locale);

        return back();
    }
}
