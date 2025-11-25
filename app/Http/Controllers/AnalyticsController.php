<?php

namespace App\Http\Controllers;

use App\Services\AnalyticsService;
use App\Models\Machine;
use App\Models\CauseCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AnalyticsController extends Controller
{
    public function __construct(
        private AnalyticsService $analyticsService
    ) {}

    /**
     * Display the analytics dashboard.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $companyId = $user->company_id;

        $filters = [
            'date_from' => $request->date_from ?? now()->subMonths(6)->toDateString(),
            'date_to' => $request->date_to ?? now()->toDateString(),
            'machine_id' => $request->machine_id,
        ];

        // Get MTBF data
        $mtbf = $this->analyticsService->calculateMTBF($companyId, $filters);

        // Get MTTR data
        $mttr = $this->analyticsService->calculateMTTR($companyId, $filters);

        // Get Pareto data for machines
        $paretoMachines = $this->analyticsService->paretoAnalysis($companyId, 'machines', $filters);

        // Get Pareto data for causes
        $paretoCauses = $this->analyticsService->paretoAnalysis($companyId, 'causes', $filters);

        // Get maintenance effectiveness
        $effectiveness = $this->analyticsService->maintenanceEffectiveness($companyId, $filters);

        // Get machines for filter dropdown
        $machines = Machine::where('company_id', $companyId)
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('analytics/index', [
            'mtbf' => $mtbf,
            'mttr' => $mttr,
            'paretoMachines' => $paretoMachines,
            'paretoCauses' => $paretoCauses,
            'effectiveness' => $effectiveness,
            'machines' => $machines,
            'filters' => $filters,
        ]);
    }

    /**
     * Display MTBF/MTTR detailed page.
     */
    public function reliability(Request $request): Response
    {
        $user = $request->user();
        $companyId = $user->company_id;

        $filters = [
            'date_from' => $request->date_from ?? now()->subMonths(6)->toDateString(),
            'date_to' => $request->date_to ?? now()->toDateString(),
            'machine_id' => $request->machine_id,
        ];

        $mtbf = $this->analyticsService->calculateMTBF($companyId, $filters);
        $mttr = $this->analyticsService->calculateMTTR($companyId, $filters);

        $machines = Machine::where('company_id', $companyId)
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('analytics/reliability', [
            'mtbf' => $mtbf,
            'mttr' => $mttr,
            'machines' => $machines,
            'filters' => $filters,
        ]);
    }

    /**
     * Display Pareto analysis page.
     */
    public function pareto(Request $request): Response
    {
        $user = $request->user();
        $companyId = $user->company_id;

        $filters = [
            'date_from' => $request->date_from ?? now()->subMonths(6)->toDateString(),
            'date_to' => $request->date_to ?? now()->toDateString(),
        ];

        $type = $request->type ?? 'machines';

        $paretoData = $this->analyticsService->paretoAnalysis($companyId, $type, $filters);

        return Inertia::render('analytics/pareto', [
            'pareto' => $paretoData,
            'analysisType' => $type,
            'filters' => $filters,
        ]);
    }

    /**
     * Display failure predictions page.
     */
    public function predictions(Request $request): Response
    {
        $user = $request->user();
        $companyId = $user->company_id;

        $machines = Machine::where('company_id', $companyId)
            ->where('status', 'active')
            ->orderBy('name')
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

        return Inertia::render('analytics/predictions', [
            'predictions' => $predictions,
            'totalMachines' => $machines->count(),
            'machinesWithPredictions' => count($predictions),
        ]);
    }

    /**
     * Display failure mode analysis page.
     */
    public function failureModes(Request $request): Response
    {
        $user = $request->user();
        $companyId = $user->company_id;

        $filters = [
            'date_from' => $request->date_from ?? now()->subMonths(6)->toDateString(),
            'date_to' => $request->date_to ?? now()->toDateString(),
            'machine_id' => $request->machine_id,
        ];

        $failureModes = $this->analyticsService->failureModeAnalysis($companyId, $filters);
        $rootCauseTrends = $this->analyticsService->rootCauseTrends($companyId, $filters);

        $machines = Machine::where('company_id', $companyId)
            ->orderBy('name')
            ->get(['id', 'name']);

        $categories = CauseCategory::where('company_id', $companyId)
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('analytics/failure-modes', [
            'failureModes' => $failureModes,
            'rootCauseTrends' => $rootCauseTrends,
            'machines' => $machines,
            'categories' => $categories,
            'filters' => $filters,
        ]);
    }
}
