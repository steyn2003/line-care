<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsManager
{
    /**
     * Handle an incoming request.
     *
     * Ensures the authenticated user has the 'manager' role.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user) {
            abort(401, 'Unauthenticated.');
        }

        if (!$user->role || $user->role->value !== 'manager') {
            abort(403, 'This action requires manager privileges.');
        }

        return $next($request);
    }
}
