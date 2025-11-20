<?php

namespace App\Http\Controllers;

use App\Enums\WorkOrderStatus;
use App\Enums\WorkOrderType;
use App\Models\Location;
use App\Models\PreventiveTask;
use App\Models\WorkOrder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $locationId = $request->location_id;

        // Parse date range (default to last 30 days)
        $dateFrom = $request->date_from ? \Carbon\Carbon::parse($request->date_from)->startOfDay() : now()->subDays(30)->startOfDay();
        $dateTo = $request->date_to ? \Carbon\Carbon::parse($request->date_to)->endOfDay() : now()->endOfDay();

        // Get locations for filter
        $locations = Location::where('company_id', $user->company_id)
            ->orderBy('name')
            ->get(['id', 'name']);

        // Build base queries
        $workOrderQuery = WorkOrder::where('company_id', $user->company_id);
        $preventiveTaskQuery = PreventiveTask::where('company_id', $user->company_id);

        if ($locationId) {
            $workOrderQuery->whereHas('machine', fn($q) => $q->where('location_id', $locationId));
            $preventiveTaskQuery->whereHas('machine', fn($q) => $q->where('location_id', $locationId));
        }

        // Calculate metrics
        $openWorkOrdersCount = (clone $workOrderQuery)
            ->whereIn('status', [WorkOrderStatus::OPEN, WorkOrderStatus::IN_PROGRESS])
            ->count();

        $overduePreventiveTasksCount = (clone $preventiveTaskQuery)
            ->where('is_active', true)
            ->where('next_due_date', '<=', now())
            ->count();

        $breakdownsInRange = (clone $workOrderQuery)
            ->where('type', WorkOrderType::BREAKDOWN)
            ->whereBetween('created_at', [$dateFrom, $dateTo])
            ->count();

        // Calculate quick stats for last 7 and 30 days for comparison
        $breakdownsLast7Days = (clone $workOrderQuery)
            ->where('type', WorkOrderType::BREAKDOWN)
            ->where('created_at', '>=', now()->subDays(7))
            ->count();

        $breakdownsLast30Days = (clone $workOrderQuery)
            ->where('type', WorkOrderType::BREAKDOWN)
            ->where('created_at', '>=', now()->subDays(30))
            ->count();

        // Top 5 machines by breakdown count (using date range)
        $topMachinesQuery = DB::table('work_orders')
            ->join('machines', 'work_orders.machine_id', '=', 'machines.id')
            ->where('work_orders.company_id', $user->company_id)
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

        $metrics = [
            'open_work_orders_count' => $openWorkOrdersCount,
            'overdue_preventive_tasks_count' => $overduePreventiveTasksCount,
            'breakdowns_in_range' => $breakdownsInRange,
            'breakdowns_last_7_days' => $breakdownsLast7Days,
            'breakdowns_last_30_days' => $breakdownsLast30Days,
            'top_machines' => $topMachines,
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
}
