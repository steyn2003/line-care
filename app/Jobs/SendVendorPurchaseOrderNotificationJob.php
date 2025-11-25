<?php

namespace App\Jobs;

use App\Models\PurchaseOrder;
use App\Services\VendorNotificationService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class SendVendorPurchaseOrderNotificationJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The number of times the job may be attempted.
     */
    public int $tries = 3;

    /**
     * The number of seconds to wait before retrying the job.
     */
    public int $backoff = 60;

    /**
     * Create a new job instance.
     *
     * @param PurchaseOrder $purchaseOrder The purchase order
     * @param string $notificationType Type: 'new' or 'updated'
     * @param string $updateMessage Optional message for updates
     */
    public function __construct(
        public PurchaseOrder $purchaseOrder,
        public string $notificationType = 'new',
        public string $updateMessage = ''
    ) {}

    /**
     * Execute the job.
     */
    public function handle(VendorNotificationService $notificationService): void
    {
        Log::info("Processing vendor notification job", [
            'purchase_order_id' => $this->purchaseOrder->id,
            'type' => $this->notificationType,
        ]);

        $success = match ($this->notificationType) {
            'new' => $notificationService->notifyNewPurchaseOrder($this->purchaseOrder),
            'updated' => $notificationService->notifyPurchaseOrderUpdated($this->purchaseOrder, $this->updateMessage),
            default => false,
        };

        Log::info("Vendor notification job completed", [
            'purchase_order_id' => $this->purchaseOrder->id,
            'type' => $this->notificationType,
            'success' => $success,
        ]);
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error("Vendor notification job failed", [
            'purchase_order_id' => $this->purchaseOrder->id,
            'type' => $this->notificationType,
            'error' => $exception->getMessage(),
        ]);
    }
}
