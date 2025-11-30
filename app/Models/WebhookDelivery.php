<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WebhookDelivery extends Model
{
    use HasFactory;

    protected $fillable = [
        'webhook_endpoint_id',
        'event',
        'payload',
        'response_code',
        'response_body',
        'duration_ms',
        'status',
        'delivered_at',
    ];

    protected $casts = [
        'payload' => 'array',
        'delivered_at' => 'datetime',
    ];

    public function webhookEndpoint(): BelongsTo
    {
        return $this->belongsTo(WebhookEndpoint::class);
    }

    public function markAsSuccess(int $responseCode, ?string $responseBody, int $durationMs): void
    {
        $this->update([
            'status' => 'success',
            'response_code' => $responseCode,
            'response_body' => $responseBody ? substr($responseBody, 0, 5000) : null,
            'duration_ms' => $durationMs,
            'delivered_at' => now(),
        ]);

        $this->webhookEndpoint->resetFailureCount();
    }

    public function markAsFailed(int $responseCode, ?string $responseBody, int $durationMs): void
    {
        $this->update([
            'status' => 'failed',
            'response_code' => $responseCode,
            'response_body' => $responseBody ? substr($responseBody, 0, 5000) : null,
            'duration_ms' => $durationMs,
            'delivered_at' => now(),
        ]);

        $this->webhookEndpoint->incrementFailureCount();
    }
}
