<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Product::query()
            ->forCompany($request->user()->company_id);

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('sku', 'like', "%{$search}%");
            });
        }

        // Filter by active status
        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        } else {
            $query->active();
        }

        $products = $query->orderBy('name')->paginate(15);

        return Inertia::render('products/index', [
            'products' => $products,
            'filters' => $request->only(['search', 'is_active']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'theoretical_cycle_time' => 'required|integer|min:0',
            'target_units_per_hour' => 'required|integer|min:0',
            'is_active' => 'boolean',
        ]);

        $validated['company_id'] = $request->user()->company_id;
        $validated['is_active'] = $validated['is_active'] ?? true;

        Product::create($validated);

        return redirect()->route('products.index');
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'theoretical_cycle_time' => 'required|integer|min:0',
            'target_units_per_hour' => 'required|integer|min:0',
            'is_active' => 'boolean',
        ]);

        $product->update($validated);

        return redirect()->route('products.index');
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return redirect()->route('products.index');
    }
}
