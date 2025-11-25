<?php

namespace App\Mail;

use App\Models\PurchaseOrder;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class NewPurchaseOrderMail extends LocalizedMailable
{
    /**
     * Create a new message instance.
     */
    public function __construct(
        public PurchaseOrder $purchaseOrder,
        ?string $locale = null
    ) {
        parent::__construct($locale ?? config('app.locale'));
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: __('emails.vendor.new_purchase_order.subject', [
                'number' => $this->purchaseOrder->po_number ?? $this->purchaseOrder->id,
                'company' => $this->purchaseOrder->company?->name ?? 'Company',
            ]),
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        $items = $this->purchaseOrder->items->map(function ($item) {
            return [
                'part_number' => $item->sparePart?->part_number ?? 'N/A',
                'name' => $item->sparePart?->name ?? 'Unknown Part',
                'quantity' => $item->quantity,
                'unit_price' => $item->unit_price,
                'total_price' => $item->quantity * $item->unit_price,
            ];
        })->toArray();

        return new Content(
            view: 'emails.vendor.new-purchase-order',
            with: [
                'supplier_name' => $this->purchaseOrder->supplier?->name ?? 'Supplier',
                'company_name' => $this->purchaseOrder->company?->name ?? 'Company',
                'po_number' => $this->purchaseOrder->po_number ?? $this->purchaseOrder->id,
                'total_amount' => $this->purchaseOrder->total_amount ?? 0,
                'items_count' => $this->purchaseOrder->items->count(),
                'items' => $items,
                'expected_delivery_date' => $this->purchaseOrder->expected_delivery_date?->format('M d, Y'),
                'notes' => $this->purchaseOrder->notes,
                'created_at' => $this->purchaseOrder->created_at?->format('M d, Y H:i'),
                'portal_url' => config('app.url') . '/vendor/purchase-orders/' . $this->purchaseOrder->id,
            ],
        );
    }

    /**
     * Build the localized message content.
     */
    protected function buildLocalizedMessage(): void
    {
        // Locale is already set by parent class
    }
}
