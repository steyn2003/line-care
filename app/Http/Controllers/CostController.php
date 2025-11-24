<?php

namespace App\Http\Controllers;

use App\Models\WorkOrderCost;
use App\Models\Machine;
use App\Models\MaintenanceBudget;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;

class CostController extends Controller
{
    /**
     * Display the cost dashboard.
     */
    public function dashboard(Request $request): Response
    {
        $user = $request->user();
        $companyId = $user->company_id;

        // Default to last 30 days
        $dateRange = $request->get('date_range', '30');
        $dateFrom = Carbon::now()->subDays((int)$dateRange)->startOfDay();
        $dateTo = Carbon::now()->endOfDay();

        // Get cost summary
        $costSummary = WorkOrderCost::query()
            ->join('work_orders', 'work_order_costs.work_order_id', '=', 'work_orders.id')
            ->where('work_orders.company_id', $companyId)
            ->whereBetween('work_orders.completed_at', [$dateFrom, $dateTo])
            ->select(
                DB::raw('SUM(work_order_costs.labor_cost) as labor_total'),
                DB::raw('SUM(work_order_costs.parts_cost) as parts_total'),
                DB::raw('SUM(work_order_costs.external_service_cost) as external_total'),
                DB::raw('SUM(work_order_costs.downtime_cost) as downtime_total'),
                DB::raw('SUM(work_order_costs.total_cost) as grand_total'),
                DB::raw('COUNT(work_order_costs.id) as work_order_count')
            )
            ->first();

        // Get top 5 machines by cost
        $topMachines = WorkOrderCost::query()
            ->join('work_orders', 'work_order_costs.work_order_id', '=', 'work_orders.id')
            ->join('machines', 'work_orders.machine_id', '=', 'machines.id')
            ->where('work_orders.company_id', $companyId)
            ->whereBetween('work_orders.completed_at', [$dateFrom, $dateTo])
            ->select(
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
            ->orderByDesc('total_cost')
            ->limit(5)
            ->get();

        // Get current month budget comparison
        $now = Carbon::now();
        $budgetComparison = null;

        $budget = MaintenanceBudget::where('company_id', $companyId)
            ->where('year', $now->year)
            ->where('month', $now->month)
            ->first();

        if ($budget) {
            // Calculate actual costs for current month
            $startDate = $now->copy()->startOfMonth();
            $endDate = $now->copy()->endOfMonth();

            $actualCosts = WorkOrderCost::query()
                ->join('work_orders', 'work_order_costs.work_order_id', '=', 'work_orders.id')
                ->where('work_orders.company_id', $companyId)
                ->whereBetween('work_orders.completed_at', [$startDate, $endDate])
                ->select(
                    DB::raw('SUM(work_order_costs.labor_cost) as actual_labor'),
                    DB::raw('SUM(work_order_costs.parts_cost) as actual_parts')
                )
                ->first();

            $budget->actual_labor = $actualCosts->actual_labor ?? 0;
            $budget->actual_parts = $actualCosts->actual_parts ?? 0;
            $budget->actual_total = $budget->actual_labor + $budget->actual_parts;
            $budget->variance = $budget->budgeted_total - $budget->actual_total;

            $percentageUsed = $budget->budgeted_total > 0
                ? ($budget->actual_total / $budget->budgeted_total) * 100
                : 0;

            $budgetComparison = [
                'budget' => $budget,
                'is_over_budget' => $budget->variance < 0,
                'percentage_used' => round($percentageUsed, 2),
            ];
        }

        return Inertia::render('costs/dashboard', [
            'costSummary' => $costSummary,
            'topMachines' => $topMachines,
            'budgetComparison' => $budgetComparison,
            'dateRange' => $dateRange,
        ]);
    }

    /**
     * Display the detailed cost report.
     */
    public function report(Request $request): Response
    {
        $user = $request->user();
        $companyId = $user->company_id;

        // Default to last 3 months
        $dateFrom = $request->get('date_from', Carbon::now()->subMonths(3)->format('Y-m-d'));
        $dateTo = $request->get('date_to', Carbon::now()->format('Y-m-d'));
        $groupBy = $request->get('group_by', 'machine');

        // Get costs by machine
        $machines = WorkOrderCost::query()
            ->join('work_orders', 'work_order_costs.work_order_id', '=', 'work_orders.id')
            ->join('machines', 'work_orders.machine_id', '=', 'machines.id')
            ->where('work_orders.company_id', $companyId)
            ->whereBetween('work_orders.completed_at', [$dateFrom, $dateTo])
            ->select(
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
            ->orderByDesc('total_cost')
            ->get();

        // Get costs by category
        $categories = [];
        if ($groupBy === 'cause_category') {
            $categories = WorkOrderCost::query()
                ->join('work_orders', 'work_order_costs.work_order_id', '=', 'work_orders.id')
                ->leftJoin('cause_categories', 'work_orders.cause_category_id', '=', 'cause_categories.id')
                ->where('work_orders.company_id', $companyId)
                ->whereBetween('work_orders.completed_at', [$dateFrom, $dateTo])
                ->select(
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
                ->orderByDesc('total_cost')
                ->get();
        } else {
            $categories = WorkOrderCost::query()
                ->join('work_orders', 'work_order_costs.work_order_id', '=', 'work_orders.id')
                ->where('work_orders.company_id', $companyId)
                ->whereBetween('work_orders.completed_at', [$dateFrom, $dateTo])
                ->select(
                    'work_orders.type as category_name',
                    DB::raw('SUM(work_order_costs.labor_cost) as labor_cost'),
                    DB::raw('SUM(work_order_costs.parts_cost) as parts_cost'),
                    DB::raw('SUM(work_order_costs.external_service_cost) as external_service_cost'),
                    DB::raw('SUM(work_order_costs.downtime_cost) as downtime_cost'),
                    DB::raw('SUM(work_order_costs.total_cost) as total_cost'),
                    DB::raw('COUNT(work_orders.id) as work_order_count')
                )
                ->groupBy('work_orders.type')
                ->orderByDesc('total_cost')
                ->get();
        }

        // Get monthly trends
        $driver = DB::connection()->getDriverName();
        $monthFormat = $driver === 'mysql'
            ? "DATE_FORMAT(work_orders.completed_at, '%Y-%m')"
            : "strftime('%Y-%m', work_orders.completed_at)";

        $trends = WorkOrderCost::query()
            ->join('work_orders', 'work_order_costs.work_order_id', '=', 'work_orders.id')
            ->where('work_orders.company_id', $companyId)
            ->whereBetween('work_orders.completed_at', [$dateFrom, $dateTo])
            ->select(
                DB::raw("{$monthFormat} as month"),
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

        return Inertia::render('costs/report', [
            'machines' => $machines,
            'categories' => $categories,
            'trends' => $trends,
            'filters' => [
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
                'group_by' => $groupBy,
            ],
        ]);
    }

    /**
     * Display the budget management page.
     */
    public function budget(Request $request): Response
    {
        $user = $request->user();
        $companyId = $user->company_id;
        $selectedYear = $request->get('year', Carbon::now()->year);

        // Get all budgets for the selected year
        $budgets = MaintenanceBudget::where('company_id', $companyId)
            ->where('year', $selectedYear)
            ->orderBy('month', 'asc')
            ->get();

        // Calculate actual costs for each budget
        foreach ($budgets as $budget) {
            $startDate = Carbon::createFromDate($budget->year, $budget->month, 1)->startOfMonth();
            $endDate = Carbon::createFromDate($budget->year, $budget->month, 1)->endOfMonth();

            $actualCosts = WorkOrderCost::query()
                ->join('work_orders', 'work_order_costs.work_order_id', '=', 'work_orders.id')
                ->where('work_orders.company_id', $companyId)
                ->whereBetween('work_orders.completed_at', [$startDate, $endDate])
                ->select(
                    DB::raw('SUM(work_order_costs.labor_cost) as actual_labor'),
                    DB::raw('SUM(work_order_costs.parts_cost) as actual_parts')
                )
                ->first();

            $budget->actual_labor = $actualCosts->actual_labor ?? 0;
            $budget->actual_parts = $actualCosts->actual_parts ?? 0;
            $budget->actual_total = $budget->actual_labor + $budget->actual_parts;
            $budget->variance = $budget->budgeted_total - $budget->actual_total;
        }

        return Inertia::render('costs/budget', [
            'budgets' => $budgets,
            'selectedYear' => $selectedYear,
        ]);
    }

    /**
     * Store a new budget.
     */
    public function storeBudget(Request $request)
    {
        $user = $request->user();
        $companyId = $user->company_id;

        $validated = $request->validate([
            'year' => 'required|integer|min:2000|max:2100',
            'month' => 'required|integer|min:1|max:12',
            'budgeted_labor' => 'required|numeric|min:0',
            'budgeted_parts' => 'required|numeric|min:0',
        ]);

        // Check if budget already exists for this month/year
        $exists = MaintenanceBudget::where('company_id', $companyId)
            ->where('year', $validated['year'])
            ->where('month', $validated['month'])
            ->exists();

        if ($exists) {
            return back()->withErrors([
                'month' => 'A budget for this month and year already exists.',
            ]);
        }

        MaintenanceBudget::create([
            'company_id' => $companyId,
            'year' => $validated['year'],
            'month' => $validated['month'],
            'budgeted_labor' => $validated['budgeted_labor'],
            'budgeted_parts' => $validated['budgeted_parts'],
            'budgeted_total' => $validated['budgeted_labor'] + $validated['budgeted_parts'],
        ]);

        return back()->with('success', 'Budget created successfully.');
    }

    /**
     * Update an existing budget.
     */
    public function updateBudget(Request $request, MaintenanceBudget $budget)
    {
        $user = $request->user();

        // Ensure budget belongs to user's company
        if ($budget->company_id !== $user->company_id) {
            abort(403);
        }

        $validated = $request->validate([
            'year' => 'required|integer|min:2000|max:2100',
            'month' => 'required|integer|min:1|max:12',
            'budgeted_labor' => 'required|numeric|min:0',
            'budgeted_parts' => 'required|numeric|min:0',
        ]);

        // Check if another budget exists for this month/year (excluding current budget)
        $exists = MaintenanceBudget::where('company_id', $user->company_id)
            ->where('year', $validated['year'])
            ->where('month', $validated['month'])
            ->where('id', '!=', $budget->id)
            ->exists();

        if ($exists) {
            return back()->withErrors([
                'month' => 'A budget for this month and year already exists.',
            ]);
        }

        $budget->update([
            'year' => $validated['year'],
            'month' => $validated['month'],
            'budgeted_labor' => $validated['budgeted_labor'],
            'budgeted_parts' => $validated['budgeted_parts'],
            'budgeted_total' => $validated['budgeted_labor'] + $validated['budgeted_parts'],
        ]);

        return back()->with('success', 'Budget updated successfully.');
    }

    /**
     * Delete a budget.
     */
    public function destroyBudget(Request $request, MaintenanceBudget $budget)
    {
        $user = $request->user();

        // Ensure budget belongs to user's company
        if ($budget->company_id !== $user->company_id) {
            abort(403);
        }

        $budget->delete();

        return back()->with('success', 'Budget deleted successfully.');
    }
}
