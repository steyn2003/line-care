<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    /**
     * Display a listing of products.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Product::query()
            ->forCompany($request->user()->company_id);

        // Filter by active status
        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        } else {
            $query->active(); // Default to active only
        }

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('sku', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $products = $query->orderBy('name')->paginate($request->input('per_page', 15));

        return response()->json($products);
    }

    /**
     * Store a newly created product.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'sku' => ['nullable', 'string', 'max:255', 'unique:products,sku'],
            'description' => ['nullable', 'string'],
            'theoretical_cycle_time' => ['required', 'integer', 'min:1'], // in seconds
            'target_units_per_hour' => ['required', 'integer', 'min:0'],
            'is_active' => ['boolean'],
        ]);

        DB::beginTransaction();

        try {
            $product = Product::create([
                'company_id' => $request->user()->company_id,
                'name' => $validated['name'],
                'sku' => $validated['sku'] ?? null,
                'description' => $validated['description'] ?? null,
                'theoretical_cycle_time' => $validated['theoretical_cycle_time'],
                'target_units_per_hour' => $validated['target_units_per_hour'],
                'is_active' => $validated['is_active'] ?? true,
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Product created successfully.',
                'data' => $product,
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to create product.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified product.
     */
    public function show(Request $request, Product $product): JsonResponse
    {
        // Ensure user can only view products from their company
        if ($product->company_id !== $request->user()->company_id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $product->load(['productionRuns' => function ($query) {
            $query->orderBy('start_time', 'desc')->limit(10);
        }]);

        return response()->json($product);
    }

    /**
     * Update the specified product.
     */
    public function update(Request $request, Product $product): JsonResponse
    {
        // Ensure user can only update products from their company
        if ($product->company_id !== $request->user()->company_id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'sku' => ['nullable', 'string', 'max:255', 'unique:products,sku,' . $product->id],
            'description' => ['nullable', 'string'],
            'theoretical_cycle_time' => ['sometimes', 'integer', 'min:1'],
            'target_units_per_hour' => ['sometimes', 'integer', 'min:0'],
            'is_active' => ['boolean'],
        ]);

        DB::beginTransaction();

        try {
            $product->update($validated);

            DB::commit();

            return response()->json([
                'message' => 'Product updated successfully.',
                'data' => $product,
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to update product.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified product.
     */
    public function destroy(Request $request, Product $product): JsonResponse
    {
        // Ensure user can only delete products from their company
        if ($product->company_id !== $request->user()->company_id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        // Check if product has production runs
        if ($product->productionRuns()->exists()) {
            return response()->json([
                'message' => 'Cannot delete product that has production runs. Consider deactivating instead.',
            ], 422);
        }

        DB::beginTransaction();

        try {
            $product->delete();

            DB::commit();

            return response()->json([
                'message' => 'Product deleted successfully.',
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to delete product.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
