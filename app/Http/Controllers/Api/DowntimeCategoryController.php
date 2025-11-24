<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DowntimeCategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DowntimeCategoryController extends Controller
{
    /**
     * Display a listing of downtime categories.
     */
    public function index(Request $request): JsonResponse
    {
        $query = DowntimeCategory::query()
            ->forCompany($request->user()->company_id);

        // Filter by type
        if ($request->has('category_type')) {
            if ($request->category_type === 'planned') {
                $query->planned();
            } elseif ($request->category_type === 'unplanned') {
                $query->unplanned();
            }
        }

        // Filter by OEE inclusion
        if ($request->has('is_included_in_oee')) {
            $query->where('is_included_in_oee', $request->boolean('is_included_in_oee'));
        }

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $categories = $query->orderBy('category_type')->orderBy('name')->get();

        return response()->json($categories);
    }

    /**
     * Store a newly created downtime category.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'category_type' => ['required', 'in:planned,unplanned'],
            'is_included_in_oee' => ['required', 'boolean'],
            'description' => ['nullable', 'string'],
        ]);

        DB::beginTransaction();

        try {
            $category = DowntimeCategory::create([
                'company_id' => $request->user()->company_id,
                'name' => $validated['name'],
                'category_type' => $validated['category_type'],
                'is_included_in_oee' => $validated['is_included_in_oee'],
                'description' => $validated['description'] ?? null,
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Downtime category created successfully.',
                'data' => $category,
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to create downtime category.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified downtime category.
     */
    public function show(Request $request, DowntimeCategory $downtimeCategory): JsonResponse
    {
        // Ensure user can only view categories from their company
        if ($downtimeCategory->company_id !== $request->user()->company_id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $downtimeCategory->load(['downtimes' => function ($query) {
            $query->orderBy('start_time', 'desc')->limit(10);
        }]);

        return response()->json($downtimeCategory);
    }

    /**
     * Update the specified downtime category.
     */
    public function update(Request $request, DowntimeCategory $downtimeCategory): JsonResponse
    {
        // Ensure user can only update categories from their company
        if ($downtimeCategory->company_id !== $request->user()->company_id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'category_type' => ['sometimes', 'in:planned,unplanned'],
            'is_included_in_oee' => ['sometimes', 'boolean'],
            'description' => ['nullable', 'string'],
        ]);

        DB::beginTransaction();

        try {
            $downtimeCategory->update($validated);

            DB::commit();

            return response()->json([
                'message' => 'Downtime category updated successfully.',
                'data' => $downtimeCategory,
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to update downtime category.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified downtime category.
     */
    public function destroy(Request $request, DowntimeCategory $downtimeCategory): JsonResponse
    {
        // Ensure user can only delete categories from their company
        if ($downtimeCategory->company_id !== $request->user()->company_id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        // Check if category has downtime records
        if ($downtimeCategory->downtimes()->exists()) {
            return response()->json([
                'message' => 'Cannot delete downtime category that has downtime records.',
            ], 422);
        }

        DB::beginTransaction();

        try {
            $downtimeCategory->delete();

            DB::commit();

            return response()->json([
                'message' => 'Downtime category deleted successfully.',
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to delete downtime category.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
