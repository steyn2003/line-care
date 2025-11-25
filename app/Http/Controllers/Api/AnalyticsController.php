<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\AnalyticsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AnalyticsController extends Controller
{
    public function __construct(
        private AnalyticsService $analyticsService
    ) {}

    /**
     * Get MTBF (Mean Time Between Failures) metrics.
     *
     * GET /api/analytics/mtbf
     */
    public function mtbf(Request $request): JsonResponse
    {
        $request->validate([
            'machine_id' => 'nullable|exists:machines,id',
            'date_from' => 'nullable|date',
            'date_to' => 'nullable|date|after_or_equal:date_from',
        ]);

        $companyId = $request->user()->company_id;

        $filters = [
            'machine_id' => $request->machine_id,
            'date_from' => $request->date_from,
            'date_to' => $request->date_to,
        ];

        $data = $this->analyticsService->calculateMTBF($companyId, $filters);

        return response()->json($data);
    }

    /**
     * Get MTTR (Mean Time To Repair) metrics.
     *
     * GET /api/analytics/mttr
     */
    public function mttr(Request $request): JsonResponse
    {
        $request->validate([
            'machine_id' => 'nullable|exists:machines,id',
            'date_from' => 'nullable|date',
            'date_to' => 'nullable|date|after_or_equal:date_from',
        ]);

        $companyId = $request->user()->company_id;

        $filters = [
            'machine_id' => $request->machine_id,
            'date_from' => $request->date_from,
            'date_to' => $request->date_to,
        ];

        $data = $this->analyticsService->calculateMTTR($companyId, $filters);

        return response()->json($data);
    }

    /**
     * Get Pareto analysis (80/20 rule).
     *
     * GET /api/analytics/pareto
     */
    public function pareto(Request $request): JsonResponse
    {
        $request->validate([
            'type' => 'nullable|in:machines,causes,downtime,costs',
            'date_from' => 'nullable|date',
            'date_to' => 'nullable|date|after_or_equal:date_from',
        ]);

        $companyId = $request->user()->company_id;
        $type = $request->type ?? 'machines';

        $filters = [
            'date_from' => $request->date_from,
            'date_to' => $request->date_to,
        ];

        $data = $this->analyticsService->paretoAnalysis($companyId, $type, $filters);

        return response()->json($data);
    }

    /**
     * Get failure predictions for machines.
     *
     * GET /api/analytics/predictions
     */
    public function predictions(Request $request): JsonResponse
    {
        $request->validate([
            'machine_id' => 'nullable|exists:machines,id',
        ]);

        $companyId = $request->user()->company_id;

        if ($request->machine_id) {
            // Single machine prediction
            $data = $this->analyticsService->generatePredictions($companyId, $request->machine_id);
            return response()->json($data);
        }

        // All machines predictions
        $machines = \App\Models\Machine::where('company_id', $companyId)
            ->where('status', 'active')
            ->get();

        $predictions = [];
        foreach ($machines as $machine) {
            $prediction = $this->analyticsService->generatePredictions($companyId, $machine->id);
            if ($prediction['prediction']) {
                $predictions[] = $prediction;
            }
        }

        // Sort by days until failure (most urgent first)
        usort($predictions, function ($a, $b) {
            return ($a['prediction']['days_until_failure'] ?? 999) <=> ($b['prediction']['days_until_failure'] ?? 999);
        });

        return response()->json([
            'predictions' => $predictions,
            'total_machines' => $machines->count(),
            'machines_with_predictions' => count($predictions),
        ]);
    }

    /**
     * Get failure mode analysis.
     *
     * GET /api/analytics/failure-modes
     */
    public function failureModes(Request $request): JsonResponse
    {
        $request->validate([
            'machine_id' => 'nullable|exists:machines,id',
            'date_from' => 'nullable|date',
            'date_to' => 'nullable|date|after_or_equal:date_from',
        ]);

        $companyId = $request->user()->company_id;

        $filters = [
            'machine_id' => $request->machine_id,
            'date_from' => $request->date_from,
            'date_to' => $request->date_to,
        ];

        $data = $this->analyticsService->failureModeAnalysis($companyId, $filters);

        return response()->json($data);
    }

    /**
     * Get root cause trends over time.
     *
     * GET /api/analytics/root-cause-trends
     */
    public function rootCauseTrends(Request $request): JsonResponse
    {
        $request->validate([
            'date_from' => 'nullable|date',
            'date_to' => 'nullable|date|after_or_equal:date_from',
        ]);

        $companyId = $request->user()->company_id;

        $filters = [
            'date_from' => $request->date_from,
            'date_to' => $request->date_to,
        ];

        $data = $this->analyticsService->rootCauseTrends($companyId, $filters);

        return response()->json($data);
    }

    /**
     * Get maintenance effectiveness report.
     *
     * GET /api/analytics/effectiveness
     */
    public function effectiveness(Request $request): JsonResponse
    {
        $request->validate([
            'date_from' => 'nullable|date',
            'date_to' => 'nullable|date|after_or_equal:date_from',
        ]);

        $companyId = $request->user()->company_id;

        $filters = [
            'date_from' => $request->date_from,
            'date_to' => $request->date_to,
        ];

        $data = $this->analyticsService->maintenanceEffectiveness($companyId, $filters);

        return response()->json($data);
    }

    /**
     * Get combined analytics dashboard data.
     *
     * GET /api/analytics/dashboard
     */
    public function dashboard(Request $request): JsonResponse
    {
        $request->validate([
            'date_from' => 'nullable|date',
            'date_to' => 'nullable|date|after_or_equal:date_from',
        ]);

        $companyId = $request->user()->company_id;

        $filters = [
            'date_from' => $request->date_from ?? now()->subMonths(6)->toDateString(),
            'date_to' => $request->date_to ?? now()->toDateString(),
        ];

        // Get all analytics in one call
        $mtbf = $this->analyticsService->calculateMTBF($companyId, $filters);
        $mttr = $this->analyticsService->calculateMTTR($companyId, $filters);
        $paretoMachines = $this->analyticsService->paretoAnalysis($companyId, 'machines', $filters);
        $paretoCauses = $this->analyticsService->paretoAnalysis($companyId, 'causes', $filters);
        $effectiveness = $this->analyticsService->maintenanceEffectiveness($companyId, $filters);

        return response()->json([
            'mtbf' => $mtbf,
            'mttr' => $mttr,
            'pareto_machines' => $paretoMachines,
            'pareto_causes' => $paretoCauses,
            'effectiveness' => $effectiveness,
            'period' => $filters,
        ]);
    }
}
