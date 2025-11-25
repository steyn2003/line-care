<?php

namespace App\Mail;

use App\Models\PreventiveTask;
use App\Models\User;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class PreventiveTaskDueMail extends LocalizedMailable
{
    /**
     * Create a new message instance.
     */
    public function __construct(
        public PreventiveTask $task,
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
            subject: __('emails.preventive_task_due.subject', ['title' => $this->task->title]),
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.notifications.preventive-task-due',
            with: [
                'user_name' => $this->recipient->name,
                'task_id' => $this->task->id,
                'task_title' => $this->task->title,
                'machine_name' => $this->task->machine?->name ?? 'N/A',
                'due_date' => $this->task->next_due_date?->format('M d, Y'),
                'frequency' => $this->task->frequency,
                'estimated_duration' => $this->task->estimated_duration,
                'instructions' => $this->task->instructions,
                'required_parts' => $this->task->requiredParts?->pluck('name')->toArray() ?? [],
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
