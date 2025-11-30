<?php

namespace App\Http\Middleware;

use App\Services\FeatureService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureFeatureEnabled
{
    /**
     * The feature service instance.
     */
    protected FeatureService $featureService;

    /**
     * Create a new middleware instance.
     */
    public function __construct(FeatureService $featureService)
    {
        $this->featureService = $featureService;
    }

    /**
     * Handle an incoming request.
     *
     * Check if the user has access to the specified feature(s).
     * Multiple features can be specified - user needs access to ALL of them.
     *
     * Usage in routes:
     *   Route::middleware('feature:inventory')
     *   Route::middleware('feature:inventory,costs')
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  ...$features
     */
    public function handle(Request $request, Closure $next, string ...$features): Response
    {
        $user = $request->user();

        if (!$user) {
            abort(401, 'Unauthenticated.');
        }

        // Check each required feature
        foreach ($features as $feature) {
            if (!$this->featureService->isValidFeature($feature)) {
                // Log invalid feature for debugging but don't expose to user
                \Log::warning("Invalid feature requested in middleware: {$feature}");
                abort(403, 'Access denied.');
            }

            if (!$this->featureService->enabledForUser($user, $feature)) {
                // For Inertia requests, return a redirect with an error message
                if ($request->header('X-Inertia')) {
                    return redirect()
                        ->back()
                        ->with('error', $this->getFeatureNotAvailableMessage($feature));
                }

                // For API requests, return JSON
                if ($request->expectsJson()) {
                    return response()->json([
                        'message' => $this->getFeatureNotAvailableMessage($feature),
                        'feature' => $feature,
                        'upgrade_required' => true,
                    ], 403);
                }

                // For regular requests, abort with 403
                abort(403, $this->getFeatureNotAvailableMessage($feature));
            }
        }

        return $next($request);
    }

    /**
     * Get a user-friendly message for feature not available.
     *
     * @param string $feature
     * @return string
     */
    protected function getFeatureNotAvailableMessage(string $feature): string
    {
        $definitions = $this->featureService->getFeatureDefinitions();
        $featureName = $definitions[$feature]['name'] ?? ucfirst($feature);

        return __('The :feature feature is not available in your current plan. Please upgrade to access this feature.', [
            'feature' => $featureName,
        ]);
    }
}
