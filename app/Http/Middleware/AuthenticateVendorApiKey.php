<?php

namespace App\Http\Middleware;

use App\Models\VendorApiKey;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AuthenticateVendorApiKey
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $apiKey = $request->header('X-Vendor-API-Key') ?? $request->bearerToken();

        if (!$apiKey) {
            return response()->json([
                'message' => 'API key is required',
            ], 401);
        }

        $vendorKey = VendorApiKey::where('key', $apiKey)
            ->active()
            ->with('supplier')
            ->first();

        if (!$vendorKey) {
            return response()->json([
                'message' => 'Invalid or expired API key',
            ], 401);
        }

        // Mark the key as used
        $vendorKey->markAsUsed();

        // Attach supplier to request for use in controllers
        $request->merge(['vendor_supplier' => $vendorKey->supplier]);
        $request->setUserResolver(function () use ($vendorKey) {
            return $vendorKey->supplier;
        });

        return $next($request);
    }
}
