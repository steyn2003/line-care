<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  ...$roles
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (!$user) {
            abort(401, 'Unauthenticated.');
        }

        if (!$user->role) {
            abort(403, 'No role assigned. Contact your administrator.');
        }

        $userRole = $user->role->value;

        if (!in_array($userRole, $roles)) {
            abort(403, 'Unauthorized action. This action requires: ' . implode(' or ', $roles));
        }

        return $next($request);
    }
}
