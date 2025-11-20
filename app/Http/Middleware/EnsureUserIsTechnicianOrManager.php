<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsTechnicianOrManager
{
    /**
     * Handle an incoming request.
     *
     * Ensures the authenticated user has either 'technician' or 'manager' role.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user) {
            abort(401, 'Unauthenticated.');
        }

        if (!$user->role || !in_array($user->role->value, ['technician', 'manager'])) {
            abort(403, 'This action requires technician or manager privileges.');
        }

        return $next($request);
    }
}
