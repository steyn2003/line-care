<?php

namespace App\Http\Controllers;

use App\Models\ProductionRun;
use App\Models\Machine;
use App\Models\Product;
use App\Models\Shift;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductionRunController extends Controller
{
    public function index(Request $request): Response
    {
        $query = ProductionRun::query()
            ->with(['machine', 'product', 'shift', 'creator'])
            ->forCompany($request->user()->company_id);

        // Filters
        if ($request->has('machine_id')) {
            $query->where('machine_id', $request->machine_id);
        }

        if ($request->has('status')) {
            if ($request->status === 'active') {
                $query->active();
            } elseif ($request->status === 'completed') {
                $query->completed();
            }
        }

        $productionRuns = $query->orderBy('start_time', 'desc')->paginate(15);

        $machines = Machine::forCompany($request->user()->company_id)
            ->orderBy('name')
            ->get(['id', 'name']);

        $products = Product::forCompany($request->user()->company_id)
            ->active()
            ->orderBy('name')
            ->get(['id', 'name']);

        $shifts = Shift::forCompany($request->user()->company_id)
            ->active()
            ->orderBy('start_time')
            ->get(['id', 'name']);

        return Inertia::render('production/runs', [
            'productionRuns' => $productionRuns,
            'machines' => $machines,
            'products' => $products,
            'shifts' => $shifts,
            'filters' => $request->only(['machine_id', 'status']),
        ]);
    }

    public function show(Request $request, ProductionRun $productionRun): Response
    {
        // Ensure user can only view production runs from their company
        if ($productionRun->company_id !== $request->user()->company_id) {
            abort(403);
        }

        $productionRun->load([
            'machine',
            'product',
            'shift',
            'workOrder',
            'creator',
            'downtimes' => function ($query) {
                $query->with('category')->orderBy('start_time');
            },
        ]);

        $downtimeCategories = \App\Models\DowntimeCategory::forCompany($request->user()->company_id)
            ->orderBy('name')
            ->get(['id', 'name', 'category_type']);

        return Inertia::render('production/show', [
            'productionRun' => $productionRun,
            'downtimeCategories' => $downtimeCategories,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'machine_id' => 'required|exists:machines,id',
            'product_id' => 'required|exists:products,id',
            'shift_id' => 'required|exists:shifts,id',
            'planned_production_time' => 'required|integer|min:1',
        ]);

        $validated['company_id'] = $request->user()->company_id;
        $validated['created_by'] = $request->user()->id;
        $validated['start_time'] = now();

        ProductionRun::create($validated);

        return redirect()->route('production-runs.index');
    }

    public function end(Request $request, ProductionRun $productionRun)
    {
        $validated = $request->validate([
            'actual_output' => 'required|integer|min:0',
            'good_output' => 'required|integer|min:0',
            'defect_output' => 'required|integer|min:0',
        ]);

        $validated['end_time'] = now();
        $validated['status'] = 'completed';

        $productionRun->update($validated);
        $productionRun->calculateOEE();

        return redirect()->route('production-runs.index');
    }
}
