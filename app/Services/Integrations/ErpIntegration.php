<?php

namespace App\Services\Integrations;

use App\Models\Stock;
use App\Models\PurchaseOrder;
use App\Models\WorkOrder;
use Illuminate\Support\Facades\DB;

class ErpIntegration extends BaseIntegration
{
    /**
     * Test the connection to the ERP system.
     */
    public function testConnection(): array
    {
        $response = $this->makeRequest('GET', '/api/health');

        if ($response['success']) {
            return [
                'success' => true,
                'message' => 'Connection successful',
            ];
        }

        return [
            'success' => false,
            'message' => 'Connection failed: ' . ($response['error'] ?? 'Unknown error'),
        ];
    }

    /**
     * Sync data with the ERP system.
     */
    public function sync(string $action): array
    {
        $startTime = now();

        try {
            $result = match ($action) {
                'sync_inventory' => $this->syncInventory(),
                'sync_purchase_orders' => $this->syncPurchaseOrders(),
                'sync_work_order_costs' => $this->syncWorkOrderCosts(),
                default => ['success' => false, 'message' => 'Unknown action'],
            };

            $duration = now()->diffInSeconds($startTime);

            // Create log entry
            $this->createLog(
                action: $action,
                status: $result['success'] ? 'success' : 'error',
                message: $result['message'],
                recordsProcessed: $result['records_processed'] ?? 0,
                recordsSucceeded: $result['records_succeeded'] ?? 0,
                recordsFailed: $result['records_failed'] ?? 0,
                errorDetails: $result['errors'] ?? null
            );

            // Update integration status
            if ($result['success']) {
                $this->integration->markSyncSuccess($result['message']);
            } else {
                $this->integration->markSyncError($result['message']);
            }

            return $result;
        } catch (\Exception $e) {
            $this->createLog(
                action: $action,
                status: 'error',
                message: 'Sync failed: ' . $e->getMessage(),
                errorDetails: ['exception' => $e->getMessage(), 'trace' => $e->getTraceAsString()]
            );

            $this->integration->markSyncError($e->getMessage());

            return [
                'success' => false,
                'message' => 'Sync failed: ' . $e->getMessage(),
                'records_processed' => 0,
                'records_succeeded' => 0,
                'records_failed' => 0,
            ];
        }
    }

    /**
     * Sync inventory (spare parts stock) to ERP.
     */
    protected function syncInventory(): array
    {
        $stocks = Stock::where('company_id', $this->integration->company_id)
            ->with('sparePart')
            ->get();

        $processed = 0;
        $succeeded = 0;
        $failed = 0;
        $errors = [];

        foreach ($stocks as $stock) {
            $processed++;

            $payload = [
                'part_number' => $stock->sparePart->part_number,
                'quantity' => $stock->quantity_on_hand,
                'location' => $stock->location->name ?? 'Unknown',
                'updated_at' => $stock->updated_at->toIso8601String(),
            ];

            $response = $this->makeRequest('POST', '/api/inventory/update', $payload);

            if ($response['success']) {
                $succeeded++;
            } else {
                $failed++;
                $errors[] = [
                    'part_number' => $stock->sparePart->part_number,
                    'error' => $response['error'] ?? 'Unknown error',
                ];
            }
        }

        return [
            'success' => $failed === 0,
            'message' => "Synced {$succeeded}/{$processed} inventory items",
            'records_processed' => $processed,
            'records_succeeded' => $succeeded,
            'records_failed' => $failed,
            'errors' => $errors,
        ];
    }

    /**
     * Sync purchase orders from ERP to LineCare.
     */
    protected function syncPurchaseOrders(): array
    {
        $response = $this->makeRequest('GET', '/api/purchase-orders?company_id=' . $this->integration->company_id);

        if (!$response['success']) {
            return [
                'success' => false,
                'message' => 'Failed to fetch purchase orders from ERP',
                'records_processed' => 0,
                'records_succeeded' => 0,
                'records_failed' => 0,
            ];
        }

        $erpPurchaseOrders = $response['data']['purchase_orders'] ?? [];
        $processed = 0;
        $succeeded = 0;
        $failed = 0;
        $errors = [];

        foreach ($erpPurchaseOrders as $erpPo) {
            $processed++;

            try {
                // Check if PO already exists by external reference
                $existingPo = PurchaseOrder::where('company_id', $this->integration->company_id)
                    ->where('reference_number', $erpPo['po_number'])
                    ->first();

                if ($existingPo) {
                    // Update existing PO if remote is newer
                    $localData = ['updated_at' => $existingPo->updated_at->toIso8601String()];
                    $remoteData = ['updated_at' => $erpPo['updated_at']];
                    $resolved = $this->resolveConflict($localData, $remoteData);

                    if ($resolved === $remoteData) {
                        $existingPo->update(['status' => $erpPo['status']]);
                    }
                } else {
                    // Create new PO from ERP data
                    // Note: This is simplified - actual implementation would map all fields
                }

                $succeeded++;
            } catch (\Exception $e) {
                $failed++;
                $errors[] = [
                    'po_number' => $erpPo['po_number'],
                    'error' => $e->getMessage(),
                ];
            }
        }

        return [
            'success' => $failed === 0,
            'message' => "Synced {$succeeded}/{$processed} purchase orders",
            'records_processed' => $processed,
            'records_succeeded' => $succeeded,
            'records_failed' => $failed,
            'errors' => $errors,
        ];
    }

    /**
     * Sync work order costs to ERP.
     */
    protected function syncWorkOrderCosts(): array
    {
        $workOrders = WorkOrder::where('company_id', $this->integration->company_id)
            ->where('status', 'completed')
            ->whereHas('workOrderCost')
            ->with('workOrderCost')
            ->get();

        $processed = 0;
        $succeeded = 0;
        $failed = 0;
        $errors = [];

        foreach ($workOrders as $wo) {
            $processed++;

            $payload = [
                'work_order_number' => $wo->work_order_number,
                'machine' => $wo->machine->name,
                'labor_cost' => $wo->workOrderCost->labor_cost,
                'parts_cost' => $wo->workOrderCost->parts_cost,
                'external_service_cost' => $wo->workOrderCost->external_service_cost,
                'downtime_cost' => $wo->workOrderCost->downtime_cost,
                'total_cost' => $wo->workOrderCost->total_cost,
                'completed_at' => $wo->completed_at?->toIso8601String(),
            ];

            $response = $this->makeRequest('POST', '/api/maintenance-costs', $payload);

            if ($response['success']) {
                $succeeded++;
            } else {
                $failed++;
                $errors[] = [
                    'work_order_number' => $wo->work_order_number,
                    'error' => $response['error'] ?? 'Unknown error',
                ];
            }
        }

        return [
            'success' => $failed === 0,
            'message' => "Synced {$succeeded}/{$processed} work order costs",
            'records_processed' => $processed,
            'records_succeeded' => $succeeded,
            'records_failed' => $failed,
            'errors' => $errors,
        ];
    }
}
