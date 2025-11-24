<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Shift;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ShiftController extends Controller
{
    /**
     * Display a listing of shifts.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Shift::query()
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
            $query->where('name', 'like', "%{$search}%");
        }

        $shifts = $query->orderBy('start_time')->get();

        return response()->json($shifts);
    }

    /**
     * Store a newly created shift.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'start_time' => ['required', 'date_format:H:i'],
            'end_time' => ['required', 'date_format:H:i'],
            'is_active' => ['boolean'],
        ]);

        DB::beginTransaction();

        try {
            $shift = Shift::create([
                'company_id' => $request->user()->company_id,
                'name' => $validated['name'],
                'start_time' => $validated['start_time'],
                'end_time' => $validated['end_time'],
                'is_active' => $validated['is_active'] ?? true,
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Shift created successfully.',
                'data' => $shift,
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to create shift.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified shift.
     */
    public function show(Request $request, Shift $shift): JsonResponse
    {
        // Ensure user can only view shifts from their company
        if ($shift->company_id !== $request->user()->company_id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $shift->load(['productionRuns' => function ($query) {
            $query->orderBy('start_time', 'desc')->limit(10);
        }]);

        return response()->json($shift);
    }

    /**
     * Update the specified shift.
     */
    public function update(Request $request, Shift $shift): JsonResponse
    {
        // Ensure user can only update shifts from their company
        if ($shift->company_id !== $request->user()->company_id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'start_time' => ['sometimes', 'date_format:H:i'],
            'end_time' => ['sometimes', 'date_format:H:i'],
            'is_active' => ['boolean'],
        ]);

        DB::beginTransaction();

        try {
            $shift->update($validated);

            DB::commit();

            return response()->json([
                'message' => 'Shift updated successfully.',
                'data' => $shift,
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to update shift.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified shift.
     */
    public function destroy(Request $request, Shift $shift): JsonResponse
    {
        // Ensure user can only delete shifts from their company
        if ($shift->company_id !== $request->user()->company_id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        // Check if shift has production runs
        if ($shift->productionRuns()->exists()) {
            return response()->json([
                'message' => 'Cannot delete shift that has production runs. Consider deactivating instead.',
            ], 422);
        }

        DB::beginTransaction();

        try {
            $shift->delete();

            DB::commit();

            return response()->json([
                'message' => 'Shift deleted successfully.',
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to delete shift.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
