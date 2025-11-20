<?php

namespace App\Http\Middleware;

use App\Enums\Role;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsTechnicianOrManager
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->user() || !in_array($request->user()->role, [Role::TECHNICIAN, Role::MANAGER])) {
            return response()->json([
                'message' => 'Forbidden. Technician or Manager access required.',
            ], 403);
        }

        return $next($request);
    }
}
