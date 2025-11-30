<?php

namespace App\Http\Middleware;

use App\Services\FeatureService;
use App\Services\ImpersonationService;
use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $request->user(),
            ],
            'features' => $this->getFeatures($request),
            'impersonation' => $this->getImpersonation(),
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'locale' => app()->getLocale(),
            'availableLocales' => config('localization.available', ['en', 'nl']),
            'localeMetadata' => config('localization.locales', []),
        ];
    }

    /**
     * Get the features available to the current user.
     *
     * @return array<string, bool>
     */
    protected function getFeatures(Request $request): array
    {
        $user = $request->user();

        if (!$user) {
            return [];
        }

        return app(FeatureService::class)->getAllFeaturesForUser($user);
    }

    /**
     * Get the impersonation data if currently impersonating.
     *
     * @return array|null
     */
    protected function getImpersonation(): ?array
    {
        return app(ImpersonationService::class)->getImpersonationData();
    }
}
