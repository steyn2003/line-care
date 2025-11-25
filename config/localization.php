<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Available Locales
    |--------------------------------------------------------------------------
    |
    | This array contains the locales that are available in the application.
    | The first locale in the array is used as the default locale.
    |
    */

    'available' => explode(',', env('APP_AVAILABLE_LOCALES', 'en,nl')),

    /*
    |--------------------------------------------------------------------------
    | Locale Metadata
    |--------------------------------------------------------------------------
    |
    | This array contains metadata for each available locale, including
    | the display name, native name, flag code, and text direction.
    |
    */

    'locales' => [
        'en' => [
            'name' => 'English',
            'native' => 'English',
            'flag' => 'gb',
            'dir' => 'ltr',
        ],
        'nl' => [
            'name' => 'Dutch',
            'native' => 'Nederlands',
            'flag' => 'nl',
            'dir' => 'ltr',
        ],
    ],

];
