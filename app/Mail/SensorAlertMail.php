<?php

namespace App\Mail;

use App\Models\SensorAlert;
use App\Models\User;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class SensorAlertMail extends LocalizedMailable
{
    /**
     * Create a new message instance.
     */
    public function __construct(
        public SensorAlert $alert,
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
            subject: __('emails.sensor_alert.subject', [
                'sensor_name' => $this->alert->sensor?->name ?? 'Sensor',
                'machine_name' => $this->alert->machine?->name ?? 'Machine',
            ]),
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.notifications.sensor-alert',
            with: [
                'user_name' => $this->recipient->name,
                'machine_id' => $this->alert->machine_id,
                'machine_name' => $this->alert->machine?->name ?? 'N/A',
                'sensor_type' => $this->alert->sensor?->type ?? 'unknown',
                'alert_type' => $this->alert->severity ?? 'warning',
                'reading_value' => $this->alert->reading_value,
                'threshold' => $this->alert->threshold,
                'unit' => $this->alert->sensor?->unit ?? '',
                'triggered_at' => $this->alert->created_at?->format('M d, Y H:i'),
                'work_order_id' => $this->alert->work_order_id,
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
