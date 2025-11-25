<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Dashboard;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CustomDashboardController extends Controller
{
    /**
     * List all dashboards accessible by the user.
     *
     * GET /api/custom-dashboards
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $dashboards = Dashboard::where('company_id', $user->company_id)
            ->where(function ($query) use ($user) {
                // User's own dashboards
                $query->where('created_by', $user->id)
                    // Or shared dashboards
                    ->orWhere(function ($q) use ($user) {
                        $q->where('is_shared', true)
                            ->where(function ($q2) use ($user) {
                                $q2->whereNull('shared_with_role')
                                    ->orWhere('shared_with_role', $user->role);
                            });
                    });
            })
            ->with(['creator:id,name', 'widgets'])
            ->withCount('widgets')
            ->orderBy('is_default', 'desc')
            ->orderBy('name')
            ->get();

        return response()->json([
            'dashboards' => $dashboards,
        ]);
    }

    /**
     * Create a new dashboard.
     *
     * POST /api/custom-dashboards
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'layout' => 'nullable|array',
            'is_default' => 'boolean',
            'is_shared' => 'boolean',
            'shared_with_role' => 'nullable|in:operator,technician,manager',
        ]);

        $user = $request->user();

        // If setting as default, unset other defaults for this user
        if (!empty($validated['is_default'])) {
            Dashboard::where('company_id', $user->company_id)
                ->where('created_by', $user->id)
                ->where('is_default', true)
                ->update(['is_default' => false]);
        }

        $dashboard = Dashboard::create([
            'company_id' => $user->company_id,
            'created_by' => $user->id,
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'layout' => $validated['layout'] ?? null,
            'is_default' => $validated['is_default'] ?? false,
            'is_shared' => $validated['is_shared'] ?? false,
            'shared_with_role' => $validated['shared_with_role'] ?? null,
        ]);

        return response()->json([
            'message' => 'Dashboard created successfully',
            'dashboard' => $dashboard->load('creator:id,name'),
        ], 201);
    }

    /**
     * Get a specific dashboard with widgets.
     *
     * GET /api/custom-dashboards/{dashboard}
     */
    public function show(Request $request, Dashboard $customDashboard): JsonResponse
    {
        $user = $request->user();

        // Check access
        if (!$customDashboard->isAccessibleBy($user)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $customDashboard->load(['creator:id,name', 'widgets']);

        return response()->json([
            'dashboard' => $customDashboard,
        ]);
    }

    /**
     * Update a dashboard.
     *
     * PUT /api/custom-dashboards/{dashboard}
     */
    public function update(Request $request, Dashboard $customDashboard): JsonResponse
    {
        $user = $request->user();

        // Only creator can update
        if ($customDashboard->created_by !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'layout' => 'nullable|array',
            'is_default' => 'boolean',
            'is_shared' => 'boolean',
            'shared_with_role' => 'nullable|in:operator,technician,manager',
        ]);

        // If setting as default, unset other defaults
        if (!empty($validated['is_default']) && !$customDashboard->is_default) {
            Dashboard::where('company_id', $user->company_id)
                ->where('created_by', $user->id)
                ->where('is_default', true)
                ->update(['is_default' => false]);
        }

        $customDashboard->update($validated);

        return response()->json([
            'message' => 'Dashboard updated successfully',
            'dashboard' => $customDashboard->fresh(['creator:id,name', 'widgets']),
        ]);
    }

    /**
     * Delete a dashboard.
     *
     * DELETE /api/custom-dashboards/{dashboard}
     */
    public function destroy(Request $request, Dashboard $customDashboard): JsonResponse
    {
        $user = $request->user();

        // Only creator can delete
        if ($customDashboard->created_by !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $customDashboard->delete();

        return response()->json([
            'message' => 'Dashboard deleted successfully',
        ]);
    }

    /**
     * Duplicate a dashboard.
     *
     * POST /api/custom-dashboards/{dashboard}/duplicate
     */
    public function duplicate(Request $request, Dashboard $dashboard): JsonResponse
    {
        $user = $request->user();

        // Check access
        if (!$dashboard->isAccessibleBy($user)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $newDashboard = $dashboard->duplicate($user);

        return response()->json([
            'message' => 'Dashboard duplicated successfully',
            'dashboard' => $newDashboard->load(['creator:id,name', 'widgets']),
        ], 201);
    }

    /**
     * Update widget positions (batch update).
     *
     * PUT /api/custom-dashboards/{dashboard}/layout
     */
    public function updateLayout(Request $request, Dashboard $dashboard): JsonResponse
    {
        $user = $request->user();

        // Only creator can update layout
        if ($dashboard->created_by !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'widgets' => 'required|array',
            'widgets.*.id' => 'required|exists:widgets,id',
            'widgets.*.position_x' => 'required|integer|min:0',
            'widgets.*.position_y' => 'required|integer|min:0',
            'widgets.*.size_width' => 'required|integer|min:1|max:12',
            'widgets.*.size_height' => 'required|integer|min:1|max:12',
            'widgets.*.sort_order' => 'required|integer|min:0',
        ]);

        foreach ($validated['widgets'] as $widgetData) {
            $dashboard->widgets()
                ->where('id', $widgetData['id'])
                ->update([
                    'position_x' => $widgetData['position_x'],
                    'position_y' => $widgetData['position_y'],
                    'size_width' => $widgetData['size_width'],
                    'size_height' => $widgetData['size_height'],
                    'sort_order' => $widgetData['sort_order'],
                ]);
        }

        return response()->json([
            'message' => 'Layout updated successfully',
            'dashboard' => $dashboard->fresh('widgets'),
        ]);
    }
}
