<?php

namespace App\Http\Controllers\Api;

use App\Enums\Role;
use App\Enums\WorkOrderStatus;
use App\Enums\WorkOrderType;
use App\Http\Controllers\Controller;
use App\Models\MaintenanceLog;
use App\Models\WorkOrder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class WorkOrderController extends Controller
{
    /**
     * Display a listing of work orders.
     */
    public function index(Request $request): JsonResponse
    {
        Gate::authorize('viewAny', WorkOrder::class);

        $query = WorkOrder::query()
            ->with(['machine:id,name', 'creator:id,name', 'assignee:id,name', 'causeCategory:id,name'])
            ->forCompany($request->user()->company_id);

        // Operators can only see work orders they created
        if ($request->user()->role === Role::OPERATOR) {
            $query->where('created_by', $request->user()->id);
        }

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by type
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        // Filter by machine
        if ($request->has('machine_id')) {
            $query->where('machine_id', $request->machine_id);
        }

        // Filter by assigned user
        if ($request->has('assigned_to')) {
            $query->where('assigned_to', $request->assigned_to);
        }

        // Filter by date range
        if ($request->has('date_from')) {
            $query->where('created_at', '>=', $request->date_from);
        }
        if ($request->has('date_to')) {
            $query->where('created_at', '<=', $request->date_to);
        }

        // Sort
        $query->orderBy('created_at', 'desc');

        $workOrders = $query->paginate(20);

        return response()->json($workOrders);
    }

    /**
     * Store a newly created work order.
     */
    public function store(Request $request): JsonResponse
    {
        Gate::authorize('create', WorkOrder::class);

        $validated = $request->validate([
            'machine_id' => ['required', 'exists:machines,id'],
            'type' => ['required', Rule::in(WorkOrderType::values())],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'cause_category_id' => ['nullable', 'exists:cause_categories,id'],
            'started_at' => ['nullable', 'date'],
        ]);

        // Operators can only create breakdown work orders
        if ($request->user()->role === Role::OPERATOR && $validated['type'] !== WorkOrderType::BREAKDOWN->value) {
            return response()->json([
                'message' => 'Operators can only create breakdown work orders.',
            ], 403);
        }

        $workOrder = WorkOrder::create([
            ...$validated,
            'company_id' => $request->user()->company_id,
            'created_by' => $request->user()->id,
            'status' => WorkOrderStatus::OPEN,
            'started_at' => $validated['started_at'] ?? now(),
        ]);

        return response()->json([
            'work_order' => $workOrder->load(['machine', 'creator', 'causeCategory']),
        ], 201);
    }

    /**
     * Display the specified work order.
     */
    public function show(Request $request, WorkOrder $workOrder): JsonResponse
    {
        Gate::authorize('view', $workOrder);

        $workOrder->load([
            'machine.location',
            'creator:id,name,email',
            'assignee:id,name,email',
            'causeCategory',
            'preventiveTask',
            'maintenanceLogs.user:id,name',
        ]);

        return response()->json([
            'work_order' => $workOrder,
        ]);
    }

    /**
     * Update the specified work order.
     */
    public function update(Request $request, WorkOrder $workOrder): JsonResponse
    {
        Gate::authorize('update', $workOrder);

        $validated = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'status' => ['sometimes', Rule::in(WorkOrderStatus::values())],
            'assigned_to' => ['nullable', 'exists:users,id'],
            'cause_category_id' => ['nullable', 'exists:cause_categories,id'],
            'started_at' => ['nullable', 'date'],
        ]);

        // If assigning to someone, verify they're in the same company
        if (isset($validated['assigned_to'])) {
            $assignee = \App\Models\User::find($validated['assigned_to']);
            if ($assignee && $assignee->company_id !== $request->user()->company_id) {
                return response()->json([
                    'message' => 'Cannot assign work order to user from different company.',
                ], 403);
            }
        }

        $workOrder->update($validated);

        return response()->json([
            'work_order' => $workOrder->load(['machine', 'creator', 'assignee', 'causeCategory']),
        ]);
    }

    /**
     * Delete the specified work order.
     */
    public function destroy(Request $request, WorkOrder $workOrder): JsonResponse
    {
        Gate::authorize('delete', $workOrder);

        $workOrder->delete();

        return response()->json([
            'message' => 'Work order deleted successfully',
        ]);
    }

    /**
     * Complete a work order.
     */
    public function complete(Request $request, WorkOrder $workOrder): JsonResponse
    {
        Gate::authorize('complete', $workOrder);

        $validated = $request->validate([
            'completed_at' => ['nullable', 'date'],
            'cause_category_id' => ['nullable', 'exists:cause_categories,id'],
            'notes' => ['nullable', 'string'],
            'work_done' => ['nullable', 'string'],
            'parts_used' => ['nullable', 'string'],
        ]);

        try {
            DB::transaction(function () use ($workOrder, $validated, $request) {
                // Update work order
                $workOrder->update([
                    'status' => WorkOrderStatus::COMPLETED,
                    'completed_at' => $validated['completed_at'] ?? now(),
                    'cause_category_id' => $validated['cause_category_id'] ?? $workOrder->cause_category_id,
                ]);

                // Create maintenance log
                MaintenanceLog::create([
                    'work_order_id' => $workOrder->id,
                    'machine_id' => $workOrder->machine_id,
                    'user_id' => $request->user()->id,
                    'notes' => $validated['notes'] ?? null,
                    'work_done' => $validated['work_done'] ?? null,
                    'parts_used' => $validated['parts_used'] ?? null,
                ]);

                // If this work order is linked to a preventive task, update the task
                if ($workOrder->preventive_task_id) {
                    $preventiveTask = $workOrder->preventiveTask;
                    $preventiveTask->last_completed_at = $workOrder->completed_at;
                    $preventiveTask->calculateNextDueDate();
                    $preventiveTask->save();
                }
            });

            return response()->json([
                'work_order' => $workOrder->fresh()->load(['machine', 'maintenanceLogs']),
                'message' => 'Work order completed successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to complete work order',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Assign a work order to a user.
     */
    public function assign(Request $request, WorkOrder $workOrder): JsonResponse
    {
        Gate::authorize('assign', $workOrder);

        $validated = $request->validate([
            'assigned_to' => ['required', 'exists:users,id'],
        ]);

        // Verify assignee is in the same company
        $assignee = \App\Models\User::find($validated['assigned_to']);
        if ($assignee->company_id !== $request->user()->company_id) {
            return response()->json([
                'message' => 'Cannot assign work order to user from different company.',
            ], 403);
        }

        $workOrder->update([
            'assigned_to' => $validated['assigned_to'],
        ]);

        return response()->json([
            'work_order' => $workOrder->load(['assignee']),
            'message' => 'Work order assigned successfully',
        ]);
    }

    /**
     * Change work order status.
     */
    public function updateStatus(Request $request, WorkOrder $workOrder): JsonResponse
    {
        Gate::authorize('update', $workOrder);

        $validated = $request->validate([
            'status' => ['required', Rule::in(WorkOrderStatus::values())],
        ]);

        $workOrder->update([
            'status' => $validated['status'],
        ]);

        // If status is set to completed, we should use the complete endpoint instead
        if ($validated['status'] === WorkOrderStatus::COMPLETED->value) {
            return response()->json([
                'message' => 'Please use the complete endpoint to mark work orders as completed.',
            ], 400);
        }

        return response()->json([
            'work_order' => $workOrder,
            'message' => 'Status updated successfully',
        ]);
    }
}
