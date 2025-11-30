<?php

namespace App\Http\Controllers;

use App\Models\Machine;
use App\Models\PreventiveTask;
use App\Models\SparePart;
use App\Models\WorkOrder;
use App\Models\WorkOrderCost;
use App\Services\ExportService;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ExportController extends Controller
{
    public function __construct(
        protected ExportService $exportService
    ) {}

    /**
     * Export work orders to CSV.
     */
    public function workOrders(Request $request): StreamedResponse
    {
        $user = $request->user();

        $query = WorkOrder::query()
            ->with(['machine.location', 'assignee', 'creator', 'causeCategory'])
            ->where('company_id', $user->company_id)
            ->when($request->status, fn($q, $status) => $q->where('status', $status))
            ->when($request->type, fn($q, $type) => $q->where('type', $type))
            ->when($request->machine_id, fn($q, $id) => $q->where('machine_id', $id))
            ->when($request->assigned_to, fn($q, $id) => $q->where('assigned_to', $id))
            ->when($request->date_from, fn($q, $date) => $q->whereDate('created_at', '>=', $date))
            ->when($request->date_to, fn($q, $date) => $q->whereDate('created_at', '<=', $date))
            ->orderBy('created_at', 'desc');

        $filename = 'work-orders-' . now()->format('Y-m-d-His') . '.csv';

        return $this->exportService->csv($filename, $query, ExportService::workOrderColumns());
    }

    /**
     * Export machines to CSV.
     */
    public function machines(Request $request): StreamedResponse
    {
        $user = $request->user();

        $query = Machine::query()
            ->with(['location'])
            ->withCount(['workOrders', 'workOrders as open_work_orders_count' => function ($q) {
                $q->whereIn('status', ['open', 'in_progress']);
            }])
            ->where('company_id', $user->company_id)
            ->when($request->status, fn($q, $status) => $q->where('status', $status))
            ->when($request->location_id, fn($q, $id) => $q->where('location_id', $id))
            ->when($request->criticality, fn($q, $crit) => $q->where('criticality', $crit))
            ->orderBy('name');

        $filename = 'machines-' . now()->format('Y-m-d-His') . '.csv';

        return $this->exportService->csv($filename, $query, ExportService::machineColumns());
    }

    /**
     * Export spare parts to CSV.
     */
    public function spareParts(Request $request): StreamedResponse
    {
        $user = $request->user();

        $query = SparePart::query()
            ->with(['category', 'supplier', 'stocks'])
            ->where('company_id', $user->company_id)
            ->when($request->status, fn($q, $status) => $q->where('status', $status))
            ->when($request->category_id, fn($q, $id) => $q->where('category_id', $id))
            ->when($request->supplier_id, fn($q, $id) => $q->where('supplier_id', $id))
            ->when($request->is_critical !== null, fn($q) => $q->where('is_critical', $request->boolean('is_critical')))
            ->when($request->low_stock, fn($q) => $q->lowStock())
            ->orderBy('name');

        $filename = 'spare-parts-' . now()->format('Y-m-d-His') . '.csv';

        return $this->exportService->csv($filename, $query, ExportService::sparePartColumns());
    }

    /**
     * Export cost report to CSV.
     */
    public function costs(Request $request): StreamedResponse
    {
        $user = $request->user();

        $query = WorkOrderCost::query()
            ->with(['workOrder.machine', 'workOrder'])
            ->whereHas('workOrder', function ($q) use ($user, $request) {
                $q->where('company_id', $user->company_id);

                if ($request->date_from) {
                    $q->whereDate('completed_at', '>=', $request->date_from);
                }
                if ($request->date_to) {
                    $q->whereDate('completed_at', '<=', $request->date_to);
                }
                if ($request->machine_id) {
                    $q->where('machine_id', $request->machine_id);
                }
                if ($request->type) {
                    $q->where('type', $request->type);
                }
            })
            ->orderBy('created_at', 'desc');

        $filename = 'cost-report-' . now()->format('Y-m-d-His') . '.csv';

        return $this->exportService->csv($filename, $query, ExportService::costReportColumns());
    }

    /**
     * Export preventive tasks to CSV.
     */
    public function preventiveTasks(Request $request): StreamedResponse
    {
        $user = $request->user();

        $query = PreventiveTask::query()
            ->with(['machine', 'assignee'])
            ->where('company_id', $user->company_id)
            ->when($request->is_active !== null, fn($q) => $q->where('is_active', $request->boolean('is_active')))
            ->when($request->machine_id, fn($q, $id) => $q->where('machine_id', $id))
            ->when($request->assigned_to, fn($q, $id) => $q->where('assigned_to', $id))
            ->when($request->overdue, fn($q) => $q->overdue())
            ->orderBy('next_due_date');

        $filename = 'preventive-tasks-' . now()->format('Y-m-d-His') . '.csv';

        return $this->exportService->csv($filename, $query, ExportService::preventiveTaskColumns());
    }
}
