<?php

namespace App\Mail;

use App\Models\MaintenanceBudget;
use App\Models\User;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class BudgetExceededMail extends LocalizedMailable
{
    /**
     * Create a new message instance.
     */
    public function __construct(
        public MaintenanceBudget $budget,
        public User $recipient,
        public array $costBreakdown = [],
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
            subject: __('emails.budget_exceeded.subject', ['period' => $this->budget->period ?? 'Current Month']),
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        $variance = ($this->budget->actual_amount ?? 0) - ($this->budget->budgeted_amount ?? 0);
        $variancePercentage = $this->budget->budgeted_amount > 0
            ? ($variance / $this->budget->budgeted_amount) * 100
            : 0;

        return new Content(
            view: 'emails.notifications.budget-exceeded',
            with: [
                'user_name' => $this->recipient->name,
                'period' => $this->budget->period ?? 'Current Month',
                'budgeted_amount' => $this->budget->budgeted_amount ?? 0,
                'actual_amount' => $this->budget->actual_amount ?? 0,
                'variance' => $variance,
                'variance_percentage' => $variancePercentage,
                'cost_breakdown' => $this->costBreakdown,
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
