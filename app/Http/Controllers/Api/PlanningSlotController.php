<?php

namespace App\Http\Controllers\Api;

use App\Enums\PlanningSlotStatus;
use App\Enums\PlanningSlotSource;
use App\Http\Controllers\Controller;
use App\Models\PlanningSlot;
use App\Models\WorkOrder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class PlanningSlotController extends Controller
{
    /**
     * Display a listing of planning slots.
     */
    public function index(Request $request): JsonResponse
    {
        Gate::authorize('viewAny', PlanningSlot::class);

        $query = PlanningSlot::query()
            ->with([
                'workOrder:id,title,type,status,machine_id',
                'technician:id,name',
                'machine:id,name,code',
                'location:id,name',
            ])
            ->forCompany($request->user()->company_id);

        // Filter by date range
        if ($request->has('date_from') && $request->has('date_to')) {
            $query->overlapping($request->date_from, $request->date_to);
        }

        // Filter by technician
        if ($request->has('technician_id')) {
            $query->forTechnician($request->technician_id);
        }

        // Filter by machine
        if ($request->has('machine_id')) {
            $query->forMachine($request->machine_id);
        }

        // Filter by status
        if ($request->has('status')) {
            $status = PlanningSlotStatus::tryFrom($request->status);
            if ($status) {
                $query->withStatus($status);
            }
        }

        // Sort
        $query->orderBy('start_at', 'asc');

        $slots = $query->paginate($request->input('per_page', 50));

        return response()->json($slots);
    }

    /**
     * Store a newly created planning slot.
     */
    public function store(Request $request): JsonResponse
    {
        Gate::authorize('create', PlanningSlot::class);

        $validated = $request->validate([
            'work_order_id' => ['required', 'exists:work_orders,id'],
            'technician_id' => ['required', 'exists:users,id'],
            'start_at' => ['required', 'date'],
            'end_at' => ['required', 'date', 'after:start_at'],
            'status' => ['nullable', Rule::in(PlanningSlotStatus::values())],
            'source' => ['nullable', Rule::in(PlanningSlotSource::values())],
            'color' => ['nullable', 'string', 'max:50'],
            'notes' => ['nullable', 'string'],
        ]);

        // Get work order and verify company
        $workOrder = WorkOrder::findOrFail($validated['work_order_id']);
        if ($workOrder->company_id !== $request->user()->company_id) {
            return response()->json(['message' => 'Work order not found'], 404);
        }

        // Verify technician is in the same company
        $technician = \App\Models\User::findOrFail($validated['technician_id']);
        if ($technician->company_id !== $request->user()->company_id) {
            return response()->json(['message' => 'Technician not found'], 404);
        }

        // Calculate duration
        $startAt = \Carbon\Carbon::parse($validated['start_at']);
        $endAt = \Carbon\Carbon::parse($validated['end_at']);
        $durationMinutes = $startAt->diffInMinutes($endAt);

        // Check for conflicts
        $conflicts = $this->detectConflicts(
            $request->user()->company_id,
            $validated['technician_id'],
            $workOrder->machine_id,
            $validated['start_at'],
            $validated['end_at']
        );

        $slot = PlanningSlot::create([
            'company_id' => $request->user()->company_id,
            'work_order_id' => $validated['work_order_id'],
            'technician_id' => $validated['technician_id'],
            'machine_id' => $workOrder->machine_id,
            'location_id' => $workOrder->machine->location_id,
            'start_at' => $validated['start_at'],
            'end_at' => $validated['end_at'],
            'duration_minutes' => $durationMinutes,
            'status' => $validated['status'] ?? PlanningSlotStatus::PLANNED->value,
            'source' => $validated['source'] ?? PlanningSlotSource::MANUAL->value,
            'color' => $validated['color'],
            'notes' => $validated['notes'],
            'created_by' => $request->user()->id,
        ]);

        // Update work order planned dates
        $workOrder->update([
            'planned_start_at' => $validated['start_at'],
            'planned_end_at' => $validated['end_at'],
            'planned_duration_minutes' => $durationMinutes,
        ]);

        return response()->json([
            'slot' => $slot->load(['workOrder', 'technician', 'machine', 'location']),
            'conflicts' => $conflicts,
            'message' => 'Planning slot created successfully',
        ], 201);
    }

    /**
     * Display the specified planning slot.
     */
    public function show(Request $request, PlanningSlot $planningSlot): JsonResponse
    {
        Gate::authorize('view', $planningSlot);

        $planningSlot->load([
            'workOrder.machine',
            'workOrder.assignee',
            'technician',
            'machine.location',
            'location',
            'creator',
            'updater',
        ]);

        return response()->json([
            'slot' => $planningSlot,
        ]);
    }

    /**
     * Update the specified planning slot.
     */
    public function update(Request $request, PlanningSlot $planningSlot): JsonResponse
    {
        Gate::authorize('update', $planningSlot);

        $validated = $request->validate([
            'technician_id' => ['sometimes', 'exists:users,id'],
            'start_at' => ['sometimes', 'date'],
            'end_at' => ['sometimes', 'date'],
            'status' => ['sometimes', Rule::in(PlanningSlotStatus::values())],
            'color' => ['nullable', 'string', 'max:50'],
            'notes' => ['nullable', 'string'],
        ]);

        // Verify technician is in the same company
        if (isset($validated['technician_id'])) {
            $technician = \App\Models\User::findOrFail($validated['technician_id']);
            if ($technician->company_id !== $request->user()->company_id) {
                return response()->json(['message' => 'Technician not found'], 404);
            }
        }

        // Calculate duration if times changed
        $startAt = \Carbon\Carbon::parse($validated['start_at'] ?? $planningSlot->start_at);
        $endAt = \Carbon\Carbon::parse($validated['end_at'] ?? $planningSlot->end_at);

        if ($endAt <= $startAt) {
            return response()->json(['message' => 'End time must be after start time'], 422);
        }

        $durationMinutes = $startAt->diffInMinutes($endAt);

        // Check for conflicts (excluding current slot)
        $conflicts = $this->detectConflicts(
            $request->user()->company_id,
            $validated['technician_id'] ?? $planningSlot->technician_id,
            $planningSlot->machine_id,
            $startAt->toDateTimeString(),
            $endAt->toDateTimeString(),
            $planningSlot->id
        );

        $planningSlot->update([
            ...$validated,
            'duration_minutes' => $durationMinutes,
            'updated_by' => $request->user()->id,
        ]);

        // Update work order planned dates
        $planningSlot->workOrder->update([
            'planned_start_at' => $startAt,
            'planned_end_at' => $endAt,
            'planned_duration_minutes' => $durationMinutes,
        ]);

        return response()->json([
            'slot' => $planningSlot->fresh()->load(['workOrder', 'technician', 'machine', 'location']),
            'conflicts' => $conflicts,
            'message' => 'Planning slot updated successfully',
        ]);
    }

    /**
     * Delete the specified planning slot.
     */
    public function destroy(Request $request, PlanningSlot $planningSlot): JsonResponse
    {
        Gate::authorize('delete', $planningSlot);

        // Clear work order planned dates
        $planningSlot->workOrder->update([
            'planned_start_at' => null,
            'planned_end_at' => null,
            'planned_duration_minutes' => null,
        ]);

        $planningSlot->delete();

        return response()->json([
            'message' => 'Planning slot deleted successfully',
        ]);
    }

    /**
     * Bulk create planning slots.
     */
    public function bulkCreate(Request $request): JsonResponse
    {
        Gate::authorize('create', PlanningSlot::class);

        $validated = $request->validate([
            'slots' => ['required', 'array', 'min:1'],
            'slots.*.work_order_id' => ['required', 'exists:work_orders,id'],
            'slots.*.technician_id' => ['required', 'exists:users,id'],
            'slots.*.start_at' => ['required', 'date'],
            'slots.*.end_at' => ['required', 'date'],
            'slots.*.status' => ['nullable', Rule::in(PlanningSlotStatus::values())],
            'slots.*.notes' => ['nullable', 'string'],
        ]);

        $createdSlots = [];
        $allConflicts = [];

        DB::beginTransaction();
        try {
            foreach ($validated['slots'] as $slotData) {
                $workOrder = WorkOrder::findOrFail($slotData['work_order_id']);
                if ($workOrder->company_id !== $request->user()->company_id) {
                    throw new \Exception('Work order not found');
                }

                $technician = \App\Models\User::findOrFail($slotData['technician_id']);
                if ($technician->company_id !== $request->user()->company_id) {
                    throw new \Exception('Technician not found');
                }

                $startAt = \Carbon\Carbon::parse($slotData['start_at']);
                $endAt = \Carbon\Carbon::parse($slotData['end_at']);
                $durationMinutes = $startAt->diffInMinutes($endAt);

                $conflicts = $this->detectConflicts(
                    $request->user()->company_id,
                    $slotData['technician_id'],
                    $workOrder->machine_id,
                    $slotData['start_at'],
                    $slotData['end_at']
                );

                if (!empty($conflicts)) {
                    $allConflicts[$slotData['work_order_id']] = $conflicts;
                }

                $slot = PlanningSlot::create([
                    'company_id' => $request->user()->company_id,
                    'work_order_id' => $slotData['work_order_id'],
                    'technician_id' => $slotData['technician_id'],
                    'machine_id' => $workOrder->machine_id,
                    'location_id' => $workOrder->machine->location_id,
                    'start_at' => $slotData['start_at'],
                    'end_at' => $slotData['end_at'],
                    'duration_minutes' => $durationMinutes,
                    'status' => $slotData['status'] ?? PlanningSlotStatus::PLANNED->value,
                    'source' => PlanningSlotSource::MANUAL->value,
                    'notes' => $slotData['notes'] ?? null,
                    'created_by' => $request->user()->id,
                ]);

                $workOrder->update([
                    'planned_start_at' => $slotData['start_at'],
                    'planned_end_at' => $slotData['end_at'],
                    'planned_duration_minutes' => $durationMinutes,
                ]);

                $createdSlots[] = $slot;
            }

            DB::commit();

            return response()->json([
                'slots' => PlanningSlot::whereIn('id', collect($createdSlots)->pluck('id'))
                    ->with(['workOrder', 'technician', 'machine', 'location'])
                    ->get(),
                'conflicts' => $allConflicts,
                'message' => count($createdSlots) . ' planning slots created successfully',
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to create planning slots: ' . $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Bulk update planning slots.
     */
    public function bulkUpdate(Request $request): JsonResponse
    {
        Gate::authorize('create', PlanningSlot::class);

        $validated = $request->validate([
            'slots' => ['required', 'array', 'min:1'],
            'slots.*.id' => ['required', 'exists:planning_slots,id'],
            'slots.*.technician_id' => ['sometimes', 'exists:users,id'],
            'slots.*.start_at' => ['sometimes', 'date'],
            'slots.*.end_at' => ['sometimes', 'date'],
            'slots.*.status' => ['sometimes', Rule::in(PlanningSlotStatus::values())],
            'slots.*.notes' => ['nullable', 'string'],
        ]);

        $updatedSlots = [];
        $allConflicts = [];

        DB::beginTransaction();
        try {
            foreach ($validated['slots'] as $slotData) {
                $slot = PlanningSlot::findOrFail($slotData['id']);

                if ($slot->company_id !== $request->user()->company_id) {
                    throw new \Exception('Planning slot not found');
                }

                if (isset($slotData['technician_id'])) {
                    $technician = \App\Models\User::findOrFail($slotData['technician_id']);
                    if ($technician->company_id !== $request->user()->company_id) {
                        throw new \Exception('Technician not found');
                    }
                }

                $startAt = \Carbon\Carbon::parse($slotData['start_at'] ?? $slot->start_at);
                $endAt = \Carbon\Carbon::parse($slotData['end_at'] ?? $slot->end_at);
                $durationMinutes = $startAt->diffInMinutes($endAt);

                $conflicts = $this->detectConflicts(
                    $request->user()->company_id,
                    $slotData['technician_id'] ?? $slot->technician_id,
                    $slot->machine_id,
                    $startAt->toDateTimeString(),
                    $endAt->toDateTimeString(),
                    $slot->id
                );

                if (!empty($conflicts)) {
                    $allConflicts[$slot->id] = $conflicts;
                }

                $slot->update([
                    'technician_id' => $slotData['technician_id'] ?? $slot->technician_id,
                    'start_at' => $startAt,
                    'end_at' => $endAt,
                    'duration_minutes' => $durationMinutes,
                    'status' => $slotData['status'] ?? $slot->status,
                    'notes' => $slotData['notes'] ?? $slot->notes,
                    'updated_by' => $request->user()->id,
                ]);

                $slot->workOrder->update([
                    'planned_start_at' => $startAt,
                    'planned_end_at' => $endAt,
                    'planned_duration_minutes' => $durationMinutes,
                ]);

                $updatedSlots[] = $slot->id;
            }

            DB::commit();

            return response()->json([
                'slots' => PlanningSlot::whereIn('id', $updatedSlots)
                    ->with(['workOrder', 'technician', 'machine', 'location'])
                    ->get(),
                'conflicts' => $allConflicts,
                'message' => count($updatedSlots) . ' planning slots updated successfully',
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to update planning slots: ' . $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Detect conflicts for a planning slot.
     */
    protected function detectConflicts(
        int $companyId,
        int $technicianId,
        int $machineId,
        string $startAt,
        string $endAt,
        ?int $excludeSlotId = null
    ): array {
        $conflicts = [];

        // Check technician conflicts (double booking)
        $technicianConflicts = PlanningSlot::forCompany($companyId)
            ->forTechnician($technicianId)
            ->overlapping($startAt, $endAt)
            ->active()
            ->when($excludeSlotId, fn($q) => $q->where('id', '!=', $excludeSlotId))
            ->with(['workOrder:id,title', 'machine:id,name'])
            ->get();

        if ($technicianConflicts->isNotEmpty()) {
            $conflicts['technician'] = $technicianConflicts->map(fn($s) => [
                'id' => $s->id,
                'work_order_title' => $s->workOrder->title,
                'machine_name' => $s->machine->name,
                'start_at' => $s->start_at->toDateTimeString(),
                'end_at' => $s->end_at->toDateTimeString(),
            ])->toArray();
        }

        // Check machine conflicts
        $machineConflicts = PlanningSlot::forCompany($companyId)
            ->forMachine($machineId)
            ->overlapping($startAt, $endAt)
            ->active()
            ->when($excludeSlotId, fn($q) => $q->where('id', '!=', $excludeSlotId))
            ->with(['workOrder:id,title', 'technician:id,name'])
            ->get();

        if ($machineConflicts->isNotEmpty()) {
            $conflicts['machine'] = $machineConflicts->map(fn($s) => [
                'id' => $s->id,
                'work_order_title' => $s->workOrder->title,
                'technician_name' => $s->technician->name,
                'start_at' => $s->start_at->toDateTimeString(),
                'end_at' => $s->end_at->toDateTimeString(),
            ])->toArray();
        }

        return $conflicts;
    }
}
