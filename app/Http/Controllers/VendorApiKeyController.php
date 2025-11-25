<?php

namespace App\Http\Controllers;

use App\Models\Supplier;
use App\Models\VendorApiKey;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class VendorApiKeyController extends Controller
{
    /**
     * Display the vendor API keys management page.
     */
    public function index(): Response
    {
        $companyId = Auth::user()->company_id;

        $suppliers = Supplier::where('company_id', $companyId)
            ->with(['vendorApiKeys' => function ($query) {
                $query->orderBy('created_at', 'desc');
            }])
            ->orderBy('name')
            ->get()
            ->map(function ($supplier) {
                return [
                    'id' => $supplier->id,
                    'name' => $supplier->name,
                    'email' => $supplier->email,
                    'api_keys' => $supplier->vendorApiKeys->map(function ($key) {
                        return [
                            'id' => $key->id,
                            'name' => $key->name,
                            'masked_key' => $key->masked_key,
                            'is_active' => $key->is_active,
                            'last_used_at' => $key->last_used_at?->toIso8601String(),
                            'expires_at' => $key->expires_at?->toIso8601String(),
                            'created_at' => $key->created_at->toIso8601String(),
                        ];
                    }),
                ];
            });

        return Inertia::render('settings/vendor-api-keys/index', [
            'suppliers' => $suppliers,
        ]);
    }

    /**
     * Store a new vendor API key.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'supplier_id' => ['required', 'exists:suppliers,id'],
            'name' => ['required', 'string', 'max:255'],
            'expires_at' => ['nullable', 'date', 'after:now'],
        ]);

        // Verify supplier belongs to user's company
        $supplier = Supplier::where('id', $validated['supplier_id'])
            ->where('company_id', Auth::user()->company_id)
            ->firstOrFail();

        $plainKey = VendorApiKey::generate();

        $apiKey = VendorApiKey::create([
            'supplier_id' => $supplier->id,
            'name' => $validated['name'],
            'key' => $plainKey,
            'is_active' => true,
            'expires_at' => $validated['expires_at'] ?? null,
        ]);

        // Flash the plain key so it can be shown once
        return redirect()->route('vendor-api-keys.index')
            ->with('success', 'API key created successfully.')
            ->with('new_api_key', $plainKey)
            ->with('new_api_key_id', $apiKey->id);
    }

    /**
     * Toggle the active status of an API key.
     */
    public function toggle(Request $request, VendorApiKey $vendorApiKey): RedirectResponse
    {
        // Verify the API key belongs to a supplier in the user's company
        $supplier = $vendorApiKey->supplier;
        if ($supplier->company_id !== Auth::user()->company_id) {
            abort(403);
        }

        $vendorApiKey->update([
            'is_active' => !$vendorApiKey->is_active,
        ]);

        $status = $vendorApiKey->is_active ? 'activated' : 'deactivated';

        return redirect()->route('vendor-api-keys.index')
            ->with('success', "API key {$status} successfully.");
    }

    /**
     * Revoke (delete) an API key.
     */
    public function destroy(VendorApiKey $vendorApiKey): RedirectResponse
    {
        // Verify the API key belongs to a supplier in the user's company
        $supplier = $vendorApiKey->supplier;
        if ($supplier->company_id !== Auth::user()->company_id) {
            abort(403);
        }

        $vendorApiKey->delete();

        return redirect()->route('vendor-api-keys.index')
            ->with('success', 'API key revoked successfully.');
    }
}
