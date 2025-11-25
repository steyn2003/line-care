<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * Base Mailable class that handles locale for translated emails.
 *
 * Extend this class for all notification emails to ensure they are
 * sent in the user's preferred language.
 */
abstract class LocalizedMailable extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * The locale for this email.
     */
    public string $emailLocale;

    /**
     * Create a new message instance.
     */
    public function __construct(?string $locale = null)
    {
        $this->emailLocale = $locale ?? app()->getLocale();
    }

    /**
     * Build the message with the correct locale.
     */
    public function build()
    {
        // Set the locale for rendering this email
        $previousLocale = app()->getLocale();
        app()->setLocale($this->emailLocale);

        $this->buildLocalizedMessage();

        // Restore the previous locale
        app()->setLocale($previousLocale);

        return $this;
    }

    /**
     * Build the localized message content.
     * Override this method in child classes.
     */
    abstract protected function buildLocalizedMessage(): void;

    /**
     * Set the locale for this email.
     */
    public function locale(string $locale): static
    {
        $this->emailLocale = $locale;
        return $this;
    }
}
