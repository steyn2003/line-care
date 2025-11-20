<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CauseCategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CauseCategoryController extends Controller
{
    /**
     * Display a listing of cause categories.
     */
    public function index(Request $request): JsonResponse
    {
        $categories = CauseCategory::query()
            ->forCompany($request->user()->company_id)
            ->orderBy('name')
            ->get();

        return response()->json([
            'cause_categories' => $categories,
        ]);
    }

    /**
     * Store a newly created cause category.
     */
    public function store(Request $request): JsonResponse
    {
        // Only managers can create cause categories
        if ($request->user()->role !== \App\Enums\Role::MANAGER) {
            return response()->json([
                'message' => 'Only managers can create cause categories.',
            ], 403);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);

        $category = CauseCategory::create([
            ...$validated,
            'company_id' => $request->user()->company_id,
        ]);

        return response()->json([
            'cause_category' => $category,
        ], 201);
    }

    /**
     * Display the specified cause category.
     */
    public function show(Request $request, CauseCategory $causeCategory): JsonResponse
    {
        // Verify belongs to user's company
        if ($causeCategory->company_id !== $request->user()->company_id) {
            return response()->json([
                'message' => 'Not found.',
            ], 404);
        }

        return response()->json([
            'cause_category' => $causeCategory,
        ]);
    }

    /**
     * Update the specified cause category.
     */
    public function update(Request $request, CauseCategory $causeCategory): JsonResponse
    {
        // Only managers can update cause categories
        if ($request->user()->role !== \App\Enums\Role::MANAGER) {
            return response()->json([
                'message' => 'Only managers can update cause categories.',
            ], 403);
        }

        // Verify belongs to user's company
        if ($causeCategory->company_id !== $request->user()->company_id) {
            return response()->json([
                'message' => 'Not found.',
            ], 404);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);

        $causeCategory->update($validated);

        return response()->json([
            'cause_category' => $causeCategory,
        ]);
    }

    /**
     * Remove the specified cause category.
     */
    public function destroy(Request $request, CauseCategory $causeCategory): JsonResponse
    {
        // Only managers can delete cause categories
        if ($request->user()->role !== \App\Enums\Role::MANAGER) {
            return response()->json([
                'message' => 'Only managers can delete cause categories.',
            ], 403);
        }

        // Verify belongs to user's company
        if ($causeCategory->company_id !== $request->user()->company_id) {
            return response()->json([
                'message' => 'Not found.',
            ], 404);
        }

        $causeCategory->delete();

        return response()->json([
            'message' => 'Cause category deleted successfully',
        ]);
    }
}
