<?php

namespace App\Http\Controllers;

use App\Models\PreventiveTask;
use App\Models\Machine;
use App\Models\User;
use App\Models\WorkOrder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PreventiveTaskController extends Controller
{
    public function index(Request $request): Response
    {
        $tasks = PreventiveTask::with(['machine', 'assignee'])
            ->where('company_id', $request->user()->company_id)
            ->orderBy('next_due_date')
            ->get();

        $machines = Machine::where('company_id', $request->user()->company_id)
            ->where('status', 'active')
            ->orderBy('name')
            ->get(['id', 'name', 'code']);

        return Inertia::render('preventive-tasks/index', [
            'tasks' => $tasks,
            'machines' => $machines,
        ]);
    }

    public function create(Request $request): Response
    {
        $machines = Machine::where('company_id', $request->user()->company_id)
            ->where('status', 'active')
            ->orderBy('name')
            ->get(['id', 'name', 'code']);

        $users = User::where('company_id', $request->user()->company_id)
            ->whereIn('role', ['technician', 'manager'])
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('preventive-tasks/create', [
            'machines' => $machines,
            'users' => $users,
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        if (!$user->company_id) {
            return back()->withErrors([
                'company' => 'You must be assigned to a company to create preventive tasks.'
            ]);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'machine_id' => 'required|exists:machines,id',
            'schedule_interval_value' => 'required|integer|min:1',
            'schedule_interval_unit' => 'required|in:days,weeks,months',
            'assigned_to' => 'nullable|exists:users,id',
        ]);

        $validated['company_id'] = $user->company_id;
        $validated['is_active'] = true;

        // Calculate next_due_date based on interval
        $interval = (int) $validated['schedule_interval_value'];
        $unit = $validated['schedule_interval_unit'];

        $nextDueDate = now();
        if ($unit === 'days') {
            $nextDueDate->addDays($interval);
        } elseif ($unit === 'weeks') {
            $nextDueDate->addWeeks($interval);
        } else {
            $nextDueDate->addMonths($interval);
        }

        $validated['next_due_date'] = $nextDueDate;

        PreventiveTask::create($validated);

        return redirect()->route('preventive-tasks.index')
            ->with('success', 'Preventive task created successfully');
    }

    public function show(Request $request, PreventiveTask $preventiveTask): Response
    {
        $preventiveTask->load(['machine', 'assignee']);

        $workOrders = WorkOrder::where('preventive_task_id', $preventiveTask->id)
            ->with('machine')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('preventive-tasks/show', [
            'task' => $preventiveTask,
            'work_orders' => $workOrders,
        ]);
    }

    public function edit(Request $request, PreventiveTask $preventiveTask): Response
    {
        $machines = Machine::where('company_id', $request->user()->company_id)
            ->where('status', 'active')
            ->orderBy('name')
            ->get(['id', 'name', 'code']);

        $users = User::where('company_id', $request->user()->company_id)
            ->whereIn('role', ['technician', 'manager'])
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('preventive-tasks/create', [
            'machines' => $machines,
            'users' => $users,
            'task' => $preventiveTask,
        ]);
    }

    public function update(Request $request, PreventiveTask $preventiveTask)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'machine_id' => 'required|exists:machines,id',
            'schedule_interval_value' => 'required|integer|min:1',
            'schedule_interval_unit' => 'required|in:days,weeks,months',
            'assigned_to' => 'nullable|exists:users,id',
            'is_active' => 'required|boolean',
        ]);

        // If schedule changed, recalculate next_due_date
        if (
            $preventiveTask->schedule_interval_value != $validated['schedule_interval_value'] ||
            $preventiveTask->schedule_interval_unit != $validated['schedule_interval_unit']
        ) {
            $interval = (int) $validated['schedule_interval_value'];
            $unit = $validated['schedule_interval_unit'];

            $baseDate = $preventiveTask->last_completed_at
                ? \Carbon\Carbon::parse($preventiveTask->last_completed_at)
                : now();

            if ($unit === 'days') {
                $baseDate->addDays($interval);
            } elseif ($unit === 'weeks') {
                $baseDate->addWeeks($interval);
            } else {
                $baseDate->addMonths($interval);
            }

            $validated['next_due_date'] = $baseDate;
        }

        $preventiveTask->update($validated);

        return redirect()->route('preventive-tasks.show', $preventiveTask)
            ->with('success', 'Preventive task updated successfully');
    }

    public function destroy(PreventiveTask $preventiveTask)
    {
        // Deactivate instead of delete
        $preventiveTask->update(['is_active' => false]);

        return redirect()->route('preventive-tasks.index')
            ->with('success', 'Preventive task deactivated successfully');
    }
}
