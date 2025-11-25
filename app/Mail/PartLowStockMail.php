<?php

namespace App\Mail;

use App\Models\SparePart;
use App\Models\User;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class PartLowStockMail extends LocalizedMailable
{
    /**
     * Create a new message instance.
     */
    public function __construct(
        public SparePart $part,
        public User $recipient,
        ?string $locale = null
    ) {
        parent::__construct($locale ?? $recipient->preferred_locale);
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: __('emails.part_low_stock.subject', ['part_name' => $this->part->name]),
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        $stock = $this->part->stocks()->first();
        $quantityAvailable = $stock?->quantity_available ?? 0;

        return new Content(
            view: 'emails.notifications.part-low-stock',
            with: [
                'user_name' => $this->recipient->name,
                'part_id' => $this->part->id,
                'part_name' => $this->part->name,
                'part_number' => $this->part->part_number,
                'quantity_available' => $quantityAvailable,
                'reorder_point' => $this->part->reorder_point,
                'reorder_quantity' => $this->part->reorder_quantity,
                'unit_of_measure' => $this->part->unit_of_measure ?? 'units',
                'unit_cost' => $this->part->unit_cost,
                'category_name' => $this->part->category?->name,
                'supplier_name' => $this->part->supplier?->name,
                'is_critical' => $this->part->is_critical ?? false,
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
