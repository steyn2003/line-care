<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Downtime;
use App\Models\DowntimeCategory;
use App\Models\ProductionRun;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DowntimeController extends Controller
{
    /**
     * Display a listing of downtime records.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Downtime::query()
            ->with(['machine', 'category', 'productionRun', 'recorder'])
            ->forCompany($request->user()->company_id);

        // Filter by machine
        if ($request->has('machine_id')) {
            $query->forMachine($request->machine_id);
        }

        // Filter by production run
        if ($request->has('production_run_id')) {
            $query->where('production_run_id', $request->production_run_id);
        }

        // Filter by category
        if ($request->has('downtime_category_id')) {
            $query->where('downtime_category_id', $request->downtime_category_id);
        }

        // Filter by status (active/completed)
        if ($request->has('status')) {
            if ($request->status === 'active') {
                $query->active();
            } elseif ($request->status === 'completed') {
                $query->completed();
            }
        }

        // Filter by type (planned/unplanned)
        if ($request->has('type')) {
            if ($request->type === 'planned') {
                $query->planned();
            } elseif ($request->type === 'unplanned') {
                $query->unplanned();
            }
        }

        // Filter by date range
        if ($request->has('date_from') && $request->has('date_to')) {
            $query->whereBetween('start_time', [$request->date_from, $request->date_to]);
        }

        $downtimes = $query->orderBy('start_time', 'desc')
            ->paginate($request->input('per_page', 15));

        return response()->json($downtimes);
    }

    /**
     * Store a newly created downtime record (start downtime).
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'machine_id' => ['required', 'exists:machines,id'],
            'production_run_id' => ['nullable', 'exists:production_runs,id'],
            'downtime_category_id' => ['required', 'exists:downtime_categories,id'],
            'start_time' => ['nullable', 'date'],
            'description' => ['nullable', 'string', 'max:1000'],
        ]);

        // Verify production run belongs to the same machine if provided
        if (isset($validated['production_run_id'])) {
            $productionRun = ProductionRun::find($validated['production_run_id']);
            if ($productionRun && $productionRun->machine_id != $validated['machine_id']) {
                return response()->json([
                    'message' => 'Production run does not belong to the specified machine.',
                ], 422);
            }
        }

        DB::beginTransaction();

        try {
            $downtime = Downtime::create([
                'company_id' => $request->user()->company_id,
                'machine_id' => $validated['machine_id'],
                'production_run_id' => $validated['production_run_id'] ?? null,
                'downtime_category_id' => $validated['downtime_category_id'],
                'start_time' => $validated['start_time'] ?? now(),
                'description' => $validated['description'] ?? null,
                'recorded_by' => $request->user()->id,
            ]);

            DB::commit();

            $downtime->load(['machine', 'category', 'productionRun', 'recorder']);

            return response()->json([
                'message' => 'Downtime recorded successfully.',
                'data' => $downtime,
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to record downtime.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified downtime record.
     */
    public function show(Request $request, Downtime $downtime): JsonResponse
    {
        // Ensure user can only view downtime from their company
        if ($downtime->company_id !== $request->user()->company_id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $downtime->load(['machine', 'category', 'productionRun', 'recorder']);

        return response()->json($downtime);
    }

    /**
     * End a downtime record and calculate duration.
     */
    public function end(Request $request, Downtime $downtime): JsonResponse
    {
        // Ensure user can only end downtime from their company
        if ($downtime->company_id !== $request->user()->company_id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        // Check if already ended
        if (!$downtime->isActive()) {
            return response()->json([
                'message' => 'This downtime has already been ended.',
            ], 422);
        }

        $validated = $request->validate([
            'end_time' => ['nullable', 'date', 'after:' . $downtime->start_time],
            'description' => ['nullable', 'string', 'max:1000'],
        ]);

        DB::beginTransaction();

        try {
            $downtime->end($validated['end_time'] ?? now());

            if (isset($validated['description'])) {
                $downtime->description = $validated['description'];
                $downtime->save();
            }

            // If this downtime is linked to a production run, recalculate OEE
            if ($downtime->production_run_id) {
                $productionRun = $downtime->productionRun;
                if ($productionRun && !$productionRun->isActive()) {
                    $productionRun->calculateOEE();
                }
            }

            DB::commit();

            $downtime->load(['machine', 'category', 'productionRun']);

            return response()->json([
                'message' => 'Downtime ended successfully. Duration calculated.',
                'data' => $downtime,
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to end downtime.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update the specified downtime record.
     */
    public function update(Request $request, Downtime $downtime): JsonResponse
    {
        // Ensure user can only update downtime from their company
        if ($downtime->company_id !== $request->user()->company_id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $validated = $request->validate([
            'downtime_category_id' => ['sometimes', 'exists:downtime_categories,id'],
            'description' => ['nullable', 'string', 'max:1000'],
            'start_time' => ['sometimes', 'date'],
            'end_time' => ['sometimes', 'date', 'after:start_time'],
        ]);

        DB::beginTransaction();

        try {
            $downtime->update($validated);

            // Recalculate duration if times changed
            if (isset($validated['start_time']) || isset($validated['end_time'])) {
                if ($downtime->start_time && $downtime->end_time) {
                    $downtime->calculateDuration();
                }

                // Recalculate OEE if linked to production run
                if ($downtime->production_run_id) {
                    $productionRun = $downtime->productionRun;
                    if ($productionRun && !$productionRun->isActive()) {
                        $productionRun->calculateOEE();
                    }
                }
            }

            DB::commit();

            $downtime->load(['machine', 'category', 'productionRun']);

            return response()->json([
                'message' => 'Downtime updated successfully.',
                'data' => $downtime,
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to update downtime.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified downtime record.
     */
    public function destroy(Request $request, Downtime $downtime): JsonResponse
    {
        // Ensure user can only delete downtime from their company
        if ($downtime->company_id !== $request->user()->company_id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $productionRunId = $downtime->production_run_id;

        DB::beginTransaction();

        try {
            $downtime->delete();

            // Recalculate OEE if linked to production run
            if ($productionRunId) {
                $productionRun = ProductionRun::find($productionRunId);
                if ($productionRun && !$productionRun->isActive()) {
                    $productionRun->calculateOEE();
                }
            }

            DB::commit();

            return response()->json([
                'message' => 'Downtime deleted successfully.',
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to delete downtime.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get all downtime categories.
     */
    public function categories(Request $request): JsonResponse
    {
        $categories = DowntimeCategory::query()
            ->forCompany($request->user()->company_id)
            ->orderBy('category_type')
            ->orderBy('name')
            ->get();

        return response()->json($categories);
    }
}
