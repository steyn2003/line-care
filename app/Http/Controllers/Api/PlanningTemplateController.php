<?php

namespace App\Http\Controllers\Api;

use App\Enums\PlanningSlotSource;
use App\Enums\PlanningSlotStatus;
use App\Http\Controllers\Controller;
use App\Models\PlanningSlot;
use App\Models\PlanningTemplate;
use App\Models\WorkOrder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

class PlanningTemplateController extends Controller
{
    /**
     * Display a listing of planning templates.
     */
    public function index(Request $request): JsonResponse
    {
        Gate::authorize('viewAny', PlanningTemplate::class);

        $query = PlanningTemplate::query()
            ->with(['creator:id,name'])
            ->forCompany($request->user()->company_id);

        // Search by name
        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        // Sort
        $query->orderBy('name', 'asc');

        $templates = $query->paginate($request->input('per_page', 20));

        return response()->json($templates);
    }

    /**
     * Store a newly created planning template.
     */
    public function store(Request $request): JsonResponse
    {
        Gate::authorize('create', PlanningTemplate::class);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'template_data' => ['required', 'array'],
            'template_data.slots' => ['required', 'array', 'min:1'],
            'template_data.slots.*.day_of_week' => ['nullable', 'integer', 'min:0', 'max:6'],
            'template_data.slots.*.start_time' => ['required', 'date_format:H:i'],
            'template_data.slots.*.duration_minutes' => ['required', 'integer', 'min:15'],
            'template_data.slots.*.technician_id' => ['nullable', 'exists:users,id'],
            'template_data.slots.*.machine_id' => ['nullable', 'exists:machines,id'],
            'template_data.slots.*.notes' => ['nullable', 'string'],
            'recurrence_rule' => ['nullable', 'string'],
        ]);

        $template = PlanningTemplate::create([
            'company_id' => $request->user()->company_id,
            'name' => $validated['name'],
            'description' => $validated['description'],
            'template_data' => $validated['template_data'],
            'recurrence_rule' => $validated['recurrence_rule'],
            'created_by' => $request->user()->id,
        ]);

        return response()->json([
            'template' => $template->load('creator'),
            'message' => 'Planning template created successfully',
        ], 201);
    }

    /**
     * Display the specified planning template.
     */
    public function show(Request $request, PlanningTemplate $planningTemplate): JsonResponse
    {
        Gate::authorize('view', $planningTemplate);

        $planningTemplate->load('creator');

        return response()->json([
            'template' => $planningTemplate,
        ]);
    }

    /**
     * Update the specified planning template.
     */
    public function update(Request $request, PlanningTemplate $planningTemplate): JsonResponse
    {
        Gate::authorize('update', $planningTemplate);

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'template_data' => ['sometimes', 'array'],
            'template_data.slots' => ['sometimes', 'array', 'min:1'],
            'template_data.slots.*.day_of_week' => ['nullable', 'integer', 'min:0', 'max:6'],
            'template_data.slots.*.start_time' => ['required_with:template_data.slots', 'date_format:H:i'],
            'template_data.slots.*.duration_minutes' => ['required_with:template_data.slots', 'integer', 'min:15'],
            'template_data.slots.*.technician_id' => ['nullable', 'exists:users,id'],
            'template_data.slots.*.machine_id' => ['nullable', 'exists:machines,id'],
            'template_data.slots.*.notes' => ['nullable', 'string'],
            'recurrence_rule' => ['nullable', 'string'],
        ]);

        $planningTemplate->update($validated);

        return response()->json([
            'template' => $planningTemplate->fresh()->load('creator'),
            'message' => 'Planning template updated successfully',
        ]);
    }

    /**
     * Delete the specified planning template.
     */
    public function destroy(Request $request, PlanningTemplate $planningTemplate): JsonResponse
    {
        Gate::authorize('delete', $planningTemplate);

        $planningTemplate->delete();

        return response()->json([
            'message' => 'Planning template deleted successfully',
        ]);
    }

    /**
     * Generate planning slots from a template.
     */
    public function generate(Request $request, PlanningTemplate $planningTemplate): JsonResponse
    {
        Gate::authorize('view', $planningTemplate);

        $validated = $request->validate([
            'date_from' => ['required', 'date'],
            'date_to' => ['required', 'date', 'after_or_equal:date_from'],
            'work_order_ids' => ['nullable', 'array'],
            'work_order_ids.*' => ['exists:work_orders,id'],
        ]);

        $dateFrom = \Carbon\Carbon::parse($validated['date_from']);
        $dateTo = \Carbon\Carbon::parse($validated['date_to']);
        $templateSlots = $planningTemplate->getSlots();
        $workOrderIds = $validated['work_order_ids'] ?? [];

        $createdSlots = [];
        $errors = [];

        DB::beginTransaction();
        try {
            $workOrderIndex = 0;
            $currentDate = $dateFrom->copy();

            while ($currentDate <= $dateTo) {
                foreach ($templateSlots as $templateSlot) {
                    // Check if this slot is for a specific day of week
                    if (isset($templateSlot['day_of_week'])) {
                        if ($currentDate->dayOfWeek !== $templateSlot['day_of_week']) {
                            continue;
                        }
                    }

                    // Skip weekends unless explicitly defined
                    if (!isset($templateSlot['day_of_week']) && $currentDate->isWeekend()) {
                        continue;
                    }

                    // Get work order if available
                    $workOrderId = null;
                    if (isset($workOrderIds[$workOrderIndex])) {
                        $workOrder = WorkOrder::find($workOrderIds[$workOrderIndex]);
                        if ($workOrder && $workOrder->company_id === $request->user()->company_id) {
                            $workOrderId = $workOrder->id;
                            $workOrderIndex++;
                        }
                    }

                    // Skip if no work order and template requires one
                    if (!$workOrderId && !isset($templateSlot['is_recurring'])) {
                        continue;
                    }

                    // Parse times
                    $startTime = \Carbon\Carbon::parse($templateSlot['start_time']);
                    $slotStart = $currentDate->copy()->setTime($startTime->hour, $startTime->minute);
                    $slotEnd = $slotStart->copy()->addMinutes($templateSlot['duration_minutes']);

                    // Get technician
                    $technicianId = $templateSlot['technician_id'] ?? null;
                    if (!$technicianId && $workOrderId) {
                        $workOrder = WorkOrder::find($workOrderId);
                        $technicianId = $workOrder->assigned_to;
                    }

                    if (!$technicianId) {
                        $errors[] = "No technician specified for slot on {$currentDate->toDateString()}";
                        continue;
                    }

                    // Get machine from work order if available
                    $machineId = $templateSlot['machine_id'] ?? null;
                    $locationId = null;
                    if ($workOrderId) {
                        $workOrder = WorkOrder::with('machine')->find($workOrderId);
                        $machineId = $machineId ?? $workOrder->machine_id;
                        $locationId = $workOrder->machine->location_id;
                    }

                    if (!$machineId) {
                        $errors[] = "No machine specified for slot on {$currentDate->toDateString()}";
                        continue;
                    }

                    // Get location if not set
                    if (!$locationId) {
                        $machine = \App\Models\Machine::find($machineId);
                        $locationId = $machine->location_id;
                    }

                    // Create slot
                    $slot = PlanningSlot::create([
                        'company_id' => $request->user()->company_id,
                        'work_order_id' => $workOrderId,
                        'technician_id' => $technicianId,
                        'machine_id' => $machineId,
                        'location_id' => $locationId,
                        'start_at' => $slotStart,
                        'end_at' => $slotEnd,
                        'duration_minutes' => $templateSlot['duration_minutes'],
                        'status' => PlanningSlotStatus::TENTATIVE->value,
                        'source' => PlanningSlotSource::RECURRING->value,
                        'notes' => $templateSlot['notes'] ?? "Generated from template: {$planningTemplate->name}",
                        'created_by' => $request->user()->id,
                    ]);

                    // Update work order if linked
                    if ($workOrderId) {
                        WorkOrder::where('id', $workOrderId)->update([
                            'planned_start_at' => $slotStart,
                            'planned_end_at' => $slotEnd,
                            'planned_duration_minutes' => $templateSlot['duration_minutes'],
                        ]);
                    }

                    $createdSlots[] = $slot;
                }

                $currentDate->addDay();
            }

            DB::commit();

            return response()->json([
                'slots' => PlanningSlot::whereIn('id', collect($createdSlots)->pluck('id'))
                    ->with(['workOrder', 'technician', 'machine'])
                    ->get(),
                'errors' => $errors,
                'message' => count($createdSlots) . ' planning slots generated from template',
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to generate slots: ' . $e->getMessage(),
            ], 500);
        }
    }
}
