<?php

namespace App\Http\Controllers;

use App\Models\CauseCategory;
use App\Models\Machine;
use App\Models\WorkOrder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WorkOrderController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $query = WorkOrder::with(['machine:id,name', 'creator:id,name', 'assignee:id,name'])
            ->where('company_id', $user->company_id);

        // Operators can only see their own work orders
        if ($user->role && $user->role->value === 'operator') {
            $query->where('created_by', $user->id);
        }

        // Apply filters
        if ($request->status) {
            $query->where('status', $request->status);
        }

        if ($request->type) {
            $query->where('type', $request->type);
        }

        if ($request->machine_id) {
            $query->where('machine_id', $request->machine_id);
        }

        // Date range filter
        if ($request->date_from) {
            $query->where('created_at', '>=', \Carbon\Carbon::parse($request->date_from)->startOfDay());
        }

        if ($request->date_to) {
            $query->where('created_at', '<=', \Carbon\Carbon::parse($request->date_to)->endOfDay());
        }

        $workOrders = $query->latest()->paginate(20);

        $machines = Machine::where('company_id', $user->company_id)
            ->where('status', 'active')
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('work-orders/index', [
            'work_orders' => $workOrders,
            'machines' => $machines,
            'filters' => [
                'status' => $request->status,
                'type' => $request->type,
                'machine_id' => $request->machine_id,
                'date_from' => $request->date_from,
                'date_to' => $request->date_to,
            ],
            'user' => [
                'role' => $user->role ? $user->role->value : 'operator',
            ],
        ]);
    }

    public function show(Request $request, WorkOrder $workOrder): Response
    {
        // Verify user can access this work order
        if ($workOrder->company_id !== $request->user()->company_id) {
            abort(403);
        }

        $workOrder->load([
            'machine.location',
            'creator:id,name,email',
            'assignee:id,name,email',
            'causeCategory',
            'preventiveTask',
            'maintenanceLogs.user:id,name',
            'spareParts.category',
            'spareParts.stocks.location',
            'cost',
        ]);

        $causeCategories = CauseCategory::where('company_id', $request->user()->company_id)
            ->orderBy('name')
            ->get(['id', 'name']);

        // Get available spare parts for selection
        $spareParts = \App\Models\SparePart::query()
            ->with(['category', 'stocks.location'])
            ->where('company_id', $request->user()->company_id)
            ->where('status', 'active')
            ->orderBy('name')
            ->get()
            ->map(function ($part) {
                $part->total_quantity_available = $part->stocks->sum(function ($stock) {
                    return max(0, $stock->quantity_on_hand - $stock->quantity_reserved);
                });
                return $part;
            });

        // Get locations for the company
        $locations = \App\Models\Location::where('company_id', $request->user()->company_id)
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('work-orders/show', [
            'work_order' => $workOrder,
            'cause_categories' => $causeCategories,
            'spare_parts' => $spareParts,
            'locations' => $locations,
            'user' => [
                'id' => $request->user()->id,
                'role' => $request->user()->role ? $request->user()->role->value : 'operator',
            ],
        ]);
    }

    public function reportBreakdown(Request $request): Response
    {
        $machines = Machine::where('company_id', $request->user()->company_id)
            ->where('status', 'active')
            ->orderBy('name')
            ->get(['id', 'name', 'code']);

        $causeCategories = CauseCategory::where('company_id', $request->user()->company_id)
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('work-orders/report-breakdown', [
            'machines' => $machines,
            'cause_categories' => $causeCategories,
            'preselected_machine_id' => $request->machine_id,
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        // Check if user has a company assigned
        if (!$user->company_id) {
            return back()->withErrors([
                'company' => 'You must be assigned to a company to create work orders. Please contact your administrator.'
            ]);
        }

        $validated = $request->validate([
            'machine_id' => 'required|exists:machines,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'started_at' => 'nullable|date',
            'cause_category_id' => 'nullable|exists:cause_categories,id',
        ]);

        $validated['company_id'] = $user->company_id;
        $validated['created_by'] = $user->id;
        $validated['type'] = \App\Enums\WorkOrderType::BREAKDOWN;
        $validated['status'] = \App\Enums\WorkOrderStatus::OPEN;

        WorkOrder::create($validated);

        return redirect()->route('work-orders.index')
            ->with('success', 'Breakdown reported successfully');
    }

    public function updateStatus(Request $request, WorkOrder $workOrder)
    {
        // Verify user can access this work order
        if ($workOrder->company_id !== $request->user()->company_id) {
            abort(403);
        }

        $validated = $request->validate([
            'status' => 'required|in:open,in_progress,completed,cancelled',
        ]);

        // If changing to in_progress, set started_at
        if ($validated['status'] === 'in_progress' && !$workOrder->started_at) {
            $workOrder->started_at = now();
        }

        $workOrder->update(['status' => $validated['status']]);

        return back()->with('success', 'Work order status updated successfully');
    }

    public function assign(Request $request, WorkOrder $workOrder)
    {
        // Verify user can access this work order
        if ($workOrder->company_id !== $request->user()->company_id) {
            abort(403);
        }

        $validated = $request->validate([
            'assigned_to' => 'required|exists:users,id',
        ]);

        $workOrder->update(['assigned_to' => $validated['assigned_to']]);

        return back()->with('success', 'Work order assigned successfully');
    }

    public function complete(Request $request, WorkOrder $workOrder)
    {
        // Verify user can access this work order
        if ($workOrder->company_id !== $request->user()->company_id) {
            abort(403);
        }

        // Check authorization to complete work orders
        $this->authorize('complete', $workOrder);

        $validated = $request->validate([
            'completed_at' => 'required|date',
            'time_started' => 'nullable|date',
            'time_completed' => 'nullable|date|after:time_started',
            'break_time' => 'nullable|numeric|min:0',
            'cause_category_id' => 'nullable|exists:cause_categories,id',
            'notes' => 'nullable|string',
            'work_done' => 'nullable|string',
            'parts_used' => 'nullable|string',
            'spare_parts' => 'nullable|array',
            'spare_parts.*.spare_part_id' => 'required|exists:spare_parts,id',
            'spare_parts.*.quantity' => 'required|integer|min:1',
            'spare_parts.*.location_id' => 'required|exists:locations,id',
        ]);

        // Update work order
        $workOrder->update([
            'status' => \App\Enums\WorkOrderStatus::COMPLETED,
            'completed_at' => $validated['completed_at'],
            'cause_category_id' => $validated['cause_category_id'] ?? null,
        ]);

        // Handle spare parts if provided
        if (!empty($validated['spare_parts'])) {
            foreach ($validated['spare_parts'] as $partData) {
                $sparePart = \App\Models\SparePart::find($partData['spare_part_id']);

                // Find the stock for this location
                $stock = $sparePart->stocks()->where('location_id', $partData['location_id'])->first();

                if ($stock && $stock->quantity_on_hand >= $partData['quantity']) {
                    // Consume the stock
                    $stock->decrement('quantity_on_hand', $partData['quantity']);

                    // Attach to work order
                    $workOrder->spareParts()->attach($partData['spare_part_id'], [
                        'quantity_used' => $partData['quantity'],
                        'unit_cost' => $sparePart->unit_cost,
                        'location_id' => $partData['location_id'],
                    ]);

                    // Create inventory transaction
                    \App\Models\InventoryTransaction::create([
                        'company_id' => $request->user()->company_id,
                        'spare_part_id' => $partData['spare_part_id'],
                        'location_id' => $partData['location_id'],
                        'transaction_type' => 'consumption',
                        'quantity' => -$partData['quantity'],
                        'reference_type' => 'App\Models\WorkOrder',
                        'reference_id' => $workOrder->id,
                        'user_id' => $request->user()->id,
                        'notes' => 'Used in work order #' . $workOrder->id,
                        'transaction_date' => $validated['completed_at'],
                    ]);
                }
            }
        }

        // Calculate labor cost if time tracking provided
        $hoursWorked = 0;
        $laborCost = 0;

        if (!empty($validated['time_started']) && !empty($validated['time_completed'])) {
            $timeStarted = \Carbon\Carbon::parse($validated['time_started']);
            $timeCompleted = \Carbon\Carbon::parse($validated['time_completed']);
            $breakTime = $validated['break_time'] ?? 0;

            // Calculate hours worked
            $totalMinutes = $timeStarted->diffInMinutes($timeCompleted);
            $breakMinutes = $breakTime * 60;
            $workedMinutes = $totalMinutes - $breakMinutes;
            $hoursWorked = $workedMinutes / 60;

            // Get user's labor rate
            $userId = $request->user()->id;
            $laborRate = \App\Models\LaborRate::getCurrentRate(
                $request->user()->company_id,
                $userId,
                $request->user()->role->value
            );

            if ($laborRate) {
                // Check if overtime (basic check - after 6 PM)
                $rate = $laborRate->hourly_rate;
                if ($laborRate->overtime_rate && $timeCompleted->hour >= 18) {
                    $rate = $laborRate->overtime_rate;
                }
                $laborCost = $hoursWorked * $rate;
            }
        }

        // Create maintenance log with time tracking
        $workOrder->maintenanceLogs()->create([
            'user_id' => $request->user()->id,
            'machine_id' => $workOrder->machine_id,
            'notes' => $validated['notes'] ?? null,
            'work_done' => $validated['work_done'] ?? null,
            'parts_used' => $validated['parts_used'] ?? null,
            'time_started' => $validated['time_started'] ?? null,
            'time_completed' => $validated['time_completed'] ?? null,
            'hours_worked' => $hoursWorked > 0 ? round($hoursWorked, 2) : null,
            'break_time' => $validated['break_time'] ?? null,
            'labor_cost' => $laborCost > 0 ? round($laborCost, 2) : null,
        ]);

        // Calculate and update work order costs
        $workOrderCost = $workOrder->cost ?? new \App\Models\WorkOrderCost(['work_order_id' => $workOrder->id]);

        // Labor cost (sum all maintenance logs)
        $totalLaborCost = $workOrder->maintenanceLogs()->sum('labor_cost') + $laborCost;
        $workOrderCost->labor_cost = $totalLaborCost;

        // Parts cost (sum all spare parts used)
        $partsCost = $workOrder->spareParts()->sum(\DB::raw('work_order_spare_parts.quantity_used * work_order_spare_parts.unit_cost'));
        $workOrderCost->parts_cost = $partsCost;

        // Downtime cost
        if ($workOrder->started_at && $workOrder->completed_at) {
            $downtimeHours = \Carbon\Carbon::parse($workOrder->started_at)
                ->diffInHours(\Carbon\Carbon::parse($workOrder->completed_at), true);
            $hourlyProductionValue = $workOrder->machine->hourly_production_value ?? 0;
            $workOrderCost->downtime_cost = $downtimeHours * $hourlyProductionValue;
        }

        // External service cost (if any - default 0)
        $externalServiceCost = \App\Models\ExternalService::where('work_order_id', $workOrder->id)->sum('cost');
        $workOrderCost->external_service_cost = $externalServiceCost;

        // Calculate total
        $workOrderCost->total_cost = $workOrderCost->labor_cost
            + $workOrderCost->parts_cost
            + $workOrderCost->downtime_cost
            + $workOrderCost->external_service_cost;

        $workOrderCost->save();

        // If this is a preventive task work order, update the task
        if ($workOrder->preventive_task_id) {
            $preventiveTask = $workOrder->preventiveTask;
            if ($preventiveTask) {
                $preventiveTask->last_completed_at = $validated['completed_at'];

                // Recalculate next due date
                $interval = (int) $preventiveTask->schedule_interval_value;
                $unit = $preventiveTask->schedule_interval_unit;
                $nextDueDate = \Carbon\Carbon::parse($validated['completed_at']);

                if ($unit === 'days') {
                    $nextDueDate->addDays($interval);
                } elseif ($unit === 'weeks') {
                    $nextDueDate->addWeeks($interval);
                } else {
                    $nextDueDate->addMonths($interval);
                }

                $preventiveTask->next_due_date = $nextDueDate;
                $preventiveTask->save();
            }
        }

        return redirect()->route('work-orders.show', $workOrder)
            ->with('success', 'Work order completed successfully');
    }
}
