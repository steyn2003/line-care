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
        ]);

        $causeCategories = CauseCategory::where('company_id', $request->user()->company_id)
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('work-orders/show', [
            'work_order' => $workOrder,
            'cause_categories' => $causeCategories,
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

        $validated = $request->validate([
            'completed_at' => 'required|date',
            'cause_category_id' => 'nullable|exists:cause_categories,id',
            'notes' => 'nullable|string',
            'work_done' => 'nullable|string',
            'parts_used' => 'nullable|string',
        ]);

        // Update work order
        $workOrder->update([
            'status' => \App\Enums\WorkOrderStatus::COMPLETED,
            'completed_at' => $validated['completed_at'],
            'cause_category_id' => $validated['cause_category_id'],
        ]);

        // Create maintenance log
        $workOrder->maintenanceLogs()->create([
            'user_id' => $request->user()->id,
            'machine_id' => $workOrder->machine_id,
            'notes' => $validated['notes'],
            'work_done' => $validated['work_done'],
            'parts_used' => $validated['parts_used'],
        ]);

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
