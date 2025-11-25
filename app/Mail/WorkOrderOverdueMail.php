<?php

namespace App\Mail;

use App\Models\User;
use App\Models\WorkOrder;
use Carbon\Carbon;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class WorkOrderOverdueMail extends LocalizedMailable
{
    /**
     * Create a new message instance.
     */
    public function __construct(
        public WorkOrder $workOrder,
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
            subject: __('emails.work_order_overdue.subject', ['title' => $this->workOrder->title]),
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        $daysOverdue = $this->workOrder->due_date
            ? Carbon::now()->diffInDays($this->workOrder->due_date)
            : 0;

        return new Content(
            view: 'emails.notifications.work-order-overdue',
            with: [
                'user_name' => $this->recipient->name,
                'work_order_id' => $this->workOrder->id,
                'work_order_number' => $this->workOrder->work_order_number ?? $this->workOrder->id,
                'work_order_title' => $this->workOrder->title,
                'machine_name' => $this->workOrder->machine?->name ?? 'N/A',
                'due_date' => $this->workOrder->due_date?->format('M d, Y'),
                'days_overdue' => $daysOverdue,
                'status' => $this->workOrder->status,
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
