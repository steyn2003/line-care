<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Machine;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class MachineController extends Controller
{
    /**
     * Display a listing of machines.
     */
    public function index(Request $request): JsonResponse
    {
        Gate::authorize('viewAny', Machine::class);

        $query = Machine::query()
            ->with('location')
            ->forCompany($request->user()->company_id);

        // Filter by location
        if ($request->has('location_id')) {
            $query->where('location_id', $request->location_id);
        }

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        } else {
            // Default to active machines only
            $query->active();
        }

        $machines = $query->orderBy('name')->get();

        return response()->json([
            'machines' => $machines,
        ]);
    }

    /**
     * Store a newly created machine.
     */
    public function store(Request $request): JsonResponse
    {
        Gate::authorize('create', Machine::class);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'code' => ['nullable', 'string', 'max:255'],
            'location_id' => ['nullable', 'exists:locations,id'],
            'criticality' => ['nullable', 'in:low,medium,high'],
        ]);

        $machine = Machine::create([
            ...$validated,
            'company_id' => $request->user()->company_id,
            'status' => 'active',
        ]);

        return response()->json([
            'machine' => $machine->load('location'),
        ], 201);
    }

    /**
     * Display the specified machine.
     */
    public function show(Request $request, Machine $machine): JsonResponse
    {
        Gate::authorize('view', $machine);

        $machine->load([
            'location',
            'workOrders' => fn($query) => $query->latest()->limit(10),
            'workOrders.creator:id,name',
            'workOrders.assignee:id,name',
        ]);

        return response()->json([
            'machine' => $machine,
        ]);
    }

    /**
     * Update the specified machine.
     */
    public function update(Request $request, Machine $machine): JsonResponse
    {
        Gate::authorize('update', $machine);

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'code' => ['nullable', 'string', 'max:255'],
            'location_id' => ['nullable', 'exists:locations,id'],
            'criticality' => ['nullable', 'in:low,medium,high'],
            'status' => ['sometimes', 'in:active,archived'],
        ]);

        $machine->update($validated);

        return response()->json([
            'machine' => $machine->load('location'),
        ]);
    }

    /**
     * Remove the specified machine (archive it).
     */
    public function destroy(Request $request, Machine $machine): JsonResponse
    {
        Gate::authorize('delete', $machine);

        // Archive instead of delete
        $machine->update(['status' => 'archived']);

        return response()->json([
            'message' => 'Machine archived successfully',
        ]);
    }

    /**
     * Get analytics for the specified machine.
     */
    public function analytics(Request $request, Machine $machine): JsonResponse
    {
        Gate::authorize('view', $machine);

        $dateFrom = $request->input('date_from', now()->subDays(90));
        $dateTo = $request->input('date_to', now());

        // Get work order counts
        $breakdownCount = $machine->workOrders()
            ->where('type', 'breakdown')
            ->whereBetween('created_at', [$dateFrom, $dateTo])
            ->count();

        $preventiveCount = $machine->workOrders()
            ->where('type', 'preventive')
            ->whereBetween('created_at', [$dateFrom, $dateTo])
            ->count();

        // Get total downtime (sum of completed_at - started_at for breakdowns)
        $totalDowntime = $machine->workOrders()
            ->where('type', 'breakdown')
            ->where('status', 'completed')
            ->whereNotNull('started_at')
            ->whereNotNull('completed_at')
            ->whereBetween('created_at', [$dateFrom, $dateTo])
            ->get()
            ->sum(function ($workOrder) {
                return $workOrder->completed_at->diffInMinutes($workOrder->started_at);
            });

        // Get breakdowns by cause category
        $breakdownsByCause = $machine->workOrders()
            ->where('type', 'breakdown')
            ->whereNotNull('cause_category_id')
            ->whereBetween('created_at', [$dateFrom, $dateTo])
            ->with('causeCategory:id,name')
            ->get()
            ->groupBy('cause_category_id')
            ->map(function ($group) {
                return [
                    'cause' => $group->first()->causeCategory->name ?? 'Unknown',
                    'count' => $group->count(),
                ];
            })
            ->values();

        return response()->json([
            'breakdown_count' => $breakdownCount,
            'preventive_count' => $preventiveCount,
            'total_downtime_minutes' => $totalDowntime,
            'avg_resolution_time_minutes' => $breakdownCount > 0 ? round($totalDowntime / $breakdownCount, 1) : 0,
            'breakdowns_by_cause' => $breakdownsByCause,
        ]);
    }
}
