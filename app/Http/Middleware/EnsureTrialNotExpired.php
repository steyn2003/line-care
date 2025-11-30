<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureTrialNotExpired
{
    /**
     * Routes that are allowed even when trial has expired.
     */
    protected array $allowedRoutes = [
        'trial.expired',
        'logout',
        'impersonation.stop',
    ];

    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user) {
            return $next($request);
        }

        // Super admins bypass trial check
        if ($user->is_super_admin) {
            return $next($request);
        }

        // If impersonating, allow access (super admin is impersonating)
        if (session()->has('impersonator_id')) {
            return $next($request);
        }

        $company = $user->company;

        if (! $company) {
            return $next($request);
        }

        // Check if trial has expired
        if ($company->is_trial && $company->isTrialExpired()) {
            $routeName = $request->route()?->getName();

            // Allow certain routes even when expired
            if ($routeName && in_array($routeName, $this->allowedRoutes)) {
                return $next($request);
            }

            return redirect()->route('trial.expired');
        }

        return $next($request);
    }
}
