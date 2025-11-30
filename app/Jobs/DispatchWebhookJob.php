<?php

namespace App\Jobs;

use App\Models\WebhookDelivery;
use App\Models\WebhookEndpoint;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class DispatchWebhookJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public int $backoff = 60; // 1 minute between retries

    public function __construct(
        public WebhookEndpoint $webhook,
        public string $event,
        public array $payload
    ) {}

    public function handle(): void
    {
        // Create delivery record
        $delivery = WebhookDelivery::create([
            'webhook_endpoint_id' => $this->webhook->id,
            'event' => $this->event,
            'payload' => $this->payload,
            'status' => 'pending',
        ]);

        $startTime = microtime(true);

        try {
            $request = Http::timeout(30)
                ->withHeaders($this->buildHeaders());

            $response = $request->post($this->webhook->url, $this->payload);

            $durationMs = (int) ((microtime(true) - $startTime) * 1000);

            if ($response->successful()) {
                $delivery->markAsSuccess(
                    $response->status(),
                    $response->body(),
                    $durationMs
                );

                Log::info("Webhook delivered successfully", [
                    'webhook_id' => $this->webhook->id,
                    'event' => $this->event,
                    'url' => $this->webhook->url,
                    'status' => $response->status(),
                ]);
            } else {
                $delivery->markAsFailed(
                    $response->status(),
                    $response->body(),
                    $durationMs
                );

                Log::warning("Webhook delivery failed", [
                    'webhook_id' => $this->webhook->id,
                    'event' => $this->event,
                    'url' => $this->webhook->url,
                    'status' => $response->status(),
                ]);

                // Retry on server errors
                if ($response->serverError()) {
                    $this->release($this->backoff);
                }
            }
        } catch (\Exception $e) {
            $durationMs = (int) ((microtime(true) - $startTime) * 1000);

            $delivery->markAsFailed(
                0,
                $e->getMessage(),
                $durationMs
            );

            Log::error("Webhook delivery exception", [
                'webhook_id' => $this->webhook->id,
                'event' => $this->event,
                'url' => $this->webhook->url,
                'error' => $e->getMessage(),
            ]);

            // Re-throw to trigger retry
            throw $e;
        }
    }

    protected function buildHeaders(): array
    {
        $headers = [
            'Content-Type' => 'application/json',
            'User-Agent' => 'LineCare-Webhook/1.0',
            'X-Webhook-Event' => $this->event,
            'X-Webhook-Delivery' => uniqid('del_', true),
            'X-Webhook-Timestamp' => (string) time(),
        ];

        // Add signature if secret is configured
        if ($this->webhook->secret) {
            $headers['X-Webhook-Signature'] = $this->generateSignature();
        }

        return $headers;
    }

    protected function generateSignature(): string
    {
        $payload = json_encode($this->payload);
        $timestamp = time();

        $signaturePayload = "{$timestamp}.{$payload}";
        $signature = hash_hmac('sha256', $signaturePayload, $this->webhook->secret);

        return "t={$timestamp},v1={$signature}";
    }

    public function failed(\Throwable $exception): void
    {
        Log::error("Webhook job failed permanently", [
            'webhook_id' => $this->webhook->id,
            'event' => $this->event,
            'url' => $this->webhook->url,
            'error' => $exception->getMessage(),
        ]);
    }
}
