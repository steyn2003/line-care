<?php

namespace App\Http\Controllers;

use App\Models\Downtime;
use App\Models\ProductionRun;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DowntimeController extends Controller
{
    /**
     * Store a newly created downtime record (start downtime).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'production_run_id' => ['required', 'exists:production_runs,id'],
            'category_id' => ['required', 'exists:downtime_categories,id'],
            'description' => ['nullable', 'string', 'max:1000'],
        ]);

        $productionRun = ProductionRun::findOrFail($validated['production_run_id']);

        // Ensure user can only create downtime for their company's production runs
        if ($productionRun->company_id !== $request->user()->company_id) {
            abort(403);
        }

        DB::beginTransaction();

        try {
            Downtime::create([
                'company_id' => $request->user()->company_id,
                'machine_id' => $productionRun->machine_id,
                'production_run_id' => $validated['production_run_id'],
                'downtime_category_id' => $validated['category_id'],
                'start_time' => now(),
                'description' => $validated['description'] ?? null,
                'recorded_by' => $request->user()->id,
            ]);

            DB::commit();

            return redirect()->route('production.runs.show', $productionRun->id);

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to record downtime.']);
        }
    }

    /**
     * End a downtime record and calculate duration.
     */
    public function end(Request $request, Downtime $downtime)
    {
        // Ensure user can only end downtime from their company
        if ($downtime->company_id !== $request->user()->company_id) {
            abort(403);
        }

        // Check if already ended
        if (!$downtime->isActive()) {
            return back()->withErrors(['error' => 'This downtime has already been ended.']);
        }

        DB::beginTransaction();

        try {
            $downtime->end(now());

            // If this downtime is linked to a production run, recalculate OEE
            if ($downtime->production_run_id) {
                $productionRun = $downtime->productionRun;
                if ($productionRun && !$productionRun->isActive()) {
                    $productionRun->calculateOEE();
                }
            }

            DB::commit();

            return redirect()->route('production.runs.show', $downtime->production_run_id);

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to end downtime.']);
        }
    }
}
