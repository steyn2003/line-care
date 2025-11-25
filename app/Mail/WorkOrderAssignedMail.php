<?php

namespace App\Mail;

use App\Models\User;
use App\Models\WorkOrder;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class WorkOrderAssignedMail extends LocalizedMailable
{
    /**
     * Create a new message instance.
     */
    public function __construct(
        public WorkOrder $workOrder,
        public User $assignee,
        ?string $locale = null
    ) {
        parent::__construct($locale ?? $assignee->preferred_locale);
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: __('emails.work_order_assigned.subject', ['title' => $this->workOrder->title]),
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.notifications.work-order-assigned',
            with: [
                'user_name' => $this->assignee->name,
                'work_order_id' => $this->workOrder->id,
                'work_order_number' => $this->workOrder->work_order_number ?? $this->workOrder->id,
                'work_order_title' => $this->workOrder->title,
                'machine_name' => $this->workOrder->machine?->name ?? 'N/A',
                'priority' => $this->workOrder->priority ?? 'normal',
                'due_date' => $this->workOrder->due_date?->format('M d, Y'),
                'description' => $this->workOrder->description,
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
