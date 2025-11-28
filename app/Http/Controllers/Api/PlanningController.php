<?php

namespace App\Http\Controllers\Api;

use App\Enums\AvailabilityType;
use App\Enums\PlanningSlotSource;
use App\Enums\PlanningSlotStatus;
use App\Enums\Role;
use App\Enums\WorkOrderStatus;
use App\Http\Controllers\Controller;
use App\Models\PlanningSlot;
use App\Models\PlannedShutdown;
use App\Models\TechnicianAvailability;
use App\Models\User;
use App\Models\WorkOrder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PlanningController extends Controller
{
    /**
     * Get calendar view data with all planning information.
     */
    public function calendar(Request $request): JsonResponse
    {
        $request->validate([
            'date_from' => ['required', 'date'],
            'date_to' => ['required', 'date', 'after_or_equal:date_from'],
            'view' => ['nullable', 'in:day,week,month'],
        ]);

        $companyId = $request->user()->company_id;
        $dateFrom = $request->date_from;
        $dateTo = $request->date_to;

        // Get all planning slots
        $slots = PlanningSlot::forCompany($companyId)
            ->overlapping($dateFrom, $dateTo)
            ->with([
                'workOrder:id,title,type,status,machine_id',
                'technician:id,name',
                'machine:id,name,code',
                'location:id,name',
            ])
            ->get();

        // Get technicians with capacity info
        $technicians = User::where('company_id', $companyId)
            ->whereIn('role', [Role::TECHNICIAN->value, Role::MANAGER->value])
            ->get()
            ->map(function ($tech) use ($companyId, $dateFrom, $dateTo) {
                $availability = $this->calculateTechnicianCapacity($companyId, $tech->id, $dateFrom, $dateTo);
                return [
                    'id' => $tech->id,
                    'name' => $tech->name,
                    'planned_hours' => $availability['planned_hours'],
                    'available_hours' => $availability['available_hours'],
                    'utilization_pct' => $availability['utilization_pct'],
                    'status' => $availability['status'],
                ];
            });

        // Get unplanned work orders
        $unplannedWorkOrders = WorkOrder::forCompany($companyId)
            ->unplanned()
            ->with(['machine:id,name,code', 'assignee:id,name'])
            ->orderBy('planning_priority', 'asc')
            ->orderBy('created_at', 'asc')
            ->get();

        // Get shutdowns
        $shutdowns = PlannedShutdown::forCompany($companyId)
            ->overlapping($dateFrom, $dateTo)
            ->active()
            ->with(['machine:id,name', 'location:id,name'])
            ->get();

        // Detect conflicts
        $conflicts = $this->detectAllConflicts($companyId, $dateFrom, $dateTo);

        return response()->json([
            'slots' => $slots,
            'technicians' => $technicians,
            'unplanned_work_orders' => $unplannedWorkOrders,
            'shutdowns' => $shutdowns,
            'conflicts' => $conflicts,
        ]);
    }

    /**
     * Get Gantt chart data.
     */
    public function gantt(Request $request): JsonResponse
    {
        $request->validate([
            'date_from' => ['required', 'date'],
            'date_to' => ['required', 'date', 'after_or_equal:date_from'],
            'group_by' => ['nullable', 'in:technician,machine,location'],
        ]);

        $companyId = $request->user()->company_id;
        $dateFrom = $request->date_from;
        $dateTo = $request->date_to;
        $groupBy = $request->input('group_by', 'technician');

        $slots = PlanningSlot::forCompany($companyId)
            ->overlapping($dateFrom, $dateTo)
            ->with([
                'workOrder:id,title,type,status',
                'technician:id,name',
                'machine:id,name,code',
                'location:id,name',
            ])
            ->orderBy('start_at')
            ->get();

        // Group slots
        $grouped = $slots->groupBy(function ($slot) use ($groupBy) {
            return match($groupBy) {
                'technician' => $slot->technician_id,
                'machine' => $slot->machine_id,
                'location' => $slot->location_id,
            };
        });

        $ganttData = [];
        foreach ($grouped as $groupId => $groupSlots) {
            $groupInfo = match($groupBy) {
                'technician' => $groupSlots->first()->technician,
                'machine' => $groupSlots->first()->machine,
                'location' => $groupSlots->first()->location,
            };

            $ganttData[] = [
                'id' => $groupId,
                'name' => $groupInfo->name ?? 'Unknown',
                'slots' => $groupSlots->map(fn($slot) => [
                    'id' => $slot->id,
                    'work_order_id' => $slot->work_order_id,
                    'work_order_title' => $slot->workOrder->title ?? '',
                    'start_at' => $slot->start_at->toIso8601String(),
                    'end_at' => $slot->end_at->toIso8601String(),
                    'duration_minutes' => $slot->duration_minutes,
                    'status' => $slot->status->value,
                    'color' => $slot->color ?? $slot->status->color(),
                ]),
            ];
        }

        return response()->json([
            'gantt_data' => $ganttData,
            'date_from' => $dateFrom,
            'date_to' => $dateTo,
            'group_by' => $groupBy,
        ]);
    }

    /**
     * Get unplanned work orders that need scheduling.
     */
    public function unplannedWorkOrders(Request $request): JsonResponse
    {
        $companyId = $request->user()->company_id;

        $workOrders = WorkOrder::forCompany($companyId)
            ->unplanned()
            ->with([
                'machine:id,name,code,location_id',
                'machine.location:id,name',
                'assignee:id,name',
                'creator:id,name',
            ])
            ->orderBy('planning_priority', 'asc')
            ->orderBy('created_at', 'asc')
            ->paginate($request->input('per_page', 50));

        return response()->json($workOrders);
    }

    /**
     * Auto-schedule work orders.
     */
    public function autoSchedule(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'work_order_ids' => ['required', 'array', 'min:1'],
            'work_order_ids.*' => ['exists:work_orders,id'],
            'date_from' => ['nullable', 'date'],
            'date_to' => ['nullable', 'date', 'after_or_equal:date_from'],
        ]);

        $companyId = $request->user()->company_id;
        $dateFrom = $validated['date_from'] ?? now()->toDateString();
        $dateTo = $validated['date_to'] ?? now()->addWeeks(2)->toDateString();

        $createdSlots = [];
        $errors = [];

        DB::beginTransaction();
        try {
            foreach ($validated['work_order_ids'] as $workOrderId) {
                $workOrder = WorkOrder::with('machine.location')->findOrFail($workOrderId);

                if ($workOrder->company_id !== $companyId) {
                    $errors[] = "Work order #{$workOrderId} not found";
                    continue;
                }

                // Check if already planned
                if ($workOrder->isPlanned()) {
                    $errors[] = "Work order #{$workOrderId} is already planned";
                    continue;
                }

                // Find best slot
                $recommendation = $this->findBestSlot($companyId, $workOrder, $dateFrom, $dateTo);

                if (!$recommendation) {
                    $errors[] = "No available slot found for work order #{$workOrderId}";
                    continue;
                }

                // Create planning slot
                $slot = PlanningSlot::create([
                    'company_id' => $companyId,
                    'work_order_id' => $workOrder->id,
                    'technician_id' => $recommendation['technician_id'],
                    'machine_id' => $workOrder->machine_id,
                    'location_id' => $workOrder->machine->location_id,
                    'start_at' => $recommendation['start_at'],
                    'end_at' => $recommendation['end_at'],
                    'duration_minutes' => $recommendation['duration_minutes'],
                    'status' => PlanningSlotStatus::TENTATIVE->value,
                    'source' => PlanningSlotSource::AUTO_PM->value,
                    'notes' => 'Auto-scheduled',
                    'created_by' => $request->user()->id,
                ]);

                // Update work order
                $workOrder->update([
                    'planned_start_at' => $recommendation['start_at'],
                    'planned_end_at' => $recommendation['end_at'],
                    'planned_duration_minutes' => $recommendation['duration_minutes'],
                ]);

                $createdSlots[] = $slot;
            }

            DB::commit();

            return response()->json([
                'slots' => PlanningSlot::whereIn('id', collect($createdSlots)->pluck('id'))
                    ->with(['workOrder', 'technician', 'machine'])
                    ->get(),
                'errors' => $errors,
                'optimization_score' => $this->calculateOptimizationScore($createdSlots),
                'message' => count($createdSlots) . ' work orders auto-scheduled',
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to auto-schedule: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Suggest optimal slot for a work order.
     */
    public function suggestSlot(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'work_order_id' => ['required', 'exists:work_orders,id'],
            'date_from' => ['nullable', 'date'],
            'date_to' => ['nullable', 'date', 'after_or_equal:date_from'],
        ]);

        $companyId = $request->user()->company_id;
        $workOrder = WorkOrder::with('machine.location')->findOrFail($validated['work_order_id']);

        if ($workOrder->company_id !== $companyId) {
            return response()->json(['message' => 'Work order not found'], 404);
        }

        $dateFrom = $validated['date_from'] ?? now()->toDateString();
        $dateTo = $validated['date_to'] ?? now()->addWeeks(2)->toDateString();

        $recommendations = $this->findAllSlotOptions($companyId, $workOrder, $dateFrom, $dateTo);

        return response()->json([
            'work_order_id' => $workOrder->id,
            'recommendations' => $recommendations,
        ]);
    }

    /**
     * Rebalance workload across technicians.
     */
    public function rebalance(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'date_from' => ['required', 'date'],
            'date_to' => ['required', 'date', 'after_or_equal:date_from'],
        ]);

        $companyId = $request->user()->company_id;
        $dateFrom = $validated['date_from'];
        $dateTo = $validated['date_to'];

        // Get current utilization
        $technicians = User::where('company_id', $companyId)
            ->where('role', Role::TECHNICIAN->value)
            ->get();

        $utilization = [];
        foreach ($technicians as $tech) {
            $capacity = $this->calculateTechnicianCapacity($companyId, $tech->id, $dateFrom, $dateTo);
            $utilization[$tech->id] = $capacity;
        }

        // Find over-utilized and under-utilized technicians
        $overUtilized = collect($utilization)->filter(fn($u) => $u['utilization_pct'] > 100);
        $underUtilized = collect($utilization)->filter(fn($u) => $u['utilization_pct'] < 70);

        $movedSlots = [];
        $errors = [];

        if ($overUtilized->isEmpty() || $underUtilized->isEmpty()) {
            return response()->json([
                'message' => 'Workload is already balanced',
                'utilization' => $utilization,
            ]);
        }

        DB::beginTransaction();
        try {
            foreach ($overUtilized as $techId => $data) {
                // Get movable slots (tentative or planned, not in progress)
                $movableSlots = PlanningSlot::forCompany($companyId)
                    ->forTechnician($techId)
                    ->overlapping($dateFrom, $dateTo)
                    ->whereIn('status', [PlanningSlotStatus::TENTATIVE, PlanningSlotStatus::PLANNED])
                    ->orderBy('start_at', 'desc') // Move later slots first
                    ->get();

                $excessMinutes = ($data['utilization_pct'] - 85) * $data['available_hours'] * 60 / 100;

                foreach ($movableSlots as $slot) {
                    if ($excessMinutes <= 0) break;

                    // Find under-utilized technician who can take this slot
                    foreach ($underUtilized as $targetTechId => $targetData) {
                        if ($targetData['utilization_pct'] >= 85) continue;

                        // Check for conflicts
                        $hasConflict = PlanningSlot::forCompany($companyId)
                            ->forTechnician($targetTechId)
                            ->overlapping($slot->start_at, $slot->end_at)
                            ->active()
                            ->exists();

                        if (!$hasConflict) {
                            $slot->update(['technician_id' => $targetTechId]);
                            $movedSlots[] = [
                                'slot_id' => $slot->id,
                                'from_technician' => $techId,
                                'to_technician' => $targetTechId,
                            ];
                            $excessMinutes -= $slot->duration_minutes;

                            // Update utilization tracking
                            $underUtilized[$targetTechId]['planned_hours'] += $slot->duration_hours;
                            $underUtilized[$targetTechId]['utilization_pct'] =
                                ($underUtilized[$targetTechId]['planned_hours'] / $targetData['available_hours']) * 100;
                            break;
                        }
                    }
                }
            }

            DB::commit();

            // Recalculate utilization
            $newUtilization = [];
            foreach ($technicians as $tech) {
                $newUtilization[$tech->id] = $this->calculateTechnicianCapacity($companyId, $tech->id, $dateFrom, $dateTo);
            }

            return response()->json([
                'moved_slots' => $movedSlots,
                'errors' => $errors,
                'before_utilization' => $utilization,
                'after_utilization' => $newUtilization,
                'message' => count($movedSlots) . ' slots rebalanced',
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to rebalance: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get capacity overview.
     */
    public function capacity(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'date_from' => ['required', 'date'],
            'date_to' => ['required', 'date', 'after_or_equal:date_from'],
        ]);

        $companyId = $request->user()->company_id;
        $dateFrom = \Carbon\Carbon::parse($validated['date_from']);
        $dateTo = \Carbon\Carbon::parse($validated['date_to']);

        // Get daily capacity
        $daily = [];
        $currentDate = $dateFrom->copy();
        while ($currentDate <= $dateTo) {
            $dateStr = $currentDate->toDateString();

            $technicians = User::where('company_id', $companyId)
                ->where('role', Role::TECHNICIAN->value)
                ->get();

            $dayData = [
                'date' => $dateStr,
                'technicians' => [],
                'total_available' => 0,
                'total_planned' => 0,
            ];

            foreach ($technicians as $tech) {
                $capacity = $this->calculateTechnicianCapacity($companyId, $tech->id, $dateStr, $dateStr);
                $dayData['technicians'][] = [
                    'id' => $tech->id,
                    'name' => $tech->name,
                    'available_hours' => $capacity['available_hours'],
                    'planned_hours' => $capacity['planned_hours'],
                    'utilization_pct' => $capacity['utilization_pct'],
                ];
                $dayData['total_available'] += $capacity['available_hours'];
                $dayData['total_planned'] += $capacity['planned_hours'];
            }

            $dayData['utilization_pct'] = $dayData['total_available'] > 0
                ? round(($dayData['total_planned'] / $dayData['total_available']) * 100, 1)
                : 0;

            $daily[] = $dayData;
            $currentDate->addDay();
        }

        // Summary
        $totalAvailable = collect($daily)->sum('total_available');
        $totalPlanned = collect($daily)->sum('total_planned');

        return response()->json([
            'daily' => $daily,
            'summary' => [
                'total_available' => round($totalAvailable, 2),
                'total_planned' => round($totalPlanned, 2),
                'utilization' => $totalAvailable > 0 ? round(($totalPlanned / $totalAvailable) * 100, 1) : 0,
            ],
        ]);
    }

    /**
     * Get all conflicts.
     */
    public function conflicts(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'date_from' => ['required', 'date'],
            'date_to' => ['required', 'date', 'after_or_equal:date_from'],
        ]);

        $companyId = $request->user()->company_id;
        $conflicts = $this->detectAllConflicts($companyId, $validated['date_from'], $validated['date_to']);

        return response()->json([
            'conflicts' => $conflicts,
            'total' => count($conflicts),
        ]);
    }

    /**
     * Resolve a conflict automatically.
     */
    public function resolveConflict(Request $request, int $slotId): JsonResponse
    {
        $slot = PlanningSlot::findOrFail($slotId);

        if ($slot->company_id !== $request->user()->company_id) {
            return response()->json(['message' => 'Slot not found'], 404);
        }

        // Find alternative slot
        $workOrder = $slot->workOrder;
        $dateFrom = now()->toDateString();
        $dateTo = now()->addWeeks(2)->toDateString();

        $recommendations = $this->findAllSlotOptions(
            $request->user()->company_id,
            $workOrder,
            $dateFrom,
            $dateTo,
            $slot->id
        );

        if (empty($recommendations)) {
            return response()->json([
                'message' => 'No alternative slots available',
                'slot' => $slot,
            ], 422);
        }

        $best = $recommendations[0];

        DB::beginTransaction();
        try {
            $slot->update([
                'technician_id' => $best['technician_id'],
                'start_at' => $best['date'] . ' ' . $best['start_time'],
                'end_at' => \Carbon\Carbon::parse($best['date'] . ' ' . $best['start_time'])
                    ->addMinutes($slot->duration_minutes)
                    ->toDateTimeString(),
                'updated_by' => $request->user()->id,
            ]);

            $slot->workOrder->update([
                'planned_start_at' => $slot->start_at,
                'planned_end_at' => $slot->end_at,
            ]);

            DB::commit();

            return response()->json([
                'slot' => $slot->fresh()->load(['workOrder', 'technician', 'machine']),
                'message' => 'Conflict resolved',
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to resolve conflict: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get planning accuracy metrics.
     */
    public function accuracyMetrics(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'date_from' => ['nullable', 'date'],
            'date_to' => ['nullable', 'date', 'after_or_equal:date_from'],
        ]);

        $companyId = $request->user()->company_id;
        $dateFrom = $validated['date_from'] ?? now()->subMonth()->toDateString();
        $dateTo = $validated['date_to'] ?? now()->toDateString();

        // Get completed slots with work order data
        $completedSlots = PlanningSlot::forCompany($companyId)
            ->whereHas('workOrder', function ($q) {
                $q->where('status', WorkOrderStatus::COMPLETED);
            })
            ->where('status', PlanningSlotStatus::COMPLETED)
            ->whereBetween('start_at', [$dateFrom, $dateTo])
            ->with(['workOrder'])
            ->get();

        if ($completedSlots->isEmpty()) {
            return response()->json([
                'on_time_start_rate' => 0,
                'duration_accuracy' => 0,
                'schedule_adherence' => 0,
                'avg_delay_minutes' => 0,
                'total_slots_analyzed' => 0,
            ]);
        }

        $onTimeStarts = 0;
        $totalDelayMinutes = 0;
        $durationVariances = [];

        foreach ($completedSlots as $slot) {
            $workOrder = $slot->workOrder;

            // On-time start (within 15 minutes)
            if ($workOrder->started_at) {
                $plannedStart = $slot->start_at;
                $actualStart = $workOrder->started_at;
                $startDelay = $plannedStart->diffInMinutes($actualStart, false);

                if (abs($startDelay) <= 15) {
                    $onTimeStarts++;
                }
                $totalDelayMinutes += max(0, $startDelay);
            }

            // Duration accuracy
            if ($workOrder->downtime_minutes && $slot->duration_minutes) {
                $durationVariances[] = $workOrder->downtime_minutes / $slot->duration_minutes;
            }
        }

        $totalSlots = $completedSlots->count();
        $onTimeStartRate = ($onTimeStarts / $totalSlots) * 100;
        $avgDelayMinutes = $totalDelayMinutes / $totalSlots;
        $durationAccuracy = !empty($durationVariances) ? array_sum($durationVariances) / count($durationVariances) : 1;
        $scheduleAdherence = min(100, $onTimeStartRate * (1 / max($durationAccuracy, 0.5)));

        return response()->json([
            'on_time_start_rate' => round($onTimeStartRate, 1),
            'duration_accuracy' => round($durationAccuracy, 2),
            'schedule_adherence' => round($scheduleAdherence, 1),
            'avg_delay_minutes' => round($avgDelayMinutes, 0),
            'total_slots_analyzed' => $totalSlots,
        ]);
    }

    /**
     * Get variance analysis.
     */
    public function variances(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'date_from' => ['nullable', 'date'],
            'date_to' => ['nullable', 'date', 'after_or_equal:date_from'],
        ]);

        $companyId = $request->user()->company_id;
        $dateFrom = $validated['date_from'] ?? now()->subMonth()->toDateString();
        $dateTo = $validated['date_to'] ?? now()->toDateString();

        $completedSlots = PlanningSlot::forCompany($companyId)
            ->whereHas('workOrder', function ($q) {
                $q->where('status', WorkOrderStatus::COMPLETED);
            })
            ->where('status', PlanningSlotStatus::COMPLETED)
            ->whereBetween('start_at', [$dateFrom, $dateTo])
            ->with(['workOrder', 'technician:id,name', 'machine:id,name'])
            ->get();

        $variances = $completedSlots->map(function ($slot) {
            $workOrder = $slot->workOrder;
            $startVariance = null;
            $durationVariance = null;

            if ($workOrder->started_at) {
                $startVariance = $slot->start_at->diffInMinutes($workOrder->started_at, false);
            }

            if ($workOrder->downtime_minutes && $slot->duration_minutes) {
                $durationVariance = $workOrder->downtime_minutes - $slot->duration_minutes;
            }

            return [
                'slot_id' => $slot->id,
                'work_order_id' => $workOrder->id,
                'work_order_title' => $workOrder->title,
                'technician_name' => $slot->technician->name ?? '',
                'machine_name' => $slot->machine->name ?? '',
                'planned_start' => $slot->start_at->toDateTimeString(),
                'actual_start' => $workOrder->started_at?->toDateTimeString(),
                'planned_duration' => $slot->duration_minutes,
                'actual_duration' => $workOrder->downtime_minutes,
                'start_variance_minutes' => $startVariance,
                'duration_variance_minutes' => $durationVariance,
            ];
        });

        return response()->json([
            'variances' => $variances,
            'date_from' => $dateFrom,
            'date_to' => $dateTo,
        ]);
    }

    // === Private Helper Methods ===

    /**
     * Calculate technician capacity for a date range.
     */
    private function calculateTechnicianCapacity(int $companyId, int $technicianId, string $dateFrom, string $dateTo): array
    {
        // Default work hours (8 hours/day, 5 days/week)
        $startDate = \Carbon\Carbon::parse($dateFrom);
        $endDate = \Carbon\Carbon::parse($dateTo);
        $workDays = 0;
        $current = $startDate->copy();
        while ($current <= $endDate) {
            if (!$current->isWeekend()) {
                $workDays++;
            }
            $current->addDay();
        }
        $defaultAvailableHours = $workDays * 8;

        // Get custom availability
        $availabilityRecords = TechnicianAvailability::forCompany($companyId)
            ->forTechnician($technicianId)
            ->inDateRange($dateFrom, $dateTo)
            ->get();

        $customAvailableMinutes = 0;
        $unavailableMinutes = 0;

        foreach ($availabilityRecords as $record) {
            if ($record->isAvailable()) {
                $customAvailableMinutes += $record->duration_minutes;
            } else {
                $unavailableMinutes += $record->duration_minutes;
            }
        }

        // Use custom if available, otherwise default minus unavailable
        $availableHours = $customAvailableMinutes > 0
            ? $customAvailableMinutes / 60
            : max(0, $defaultAvailableHours - ($unavailableMinutes / 60));

        // Get planned hours
        $plannedMinutes = PlanningSlot::forCompany($companyId)
            ->forTechnician($technicianId)
            ->overlapping($dateFrom, $dateTo)
            ->active()
            ->sum('duration_minutes');

        $plannedHours = $plannedMinutes / 60;
        $utilizationPct = $availableHours > 0 ? ($plannedHours / $availableHours) * 100 : 0;

        $status = 'optimal';
        if ($utilizationPct > 100) {
            $status = 'overbooked';
        } elseif ($utilizationPct > 90) {
            $status = 'high';
        } elseif ($utilizationPct < 50) {
            $status = 'low';
        }

        return [
            'available_hours' => round($availableHours, 2),
            'planned_hours' => round($plannedHours, 2),
            'utilization_pct' => round($utilizationPct, 1),
            'status' => $status,
        ];
    }

    /**
     * Find the best slot for a work order.
     */
    private function findBestSlot(int $companyId, WorkOrder $workOrder, string $dateFrom, string $dateTo): ?array
    {
        $options = $this->findAllSlotOptions($companyId, $workOrder, $dateFrom, $dateTo);
        return !empty($options) ? $options[0] : null;
    }

    /**
     * Find all slot options for a work order with scores.
     */
    private function findAllSlotOptions(int $companyId, WorkOrder $workOrder, string $dateFrom, string $dateTo, ?int $excludeSlotId = null): array
    {
        $duration = $workOrder->planned_duration_minutes ?? 60;
        $assignedTech = $workOrder->assigned_to;
        $machineId = $workOrder->machine_id;

        // Get all technicians
        $technicians = User::where('company_id', $companyId)
            ->where('role', Role::TECHNICIAN->value)
            ->get();

        // Prefer assigned technician
        if ($assignedTech) {
            $technicians = $technicians->sortByDesc(fn($t) => $t->id === $assignedTech ? 1 : 0);
        }

        $options = [];
        $currentDate = \Carbon\Carbon::parse($dateFrom);
        $endDate = \Carbon\Carbon::parse($dateTo);

        while ($currentDate <= $endDate && count($options) < 10) {
            if ($currentDate->isWeekend()) {
                $currentDate->addDay();
                continue;
            }

            foreach ($technicians as $tech) {
                // Check availability
                $availability = TechnicianAvailability::forCompany($companyId)
                    ->forTechnician($tech->id)
                    ->forDate($currentDate->toDateString())
                    ->first();

                $startHour = 8;
                $endHour = 17;

                if ($availability) {
                    if ($availability->isUnavailable()) {
                        continue;
                    }
                    $startHour = (int) \Carbon\Carbon::parse($availability->start_time)->hour;
                    $endHour = (int) \Carbon\Carbon::parse($availability->end_time)->hour;
                }

                // Find available time slots
                $existingSlots = PlanningSlot::forCompany($companyId)
                    ->forTechnician($tech->id)
                    ->where('start_at', '>=', $currentDate->copy()->setHour($startHour))
                    ->where('end_at', '<=', $currentDate->copy()->setHour($endHour))
                    ->when($excludeSlotId, fn($q) => $q->where('id', '!=', $excludeSlotId))
                    ->active()
                    ->orderBy('start_at')
                    ->get();

                // Find gaps
                $currentTime = $currentDate->copy()->setHour($startHour)->setMinute(0);
                $dayEnd = $currentDate->copy()->setHour($endHour)->setMinute(0);

                foreach ($existingSlots as $slot) {
                    $gapMinutes = $currentTime->diffInMinutes($slot->start_at);
                    if ($gapMinutes >= $duration) {
                        $options[] = $this->scoreSlotOption(
                            $tech,
                            $currentDate->toDateString(),
                            $currentTime->format('H:i'),
                            $duration,
                            $workOrder,
                            $companyId
                        );
                    }
                    $currentTime = $slot->end_at->copy();
                }

                // Check end of day gap
                $remainingMinutes = $currentTime->diffInMinutes($dayEnd);
                if ($remainingMinutes >= $duration) {
                    $options[] = $this->scoreSlotOption(
                        $tech,
                        $currentDate->toDateString(),
                        $currentTime->format('H:i'),
                        $duration,
                        $workOrder,
                        $companyId
                    );
                }
            }

            $currentDate->addDay();
        }

        // Sort by score descending
        usort($options, fn($a, $b) => $b['score'] <=> $a['score']);

        return array_slice($options, 0, 5);
    }

    /**
     * Score a slot option.
     */
    private function scoreSlotOption(User $tech, string $date, string $startTime, int $duration, WorkOrder $workOrder, int $companyId): array
    {
        $score = 50; // Base score
        $reasons = [];

        // Prefer assigned technician
        if ($tech->id === $workOrder->assigned_to) {
            $score += 25;
            $reasons[] = 'Assigned technician';
        }

        // Check utilization (prefer 60-80%)
        $capacity = $this->calculateTechnicianCapacity($companyId, $tech->id, $date, $date);
        if ($capacity['utilization_pct'] >= 60 && $capacity['utilization_pct'] <= 80) {
            $score += 15;
            $reasons[] = 'Optimal utilization (' . $capacity['utilization_pct'] . '%)';
        } elseif ($capacity['utilization_pct'] < 60) {
            $score += 10;
            $reasons[] = 'Has availability (' . $capacity['utilization_pct'] . '%)';
        }

        // Earlier dates get higher scores
        $daysFromNow = \Carbon\Carbon::parse($date)->diffInDays(now());
        if ($daysFromNow <= 2) {
            $score += 10;
            $reasons[] = 'Soon available';
        }

        $startAt = \Carbon\Carbon::parse($date . ' ' . $startTime);
        $endAt = $startAt->copy()->addMinutes($duration);

        return [
            'technician_id' => $tech->id,
            'technician_name' => $tech->name,
            'date' => $date,
            'start_time' => $startTime,
            'start_at' => $startAt->toDateTimeString(),
            'end_at' => $endAt->toDateTimeString(),
            'duration_minutes' => $duration,
            'score' => $score,
            'reasons' => $reasons,
        ];
    }

    /**
     * Detect all conflicts in a date range.
     */
    private function detectAllConflicts(int $companyId, string $dateFrom, string $dateTo): array
    {
        $conflicts = [];

        $slots = PlanningSlot::forCompany($companyId)
            ->overlapping($dateFrom, $dateTo)
            ->active()
            ->with(['workOrder:id,title', 'technician:id,name', 'machine:id,name'])
            ->get();

        // Check technician double-bookings
        $byTechnician = $slots->groupBy('technician_id');
        foreach ($byTechnician as $techSlots) {
            $slotArray = $techSlots->values()->all();
            for ($i = 0; $i < count($slotArray); $i++) {
                for ($j = $i + 1; $j < count($slotArray); $j++) {
                    if ($slotArray[$i]->conflictsWithTechnician($slotArray[$j])) {
                        $conflicts[] = [
                            'type' => 'technician_double_booking',
                            'slot_1' => [
                                'id' => $slotArray[$i]->id,
                                'work_order_title' => $slotArray[$i]->workOrder->title ?? '',
                                'start_at' => $slotArray[$i]->start_at->toDateTimeString(),
                                'end_at' => $slotArray[$i]->end_at->toDateTimeString(),
                            ],
                            'slot_2' => [
                                'id' => $slotArray[$j]->id,
                                'work_order_title' => $slotArray[$j]->workOrder->title ?? '',
                                'start_at' => $slotArray[$j]->start_at->toDateTimeString(),
                                'end_at' => $slotArray[$j]->end_at->toDateTimeString(),
                            ],
                            'technician_name' => $slotArray[$i]->technician->name ?? '',
                        ];
                    }
                }
            }
        }

        // Check machine conflicts
        $byMachine = $slots->groupBy('machine_id');
        foreach ($byMachine as $machineSlots) {
            $slotArray = $machineSlots->values()->all();
            for ($i = 0; $i < count($slotArray); $i++) {
                for ($j = $i + 1; $j < count($slotArray); $j++) {
                    if ($slotArray[$i]->conflictsWithMachine($slotArray[$j])) {
                        $conflicts[] = [
                            'type' => 'machine_conflict',
                            'slot_1' => [
                                'id' => $slotArray[$i]->id,
                                'work_order_title' => $slotArray[$i]->workOrder->title ?? '',
                                'technician_name' => $slotArray[$i]->technician->name ?? '',
                                'start_at' => $slotArray[$i]->start_at->toDateTimeString(),
                                'end_at' => $slotArray[$i]->end_at->toDateTimeString(),
                            ],
                            'slot_2' => [
                                'id' => $slotArray[$j]->id,
                                'work_order_title' => $slotArray[$j]->workOrder->title ?? '',
                                'technician_name' => $slotArray[$j]->technician->name ?? '',
                                'start_at' => $slotArray[$j]->start_at->toDateTimeString(),
                                'end_at' => $slotArray[$j]->end_at->toDateTimeString(),
                            ],
                            'machine_name' => $slotArray[$i]->machine->name ?? '',
                        ];
                    }
                }
            }
        }

        return $conflicts;
    }

    /**
     * Calculate optimization score for created slots.
     */
    private function calculateOptimizationScore(array $slots): float
    {
        if (empty($slots)) {
            return 0;
        }

        $totalScore = 0;
        foreach ($slots as $slot) {
            // Base score
            $score = 70;

            // Earlier scheduling is better
            $daysFromNow = \Carbon\Carbon::parse($slot->start_at)->diffInDays(now());
            if ($daysFromNow <= 7) {
                $score += 15;
            }

            // No conflicts is better
            $hasConflict = PlanningSlot::forCompany($slot->company_id)
                ->where('id', '!=', $slot->id)
                ->forTechnician($slot->technician_id)
                ->overlapping($slot->start_at, $slot->end_at)
                ->active()
                ->exists();

            if (!$hasConflict) {
                $score += 15;
            }

            $totalScore += $score;
        }

        return round($totalScore / count($slots), 1);
    }
}
