<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SavedFilter;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SavedFilterController extends Controller
{
    /**
     * List all saved filters accessible by the user.
     *
     * GET /api/saved-filters
     */
    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'filter_type' => 'nullable|in:' . implode(',', array_keys(SavedFilter::getFilterTypes())),
        ]);

        $user = $request->user();

        $query = SavedFilter::where(function ($q) use ($user) {
            // User's own filters
            $q->where('user_id', $user->id)
                // Or shared filters from same company
                ->orWhere(function ($q2) use ($user) {
                    $q2->where('company_id', $user->company_id)
                        ->where('is_shared', true);
                });
        });

        if ($request->filter_type) {
            $query->where('filter_type', $request->filter_type);
        }

        $filters = $query->with('user:id,name')
            ->orderBy('is_default', 'desc')
            ->orderBy('name')
            ->get();

        return response()->json([
            'filters' => $filters,
            'filter_types' => SavedFilter::getFilterTypes(),
        ]);
    }

    /**
     * Create a new saved filter.
     *
     * POST /api/saved-filters
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'filter_type' => 'required|in:' . implode(',', array_keys(SavedFilter::getFilterTypes())),
            'filters' => 'required|array',
            'is_default' => 'boolean',
            'is_shared' => 'boolean',
        ]);

        $user = $request->user();

        // If setting as default, unset other defaults for this user and type
        if (!empty($validated['is_default'])) {
            SavedFilter::where('user_id', $user->id)
                ->where('filter_type', $validated['filter_type'])
                ->where('is_default', true)
                ->update(['is_default' => false]);
        }

        $filter = SavedFilter::create([
            'company_id' => $user->company_id,
            'user_id' => $user->id,
            'name' => $validated['name'],
            'filter_type' => $validated['filter_type'],
            'filters' => $validated['filters'],
            'is_default' => $validated['is_default'] ?? false,
            'is_shared' => $validated['is_shared'] ?? false,
        ]);

        return response()->json([
            'message' => 'Filter saved successfully',
            'filter' => $filter->load('user:id,name'),
        ], 201);
    }

    /**
     * Get a specific saved filter.
     *
     * GET /api/saved-filters/{id}
     */
    public function show(Request $request, SavedFilter $savedFilter): JsonResponse
    {
        $user = $request->user();

        // Check access
        if ($savedFilter->user_id !== $user->id &&
            !($savedFilter->is_shared && $savedFilter->company_id === $user->company_id)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json([
            'filter' => $savedFilter->load('user:id,name'),
        ]);
    }

    /**
     * Update a saved filter.
     *
     * PUT /api/saved-filters/{id}
     */
    public function update(Request $request, SavedFilter $savedFilter): JsonResponse
    {
        $user = $request->user();

        // Only owner can update
        if ($savedFilter->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'filters' => 'sometimes|required|array',
            'is_default' => 'boolean',
            'is_shared' => 'boolean',
        ]);

        // If setting as default, unset other defaults
        if (!empty($validated['is_default']) && !$savedFilter->is_default) {
            SavedFilter::where('user_id', $user->id)
                ->where('filter_type', $savedFilter->filter_type)
                ->where('is_default', true)
                ->update(['is_default' => false]);
        }

        $savedFilter->update($validated);

        return response()->json([
            'message' => 'Filter updated successfully',
            'filter' => $savedFilter->fresh('user:id,name'),
        ]);
    }

    /**
     * Delete a saved filter.
     *
     * DELETE /api/saved-filters/{id}
     */
    public function destroy(Request $request, SavedFilter $savedFilter): JsonResponse
    {
        $user = $request->user();

        // Only owner can delete
        if ($savedFilter->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $savedFilter->delete();

        return response()->json([
            'message' => 'Filter deleted successfully',
        ]);
    }

    /**
     * Set a filter as default.
     *
     * POST /api/saved-filters/{id}/set-default
     */
    public function setDefault(Request $request, SavedFilter $savedFilter): JsonResponse
    {
        $user = $request->user();

        // Check access
        if ($savedFilter->user_id !== $user->id &&
            !($savedFilter->is_shared && $savedFilter->company_id === $user->company_id)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Unset other defaults for this user and type
        SavedFilter::where('user_id', $user->id)
            ->where('filter_type', $savedFilter->filter_type)
            ->where('is_default', true)
            ->update(['is_default' => false]);

        // Set this as default
        $savedFilter->update(['is_default' => true]);

        return response()->json([
            'message' => 'Default filter set successfully',
            'filter' => $savedFilter->fresh('user:id,name'),
        ]);
    }
}
