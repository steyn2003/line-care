<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Enums\WorkOrderStatus;
use App\Enums\WorkOrderType;
use App\Models\WorkOrder;
use App\Models\Machine;
use App\Models\PreventiveTask;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Get dashboard metrics.
     *
     * GET /api/dashboard/metrics
     */
    public function metrics(Request $request): JsonResponse
    {
        $user = $request->user();
        $companyId = $user->company_id;

        // Parse date range (default to last 30 days)
        $dateFrom = $request->date_from ? Carbon::parse($request->date_from)->startOfDay() : now()->subDays(30)->startOfDay();
        $dateTo = $request->date_to ? Carbon::parse($request->date_to)->endOfDay() : now()->endOfDay();

        // Open work orders
        $openWorkOrders = WorkOrder::where('company_id', $companyId)
            ->whereIn('status', [WorkOrderStatus::OPEN, WorkOrderStatus::IN_PROGRESS])
            ->count();

        // Completed work orders in period
        $completedWorkOrders = WorkOrder::where('company_id', $companyId)
            ->where('status', WorkOrderStatus::COMPLETED)
            ->whereBetween('completed_at', [$dateFrom, $dateTo])
            ->count();

        // Breakdowns in period
        $breakdowns = WorkOrder::where('company_id', $companyId)
            ->where('type', WorkOrderType::BREAKDOWN)
            ->whereBetween('created_at', [$dateFrom, $dateTo])
            ->count();

        // Preventive tasks in period
        $preventiveTasks = WorkOrder::where('company_id', $companyId)
            ->where('type', WorkOrderType::PREVENTIVE)
            ->whereBetween('created_at', [$dateFrom, $dateTo])
            ->count();

        // Overdue preventive tasks
        $overduePreventive = PreventiveTask::where('company_id', $companyId)
            ->where('is_active', true)
            ->where('next_due_date', '<', now())
            ->count();

        // Total machines
        $totalMachines = Machine::where('company_id', $companyId)->count();

        // Active machines (have had work orders in period)
        $activeMachines = WorkOrder::where('company_id', $companyId)
            ->whereBetween('created_at', [$dateFrom, $dateTo])
            ->distinct('machine_id')
            ->count('machine_id');

        return response()->json([
            'open_work_orders' => $openWorkOrders,
            'completed_work_orders' => $completedWorkOrders,
            'breakdowns' => $breakdowns,
            'preventive_tasks' => $preventiveTasks,
            'overdue_preventive' => $overduePreventive,
            'total_machines' => $totalMachines,
            'active_machines' => $activeMachines,
            'period' => [
                'from' => $dateFrom->toDateString(),
                'to' => $dateTo->toDateString(),
            ],
        ]);
    }

    /**
     * Get downtime by machine report.
     *
     * GET /api/reports/downtime-by-machine
     */
    public function downtimeByMachine(Request $request): JsonResponse
    {
        $user = $request->user();
        $companyId = $user->company_id;

        $dateFrom = $request->date_from ? Carbon::parse($request->date_from)->startOfDay() : now()->subDays(30)->startOfDay();
        $dateTo = $request->date_to ? Carbon::parse($request->date_to)->endOfDay() : now()->endOfDay();

        $data = DB::table('work_orders')
            ->join('machines', 'work_orders.machine_id', '=', 'machines.id')
            ->where('work_orders.company_id', $companyId)
            ->where('work_orders.type', WorkOrderType::BREAKDOWN->value)
            ->whereBetween('work_orders.created_at', [$dateFrom, $dateTo])
            ->select(
                'machines.id',
                'machines.name',
                'machines.code',
                DB::raw('COUNT(*) as breakdown_count'),
                DB::raw('SUM(TIMESTAMPDIFF(MINUTE, work_orders.started_at, work_orders.completed_at)) as total_downtime_minutes')
            )
            ->groupBy('machines.id', 'machines.name', 'machines.code')
            ->orderByDesc('breakdown_count')
            ->get();

        return response()->json([
            'data' => $data,
            'period' => [
                'from' => $dateFrom->toDateString(),
                'to' => $dateTo->toDateString(),
            ],
        ]);
    }

    /**
     * Get completion time metrics.
     *
     * GET /api/reports/completion-time-metrics
     */
    public function completionTimeMetrics(Request $request): JsonResponse
    {
        $user = $request->user();
        $companyId = $user->company_id;

        $dateFrom = $request->date_from ? Carbon::parse($request->date_from)->startOfDay() : now()->subDays(30)->startOfDay();
        $dateTo = $request->date_to ? Carbon::parse($request->date_to)->endOfDay() : now()->endOfDay();

        $workOrders = WorkOrder::where('company_id', $companyId)
            ->where('status', WorkOrderStatus::COMPLETED)
            ->whereNotNull('started_at')
            ->whereNotNull('completed_at')
            ->whereBetween('completed_at', [$dateFrom, $dateTo])
            ->get();

        // Calculate average completion time
        $completionTimes = $workOrders->map(function ($wo) {
            return $wo->started_at->diffInMinutes($wo->completed_at);
        });

        $avgCompletionMinutes = $completionTimes->avg() ?? 0;
        $minCompletionMinutes = $completionTimes->min() ?? 0;
        $maxCompletionMinutes = $completionTimes->max() ?? 0;

        // By type
        $byType = $workOrders->groupBy('type')->map(function ($group) {
            $times = $group->map(fn($wo) => $wo->started_at->diffInMinutes($wo->completed_at));
            return [
                'count' => $group->count(),
                'avg_minutes' => round($times->avg() ?? 0, 2),
            ];
        });

        return response()->json([
            'total_completed' => $workOrders->count(),
            'average_completion_minutes' => round($avgCompletionMinutes, 2),
            'min_completion_minutes' => $minCompletionMinutes,
            'max_completion_minutes' => $maxCompletionMinutes,
            'by_type' => $byType,
            'period' => [
                'from' => $dateFrom->toDateString(),
                'to' => $dateTo->toDateString(),
            ],
        ]);
    }
}
