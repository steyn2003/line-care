<?php

namespace App\Http\Controllers\Api;

use App\Enums\WorkOrderStatus;
use App\Enums\WorkOrderType;
use App\Http\Controllers\Controller;
use App\Models\PreventiveTask;
use App\Models\WorkOrder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class PreventiveTaskController extends Controller
{
    /**
     * Display a listing of preventive tasks.
     */
    public function index(Request $request): JsonResponse
    {
        Gate::authorize('viewAny', PreventiveTask::class);

        $query = PreventiveTask::query()
            ->with(['machine:id,name', 'assignee:id,name'])
            ->forCompany($request->user()->company_id);

        // Filter by machine
        if ($request->has('machine_id')) {
            $query->where('machine_id', $request->machine_id);
        }

        // Filter by active status
        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        } else {
            // Default to active only
            $query->active();
        }

        // Filter for overdue tasks
        if ($request->boolean('overdue')) {
            $query->overdue();
        }

        $tasks = $query->orderBy('next_due_date')->get();

        return response()->json([
            'preventive_tasks' => $tasks,
        ]);
    }

    /**
     * Store a newly created preventive task.
     */
    public function store(Request $request): JsonResponse
    {
        Gate::authorize('create', PreventiveTask::class);

        $validated = $request->validate([
            'machine_id' => ['required', 'exists:machines,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'schedule_interval_value' => ['required', 'integer', 'min:1'],
            'schedule_interval_unit' => ['required', 'in:days,weeks,months'],
            'assigned_to' => ['nullable', 'exists:users,id'],
        ]);

        // Verify machine belongs to user's company
        $machine = \App\Models\Machine::find($validated['machine_id']);
        if ($machine->company_id !== $request->user()->company_id) {
            return response()->json([
                'message' => 'Machine not found or does not belong to your company.',
            ], 403);
        }

        // Verify assignee (if provided) belongs to user's company
        if (isset($validated['assigned_to'])) {
            $assignee = \App\Models\User::find($validated['assigned_to']);
            if ($assignee->company_id !== $request->user()->company_id) {
                return response()->json([
                    'message' => 'Cannot assign task to user from different company.',
                ], 403);
            }
        }

        $task = PreventiveTask::create([
            ...$validated,
            'company_id' => $request->user()->company_id,
            'is_active' => true,
        ]);

        // Calculate the first due date
        $task->calculateNextDueDate();
        $task->save();

        return response()->json([
            'preventive_task' => $task->load(['machine', 'assignee']),
        ], 201);
    }

    /**
     * Display the specified preventive task.
     */
    public function show(Request $request, PreventiveTask $preventiveTask): JsonResponse
    {
        Gate::authorize('view', $preventiveTask);

        $preventiveTask->load([
            'machine.location',
            'assignee:id,name,email',
            'workOrders' => fn($query) => $query->latest()->limit(10),
            'workOrders.assignee:id,name',
        ]);

        return response()->json([
            'preventive_task' => $preventiveTask,
        ]);
    }

    /**
     * Update the specified preventive task.
     */
    public function update(Request $request, PreventiveTask $preventiveTask): JsonResponse
    {
        Gate::authorize('update', $preventiveTask);

        $validated = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'schedule_interval_value' => ['sometimes', 'integer', 'min:1'],
            'schedule_interval_unit' => ['sometimes', 'in:days,weeks,months'],
            'assigned_to' => ['nullable', 'exists:users,id'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        // Verify assignee (if provided) belongs to user's company
        if (isset($validated['assigned_to'])) {
            $assignee = \App\Models\User::find($validated['assigned_to']);
            if ($assignee && $assignee->company_id !== $request->user()->company_id) {
                return response()->json([
                    'message' => 'Cannot assign task to user from different company.',
                ], 403);
            }
        }

        $preventiveTask->update($validated);

        // Recalculate next due date if schedule changed
        if (isset($validated['schedule_interval_value']) || isset($validated['schedule_interval_unit'])) {
            $preventiveTask->calculateNextDueDate();
            $preventiveTask->save();
        }

        return response()->json([
            'preventive_task' => $preventiveTask->load(['machine', 'assignee']),
        ]);
    }

    /**
     * Remove the specified preventive task (deactivate it).
     */
    public function destroy(Request $request, PreventiveTask $preventiveTask): JsonResponse
    {
        Gate::authorize('delete', $preventiveTask);

        // Deactivate instead of delete
        $preventiveTask->update(['is_active' => false]);

        return response()->json([
            'message' => 'Preventive task deactivated successfully',
        ]);
    }

    /**
     * Get upcoming preventive tasks.
     */
    public function upcoming(Request $request): JsonResponse
    {
        Gate::authorize('viewAny', PreventiveTask::class);

        $days = $request->input('days', 7);

        $tasks = PreventiveTask::query()
            ->with(['machine:id,name', 'assignee:id,name'])
            ->forCompany($request->user()->company_id)
            ->active()
            ->where('next_due_date', '<=', now()->addDays($days))
            ->where('next_due_date', '>=', now())
            ->orderBy('next_due_date')
            ->get();

        return response()->json([
            'upcoming_tasks' => $tasks,
        ]);
    }

    /**
     * Get overdue preventive tasks.
     */
    public function overdue(Request $request): JsonResponse
    {
        Gate::authorize('viewAny', PreventiveTask::class);

        $tasks = PreventiveTask::query()
            ->with(['machine:id,name', 'assignee:id,name'])
            ->forCompany($request->user()->company_id)
            ->overdue()
            ->orderBy('next_due_date')
            ->get();

        return response()->json([
            'overdue_tasks' => $tasks,
        ]);
    }
}
