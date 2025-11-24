<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PartCategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PartCategoryController extends Controller
{
    /**
     * Display a listing of part categories.
     */
    public function index(Request $request): JsonResponse
    {
        $query = PartCategory::query()
            ->with(['parent'])
            ->forCompany($request->user()->company_id);

        // Filter for root categories only
        if ($request->boolean('root_only')) {
            $query->rootCategories();
        }

        $categories = $query->orderBy('name')->get();

        return response()->json([
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created part category.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'parent_category_id' => ['nullable', 'exists:part_categories,id'],
        ]);

        $category = PartCategory::create([
            ...$validated,
            'company_id' => $request->user()->company_id,
        ]);

        return response()->json([
            'category' => $category->load('parent'),
        ], 201);
    }

    /**
     * Display the specified part category.
     */
    public function show(Request $request, PartCategory $partCategory): JsonResponse
    {
        if ($partCategory->company_id !== $request->user()->company_id) {
            abort(403);
        }

        $partCategory->load(['parent', 'children', 'spareParts']);

        return response()->json([
            'category' => $partCategory,
        ]);
    }

    /**
     * Update the specified part category.
     */
    public function update(Request $request, PartCategory $partCategory): JsonResponse
    {
        if ($partCategory->company_id !== $request->user()->company_id) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'parent_category_id' => ['nullable', 'exists:part_categories,id'],
        ]);

        // Prevent self-referencing
        if (isset($validated['parent_category_id']) && $validated['parent_category_id'] == $partCategory->id) {
            return response()->json([
                'message' => 'A category cannot be its own parent',
            ], 422);
        }

        $partCategory->update($validated);

        return response()->json([
            'category' => $partCategory->load('parent'),
        ]);
    }

    /**
     * Remove the specified part category.
     */
    public function destroy(Request $request, PartCategory $partCategory): JsonResponse
    {
        if ($partCategory->company_id !== $request->user()->company_id) {
            abort(403);
        }

        // Check if category has spare parts or children
        if ($partCategory->spareParts()->count() > 0) {
            return response()->json([
                'message' => 'Cannot delete category with spare parts. Please reassign or delete the parts first.',
            ], 422);
        }

        if ($partCategory->children()->count() > 0) {
            return response()->json([
                'message' => 'Cannot delete category with subcategories. Please delete subcategories first.',
            ], 422);
        }

        $partCategory->delete();

        return response()->json([
            'message' => 'Category deleted successfully',
        ]);
    }
}
