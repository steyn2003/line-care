<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WorkOrder;
use App\Models\WorkOrderCost;
use App\Models\Machine;
use App\Models\MaintenanceBudget;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class CostController extends Controller
{
    /**
     * Get cost summary with filtering options.
     */
    public function summary(Request $request)
    {
        $companyId = $request->user()->company_id;

        $query = WorkOrderCost::query()
            ->join('work_orders', 'work_order_costs.work_order_id', '=', 'work_orders.id')
            ->where('work_orders.company_id', $companyId);

        // Apply date filters
        if ($request->has('date_from')) {
            $query->where('work_orders.completed_at', '>=', $request->date_from);
        }

        if ($request->has('date_to')) {
            $query->where('work_orders.completed_at', '<=', $request->date_to);
        }

        // Apply machine filter
        if ($request->has('machine_id')) {
            $query->where('work_orders.machine_id', $request->machine_id);
        }

        // Apply cost type filter
        if ($request->has('cost_type')) {
            $costType = $request->cost_type;
            $query->where("work_order_costs.{$costType}", '>', 0);
        }

        $summary = $query->select(
            DB::raw('SUM(work_order_costs.labor_cost) as labor_total'),
            DB::raw('SUM(work_order_costs.parts_cost) as parts_total'),
            DB::raw('SUM(work_order_costs.external_service_cost) as external_total'),
            DB::raw('SUM(work_order_costs.downtime_cost) as downtime_total'),
            DB::raw('SUM(work_order_costs.total_cost) as grand_total'),
            DB::raw('COUNT(work_order_costs.id) as work_order_count')
        )->first();

        return response()->json([
            'labor_total' => $summary->labor_total ?? 0,
            'parts_total' => $summary->parts_total ?? 0,
            'external_total' => $summary->external_total ?? 0,
            'downtime_total' => $summary->downtime_total ?? 0,
            'grand_total' => $summary->grand_total ?? 0,
            'work_order_count' => $summary->work_order_count ?? 0,
        ]);
    }

    /**
     * Get costs broken down by machine.
     */
    public function byMachine(Request $request)
    {
        $companyId = $request->user()->company_id;

        $query = WorkOrderCost::query()
            ->join('work_orders', 'work_order_costs.work_order_id', '=', 'work_orders.id')
            ->join('machines', 'work_orders.machine_id', '=', 'machines.id')
            ->where('work_orders.company_id', $companyId);

        // Apply date filters
        if ($request->has('date_from')) {
            $query->where('work_orders.completed_at', '>=', $request->date_from);
        }

        if ($request->has('date_to')) {
            $query->where('work_orders.completed_at', '<=', $request->date_to);
        }

        $costs = $query->select(
            'machines.id',
            'machines.name',
            'machines.code',
            DB::raw('SUM(work_order_costs.labor_cost) as labor_cost'),
            DB::raw('SUM(work_order_costs.parts_cost) as parts_cost'),
            DB::raw('SUM(work_order_costs.external_service_cost) as external_service_cost'),
            DB::raw('SUM(work_order_costs.downtime_cost) as downtime_cost'),
            DB::raw('SUM(work_order_costs.total_cost) as total_cost'),
            DB::raw('COUNT(work_orders.id) as work_order_count')
        )
        ->groupBy('machines.id', 'machines.name', 'machines.code')
        ->orderBy('total_cost', 'desc')
        ->get();

        return response()->json($costs);
    }

    /**
     * Get costs by category (work order type or cause category).
     */
    public function byCategory(Request $request)
    {
        $companyId = $request->user()->company_id;

        $groupBy = $request->get('group_by', 'type'); // 'type' or 'cause_category'

        $query = WorkOrderCost::query()
            ->join('work_orders', 'work_order_costs.work_order_id', '=', 'work_orders.id')
            ->where('work_orders.company_id', $companyId);

        // Apply date filters
        if ($request->has('date_from')) {
            $query->where('work_orders.completed_at', '>=', $request->date_from);
        }

        if ($request->has('date_to')) {
            $query->where('work_orders.completed_at', '<=', $request->date_to);
        }

        if ($groupBy === 'cause_category') {
            $query->leftJoin('cause_categories', 'work_orders.cause_category_id', '=', 'cause_categories.id');

            $costs = $query->select(
                'cause_categories.id',
                'cause_categories.name as category_name',
                DB::raw('SUM(work_order_costs.labor_cost) as labor_cost'),
                DB::raw('SUM(work_order_costs.parts_cost) as parts_cost'),
                DB::raw('SUM(work_order_costs.external_service_cost) as external_service_cost'),
                DB::raw('SUM(work_order_costs.downtime_cost) as downtime_cost'),
                DB::raw('SUM(work_order_costs.total_cost) as total_cost'),
                DB::raw('COUNT(work_orders.id) as work_order_count')
            )
            ->groupBy('cause_categories.id', 'cause_categories.name')
            ->orderBy('total_cost', 'desc')
            ->get();
        } else {
            $costs = $query->select(
                'work_orders.type as category_name',
                DB::raw('SUM(work_order_costs.labor_cost) as labor_cost'),
                DB::raw('SUM(work_order_costs.parts_cost) as parts_cost'),
                DB::raw('SUM(work_order_costs.external_service_cost) as external_service_cost'),
                DB::raw('SUM(work_order_costs.downtime_cost) as downtime_cost'),
                DB::raw('SUM(work_order_costs.total_cost) as total_cost'),
                DB::raw('COUNT(work_orders.id) as work_order_count')
            )
            ->groupBy('work_orders.type')
            ->orderBy('total_cost', 'desc')
            ->get();
        }

        return response()->json($costs);
    }

    /**
     * Get cost trends over time (monthly aggregation).
     */
    public function trends(Request $request)
    {
        $companyId = $request->user()->company_id;

        // Default to last 12 months if no date range provided
        $dateFrom = $request->get('date_from', Carbon::now()->subMonths(12)->startOfMonth());
        $dateTo = $request->get('date_to', Carbon::now()->endOfMonth());

        $trends = WorkOrderCost::query()
            ->join('work_orders', 'work_order_costs.work_order_id', '=', 'work_orders.id')
            ->where('work_orders.company_id', $companyId)
            ->whereBetween('work_orders.completed_at', [$dateFrom, $dateTo])
            ->select(
                DB::raw('DATE_FORMAT(work_orders.completed_at, "%Y-%m") as month'),
                DB::raw('SUM(work_order_costs.labor_cost) as labor_cost'),
                DB::raw('SUM(work_order_costs.parts_cost) as parts_cost'),
                DB::raw('SUM(work_order_costs.external_service_cost) as external_service_cost'),
                DB::raw('SUM(work_order_costs.downtime_cost) as downtime_cost'),
                DB::raw('SUM(work_order_costs.total_cost) as total_cost'),
                DB::raw('COUNT(work_orders.id) as work_order_count')
            )
            ->groupBy('month')
            ->orderBy('month', 'asc')
            ->get();

        return response()->json($trends);
    }

    /**
     * Get downtime costs with detailed breakdown.
     */
    public function downtime(Request $request)
    {
        $companyId = $request->user()->company_id;

        $query = WorkOrder::query()
            ->with(['machine', 'cost'])
            ->where('company_id', $companyId)
            ->whereNotNull('started_at')
            ->whereNotNull('completed_at');

        // Apply date filters
        if ($request->has('date_from')) {
            $query->where('completed_at', '>=', $request->date_from);
        }

        if ($request->has('date_to')) {
            $query->where('completed_at', '<=', $request->date_to);
        }

        // Apply machine filter
        if ($request->has('machine_id')) {
            $query->where('machine_id', $request->machine_id);
        }

        $workOrders = $query->get()->map(function ($workOrder) {
            $downtimeHours = $workOrder->started_at->diffInHours($workOrder->completed_at);
            $downtimeMinutes = $workOrder->started_at->diffInMinutes($workOrder->completed_at) % 60;

            return [
                'work_order_id' => $workOrder->id,
                'work_order_title' => $workOrder->title,
                'machine_name' => $workOrder->machine->name,
                'machine_code' => $workOrder->machine->code,
                'started_at' => $workOrder->started_at,
                'completed_at' => $workOrder->completed_at,
                'downtime_hours' => $downtimeHours,
                'downtime_minutes' => $downtimeMinutes,
                'total_downtime_minutes' => $workOrder->downtime_minutes,
                'downtime_cost' => $workOrder->cost ? $workOrder->cost->downtime_cost : 0,
                'hourly_production_value' => $workOrder->machine->hourly_production_value ?? 0,
            ];
        });

        $totalDowntimeHours = $workOrders->sum('total_downtime_minutes') / 60;
        $totalDowntimeCost = $workOrders->sum('downtime_cost');

        return response()->json([
            'breakdown' => $workOrders,
            'summary' => [
                'total_downtime_hours' => round($totalDowntimeHours, 2),
                'total_downtime_cost' => round($totalDowntimeCost, 2),
                'work_order_count' => $workOrders->count(),
            ],
        ]);
    }
}
