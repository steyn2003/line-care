<?php

namespace App\Http\Controllers\Api;

use App\Enums\Role;
use App\Enums\WorkOrderStatus;
use App\Enums\WorkOrderType;
use App\Http\Controllers\Controller;
use App\Models\InventoryTransaction;
use App\Models\MaintenanceLog;
use App\Models\SparePart;
use App\Models\Stock;
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
            'spareParts.category',
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

    /**
     * Add spare parts to a work order (reserve stock).
     */
    public function addParts(Request $request, WorkOrder $workOrder): JsonResponse
    {
        Gate::authorize('update', $workOrder);

        $validated = $request->validate([
            'parts' => ['required', 'array', 'min:1'],
            'parts.*.spare_part_id' => ['required', 'exists:spare_parts,id'],
            'parts.*.quantity' => ['required', 'integer', 'min:1'],
            'parts.*.location_id' => ['required', 'exists:locations,id'],
        ]);

        DB::beginTransaction();
        try {
            foreach ($validated['parts'] as $partData) {
                $sparePart = SparePart::findOrFail($partData['spare_part_id']);

                // Verify spare part belongs to same company
                if ($sparePart->company_id !== $request->user()->company_id) {
                    throw new \Exception('Spare part not found');
                }

                // Get or create stock for this location
                $stock = Stock::firstOrCreate(
                    [
                        'spare_part_id' => $partData['spare_part_id'],
                        'location_id' => $partData['location_id'],
                    ],
                    [
                        'company_id' => $request->user()->company_id,
                        'quantity_on_hand' => 0,
                        'quantity_reserved' => 0,
                    ]
                );

                // Check if sufficient stock is available
                if (!$stock->hasSufficientStock($partData['quantity'])) {
                    throw new \Exception("Insufficient stock for {$sparePart->name}. Available: {$stock->quantity_available}, Requested: {$partData['quantity']}");
                }

                // Reserve the stock
                $stock->reserve($partData['quantity']);

                // Check if this part is already attached to the work order
                $existingPart = $workOrder->spareParts()->where('spare_part_id', $partData['spare_part_id'])->first();

                if ($existingPart) {
                    // Update existing quantity
                    $newQuantity = $existingPart->pivot->quantity_used + $partData['quantity'];
                    $workOrder->spareParts()->updateExistingPivot($partData['spare_part_id'], [
                        'quantity_used' => $newQuantity,
                    ]);
                } else {
                    // Attach new part
                    $workOrder->spareParts()->attach($partData['spare_part_id'], [
                        'quantity_used' => $partData['quantity'],
                        'unit_cost' => $sparePart->unit_cost,
                        'location_id' => $partData['location_id'],
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'message' => 'Parts added successfully',
                'work_order' => $workOrder->fresh()->load('spareParts'),
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Remove spare parts from a work order (release reservation).
     */
    public function removeParts(Request $request, WorkOrder $workOrder): JsonResponse
    {
        Gate::authorize('update', $workOrder);

        $validated = $request->validate([
            'spare_part_id' => ['required', 'exists:spare_parts,id'],
        ]);

        DB::beginTransaction();
        try {
            $pivot = $workOrder->spareParts()
                ->where('spare_part_id', $validated['spare_part_id'])
                ->first();

            if (!$pivot) {
                throw new \Exception('Part not found in this work order');
            }

            // Release the reserved stock
            $stock = Stock::where('spare_part_id', $validated['spare_part_id'])
                ->where('location_id', $pivot->pivot->location_id)
                ->first();

            if ($stock) {
                $stock->releaseReservation($pivot->pivot->quantity_used);
            }

            // Detach the part
            $workOrder->spareParts()->detach($validated['spare_part_id']);

            DB::commit();

            return response()->json([
                'message' => 'Part removed successfully',
                'work_order' => $workOrder->fresh()->load('spareParts'),
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Complete work order with parts consumption.
     */
    public function completeWithParts(Request $request, WorkOrder $workOrder): JsonResponse
    {
        Gate::authorize('complete', $workOrder);

        $validated = $request->validate([
            'completed_at' => ['nullable', 'date'],
            'cause_category_id' => ['nullable', 'exists:cause_categories,id'],
            'notes' => ['nullable', 'string'],
            'work_done' => ['nullable', 'string'],
        ]);

        DB::beginTransaction();
        try {
            // Process each spare part - consume reserved stock and create transactions
            foreach ($workOrder->spareParts as $sparePart) {
                $pivot = $sparePart->pivot;

                $stock = Stock::where('spare_part_id', $sparePart->id)
                    ->where('location_id', $pivot->location_id)
                    ->first();

                if ($stock) {
                    // Consume the reserved stock
                    $stock->consumeReserved($pivot->quantity_used);

                    // Create inventory transaction
                    InventoryTransaction::create([
                        'company_id' => $request->user()->company_id,
                        'spare_part_id' => $sparePart->id,
                        'transaction_type' => 'out',
                        'quantity' => -$pivot->quantity_used, // negative for out
                        'unit_cost' => $pivot->unit_cost,
                        'reference_type' => 'work_order',
                        'reference_id' => $workOrder->id,
                        'user_id' => $request->user()->id,
                        'notes' => "Used in work order #{$workOrder->id}: {$workOrder->title}",
                        'transaction_date' => now(),
                    ]);
                }
            }

            // Update work order
            $workOrder->update([
                'status' => WorkOrderStatus::COMPLETED,
                'completed_at' => $validated['completed_at'] ?? now(),
                'cause_category_id' => $validated['cause_category_id'] ?? $workOrder->cause_category_id,
            ]);

            // Create maintenance log
            $partsUsedSummary = $workOrder->spareParts->map(function ($part) {
                return "{$part->name} (Qty: {$part->pivot->quantity_used})";
            })->join(', ');

            MaintenanceLog::create([
                'work_order_id' => $workOrder->id,
                'machine_id' => $workOrder->machine_id,
                'user_id' => $request->user()->id,
                'notes' => $validated['notes'] ?? null,
                'work_done' => $validated['work_done'] ?? null,
                'parts_used' => $partsUsedSummary,
            ]);

            // Update preventive task if linked
            if ($workOrder->preventive_task_id) {
                $preventiveTask = $workOrder->preventiveTask;
                $preventiveTask->last_completed_at = $workOrder->completed_at;
                $preventiveTask->calculateNextDueDate();
                $preventiveTask->save();
            }

            DB::commit();

            return response()->json([
                'work_order' => $workOrder->fresh()->load(['machine', 'maintenanceLogs', 'spareParts']),
                'message' => 'Work order completed successfully',
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to complete work order: ' . $e->getMessage(),
            ], 500);
        }
    }
}
