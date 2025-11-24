<?php

namespace App\Console\Commands;

use App\Models\Integration;
use App\Services\Integrations\ErpIntegration;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class SyncErpIntegrations extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'linecare:sync-erp-integrations
                            {--company= : Sync only for specific company ID}
                            {--integration= : Sync only specific integration ID}
                            {--action=all : Sync action: all, inventory, purchase_orders, work_order_costs}';

    /**
     * The console command description.
     */
    protected $description = 'Sync data with ERP systems (inventory, purchase orders, work order costs)';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('Starting ERP integration sync...');

        // Build query for integrations to sync
        $query = Integration::where('integration_type', 'erp')
            ->where('is_enabled', true);

        // Filter by company if specified
        if ($companyId = $this->option('company')) {
            $query->where('company_id', $companyId);
            $this->info("Filtering by company ID: {$companyId}");
        }

        // Filter by specific integration if specified
        if ($integrationId = $this->option('integration')) {
            $query->where('id', $integrationId);
            $this->info("Filtering by integration ID: {$integrationId}");
        }

        $integrations = $query->get();

        if ($integrations->isEmpty()) {
            $this->info('No enabled ERP integrations found.');
            return Command::SUCCESS;
        }

        $this->info("Found {$integrations->count()} ERP integration(s) to sync.");

        $action = $this->option('action');
        $successCount = 0;
        $failureCount = 0;

        foreach ($integrations as $integration) {
            try {
                // Check if integration is ready to sync
                if (!$integration->canSync()) {
                    $this->warn("Integration #{$integration->id} cannot sync (disabled or not configured)");
                    continue;
                }

                // Check sync frequency (don't sync too frequently)
                if (!$this->shouldSync($integration)) {
                    $this->info("Integration #{$integration->id} was synced recently, skipping...");
                    continue;
                }

                $this->info("Syncing integration #{$integration->id} ({$integration->provider})...");

                // Create ERP integration service instance
                $erpService = new ErpIntegration($integration);

                // Test connection first
                if (!$erpService->testConnection()) {
                    $this->error("Connection test failed for integration #{$integration->id}");
                    $failureCount++;
                    continue;
                }

                // Perform sync based on action
                $syncResults = [];

                if ($action === 'all' || $action === 'inventory') {
                    $this->info('  - Syncing inventory...');
                    $inventoryResult = $erpService->sync(['action' => 'inventory']);
                    $syncResults['inventory'] = $inventoryResult;

                    if ($inventoryResult['success']) {
                        $this->info("    ✓ Inventory synced: {$inventoryResult['records_processed']} records processed");
                    } else {
                        $this->error("    ✗ Inventory sync failed: {$inventoryResult['message']}");
                    }
                }

                if ($action === 'all' || $action === 'purchase_orders') {
                    $this->info('  - Syncing purchase orders...');
                    $poResult = $erpService->sync(['action' => 'purchase_orders']);
                    $syncResults['purchase_orders'] = $poResult;

                    if ($poResult['success']) {
                        $this->info("    ✓ Purchase orders synced: {$poResult['records_processed']} records processed");
                    } else {
                        $this->error("    ✗ Purchase order sync failed: {$poResult['message']}");
                    }
                }

                if ($action === 'all' || $action === 'work_order_costs') {
                    $this->info('  - Syncing work order costs...');
                    $costsResult = $erpService->sync(['action' => 'work_order_costs']);
                    $syncResults['work_order_costs'] = $costsResult;

                    if ($costsResult['success']) {
                        $this->info("    ✓ Work order costs synced: {$costsResult['records_processed']} records processed");
                    } else {
                        $this->error("    ✗ Work order costs sync failed: {$costsResult['message']}");
                    }
                }

                // Check if any sync succeeded
                $anySuccess = collect($syncResults)->contains('success', true);

                if ($anySuccess) {
                    $successCount++;
                    $this->info("✓ Integration #{$integration->id} synced successfully");
                } else {
                    $failureCount++;
                    $this->error("✗ All sync actions failed for integration #{$integration->id}");
                }

                Log::info("ERP sync completed", [
                    'integration_id' => $integration->id,
                    'action' => $action,
                    'results' => $syncResults
                ]);

            } catch (\Exception $e) {
                $failureCount++;
                $this->error("Failed to sync integration #{$integration->id}: {$e->getMessage()}");

                Log::error("ERP sync failed", [
                    'integration_id' => $integration->id,
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]);

                // Mark integration as failed
                $integration->markSyncError($e->getMessage());
            }
        }

        $this->info("\nSync summary:");
        $this->info("  - Successful: {$successCount}");
        $this->info("  - Failed: {$failureCount}");

        return $failureCount === 0 ? Command::SUCCESS : Command::FAILURE;
    }

    /**
     * Check if integration should sync based on sync frequency
     */
    protected function shouldSync(Integration $integration): bool
    {
        // If never synced, should sync
        if (!$integration->last_sync_at) {
            return true;
        }

        // If sync frequency is not set, default to hourly
        $frequency = $integration->sync_frequency ?? 'hourly';

        $lastSync = $integration->last_sync_at;
        $now = now();

        switch ($frequency) {
            case 'real_time':
            case 'manual':
                // Real-time and manual sync always allowed
                return true;

            case 'hourly':
                return $now->diffInHours($lastSync) >= 1;

            case 'daily':
                return $now->diffInDays($lastSync) >= 1;

            case 'weekly':
                return $now->diffInWeeks($lastSync) >= 1;

            default:
                // Unknown frequency, default to hourly
                return $now->diffInHours($lastSync) >= 1;
        }
    }
}
