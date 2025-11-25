<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Dashboard;
use App\Models\Widget;
use App\Services\AnalyticsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class WidgetController extends Controller
{
    public function __construct(
        private AnalyticsService $analyticsService
    ) {}

    /**
     * Get available widget types and data sources.
     *
     * GET /api/widgets/options
     */
    public function options(): JsonResponse
    {
        return response()->json([
            'widget_types' => Widget::getWidgetTypes(),
            'data_sources' => Widget::getDataSources(),
        ]);
    }

    /**
     * Create a new widget.
     *
     * POST /api/dashboards/{dashboard}/widgets
     */
    public function store(Request $request, Dashboard $dashboard): JsonResponse
    {
        $user = $request->user();

        // Only dashboard creator can add widgets
        if ($dashboard->created_by !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'widget_type' => 'required|in:' . implode(',', array_keys(Widget::getWidgetTypes())),
            'title' => 'required|string|max:255',
            'data_source' => 'required|in:' . implode(',', array_keys(Widget::getDataSources())),
            'config' => 'nullable|array',
            'position_x' => 'integer|min:0',
            'position_y' => 'integer|min:0',
            'size_width' => 'integer|min:1|max:12',
            'size_height' => 'integer|min:1|max:12',
        ]);

        // Get next sort order
        $maxOrder = $dashboard->widgets()->max('sort_order') ?? -1;

        $widget = $dashboard->widgets()->create([
            'widget_type' => $validated['widget_type'],
            'title' => $validated['title'],
            'data_source' => $validated['data_source'],
            'config' => $validated['config'] ?? [],
            'position_x' => $validated['position_x'] ?? 0,
            'position_y' => $validated['position_y'] ?? 0,
            'size_width' => $validated['size_width'] ?? 4,
            'size_height' => $validated['size_height'] ?? 2,
            'sort_order' => $maxOrder + 1,
        ]);

        return response()->json([
            'message' => 'Widget created successfully',
            'widget' => $widget,
        ], 201);
    }

    /**
     * Update a widget.
     *
     * PUT /api/widgets/{widget}
     */
    public function update(Request $request, Widget $widget): JsonResponse
    {
        $user = $request->user();
        $dashboard = $widget->dashboard;

        // Only dashboard creator can update widgets
        if ($dashboard->created_by !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'widget_type' => 'sometimes|in:' . implode(',', array_keys(Widget::getWidgetTypes())),
            'title' => 'sometimes|string|max:255',
            'data_source' => 'sometimes|in:' . implode(',', array_keys(Widget::getDataSources())),
            'config' => 'nullable|array',
            'position_x' => 'integer|min:0',
            'position_y' => 'integer|min:0',
            'size_width' => 'integer|min:1|max:12',
            'size_height' => 'integer|min:1|max:12',
            'sort_order' => 'integer|min:0',
        ]);

        $widget->update($validated);

        return response()->json([
            'message' => 'Widget updated successfully',
            'widget' => $widget->fresh(),
        ]);
    }

    /**
     * Delete a widget.
     *
     * DELETE /api/widgets/{widget}
     */
    public function destroy(Request $request, Widget $widget): JsonResponse
    {
        $user = $request->user();
        $dashboard = $widget->dashboard;

        // Only dashboard creator can delete widgets
        if ($dashboard->created_by !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $widget->delete();

        return response()->json([
            'message' => 'Widget deleted successfully',
        ]);
    }

    /**
     * Get data for a specific widget.
     *
     * GET /api/widgets/{widget}/data
     */
    public function data(Request $request, Widget $widget): JsonResponse
    {
        $user = $request->user();
        $dashboard = $widget->dashboard;

        // Check access
        if (!$dashboard->isAccessibleBy($user)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $companyId = $user->company_id;
        $config = $widget->config ?? [];
        $dateFrom = $config['date_from'] ?? now()->subMonths(6)->toDateString();
        $dateTo = $config['date_to'] ?? now()->toDateString();

        $data = $this->getWidgetData($widget, $companyId, $dateFrom, $dateTo);

        return response()->json([
            'widget_id' => $widget->id,
            'data' => $data,
        ]);
    }

    /**
     * Get data based on widget configuration.
     */
    private function getWidgetData(Widget $widget, int $companyId, string $dateFrom, string $dateTo): array
    {
        $config = $widget->config ?? [];
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
                    'machines' => [
                        'mtbf' => array_slice($mtbf['machines'], 0, 10),
                        'mttr' => array_slice($mttr['machines'], 0, 10),
                    ],
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
        $query = \App\Models\WorkOrder::where('company_id', $companyId);

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
        $machines = \App\Models\Machine::where('company_id', $companyId)->get();

        return [
            'total' => $machines->count(),
            'active' => $machines->where('status', 'active')->count(),
            'under_maintenance' => $machines->where('status', 'under_maintenance')->count(),
            'inactive' => $machines->where('status', 'inactive')->count(),
        ];
    }

    private function getSparePartsData(int $companyId): array
    {
        $parts = \App\Models\SparePart::where('company_id', $companyId)->get();
        $stocks = \App\Models\Stock::whereHas('sparePart', fn($q) => $q->where('company_id', $companyId))->get();

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
        $query = \App\Models\ProductionRun::where('company_id', $companyId)
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
        $query = \App\Models\WorkOrderCost::whereHas('workOrder', fn($q) => $q->where('company_id', $companyId));

        if ($filters['date_from']) {
            $query->whereHas('workOrder', fn($q) => $q->where('created_at', '>=', $filters['date_from']));
        }
        if ($filters['date_to']) {
            $query->whereHas('workOrder', fn($q) => $q->where('created_at', '<=', $filters['date_to']));
        }

        $costs = $query->get();

        return [
            'total_cost' => round($costs->sum('total_cost'), 2),
            'labor_cost' => round($costs->sum('labor_cost'), 2),
            'parts_cost' => round($costs->sum('parts_cost'), 2),
            'downtime_cost' => round($costs->sum('downtime_cost'), 2),
            'external_cost' => round($costs->sum('external_service_cost'), 2),
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

        $downtimes = $query->with('category')->get();

        $totalMinutes = $downtimes->sum('duration_minutes');
        $planned = $downtimes->filter(fn($d) => $d->category?->category_type === 'planned')->sum('duration_minutes');
        $unplanned = $downtimes->filter(fn($d) => $d->category?->category_type === 'unplanned')->sum('duration_minutes');

        return [
            'total_hours' => round($totalMinutes / 60, 1),
            'planned_hours' => round($planned / 60, 1),
            'unplanned_hours' => round($unplanned / 60, 1),
            'events_count' => $downtimes->count(),
        ];
    }

    private function getPredictionsData(int $companyId): array
    {
        $predictions = \App\Models\FailurePrediction::where('company_id', $companyId)
            ->where('status', 'active')
            ->orderBy('days_until_failure')
            ->limit(10)
            ->with('machine:id,name')
            ->get();

        return [
            'total_active' => $predictions->count(),
            'critical' => $predictions->where('severity', 'critical')->count(),
            'high' => $predictions->where('severity', 'high')->count(),
            'predictions' => $predictions->map(fn($p) => [
                'machine' => $p->machine?->name,
                'days_until_failure' => $p->days_until_failure,
                'probability' => $p->probability,
                'severity' => $p->severity,
            ]),
        ];
    }
}
