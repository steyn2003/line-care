<?php

namespace App\Services;

use App\Models\PurchaseOrder;
use App\Models\Supplier;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class VendorNotificationService
{
    /**
     * Send notification to vendor about a new purchase order.
     */
    public function notifyNewPurchaseOrder(PurchaseOrder $purchaseOrder): bool
    {
        $supplier = $purchaseOrder->supplier;

        if (!$supplier || !$supplier->email) {
            Log::info('Cannot send vendor notification: supplier has no email', [
                'purchase_order_id' => $purchaseOrder->id,
                'supplier_id' => $purchaseOrder->supplier_id,
            ]);
            return false;
        }

        $purchaseOrder->load(['spareParts', 'company']);

        $data = $this->preparePurchaseOrderData($purchaseOrder, $supplier);

        try {
            Mail::send('emails.vendor.new-purchase-order', $data, function ($message) use ($supplier, $purchaseOrder) {
                $message->to($supplier->email, $supplier->name)
                    ->subject("New Purchase Order: {$purchaseOrder->po_number}");
            });

            Log::info('Vendor notification sent for new purchase order', [
                'purchase_order_id' => $purchaseOrder->id,
                'supplier_email' => $supplier->email,
            ]);

            return true;
        } catch (\Exception $e) {
            Log::error('Failed to send vendor notification', [
                'purchase_order_id' => $purchaseOrder->id,
                'supplier_email' => $supplier->email,
                'error' => $e->getMessage(),
            ]);

            return false;
        }
    }

    /**
     * Send notification to vendor about a purchase order update.
     */
    public function notifyPurchaseOrderUpdated(PurchaseOrder $purchaseOrder, string $updateMessage = ''): bool
    {
        $supplier = $purchaseOrder->supplier;

        if (!$supplier || !$supplier->email) {
            return false;
        }

        $data = [
            'supplier_name' => $supplier->name,
            'company_name' => $purchaseOrder->company->name ?? 'Unknown',
            'po_number' => $purchaseOrder->po_number,
            'status' => $purchaseOrder->status,
            'total_amount' => $purchaseOrder->total_amount,
            'expected_delivery_date' => $purchaseOrder->expected_delivery_date?->format('M d, Y'),
            'update_message' => $updateMessage,
            'portal_url' => config('app.url') . '/vendor-portal',
        ];

        try {
            Mail::send('emails.vendor.purchase-order-updated', $data, function ($message) use ($supplier, $purchaseOrder) {
                $message->to($supplier->email, $supplier->name)
                    ->subject("Purchase Order Updated: {$purchaseOrder->po_number}");
            });

            Log::info('Vendor notification sent for purchase order update', [
                'purchase_order_id' => $purchaseOrder->id,
                'supplier_email' => $supplier->email,
            ]);

            return true;
        } catch (\Exception $e) {
            Log::error('Failed to send vendor update notification', [
                'purchase_order_id' => $purchaseOrder->id,
                'error' => $e->getMessage(),
            ]);

            return false;
        }
    }

    /**
     * Prepare purchase order data for email template.
     */
    protected function preparePurchaseOrderData(PurchaseOrder $purchaseOrder, Supplier $supplier): array
    {
        $items = $purchaseOrder->spareParts->map(function ($part) {
            return [
                'part_number' => $part->part_number,
                'name' => $part->name,
                'quantity' => $part->pivot->quantity,
                'unit_price' => $part->pivot->unit_price,
                'total_price' => $part->pivot->quantity * $part->pivot->unit_price,
            ];
        })->toArray();

        return [
            'supplier_name' => $supplier->name,
            'company_name' => $purchaseOrder->company->name ?? 'Unknown',
            'po_number' => $purchaseOrder->po_number,
            'total_amount' => $purchaseOrder->total_amount,
            'items_count' => count($items),
            'expected_delivery_date' => $purchaseOrder->expected_delivery_date?->format('M d, Y'),
            'created_at' => $purchaseOrder->created_at->format('M d, Y H:i'),
            'notes' => $purchaseOrder->notes,
            'items' => $items,
            'portal_url' => config('app.url') . '/vendor-portal',
        ];
    }
}
