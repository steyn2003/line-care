<?php

namespace App\Http\Controllers;

use App\Enums\WorkOrderStatus;
use App\Enums\WorkOrderType;
use App\Models\Location;
use App\Models\MaintenanceBudget;
use App\Models\PreventiveTask;
use App\Models\ProductionRun;
use App\Models\SparePart;
use App\Models\Stock;
use App\Models\WorkOrder;
use App\Models\WorkOrderCost;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $companyId = $user->company_id;
        $locationId = $request->location_id;

        // Parse date range (default to last 30 days)
        $dateFrom = $request->date_from ? \Carbon\Carbon::parse($request->date_from)->startOfDay() : now()->subDays(30)->startOfDay();
        $dateTo = $request->date_to ? \Carbon\Carbon::parse($request->date_to)->endOfDay() : now()->endOfDay();

        // Get locations for filter
        $locations = Location::where('company_id', $companyId)
            ->orderBy('name')
            ->get(['id', 'name']);

        // Build base queries
        $workOrderQuery = WorkOrder::where('company_id', $companyId);
        $preventiveTaskQuery = PreventiveTask::where('company_id', $companyId);

        if ($locationId) {
            $workOrderQuery->whereHas('machine', fn($q) => $q->where('location_id', $locationId));
            $preventiveTaskQuery->whereHas('machine', fn($q) => $q->where('location_id', $locationId));
        }

        // ==================
        // WORK ORDER METRICS
        // ==================
        $openWorkOrdersCount = (clone $workOrderQuery)
            ->whereIn('status', [WorkOrderStatus::OPEN, WorkOrderStatus::IN_PROGRESS])
            ->count();

        $inProgressWorkOrdersCount = (clone $workOrderQuery)
            ->where('status', WorkOrderStatus::IN_PROGRESS)
            ->count();

        $overduePreventiveTasksCount = (clone $preventiveTaskQuery)
            ->where('is_active', true)
            ->where('next_due_date', '<=', now())
            ->count();

        $breakdownsInRange = (clone $workOrderQuery)
            ->where('type', WorkOrderType::BREAKDOWN)
            ->whereBetween('created_at', [$dateFrom, $dateTo])
            ->count();

        $breakdownsLast7Days = (clone $workOrderQuery)
            ->where('type', WorkOrderType::BREAKDOWN)
            ->where('created_at', '>=', now()->subDays(7))
            ->count();

        $breakdownsLast30Days = (clone $workOrderQuery)
            ->where('type', WorkOrderType::BREAKDOWN)
            ->where('created_at', '>=', now()->subDays(30))
            ->count();

        // Completed work orders in range
        $completedInRange = (clone $workOrderQuery)
            ->where('status', WorkOrderStatus::COMPLETED)
            ->whereBetween('completed_at', [$dateFrom, $dateTo])
            ->count();

        // Top 5 machines by breakdown count
        $topMachinesQuery = DB::table('work_orders')
            ->join('machines', 'work_orders.machine_id', '=', 'machines.id')
            ->where('work_orders.company_id', $companyId)
            ->where('work_orders.type', WorkOrderType::BREAKDOWN->value)
            ->whereBetween('work_orders.created_at', [$dateFrom, $dateTo]);

        if ($locationId) {
            $topMachinesQuery->where('machines.location_id', $locationId);
        }

        $topMachines = $topMachinesQuery
            ->select(
                'machines.id as machine_id',
                'machines.name as machine_name',
                'machines.code as machine_code',
                DB::raw('count(*) as breakdown_count')
            )
            ->groupBy('machines.id', 'machines.name', 'machines.code')
            ->orderByDesc('breakdown_count')
            ->limit(5)
            ->get();

        // Recent work orders
        $recentWorkOrders = WorkOrder::where('company_id', $companyId)
            ->with(['machine:id,name,code', 'assignee:id,name'])
            ->orderByDesc('created_at')
            ->limit(5)
            ->get(['id', 'title', 'type', 'status', 'machine_id', 'assigned_to', 'created_at']);

        // ==================
        // COST METRICS
        // ==================
        $costMetrics = $this->getCostMetrics($companyId, $dateFrom, $dateTo);

        // ==================
        // INVENTORY METRICS
        // ==================
        $inventoryMetrics = $this->getInventoryMetrics($companyId);

        // ==================
        // OEE METRICS
        // ==================
        $oeeMetrics = $this->getOeeMetrics($companyId, $dateFrom, $dateTo);

        // ==================
        // UPCOMING TASKS
        // ==================
        $upcomingTasks = PreventiveTask::where('company_id', $companyId)
            ->where('is_active', true)
            ->where('next_due_date', '>=', now())
            ->where('next_due_date', '<=', now()->addDays(7))
            ->with(['machine:id,name,code'])
            ->orderBy('next_due_date')
            ->limit(5)
            ->get(['id', 'name', 'machine_id', 'next_due_date', 'frequency']);

        $metrics = [
            // Work Orders
            'open_work_orders_count' => $openWorkOrdersCount,
            'in_progress_work_orders_count' => $inProgressWorkOrdersCount,
            'overdue_preventive_tasks_count' => $overduePreventiveTasksCount,
            'breakdowns_in_range' => $breakdownsInRange,
            'breakdowns_last_7_days' => $breakdownsLast7Days,
            'breakdowns_last_30_days' => $breakdownsLast30Days,
            'completed_in_range' => $completedInRange,
            'top_machines' => $topMachines,
            'recent_work_orders' => $recentWorkOrders,
            'upcoming_tasks' => $upcomingTasks,
            // Costs
            'costs' => $costMetrics,
            // Inventory
            'inventory' => $inventoryMetrics,
            // OEE
            'oee' => $oeeMetrics,
        ];

        return Inertia::render('dashboard', [
            'metrics' => $metrics,
            'locations' => $locations,
            'filters' => [
                'location_id' => $locationId,
                'date_from' => $dateFrom->format('Y-m-d'),
                'date_to' => $dateTo->format('Y-m-d'),
            ],
            'user' => [
                'name' => $user->name,
                'role' => $user->role ? $user->role->value : 'operator',
            ],
        ]);
    }

    private function getCostMetrics(int $companyId, $dateFrom, $dateTo): array
    {
        // Total costs in range
        $costsInRange = WorkOrderCost::whereHas('workOrder', function ($q) use ($companyId, $dateFrom, $dateTo) {
            $q->where('company_id', $companyId)
                ->whereBetween('completed_at', [$dateFrom, $dateTo]);
        })->selectRaw('
            SUM(labor_cost) as labor_total,
            SUM(parts_cost) as parts_total,
            SUM(downtime_cost) as downtime_total,
            SUM(external_service_cost) as external_total,
            SUM(total_cost) as grand_total
        ')->first();

        // This month's costs
        $thisMonthCosts = WorkOrderCost::whereHas('workOrder', function ($q) use ($companyId) {
            $q->where('company_id', $companyId)
                ->whereMonth('completed_at', now()->month)
                ->whereYear('completed_at', now()->year);
        })->sum('total_cost');

        // Last month's costs for comparison
        $lastMonthCosts = WorkOrderCost::whereHas('workOrder', function ($q) use ($companyId) {
            $q->where('company_id', $companyId)
                ->whereMonth('completed_at', now()->subMonth()->month)
                ->whereYear('completed_at', now()->subMonth()->year);
        })->sum('total_cost');

        // Current month budget
        $currentBudget = MaintenanceBudget::where('company_id', $companyId)
            ->where('year', now()->year)
            ->where('month', now()->month)
            ->first();

        $budgetTotal = $currentBudget ? $currentBudget->budgeted_total : 0;
        $budgetUsedPercent = $budgetTotal > 0 ? round(($thisMonthCosts / $budgetTotal) * 100, 1) : 0;

        return [
            'range_total' => $costsInRange->grand_total ?? 0,
            'range_labor' => $costsInRange->labor_total ?? 0,
            'range_parts' => $costsInRange->parts_total ?? 0,
            'range_downtime' => $costsInRange->downtime_total ?? 0,
            'this_month_total' => $thisMonthCosts,
            'last_month_total' => $lastMonthCosts,
            'month_change_percent' => $lastMonthCosts > 0
                ? round((($thisMonthCosts - $lastMonthCosts) / $lastMonthCosts) * 100, 1)
                : 0,
            'budget_total' => $budgetTotal,
            'budget_used_percent' => $budgetUsedPercent,
        ];
    }

    private function getInventoryMetrics(int $companyId): array
    {
        // Low stock parts count
        $lowStockCount = SparePart::where('company_id', $companyId)
            ->where('status', 'active')
            ->whereHas('stocks', function ($q) {
                $q->whereRaw('quantity_on_hand <= (SELECT reorder_point FROM spare_parts WHERE spare_parts.id = stocks.spare_part_id)');
            })
            ->count();

        // Alternative: simpler query
        $lowStockParts = DB::table('spare_parts')
            ->join('stocks', 'spare_parts.id', '=', 'stocks.spare_part_id')
            ->where('spare_parts.company_id', $companyId)
            ->where('spare_parts.status', 'active')
            ->whereRaw('stocks.quantity_on_hand <= spare_parts.reorder_point')
            ->select('spare_parts.id', 'spare_parts.name', 'spare_parts.part_number', 'stocks.quantity_on_hand', 'spare_parts.reorder_point')
            ->limit(5)
            ->get();

        $lowStockCount = DB::table('spare_parts')
            ->join('stocks', 'spare_parts.id', '=', 'stocks.spare_part_id')
            ->where('spare_parts.company_id', $companyId)
            ->where('spare_parts.status', 'active')
            ->whereRaw('stocks.quantity_on_hand <= spare_parts.reorder_point')
            ->count();

        // Critical parts out of stock
        $criticalOutOfStock = DB::table('spare_parts')
            ->join('stocks', 'spare_parts.id', '=', 'stocks.spare_part_id')
            ->where('spare_parts.company_id', $companyId)
            ->where('spare_parts.status', 'active')
            ->where('spare_parts.is_critical', true)
            ->where('stocks.quantity_on_hand', 0)
            ->count();

        // Total inventory value
        $totalInventoryValue = DB::table('spare_parts')
            ->join('stocks', 'spare_parts.id', '=', 'stocks.spare_part_id')
            ->where('spare_parts.company_id', $companyId)
            ->where('spare_parts.status', 'active')
            ->selectRaw('SUM(stocks.quantity_on_hand * spare_parts.unit_cost) as total_value')
            ->value('total_value') ?? 0;

        // Total parts count
        $totalPartsCount = SparePart::where('company_id', $companyId)
            ->where('status', 'active')
            ->count();

        // Pending purchase orders
        $pendingPOsCount = DB::table('purchase_orders')
            ->where('company_id', $companyId)
            ->whereIn('status', ['draft', 'sent'])
            ->count();

        return [
            'low_stock_count' => $lowStockCount,
            'low_stock_parts' => $lowStockParts,
            'critical_out_of_stock' => $criticalOutOfStock,
            'total_inventory_value' => $totalInventoryValue,
            'total_parts_count' => $totalPartsCount,
            'pending_pos_count' => $pendingPOsCount,
        ];
    }

    private function getOeeMetrics(int $companyId, $dateFrom, $dateTo): array
    {
        // Average OEE in range
        $oeeStats = ProductionRun::where('company_id', $companyId)
            ->whereBetween('start_time', [$dateFrom, $dateTo])
            ->whereNotNull('oee_pct')
            ->selectRaw('
                AVG(availability_pct) as avg_availability,
                AVG(performance_pct) as avg_performance,
                AVG(quality_pct) as avg_quality,
                AVG(oee_pct) as avg_oee,
                COUNT(*) as run_count
            ')
            ->first();

        // Today's OEE
        $todayOee = ProductionRun::where('company_id', $companyId)
            ->whereDate('start_time', today())
            ->whereNotNull('oee_pct')
            ->avg('oee_pct');

        // This week's average OEE
        $weekOee = ProductionRun::where('company_id', $companyId)
            ->where('start_time', '>=', now()->startOfWeek())
            ->whereNotNull('oee_pct')
            ->avg('oee_pct');

        // Recent production runs
        $recentRuns = ProductionRun::where('company_id', $companyId)
            ->with(['machine:id,name', 'product:id,name'])
            ->whereNotNull('oee_pct')
            ->orderByDesc('start_time')
            ->limit(5)
            ->get(['id', 'machine_id', 'product_id', 'start_time', 'end_time', 'oee_pct', 'availability_pct', 'performance_pct', 'quality_pct']);

        return [
            'avg_availability' => round($oeeStats->avg_availability ?? 0, 1),
            'avg_performance' => round($oeeStats->avg_performance ?? 0, 1),
            'avg_quality' => round($oeeStats->avg_quality ?? 0, 1),
            'avg_oee' => round($oeeStats->avg_oee ?? 0, 1),
            'run_count' => $oeeStats->run_count ?? 0,
            'today_oee' => round($todayOee ?? 0, 1),
            'week_oee' => round($weekOee ?? 0, 1),
            'recent_runs' => $recentRuns,
        ];
    }
}
