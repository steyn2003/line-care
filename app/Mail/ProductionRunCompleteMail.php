<?php

namespace App\Mail;

use App\Models\ProductionRun;
use App\Models\User;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class ProductionRunCompleteMail extends LocalizedMailable
{
    /**
     * Create a new message instance.
     */
    public function __construct(
        public ProductionRun $productionRun,
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
            subject: __('emails.production_run_complete.subject', [
                'product' => $this->productionRun->product?->name ?? 'Product',
                'machine' => $this->productionRun->machine?->name ?? 'Machine',
            ]),
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        $duration = $this->productionRun->started_at && $this->productionRun->ended_at
            ? $this->productionRun->started_at->diffForHumans($this->productionRun->ended_at, true)
            : 'N/A';

        return new Content(
            view: 'emails.notifications.production-run-complete',
            with: [
                'user_name' => $this->recipient->name,
                'production_run_id' => $this->productionRun->id,
                'machine_name' => $this->productionRun->machine?->name ?? 'N/A',
                'product_name' => $this->productionRun->product?->name,
                'shift_name' => $this->productionRun->shift?->name,
                'duration' => $duration,
                'target_quantity' => $this->productionRun->target_quantity,
                'actual_output' => $this->productionRun->actual_output,
                'good_output' => $this->productionRun->good_output,
                'defects' => $this->productionRun->defects,
                'availability' => $this->productionRun->availability,
                'performance' => $this->productionRun->performance,
                'quality' => $this->productionRun->quality,
                'oee' => $this->productionRun->oee,
                'downtime_minutes' => $this->productionRun->downtime_minutes ?? 0,
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
