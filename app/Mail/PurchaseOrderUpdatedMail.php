<?php

namespace App\Mail;

use App\Models\PurchaseOrder;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class PurchaseOrderUpdatedMail extends LocalizedMailable
{
    /**
     * Create a new message instance.
     */
    public function __construct(
        public PurchaseOrder $purchaseOrder,
        public ?string $updateMessage = null,
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
            subject: __('emails.vendor.purchase_order_updated.subject', [
                'number' => $this->purchaseOrder->po_number ?? $this->purchaseOrder->id,
            ]),
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.vendor.purchase-order-updated',
            with: [
                'supplier_name' => $this->purchaseOrder->supplier?->name ?? 'Supplier',
                'company_name' => $this->purchaseOrder->company?->name ?? 'Company',
                'po_number' => $this->purchaseOrder->po_number ?? $this->purchaseOrder->id,
                'status' => $this->purchaseOrder->status,
                'total_amount' => $this->purchaseOrder->total_amount ?? 0,
                'expected_delivery_date' => $this->purchaseOrder->expected_delivery_date?->format('M d, Y'),
                'update_message' => $this->updateMessage,
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
