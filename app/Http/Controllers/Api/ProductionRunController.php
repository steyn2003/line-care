<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProductionRun;
use App\Models\Product;
use App\Models\Machine;
use App\Models\Shift;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class ProductionRunController extends Controller
{
    /**
     * Display a listing of production runs.
     */
    public function index(Request $request): JsonResponse
    {
        $query = ProductionRun::query()
            ->with(['machine', 'product', 'shift', 'workOrder', 'creator', 'downtimes.category'])
            ->forCompany($request->user()->company_id);

        // Filter by machine
        if ($request->has('machine_id')) {
            $query->forMachine($request->machine_id);
        }

        // Filter by shift
        if ($request->has('shift_id')) {
            $query->where('shift_id', $request->shift_id);
        }

        // Filter by product
        if ($request->has('product_id')) {
            $query->where('product_id', $request->product_id);
        }

        // Filter by date range
        if ($request->has('date_from') && $request->has('date_to')) {
            $query->dateRange($request->date_from, $request->date_to);
        }

        // Filter by status (active/completed)
        if ($request->has('status')) {
            if ($request->status === 'active') {
                $query->active();
            } elseif ($request->status === 'completed') {
                $query->completed();
            }
        }

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->whereHas('machine', function ($mq) use ($search) {
                    $mq->where('name', 'like', "%{$search}%");
                })
                ->orWhereHas('product', function ($pq) use ($search) {
                    $pq->where('name', 'like', "%{$search}%");
                });
            });
        }

        $productionRuns = $query->orderBy('start_time', 'desc')
            ->paginate($request->input('per_page', 15));

        return response()->json($productionRuns);
    }

    /**
     * Store a newly created production run (start a run).
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'machine_id' => ['required', 'exists:machines,id'],
            'product_id' => ['required', 'exists:products,id'],
            'shift_id' => ['required', 'exists:shifts,id'],
            'work_order_id' => ['nullable', 'exists:work_orders,id'],
            'planned_production_time' => ['required', 'integer', 'min:1'], // in minutes
            'theoretical_output' => ['nullable', 'integer', 'min:0'],
        ]);

        // Check if machine already has an active production run
        $activeRun = ProductionRun::where('machine_id', $validated['machine_id'])
            ->active()
            ->exists();

        if ($activeRun) {
            return response()->json([
                'message' => 'This machine already has an active production run. Please end it first.',
            ], 422);
        }

        DB::beginTransaction();

        try {
            // Calculate theoretical output if not provided
            if (!isset($validated['theoretical_output'])) {
                $product = Product::findOrFail($validated['product_id']);
                $validated['theoretical_output'] = $product->calculateTheoreticalOutput($validated['planned_production_time']);
            }

            $productionRun = ProductionRun::create([
                'company_id' => $request->user()->company_id,
                'machine_id' => $validated['machine_id'],
                'product_id' => $validated['product_id'],
                'shift_id' => $validated['shift_id'],
                'work_order_id' => $validated['work_order_id'] ?? null,
                'start_time' => now(),
                'planned_production_time' => $validated['planned_production_time'],
                'theoretical_output' => $validated['theoretical_output'],
                'created_by' => $request->user()->id,
            ]);

            DB::commit();

            $productionRun->load(['machine', 'product', 'shift', 'workOrder', 'creator']);

            return response()->json([
                'message' => 'Production run started successfully.',
                'data' => $productionRun,
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to start production run.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified production run.
     */
    public function show(Request $request, ProductionRun $productionRun): JsonResponse
    {
        // Ensure user can only view production runs from their company
        if ($productionRun->company_id !== $request->user()->company_id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $productionRun->load([
            'machine',
            'product',
            'shift',
            'workOrder',
            'creator',
            'downtimes' => function ($query) {
                $query->orderBy('start_time');
            },
            'downtimes.category',
            'downtimes.recorder',
        ]);

        return response()->json($productionRun);
    }

    /**
     * End a production run and calculate OEE.
     */
    public function end(Request $request, ProductionRun $productionRun): JsonResponse
    {
        // Ensure user can only end production runs from their company
        if ($productionRun->company_id !== $request->user()->company_id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        // Check if already ended
        if (!$productionRun->isActive()) {
            return response()->json([
                'message' => 'This production run has already been ended.',
            ], 422);
        }

        $validated = $request->validate([
            'end_time' => ['nullable', 'date', 'after:' . $productionRun->start_time],
            'actual_output' => ['required', 'integer', 'min:0'],
            'good_output' => ['required', 'integer', 'min:0', 'lte:actual_output'],
            'defect_output' => ['required', 'integer', 'min:0'],
        ]);

        // Validate that good_output + defect_output = actual_output
        if (($validated['good_output'] + $validated['defect_output']) != $validated['actual_output']) {
            return response()->json([
                'message' => 'Good output + defect output must equal actual output.',
            ], 422);
        }

        DB::beginTransaction();

        try {
            $productionRun->end_time = $validated['end_time'] ?? now();
            $productionRun->actual_output = $validated['actual_output'];
            $productionRun->good_output = $validated['good_output'];
            $productionRun->defect_output = $validated['defect_output'];

            // Calculate actual production time (end - start)
            $productionRun->actual_production_time = $productionRun->start_time->diffInMinutes($productionRun->end_time);

            // Calculate OEE metrics
            $productionRun->calculateOEE();

            DB::commit();

            $productionRun->load(['machine', 'product', 'shift', 'downtimes.category']);

            return response()->json([
                'message' => 'Production run ended successfully. OEE calculated.',
                'data' => $productionRun,
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to end production run.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update the specified production run.
     */
    public function update(Request $request, ProductionRun $productionRun): JsonResponse
    {
        // Ensure user can only update production runs from their company
        if ($productionRun->company_id !== $request->user()->company_id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $validated = $request->validate([
            'work_order_id' => ['nullable', 'exists:work_orders,id'],
            'actual_output' => ['sometimes', 'integer', 'min:0'],
            'good_output' => ['sometimes', 'integer', 'min:0'],
            'defect_output' => ['sometimes', 'integer', 'min:0'],
        ]);

        DB::beginTransaction();

        try {
            $productionRun->update($validated);

            // Recalculate OEE if output values changed and run is ended
            if (!$productionRun->isActive() &&
                ($request->has('actual_output') || $request->has('good_output') || $request->has('defect_output'))) {
                $productionRun->calculateOEE();
            }

            DB::commit();

            $productionRun->load(['machine', 'product', 'shift', 'workOrder']);

            return response()->json([
                'message' => 'Production run updated successfully.',
                'data' => $productionRun,
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to update production run.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified production run from storage.
     */
    public function destroy(Request $request, ProductionRun $productionRun): JsonResponse
    {
        // Ensure user can only delete production runs from their company
        if ($productionRun->company_id !== $request->user()->company_id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        DB::beginTransaction();

        try {
            $productionRun->delete();

            DB::commit();

            return response()->json([
                'message' => 'Production run deleted successfully.',
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to delete production run.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
