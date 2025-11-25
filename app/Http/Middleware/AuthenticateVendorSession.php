<?php

namespace App\Http\Middleware;

use App\Models\VendorApiKey;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Symfony\Component\HttpFoundation\Response;

class AuthenticateVendorSession
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $apiKeyId = Session::get('vendor_api_key_id');

        if (!$apiKeyId) {
            return redirect()->route('vendor-portal.login');
        }

        $apiKey = VendorApiKey::find($apiKeyId);

        if (!$apiKey || !$apiKey->isValid()) {
            Session::forget(['vendor_api_key_id', 'vendor_supplier_id']);
            return redirect()->route('vendor-portal.login')
                ->withErrors(['api_key' => 'Your session has expired. Please login again.']);
        }

        return $next($request);
    }
}
