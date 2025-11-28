<?php

namespace App\Http\Controllers\Api;

use App\Enums\ShutdownStatus;
use App\Enums\ShutdownType;
use App\Enums\PlanningSlotSource;
use App\Enums\PlanningSlotStatus;
use App\Http\Controllers\Controller;
use App\Models\PlannedShutdown;
use App\Models\PlanningSlot;
use App\Models\WorkOrder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class PlannedShutdownController extends Controller
{
    /**
     * Display a listing of planned shutdowns.
     */
    public function index(Request $request): JsonResponse
    {
        Gate::authorize('viewAny', PlannedShutdown::class);

        $query = PlannedShutdown::query()
            ->with([
                'machine:id,name,code',
                'location:id,name',
                'creator:id,name',
            ])
            ->forCompany($request->user()->company_id);

        // Filter by date range
        if ($request->has('date_from') && $request->has('date_to')) {
            $query->overlapping($request->date_from, $request->date_to);
        }

        // Filter by location
        if ($request->has('location_id')) {
            $query->forLocation($request->location_id);
        }

        // Filter by machine
        if ($request->has('machine_id')) {
            $query->forMachine($request->machine_id);
        }

        // Filter by status
        if ($request->has('status')) {
            $status = ShutdownStatus::tryFrom($request->status);
            if ($status) {
                $query->withStatus($status);
            }
        }

        // Filter upcoming only
        if ($request->boolean('upcoming')) {
            $query->upcoming();
        }

        // Sort
        $query->orderBy('start_at', 'asc');

        $shutdowns = $query->paginate($request->input('per_page', 20));

        return response()->json($shutdowns);
    }

    /**
     * Store a newly created planned shutdown.
     */
    public function store(Request $request): JsonResponse
    {
        Gate::authorize('create', PlannedShutdown::class);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'machine_id' => ['nullable', 'exists:machines,id'],
            'location_id' => ['required', 'exists:locations,id'],
            'start_at' => ['required', 'date'],
            'end_at' => ['required', 'date', 'after:start_at'],
            'shutdown_type' => ['nullable', Rule::in(ShutdownType::values())],
        ]);

        // Verify machine belongs to same company
        if (isset($validated['machine_id'])) {
            $machine = \App\Models\Machine::findOrFail($validated['machine_id']);
            if ($machine->company_id !== $request->user()->company_id) {
                return response()->json(['message' => 'Machine not found'], 404);
            }
        }

        // Verify location belongs to same company
        $location = \App\Models\Location::findOrFail($validated['location_id']);
        if ($location->company_id !== $request->user()->company_id) {
            return response()->json(['message' => 'Location not found'], 404);
        }

        $shutdown = PlannedShutdown::create([
            'company_id' => $request->user()->company_id,
            'name' => $validated['name'],
            'description' => $validated['description'],
            'machine_id' => $validated['machine_id'] ?? null,
            'location_id' => $validated['location_id'],
            'start_at' => $validated['start_at'],
            'end_at' => $validated['end_at'],
            'shutdown_type' => $validated['shutdown_type'] ?? ShutdownType::PLANNED_MAINTENANCE->value,
            'status' => ShutdownStatus::SCHEDULED->value,
            'created_by' => $request->user()->id,
        ]);

        return response()->json([
            'shutdown' => $shutdown->load(['machine', 'location', 'creator']),
            'message' => 'Planned shutdown created successfully',
        ], 201);
    }

    /**
     * Display the specified planned shutdown.
     */
    public function show(Request $request, PlannedShutdown $plannedShutdown): JsonResponse
    {
        Gate::authorize('view', $plannedShutdown);

        $plannedShutdown->load([
            'machine.location',
            'location',
            'creator',
        ]);

        // Get work orders scheduled during this shutdown
        $workOrders = WorkOrder::forCompany($request->user()->company_id)
            ->whereHas('planningSlots', function ($query) use ($plannedShutdown) {
                $query->where('source', PlanningSlotSource::SHUTDOWN->value)
                    ->where('start_at', '>=', $plannedShutdown->start_at)
                    ->where('end_at', '<=', $plannedShutdown->end_at);
                if ($plannedShutdown->machine_id) {
                    $query->where('machine_id', $plannedShutdown->machine_id);
                }
            })
            ->with(['machine:id,name', 'assignee:id,name', 'planningSlots'])
            ->get();

        return response()->json([
            'shutdown' => $plannedShutdown,
            'work_orders' => $workOrders,
        ]);
    }

    /**
     * Update the specified planned shutdown.
     */
    public function update(Request $request, PlannedShutdown $plannedShutdown): JsonResponse
    {
        Gate::authorize('update', $plannedShutdown);

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'machine_id' => ['nullable', 'exists:machines,id'],
            'location_id' => ['sometimes', 'exists:locations,id'],
            'start_at' => ['sometimes', 'date'],
            'end_at' => ['sometimes', 'date'],
            'shutdown_type' => ['sometimes', Rule::in(ShutdownType::values())],
            'status' => ['sometimes', Rule::in(ShutdownStatus::values())],
        ]);

        // Verify dates if both provided
        if (isset($validated['start_at']) && isset($validated['end_at'])) {
            $startAt = \Carbon\Carbon::parse($validated['start_at']);
            $endAt = \Carbon\Carbon::parse($validated['end_at']);
            if ($endAt <= $startAt) {
                return response()->json(['message' => 'End time must be after start time'], 422);
            }
        }

        // Verify machine belongs to same company
        if (isset($validated['machine_id'])) {
            $machine = \App\Models\Machine::findOrFail($validated['machine_id']);
            if ($machine->company_id !== $request->user()->company_id) {
                return response()->json(['message' => 'Machine not found'], 404);
            }
        }

        // Verify location belongs to same company
        if (isset($validated['location_id'])) {
            $location = \App\Models\Location::findOrFail($validated['location_id']);
            if ($location->company_id !== $request->user()->company_id) {
                return response()->json(['message' => 'Location not found'], 404);
            }
        }

        $plannedShutdown->update($validated);

        return response()->json([
            'shutdown' => $plannedShutdown->fresh()->load(['machine', 'location', 'creator']),
            'message' => 'Planned shutdown updated successfully',
        ]);
    }

    /**
     * Delete the specified planned shutdown.
     */
    public function destroy(Request $request, PlannedShutdown $plannedShutdown): JsonResponse
    {
        Gate::authorize('delete', $plannedShutdown);

        // Cancel associated planning slots
        PlanningSlot::forCompany($request->user()->company_id)
            ->where('source', PlanningSlotSource::SHUTDOWN->value)
            ->where('start_at', '>=', $plannedShutdown->start_at)
            ->where('end_at', '<=', $plannedShutdown->end_at)
            ->when($plannedShutdown->machine_id, fn($q) => $q->where('machine_id', $plannedShutdown->machine_id))
            ->update(['status' => PlanningSlotStatus::CANCELLED->value]);

        $plannedShutdown->delete();

        return response()->json([
            'message' => 'Planned shutdown deleted successfully',
        ]);
    }

    /**
     * Auto-schedule work during a shutdown.
     */
    public function planWork(Request $request, PlannedShutdown $plannedShutdown): JsonResponse
    {
        Gate::authorize('update', $plannedShutdown);

        $validated = $request->validate([
            'work_order_ids' => ['required', 'array', 'min:1'],
            'work_order_ids.*' => ['exists:work_orders,id'],
        ]);

        $createdSlots = [];
        $errors = [];

        DB::beginTransaction();
        try {
            $shutdownStart = \Carbon\Carbon::parse($plannedShutdown->start_at);
            $shutdownEnd = \Carbon\Carbon::parse($plannedShutdown->end_at);
            $currentTime = $shutdownStart->copy();

            foreach ($validated['work_order_ids'] as $workOrderId) {
                $workOrder = WorkOrder::findOrFail($workOrderId);

                if ($workOrder->company_id !== $request->user()->company_id) {
                    $errors[] = "Work order #{$workOrderId} not found";
                    continue;
                }

                // Check if machine matches shutdown (if shutdown is machine-specific)
                if ($plannedShutdown->machine_id && $workOrder->machine_id !== $plannedShutdown->machine_id) {
                    $errors[] = "Work order #{$workOrderId} is for a different machine";
                    continue;
                }

                // Estimate duration (use existing or default to 60 minutes)
                $durationMinutes = $workOrder->planned_duration_minutes ?? 60;
                $slotEnd = $currentTime->copy()->addMinutes($durationMinutes);

                // Check if slot fits within shutdown window
                if ($slotEnd > $shutdownEnd) {
                    $errors[] = "Work order #{$workOrderId} doesn't fit in remaining shutdown time";
                    continue;
                }

                // Find available technician (use assigned_to or first available)
                $technicianId = $workOrder->assigned_to;
                if (!$technicianId) {
                    // Get first available technician
                    $technicians = \App\Models\User::where('company_id', $request->user()->company_id)
                        ->where('role', 'technician')
                        ->get();

                    foreach ($technicians as $tech) {
                        $hasConflict = PlanningSlot::forCompany($request->user()->company_id)
                            ->forTechnician($tech->id)
                            ->overlapping($currentTime->toDateTimeString(), $slotEnd->toDateTimeString())
                            ->active()
                            ->exists();

                        if (!$hasConflict) {
                            $technicianId = $tech->id;
                            break;
                        }
                    }
                }

                if (!$technicianId) {
                    $errors[] = "No available technician for work order #{$workOrderId}";
                    continue;
                }

                // Create planning slot
                $slot = PlanningSlot::create([
                    'company_id' => $request->user()->company_id,
                    'work_order_id' => $workOrderId,
                    'technician_id' => $technicianId,
                    'machine_id' => $workOrder->machine_id,
                    'location_id' => $workOrder->machine->location_id,
                    'start_at' => $currentTime,
                    'end_at' => $slotEnd,
                    'duration_minutes' => $durationMinutes,
                    'status' => PlanningSlotStatus::PLANNED->value,
                    'source' => PlanningSlotSource::SHUTDOWN->value,
                    'notes' => "Scheduled during shutdown: {$plannedShutdown->name}",
                    'created_by' => $request->user()->id,
                ]);

                // Update work order planned dates
                $workOrder->update([
                    'planned_start_at' => $currentTime,
                    'planned_end_at' => $slotEnd,
                    'planned_duration_minutes' => $durationMinutes,
                ]);

                $createdSlots[] = $slot;
                $currentTime = $slotEnd->copy();
            }

            DB::commit();

            return response()->json([
                'slots' => PlanningSlot::whereIn('id', collect($createdSlots)->pluck('id'))
                    ->with(['workOrder', 'technician', 'machine'])
                    ->get(),
                'errors' => $errors,
                'message' => count($createdSlots) . ' work orders scheduled during shutdown',
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to schedule work: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Start a shutdown (change status to in_progress).
     */
    public function start(Request $request, PlannedShutdown $plannedShutdown): JsonResponse
    {
        Gate::authorize('update', $plannedShutdown);

        if ($plannedShutdown->status !== ShutdownStatus::SCHEDULED) {
            return response()->json([
                'message' => 'Only scheduled shutdowns can be started',
            ], 422);
        }

        $plannedShutdown->update([
            'status' => ShutdownStatus::IN_PROGRESS->value,
        ]);

        return response()->json([
            'shutdown' => $plannedShutdown->fresh(),
            'message' => 'Shutdown started',
        ]);
    }

    /**
     * Complete a shutdown.
     */
    public function complete(Request $request, PlannedShutdown $plannedShutdown): JsonResponse
    {
        Gate::authorize('update', $plannedShutdown);

        if (!in_array($plannedShutdown->status, [ShutdownStatus::SCHEDULED, ShutdownStatus::IN_PROGRESS])) {
            return response()->json([
                'message' => 'Only scheduled or in-progress shutdowns can be completed',
            ], 422);
        }

        $plannedShutdown->update([
            'status' => ShutdownStatus::COMPLETED->value,
        ]);

        return response()->json([
            'shutdown' => $plannedShutdown->fresh(),
            'message' => 'Shutdown completed',
        ]);
    }

    /**
     * Cancel a shutdown.
     */
    public function cancel(Request $request, PlannedShutdown $plannedShutdown): JsonResponse
    {
        Gate::authorize('update', $plannedShutdown);

        if ($plannedShutdown->status === ShutdownStatus::COMPLETED) {
            return response()->json([
                'message' => 'Completed shutdowns cannot be cancelled',
            ], 422);
        }

        DB::beginTransaction();
        try {
            // Cancel associated planning slots
            PlanningSlot::forCompany($request->user()->company_id)
                ->where('source', PlanningSlotSource::SHUTDOWN->value)
                ->where('start_at', '>=', $plannedShutdown->start_at)
                ->where('end_at', '<=', $plannedShutdown->end_at)
                ->when($plannedShutdown->machine_id, fn($q) => $q->where('machine_id', $plannedShutdown->machine_id))
                ->update(['status' => PlanningSlotStatus::CANCELLED->value]);

            $plannedShutdown->update([
                'status' => ShutdownStatus::CANCELLED->value,
            ]);

            DB::commit();

            return response()->json([
                'shutdown' => $plannedShutdown->fresh(),
                'message' => 'Shutdown cancelled',
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to cancel shutdown: ' . $e->getMessage(),
            ], 500);
        }
    }
}
