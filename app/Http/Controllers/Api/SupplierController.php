<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Supplier;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SupplierController extends Controller
{
    /**
     * Display a listing of suppliers.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Supplier::query()
            ->forCompany($request->user()->company_id);

        // Filter by preferred suppliers only
        if ($request->boolean('preferred_only')) {
            $query->preferred();
        }

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('contact_person', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $suppliers = $query->orderBy('name')->get();

        return response()->json([
            'suppliers' => $suppliers,
        ]);
    }

    /**
     * Store a newly created supplier.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'contact_person' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'address' => ['nullable', 'string'],
            'website' => ['nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string'],
            'is_preferred' => ['boolean'],
        ]);

        $supplier = Supplier::create([
            ...$validated,
            'company_id' => $request->user()->company_id,
        ]);

        return response()->json([
            'supplier' => $supplier,
        ], 201);
    }

    /**
     * Display the specified supplier.
     */
    public function show(Request $request, Supplier $supplier): JsonResponse
    {
        if ($supplier->company_id !== $request->user()->company_id) {
            abort(403);
        }

        $supplier->load(['spareParts', 'purchaseOrders' => fn($q) => $q->latest()->limit(10)]);

        return response()->json([
            'supplier' => $supplier,
        ]);
    }

    /**
     * Update the specified supplier.
     */
    public function update(Request $request, Supplier $supplier): JsonResponse
    {
        if ($supplier->company_id !== $request->user()->company_id) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'contact_person' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'address' => ['nullable', 'string'],
            'website' => ['nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string'],
            'is_preferred' => ['boolean'],
        ]);

        $supplier->update($validated);

        return response()->json([
            'supplier' => $supplier,
        ]);
    }

    /**
     * Remove the specified supplier.
     */
    public function destroy(Request $request, Supplier $supplier): JsonResponse
    {
        if ($supplier->company_id !== $request->user()->company_id) {
            abort(403);
        }

        // Check if supplier has spare parts or purchase orders
        if ($supplier->spareParts()->count() > 0 || $supplier->purchaseOrders()->count() > 0) {
            return response()->json([
                'message' => 'Cannot delete supplier with associated spare parts or purchase orders',
            ], 422);
        }

        $supplier->delete();

        return response()->json([
            'message' => 'Supplier deleted successfully',
        ]);
    }
}
