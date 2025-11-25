<?php

namespace App\Jobs;

use App\Models\Integration;
use App\Services\Integrations\ErpIntegration;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class SyncErpIntegrationJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The number of times the job may be attempted.
     */
    public int $tries = 3;

    /**
     * The number of seconds to wait before retrying the job.
     */
    public int $backoff = 120;

    /**
     * The number of seconds the job can run before timing out.
     */
    public int $timeout = 300;

    /**
     * Create a new job instance.
     *
     * @param Integration $integration The integration to sync
     * @param string $action The sync action (sync_inventory, sync_purchase_orders, sync_work_order_costs, all)
     */
    public function __construct(
        public Integration $integration,
        public string $action = 'all'
    ) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        Log::info("Starting ERP sync job", [
            'integration_id' => $this->integration->id,
            'action' => $this->action,
        ]);

        if (!$this->integration->is_enabled) {
            Log::info("Integration is disabled, skipping sync", [
                'integration_id' => $this->integration->id,
            ]);
            return;
        }

        $erpIntegration = new ErpIntegration($this->integration);

        if ($this->action === 'all') {
            $actions = ['sync_inventory', 'sync_purchase_orders', 'sync_work_order_costs'];
        } else {
            $actions = [$this->action];
        }

        $results = [];
        foreach ($actions as $action) {
            $result = $erpIntegration->sync($action);
            $results[$action] = $result;

            Log::info("ERP sync action completed", [
                'integration_id' => $this->integration->id,
                'action' => $action,
                'success' => $result['success'],
                'message' => $result['message'],
            ]);
        }

        Log::info("ERP sync job completed", [
            'integration_id' => $this->integration->id,
            'results' => $results,
        ]);
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error("ERP sync job failed", [
            'integration_id' => $this->integration->id,
            'action' => $this->action,
            'error' => $exception->getMessage(),
        ]);

        $this->integration->markSyncError($exception->getMessage());
    }

    /**
     * Determine the time at which the job should timeout.
     */
    public function retryUntil(): \DateTime
    {
        return now()->addHours(1);
    }
}
