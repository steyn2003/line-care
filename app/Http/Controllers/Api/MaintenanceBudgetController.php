<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MaintenanceBudget;
use App\Models\WorkOrderCost;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class MaintenanceBudgetController extends Controller
{
    /**
     * Display a listing of budgets for the company.
     */
    public function index(Request $request)
    {
        $companyId = $request->user()->company_id;

        $query = MaintenanceBudget::where('company_id', $companyId)
            ->orderBy('year', 'desc')
            ->orderBy('month', 'desc');

        // Filter by year
        if ($request->has('year')) {
            $query->where('year', $request->year);
        }

        $budgets = $query->get();

        return response()->json($budgets);
    }

    /**
     * Store a newly created budget.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'year' => 'required|integer|min:2020|max:2100',
            'month' => 'required|integer|min:1|max:12',
            'budgeted_labor' => 'required|numeric|min:0',
            'budgeted_parts' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $companyId = $request->user()->company_id;

        // Check if budget already exists for this month
        $existing = MaintenanceBudget::where('company_id', $companyId)
            ->where('year', $request->year)
            ->where('month', $request->month)
            ->first();

        if ($existing) {
            return response()->json(['error' => 'Budget already exists for this month'], 422);
        }

        $budget = new MaintenanceBudget([
            'company_id' => $companyId,
            'year' => $request->year,
            'month' => $request->month,
            'budgeted_labor' => $request->budgeted_labor,
            'budgeted_parts' => $request->budgeted_parts,
        ]);

        $budget->calculateTotals();

        return response()->json($budget, 201);
    }

    /**
     * Display the specified budget.
     */
    public function show(Request $request, $id)
    {
        $budget = MaintenanceBudget::where('company_id', $request->user()->company_id)
            ->findOrFail($id);

        return response()->json($budget);
    }

    /**
     * Update the specified budget.
     */
    public function update(Request $request, $id)
    {
        $budget = MaintenanceBudget::where('company_id', $request->user()->company_id)
            ->findOrFail($id);

        $validator = Validator::make($request->all(), [
            'budgeted_labor' => 'sometimes|required|numeric|min:0',
            'budgeted_parts' => 'sometimes|required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        if ($request->has('budgeted_labor')) {
            $budget->budgeted_labor = $request->budgeted_labor;
        }

        if ($request->has('budgeted_parts')) {
            $budget->budgeted_parts = $request->budgeted_parts;
        }

        $budget->calculateTotals();

        return response()->json($budget);
    }

    /**
     * Remove the specified budget.
     */
    public function destroy(Request $request, $id)
    {
        $budget = MaintenanceBudget::where('company_id', $request->user()->company_id)
            ->findOrFail($id);

        $budget->delete();

        return response()->json(['message' => 'Budget deleted successfully']);
    }

    /**
     * Get budget comparison for a specific month.
     */
    public function comparison(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'year' => 'required|integer',
            'month' => 'required|integer|min:1|max:12',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $companyId = $request->user()->company_id;
        $year = $request->year;
        $month = $request->month;

        // Get or create budget
        $budget = MaintenanceBudget::getBudget($companyId, $year, $month);

        if (!$budget) {
            return response()->json([
                'message' => 'No budget set for this month',
                'year' => $year,
                'month' => $month,
            ], 404);
        }

        // Calculate actual costs for the month
        $startDate = sprintf('%04d-%02d-01', $year, $month);
        $endDate = date('Y-m-t', strtotime($startDate)); // Last day of month

        $actualCosts = WorkOrderCost::query()
            ->join('work_orders', 'work_order_costs.work_order_id', '=', 'work_orders.id')
            ->where('work_orders.company_id', $companyId)
            ->whereBetween('work_orders.completed_at', [$startDate, $endDate])
            ->select(
                DB::raw('SUM(work_order_costs.labor_cost) as actual_labor'),
                DB::raw('SUM(work_order_costs.parts_cost) as actual_parts'),
                DB::raw('SUM(work_order_costs.total_cost) as actual_total')
            )
            ->first();

        // Update budget with actual values
        $budget->actual_labor = $actualCosts->actual_labor ?? 0;
        $budget->actual_parts = $actualCosts->actual_parts ?? 0;
        $budget->calculateTotals();

        return response()->json([
            'budget' => $budget,
            'is_over_budget' => $budget->variance < 0,
            'percentage_used' => $budget->budgeted_total > 0
                ? round(($budget->actual_total / $budget->budgeted_total) * 100, 2)
                : 0,
        ]);
    }

    /**
     * Update actual costs for current month.
     */
    public function updateActuals(Request $request)
    {
        $companyId = $request->user()->company_id;
        $now = now();
        $year = $now->year;
        $month = $now->month;

        // Get or create budget for current month
        $budget = MaintenanceBudget::firstOrCreate(
            [
                'company_id' => $companyId,
                'year' => $year,
                'month' => $month,
            ],
            [
                'budgeted_labor' => 0,
                'budgeted_parts' => 0,
                'budgeted_total' => 0,
            ]
        );

        // Calculate actual costs for the current month
        $startDate = $now->startOfMonth()->toDateString();
        $endDate = $now->endOfMonth()->toDateString();

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
        $budget->calculateTotals();

        return response()->json([
            'budget' => $budget,
            'message' => 'Actual costs updated successfully',
        ]);
    }
}
