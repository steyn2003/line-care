<?php

namespace App\Http\Controllers;

use App\Models\Dashboard;
use App\Models\Widget;
use App\Models\WorkOrder;
use App\Models\Machine;
use App\Models\SparePart;
use App\Models\Stock;
use App\Models\ProductionRun;
use App\Services\AnalyticsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class CustomDashboardController extends Controller
{
    public function __construct(
        private AnalyticsService $analyticsService
    ) {}
    /**
     * Display list of custom dashboards.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        $dashboards = Dashboard::where('company_id', $user->company_id)
            ->where(function ($query) use ($user) {
                $query->where('created_by', $user->id)
                    ->orWhere(function ($q) use ($user) {
                        $q->where('is_shared', true)
                            ->where(function ($q2) use ($user) {
                                $q2->whereNull('shared_with_role')
                                    ->orWhere('shared_with_role', $user->role);
                            });
                    });
            })
            ->with(['creator:id,name'])
            ->withCount('widgets')
            ->orderBy('is_default', 'desc')
            ->orderBy('name')
            ->get();

        return Inertia::render('dashboards/index', [
            'dashboards' => $dashboards,
        ]);
    }

    /**
     * Show form to create a new dashboard.
     */
    public function create(): Response
    {
        return Inertia::render('dashboards/create', [
            'widgetTypes' => Widget::getWidgetTypes(),
            'dataSources' => Widget::getDataSources(),
        ]);
    }

    /**
     * Store a new dashboard.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'is_default' => 'boolean',
            'is_shared' => 'boolean',
            'shared_with_role' => 'nullable|in:operator,technician,manager',
        ]);

        $user = $request->user();

        if (!empty($validated['is_default'])) {
            Dashboard::where('company_id', $user->company_id)
                ->where('created_by', $user->id)
                ->where('is_default', true)
                ->update(['is_default' => false]);
        }

        $dashboard = Dashboard::create([
            'company_id' => $user->company_id,
            'created_by' => $user->id,
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'is_default' => $validated['is_default'] ?? false,
            'is_shared' => $validated['is_shared'] ?? false,
            'shared_with_role' => $validated['shared_with_role'] ?? null,
        ]);

        return redirect()->route('dashboards.edit', $dashboard)
            ->with('success', 'Dashboard created successfully. Now add some widgets!');
    }

    /**
     * Display a dashboard.
     */
    public function show(Request $request, Dashboard $dashboard): Response
    {
        $user = $request->user();

        if (!$dashboard->isAccessibleBy($user)) {
            abort(403);
        }

        $dashboard->load(['creator:id,name', 'widgets']);

        // Fetch data for each widget
        $widgetsWithData = $dashboard->widgets->map(function ($widget) use ($user) {
            $data = $this->getWidgetData($widget, $user->company_id);
            return [
                'id' => $widget->id,
                'widget_type' => $widget->widget_type,
                'title' => $widget->title,
                'data_source' => $widget->data_source,
                'config' => $widget->config,
                'position_x' => $widget->position_x,
                'position_y' => $widget->position_y,
                'size_width' => $widget->size_width,
                'size_height' => $widget->size_height,
                'sort_order' => $widget->sort_order,
                'data' => $data,
            ];
        });

        return Inertia::render('dashboards/show', [
            'dashboard' => [
                'id' => $dashboard->id,
                'name' => $dashboard->name,
                'description' => $dashboard->description,
                'is_default' => $dashboard->is_default,
                'is_shared' => $dashboard->is_shared,
                'shared_with_role' => $dashboard->shared_with_role,
                'creator' => $dashboard->creator,
                'widgets' => $widgetsWithData,
            ],
        ]);
    }

    /**
     * Get data for a widget based on its data source.
     */
    private function getWidgetData(Widget $widget, int $companyId): array
    {
        $config = $widget->config ?? [];
        $dateFrom = $config['date_from'] ?? now()->subMonths(6)->toDateString();
        $dateTo = $config['date_to'] ?? now()->toDateString();
        $filters = [
            'date_from' => $dateFrom,
            'date_to' => $dateTo,
            'machine_id' => $config['machine_id'] ?? null,
        ];

        switch ($widget->data_source) {
            case Widget::SOURCE_MTBF_MTTR:
                $mtbf = $this->analyticsService->calculateMTBF($companyId, $filters);
                $mttr = $this->analyticsService->calculateMTTR($companyId, $filters);
                return [
                    'mtbf' => $mtbf['summary'],
                    'mttr' => $mttr['summary'],
                ];

            case Widget::SOURCE_WORK_ORDERS:
                return $this->getWorkOrderData($companyId, $filters);

            case Widget::SOURCE_MACHINES:
                return $this->getMachineData($companyId);

            case Widget::SOURCE_SPARE_PARTS:
                return $this->getSparePartsData($companyId);

            case Widget::SOURCE_OEE:
                return $this->getOeeData($companyId, $filters);

            case Widget::SOURCE_COSTS:
                return $this->getCostData($companyId, $filters);

            case Widget::SOURCE_DOWNTIME:
                return $this->getDowntimeData($companyId, $filters);

            case Widget::SOURCE_PREDICTIONS:
                return $this->getPredictionsData($companyId);

            default:
                return [];
        }
    }

    private function getWorkOrderData(int $companyId, array $filters): array
    {
        $query = WorkOrder::where('company_id', $companyId);

        if ($filters['date_from']) {
            $query->where('created_at', '>=', $filters['date_from']);
        }
        if ($filters['date_to']) {
            $query->where('created_at', '<=', $filters['date_to']);
        }

        $total = $query->count();
        $byStatus = (clone $query)->select('status', DB::raw('COUNT(*) as count'))
            ->groupBy('status')
            ->pluck('count', 'status');
        $byType = (clone $query)->select('type', DB::raw('COUNT(*) as count'))
            ->groupBy('type')
            ->pluck('count', 'type');

        return [
            'total' => $total,
            'by_status' => $byStatus,
            'by_type' => $byType,
            'open' => $byStatus['open'] ?? 0,
            'in_progress' => $byStatus['in_progress'] ?? 0,
            'completed' => $byStatus['completed'] ?? 0,
        ];
    }

    private function getMachineData(int $companyId): array
    {
        $machines = Machine::where('company_id', $companyId)->get();

        return [
            'total' => $machines->count(),
            'active' => $machines->where('status', 'active')->count(),
            'under_maintenance' => $machines->where('status', 'under_maintenance')->count(),
            'inactive' => $machines->where('status', 'inactive')->count(),
        ];
    }

    private function getSparePartsData(int $companyId): array
    {
        $parts = SparePart::where('company_id', $companyId)->get();
        $stocks = Stock::whereHas('sparePart', fn($q) => $q->where('company_id', $companyId))->get();

        $lowStock = $parts->filter(function ($part) use ($stocks) {
            $totalStock = $stocks->where('spare_part_id', $part->id)->sum('quantity_on_hand');
            return $totalStock <= $part->reorder_point;
        })->count();

        return [
            'total_parts' => $parts->count(),
            'low_stock' => $lowStock,
            'critical_parts' => $parts->where('is_critical', true)->count(),
            'total_value' => $stocks->sum(fn($s) => $s->quantity_on_hand * ($s->sparePart->unit_cost ?? 0)),
        ];
    }

    private function getOeeData(int $companyId, array $filters): array
    {
        $query = ProductionRun::where('company_id', $companyId)
            ->whereNotNull('oee_pct');

        if ($filters['date_from']) {
            $query->where('start_time', '>=', $filters['date_from']);
        }
        if ($filters['date_to']) {
            $query->where('start_time', '<=', $filters['date_to']);
        }

        $runs = $query->get();

        return [
            'average_oee' => round($runs->avg('oee_pct') ?? 0, 1),
            'average_availability' => round($runs->avg('availability_pct') ?? 0, 1),
            'average_performance' => round($runs->avg('performance_pct') ?? 0, 1),
            'average_quality' => round($runs->avg('quality_pct') ?? 0, 1),
            'total_runs' => $runs->count(),
        ];
    }

    private function getCostData(int $companyId, array $filters): array
    {
        $query = WorkOrder::where('company_id', $companyId)
            ->whereHas('cost');

        if ($filters['date_from']) {
            $query->where('created_at', '>=', $filters['date_from']);
        }
        if ($filters['date_to']) {
            $query->where('created_at', '<=', $filters['date_to']);
        }

        $workOrders = $query->with('cost')->get();

        return [
            'total_cost' => $workOrders->sum(fn($wo) => $wo->cost->total_cost ?? 0),
            'labor_cost' => $workOrders->sum(fn($wo) => $wo->cost->labor_cost ?? 0),
            'parts_cost' => $workOrders->sum(fn($wo) => $wo->cost->parts_cost ?? 0),
            'downtime_cost' => $workOrders->sum(fn($wo) => $wo->cost->downtime_cost ?? 0),
        ];
    }

    private function getDowntimeData(int $companyId, array $filters): array
    {
        $query = \App\Models\Downtime::where('company_id', $companyId)
            ->whereNotNull('end_time');

        if ($filters['date_from']) {
            $query->where('start_time', '>=', $filters['date_from']);
        }
        if ($filters['date_to']) {
            $query->where('start_time', '<=', $filters['date_to']);
        }

        $downtimes = $query->get();
        $totalMinutes = $downtimes->sum('duration_minutes');

        return [
            'total_incidents' => $downtimes->count(),
            'total_hours' => round($totalMinutes / 60, 1),
            'planned' => $downtimes->where('is_planned', true)->count(),
            'unplanned' => $downtimes->where('is_planned', false)->count(),
        ];
    }

    private function getPredictionsData(int $companyId): array
    {
        $machines = Machine::where('company_id', $companyId)
            ->where('status', 'active')
            ->get();

        $predictions = [];
        foreach ($machines->take(5) as $machine) {
            $prediction = $this->analyticsService->generatePredictions($companyId, $machine->id);
            if ($prediction['prediction']) {
                $predictions[] = $prediction;
            }
        }

        usort($predictions, function ($a, $b) {
            return ($a['prediction']['days_until_failure'] ?? 999) <=> ($b['prediction']['days_until_failure'] ?? 999);
        });

        return [
            'predictions' => array_slice($predictions, 0, 5),
            'total_machines' => $machines->count(),
            'machines_at_risk' => count(array_filter($predictions, fn($p) => ($p['prediction']['days_until_failure'] ?? 999) <= 14)),
        ];
    }

    /**
     * Show form to edit a dashboard.
     */
    public function edit(Request $request, Dashboard $dashboard): Response
    {
        $user = $request->user();

        if ($dashboard->created_by !== $user->id) {
            abort(403);
        }

        $dashboard->load('widgets');

        return Inertia::render('dashboards/edit', [
            'dashboard' => $dashboard,
            'widgetTypes' => Widget::getWidgetTypes(),
            'dataSources' => Widget::getDataSources(),
        ]);
    }

    /**
     * Update a dashboard.
     */
    public function update(Request $request, Dashboard $dashboard)
    {
        $user = $request->user();

        if ($dashboard->created_by !== $user->id) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'is_default' => 'boolean',
            'is_shared' => 'boolean',
            'shared_with_role' => 'nullable|in:operator,technician,manager',
        ]);

        if (!empty($validated['is_default']) && !$dashboard->is_default) {
            Dashboard::where('company_id', $user->company_id)
                ->where('created_by', $user->id)
                ->where('is_default', true)
                ->update(['is_default' => false]);
        }

        $dashboard->update($validated);

        return redirect()->back()->with('success', 'Dashboard updated successfully.');
    }

    /**
     * Delete a dashboard.
     */
    public function destroy(Request $request, Dashboard $dashboard)
    {
        $user = $request->user();

        if ($dashboard->created_by !== $user->id) {
            abort(403);
        }

        $dashboard->delete();

        return redirect()->route('dashboards.index')
            ->with('success', 'Dashboard deleted successfully.');
    }

    /**
     * Duplicate a dashboard.
     */
    public function duplicate(Request $request, Dashboard $dashboard)
    {
        $user = $request->user();

        if (!$dashboard->isAccessibleBy($user)) {
            abort(403);
        }

        $newDashboard = $dashboard->duplicate($user);

        return redirect()->route('dashboards.edit', $newDashboard)
            ->with('success', 'Dashboard duplicated successfully.');
    }

    /**
     * Add a widget to a dashboard.
     */
    public function addWidget(Request $request, Dashboard $dashboard)
    {
        $user = $request->user();

        if ($dashboard->created_by !== $user->id) {
            abort(403);
        }

        $validated = $request->validate([
            'widget_type' => 'required|string|in:' . implode(',', array_keys(Widget::getWidgetTypes())),
            'title' => 'required|string|max:255',
            'data_source' => 'required|string|in:' . implode(',', array_keys(Widget::getDataSources())),
            'config' => 'nullable|array',
            'size_width' => 'integer|min:1|max:12',
            'size_height' => 'integer|min:1|max:6',
        ]);

        $maxSortOrder = $dashboard->widgets()->max('sort_order') ?? 0;

        $widget = $dashboard->widgets()->create([
            'widget_type' => $validated['widget_type'],
            'title' => $validated['title'],
            'data_source' => $validated['data_source'],
            'config' => $validated['config'] ?? [],
            'position_x' => 0,
            'position_y' => 0,
            'size_width' => $validated['size_width'] ?? 3,
            'size_height' => $validated['size_height'] ?? 2,
            'sort_order' => $maxSortOrder + 1,
        ]);

        return redirect()->back()->with('success', 'Widget added successfully.');
    }

    /**
     * Remove a widget from a dashboard.
     */
    public function removeWidget(Request $request, Dashboard $dashboard, Widget $widget)
    {
        $user = $request->user();

        if ($dashboard->created_by !== $user->id) {
            abort(403);
        }

        if ($widget->dashboard_id !== $dashboard->id) {
            abort(404);
        }

        $widget->delete();

        return redirect()->back()->with('success', 'Widget removed successfully.');
    }
}
