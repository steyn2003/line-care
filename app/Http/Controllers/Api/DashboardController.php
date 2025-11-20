<?php

namespace App\Http\Controllers\Api;

use App\Enums\Role;
use App\Enums\WorkOrderStatus;
use App\Enums\WorkOrderType;
use App\Http\Controllers\Controller;
use App\Models\Machine;
use App\Models\PreventiveTask;
use App\Models\WorkOrder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Get dashboard metrics.
     */
    public function metrics(Request $request): JsonResponse
    {
        // Only managers and technicians can view dashboard
        if ($request->user()->role === Role::OPERATOR) {
            return response()->json([
                'message' => 'Dashboard access is restricted to managers and technicians.',
            ], 403);
        }

        $companyId = $request->user()->company_id;
        $dateFrom = $request->input('date_from', now()->subDays(30));
        $dateTo = $request->input('date_to', now());
        $locationId = $request->input('location_id');

        // Open work orders count
        $openWorkOrdersQuery = WorkOrder::query()
            ->forCompany($companyId)
            ->open();

        if ($locationId) {
            $openWorkOrdersQuery->whereHas('machine', fn($q) => $q->where('location_id', $locationId));
        }

        $openWorkOrdersCount = $openWorkOrdersQuery->count();

        // Overdue preventive tasks count
        $overdueTasksCount = PreventiveTask::query()
            ->forCompany($companyId)
            ->overdue()
            ->when($locationId, fn($q) => $q->whereHas('machine', fn($mq) => $mq->where('location_id', $locationId)))
            ->count();

        // Breakdowns in last 7 days
        $breakdownsLast7Days = WorkOrder::query()
            ->forCompany($companyId)
            ->ofType(WorkOrderType::BREAKDOWN)
            ->where('created_at', '>=', now()->subDays(7))
            ->when($locationId, fn($q) => $q->whereHas('machine', fn($mq) => $mq->where('location_id', $locationId)))
            ->count();

        // Breakdowns in last 30 days
        $breakdownsLast30Days = WorkOrder::query()
            ->forCompany($companyId)
            ->ofType(WorkOrderType::BREAKDOWN)
            ->where('created_at', '>=', now()->subDays(30))
            ->when($locationId, fn($q) => $q->whereHas('machine', fn($mq) => $mq->where('location_id', $locationId)))
            ->count();

        // Top 5 machines by breakdown count
        $topMachinesQuery = Machine::query()
            ->forCompany($companyId)
            ->withCount([
                'workOrders as breakdown_count' => fn($q) => $q
                    ->where('type', WorkOrderType::BREAKDOWN)
                    ->whereBetween('created_at', [$dateFrom, $dateTo])
            ])
            ->having('breakdown_count', '>', 0);

        if ($locationId) {
            $topMachinesQuery->where('location_id', $locationId);
        }

        $topMachines = $topMachinesQuery
            ->orderBy('breakdown_count', 'desc')
            ->limit(5)
            ->get(['id', 'name', 'code', 'location_id'])
            ->map(function ($machine) {
                return [
                    'machine_id' => $machine->id,
                    'machine_name' => $machine->name,
                    'machine_code' => $machine->code,
                    'breakdown_count' => $machine->breakdown_count,
                ];
            });

        return response()->json([
            'open_work_orders_count' => $openWorkOrdersCount,
            'overdue_preventive_tasks_count' => $overdueTasksCount,
            'breakdowns_last_7_days' => $breakdownsLast7Days,
            'breakdowns_last_30_days' => $breakdownsLast30Days,
            'top_machines' => $topMachines,
        ]);
    }

    /**
     * Get downtime report by machine.
     */
    public function downtimeByMachine(Request $request): JsonResponse
    {
        $companyId = $request->user()->company_id;
        $dateFrom = $request->input('date_from', now()->subDays(30));
        $dateTo = $request->input('date_to', now());
        $locationId = $request->input('location_id');

        $machinesQuery = Machine::query()
            ->forCompany($companyId)
            ->with(['workOrders' => fn($q) => $q
                ->where('type', WorkOrderType::BREAKDOWN)
                ->where('status', WorkOrderStatus::COMPLETED)
                ->whereNotNull('started_at')
                ->whereNotNull('completed_at')
                ->whereBetween('created_at', [$dateFrom, $dateTo])
            ]);

        if ($locationId) {
            $machinesQuery->where('location_id', $locationId);
        }

        $machines = $machinesQuery->get();

        $report = $machines->map(function ($machine) {
            $totalDowntime = $machine->workOrders->sum(function ($workOrder) {
                return $workOrder->completed_at->diffInMinutes($workOrder->started_at);
            });

            return [
                'machine_id' => $machine->id,
                'machine_name' => $machine->name,
                'breakdown_count' => $machine->workOrders->count(),
                'total_downtime_minutes' => $totalDowntime,
                'total_downtime_hours' => round($totalDowntime / 60, 2),
            ];
        })->sortByDesc('total_downtime_minutes')->values();

        return response()->json([
            'downtime_by_machine' => $report,
        ]);
    }

    /**
     * Get work order completion time metrics.
     */
    public function completionTimeMetrics(Request $request): JsonResponse
    {
        $companyId = $request->user()->company_id;
        $dateFrom = $request->input('date_from', now()->subDays(30));
        $dateTo = $request->input('date_to', now());
        $type = $request->input('type');

        $workOrdersQuery = WorkOrder::query()
            ->forCompany($companyId)
            ->where('status', WorkOrderStatus::COMPLETED)
            ->whereNotNull('started_at')
            ->whereNotNull('completed_at')
            ->whereBetween('created_at', [$dateFrom, $dateTo]);

        if ($type) {
            $workOrdersQuery->where('type', $type);
        }

        $workOrders = $workOrdersQuery->get();

        $completionTimes = $workOrders->map(function ($workOrder) {
            return $workOrder->completed_at->diffInMinutes($workOrder->started_at);
        })->sort()->values();

        $count = $completionTimes->count();

        if ($count === 0) {
            return response()->json([
                'avg_completion_time_minutes' => 0,
                'median_completion_time_minutes' => 0,
                'longest_completion_time_minutes' => 0,
            ]);
        }

        $avgCompletionTime = $completionTimes->avg();
        $medianCompletionTime = $completionTimes[$count % 2 === 0 ? $count / 2 : ($count - 1) / 2];
        $longestCompletionTime = $completionTimes->max();

        return response()->json([
            'avg_completion_time_minutes' => round($avgCompletionTime, 1),
            'median_completion_time_minutes' => $medianCompletionTime,
            'longest_completion_time_minutes' => $longestCompletionTime,
        ]);
    }
}
