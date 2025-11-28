<?php

namespace App\Http\Controllers;

use App\Enums\PlanningSlotStatus;
use App\Enums\PlanningSlotSource;
use App\Models\PlanningSlot;
use App\Models\WorkOrder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class PlanningSlotController extends Controller
{
    /**
     * Store a newly created planning slot.
     */
    public function store(Request $request): RedirectResponse
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
            return back()->withErrors(['work_order_id' => 'Work order not found']);
        }

        // Verify technician is in the same company
        $technician = \App\Models\User::findOrFail($validated['technician_id']);
        if ($technician->company_id !== $request->user()->company_id) {
            return back()->withErrors(['technician_id' => 'Technician not found']);
        }

        // Calculate duration
        $startAt = \Carbon\Carbon::parse($validated['start_at']);
        $endAt = \Carbon\Carbon::parse($validated['end_at']);
        $durationMinutes = $startAt->diffInMinutes($endAt);

        PlanningSlot::create([
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
            'color' => $validated['color'] ?? null,
            'notes' => $validated['notes'] ?? null,
            'created_by' => $request->user()->id,
        ]);

        // Update work order planned dates
        $workOrder->update([
            'planned_start_at' => $validated['start_at'],
            'planned_end_at' => $validated['end_at'],
            'planned_duration_minutes' => $durationMinutes,
        ]);

        return back()->with('success', 'Planning slot created successfully');
    }

    /**
     * Update the specified planning slot.
     */
    public function update(Request $request, PlanningSlot $slot): RedirectResponse
    {
        Gate::authorize('update', $slot);

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
                return back()->withErrors(['technician_id' => 'Technician not found']);
            }
        }

        // Calculate duration if times changed
        $startAt = \Carbon\Carbon::parse($validated['start_at'] ?? $slot->start_at);
        $endAt = \Carbon\Carbon::parse($validated['end_at'] ?? $slot->end_at);

        if ($endAt <= $startAt) {
            return back()->withErrors(['end_at' => 'End time must be after start time']);
        }

        $durationMinutes = $startAt->diffInMinutes($endAt);

        $slot->update([
            ...$validated,
            'start_at' => $startAt,
            'end_at' => $endAt,
            'duration_minutes' => $durationMinutes,
            'updated_by' => $request->user()->id,
        ]);

        // Update work order planned dates
        $slot->workOrder->update([
            'planned_start_at' => $startAt,
            'planned_end_at' => $endAt,
            'planned_duration_minutes' => $durationMinutes,
        ]);

        return back()->with('success', 'Planning slot updated successfully');
    }

    /**
     * Delete the specified planning slot.
     */
    public function destroy(Request $request, PlanningSlot $slot): RedirectResponse
    {
        Gate::authorize('delete', $slot);

        // Clear work order planned dates
        $slot->workOrder->update([
            'planned_start_at' => null,
            'planned_end_at' => null,
            'planned_duration_minutes' => null,
        ]);

        $slot->delete();

        return back()->with('success', 'Planning slot deleted successfully');
    }
}
