<?php

namespace App\Services;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ExportService
{
    /**
     * Export a query to CSV format with streaming for large datasets.
     *
     * @param string $filename The filename for the download
     * @param Builder|Collection $data The query builder or collection to export
     * @param array $columns Column definitions with 'label' and 'value' keys
     * @return StreamedResponse
     */
    public function csv(string $filename, Builder|Collection $data, array $columns): StreamedResponse
    {
        return response()->stream(function () use ($data, $columns) {
            $handle = fopen('php://output', 'w');

            // Add BOM for Excel UTF-8 compatibility
            fprintf($handle, chr(0xEF) . chr(0xBB) . chr(0xBF));

            // Write headers
            fputcsv($handle, array_column($columns, 'label'));

            // Write data (chunked for memory efficiency if it's a query)
            if ($data instanceof Builder) {
                $data->chunk(1000, function ($rows) use ($handle, $columns) {
                    foreach ($rows as $row) {
                        fputcsv($handle, $this->extractRowData($row, $columns));
                    }
                });
            } else {
                foreach ($data as $row) {
                    fputcsv($handle, $this->extractRowData($row, $columns));
                }
            }

            fclose($handle);
        }, 200, [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0',
        ]);
    }

    /**
     * Export a query to Excel format (XLSX).
     * Requires maatwebsite/excel package.
     *
     * @param string $filename The filename for the download
     * @param Builder|Collection $data The query builder or collection to export
     * @param array $columns Column definitions with 'label' and 'value' keys
     * @return mixed
     */
    public function excel(string $filename, Builder|Collection $data, array $columns)
    {
        // For simplicity, we'll use CSV.
        // To support XLSX, install maatwebsite/excel package
        return $this->csv(str_replace('.xlsx', '.csv', $filename), $data, $columns);
    }

    /**
     * Extract row data based on column definitions.
     *
     * @param mixed $row The model/object to extract data from
     * @param array $columns Column definitions
     * @return array
     */
    protected function extractRowData($row, array $columns): array
    {
        $data = [];

        foreach ($columns as $col) {
            if (is_callable($col['value'])) {
                $data[] = $col['value']($row);
            } elseif (str_contains($col['value'], '.')) {
                // Handle dot notation for relationships (e.g., 'machine.name')
                $data[] = data_get($row, $col['value']) ?? '';
            } else {
                $data[] = $row->{$col['value']} ?? '';
            }
        }

        return $data;
    }

    /**
     * Get common work order export columns.
     *
     * @return array
     */
    public static function workOrderColumns(): array
    {
        return [
            ['label' => 'ID', 'value' => 'id'],
            ['label' => 'Title', 'value' => 'title'],
            ['label' => 'Type', 'value' => fn($wo) => $wo->type->value ?? $wo->type],
            ['label' => 'Status', 'value' => fn($wo) => $wo->status->value ?? $wo->status],
            ['label' => 'Machine', 'value' => 'machine.name'],
            ['label' => 'Machine Code', 'value' => 'machine.code'],
            ['label' => 'Location', 'value' => 'machine.location.name'],
            ['label' => 'Assigned To', 'value' => 'assignee.name'],
            ['label' => 'Created By', 'value' => 'creator.name'],
            ['label' => 'Cause Category', 'value' => 'causeCategory.name'],
            ['label' => 'Description', 'value' => 'description'],
            ['label' => 'Created At', 'value' => fn($wo) => $wo->created_at?->format('Y-m-d H:i:s')],
            ['label' => 'Started At', 'value' => fn($wo) => $wo->started_at?->format('Y-m-d H:i:s')],
            ['label' => 'Completed At', 'value' => fn($wo) => $wo->completed_at?->format('Y-m-d H:i:s')],
            ['label' => 'Downtime (minutes)', 'value' => 'downtime_minutes'],
        ];
    }

    /**
     * Get common machine export columns.
     *
     * @return array
     */
    public static function machineColumns(): array
    {
        return [
            ['label' => 'ID', 'value' => 'id'],
            ['label' => 'Name', 'value' => 'name'],
            ['label' => 'Code', 'value' => 'code'],
            ['label' => 'Location', 'value' => 'location.name'],
            ['label' => 'Status', 'value' => 'status'],
            ['label' => 'Criticality', 'value' => 'criticality'],
            ['label' => 'Hourly Production Value', 'value' => 'hourly_production_value'],
            ['label' => 'Total Work Orders', 'value' => fn($m) => $m->work_orders_count ?? $m->workOrders()->count()],
            ['label' => 'Open Work Orders', 'value' => fn($m) => $m->open_work_orders_count ?? $m->workOrders()->whereIn('status', ['open', 'in_progress'])->count()],
            ['label' => 'Created At', 'value' => fn($m) => $m->created_at?->format('Y-m-d H:i:s')],
        ];
    }

    /**
     * Get common spare part export columns.
     *
     * @return array
     */
    public static function sparePartColumns(): array
    {
        return [
            ['label' => 'ID', 'value' => 'id'],
            ['label' => 'Part Number', 'value' => 'part_number'],
            ['label' => 'Name', 'value' => 'name'],
            ['label' => 'Description', 'value' => 'description'],
            ['label' => 'Category', 'value' => 'category.name'],
            ['label' => 'Supplier', 'value' => 'supplier.name'],
            ['label' => 'Manufacturer', 'value' => 'manufacturer'],
            ['label' => 'Unit of Measure', 'value' => 'unit_of_measure'],
            ['label' => 'Unit Cost', 'value' => 'unit_cost'],
            ['label' => 'Total Stock', 'value' => 'total_quantity_on_hand'],
            ['label' => 'Available Stock', 'value' => 'total_quantity_available'],
            ['label' => 'Reorder Point', 'value' => 'reorder_point'],
            ['label' => 'Reorder Quantity', 'value' => 'reorder_quantity'],
            ['label' => 'Lead Time (days)', 'value' => 'lead_time_days'],
            ['label' => 'Is Critical', 'value' => fn($p) => $p->is_critical ? 'Yes' : 'No'],
            ['label' => 'Status', 'value' => 'status'],
        ];
    }

    /**
     * Get cost report export columns.
     *
     * @return array
     */
    public static function costReportColumns(): array
    {
        return [
            ['label' => 'Work Order ID', 'value' => 'work_order_id'],
            ['label' => 'Work Order Title', 'value' => 'workOrder.title'],
            ['label' => 'Machine', 'value' => 'workOrder.machine.name'],
            ['label' => 'Type', 'value' => fn($c) => $c->workOrder?->type->value ?? ''],
            ['label' => 'Labor Cost', 'value' => 'labor_cost'],
            ['label' => 'Parts Cost', 'value' => 'parts_cost'],
            ['label' => 'External Service Cost', 'value' => 'external_service_cost'],
            ['label' => 'Downtime Cost', 'value' => 'downtime_cost'],
            ['label' => 'Total Cost', 'value' => 'total_cost'],
            ['label' => 'Completed At', 'value' => fn($c) => $c->workOrder?->completed_at?->format('Y-m-d H:i:s')],
        ];
    }

    /**
     * Get preventive task export columns.
     *
     * @return array
     */
    public static function preventiveTaskColumns(): array
    {
        return [
            ['label' => 'ID', 'value' => 'id'],
            ['label' => 'Title', 'value' => 'title'],
            ['label' => 'Description', 'value' => 'description'],
            ['label' => 'Machine', 'value' => 'machine.name'],
            ['label' => 'Machine Code', 'value' => 'machine.code'],
            ['label' => 'Assigned To', 'value' => 'assignee.name'],
            ['label' => 'Schedule Interval', 'value' => fn($t) => $t->schedule_interval_value . ' ' . $t->schedule_interval_unit],
            ['label' => 'Next Due Date', 'value' => fn($t) => $t->next_due_date?->format('Y-m-d')],
            ['label' => 'Last Completed At', 'value' => fn($t) => $t->last_completed_at?->format('Y-m-d H:i:s')],
            ['label' => 'Is Active', 'value' => fn($t) => $t->is_active ? 'Yes' : 'No'],
            ['label' => 'Created At', 'value' => fn($t) => $t->created_at?->format('Y-m-d H:i:s')],
        ];
    }
}
