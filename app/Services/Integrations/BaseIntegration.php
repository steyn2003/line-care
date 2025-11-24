<?php

namespace App\Services\Integrations;

use App\Models\Integration;
use App\Models\IntegrationLog;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

abstract class BaseIntegration implements IntegrationInterface
{
    protected Integration $integration;

    public function __construct(Integration $integration)
    {
        $this->integration = $integration;
    }

    /**
     * Get the integration model.
     */
    public function getIntegration(): Integration
    {
        return $this->integration;
    }

    /**
     * Create a log entry for the integration action.
     */
    protected function createLog(string $action, string $status, string $message, int $recordsProcessed = 0, int $recordsSucceeded = 0, int $recordsFailed = 0, ?array $errorDetails = null): IntegrationLog
    {
        return IntegrationLog::create([
            'integration_id' => $this->integration->id,
            'action' => $action,
            'status' => $status,
            'message' => $message,
            'records_processed' => $recordsProcessed,
            'records_succeeded' => $recordsSucceeded,
            'records_failed' => $recordsFailed,
            'error_details' => $errorDetails,
            'started_at' => now(),
            'completed_at' => now(),
            'duration_seconds' => 0,
        ]);
    }

    /**
     * Make an HTTP request to the integration endpoint.
     */
    protected function makeRequest(string $method, string $endpoint, array $data = [], array $headers = []): array
    {
        try {
            $config = $this->integration->config;
            $baseUrl = $config['api_url'] ?? '';
            $url = rtrim($baseUrl, '/') . '/' . ltrim($endpoint, '/');

            // Add authentication headers if configured
            if (isset($config['api_key'])) {
                $headers['Authorization'] = 'Bearer ' . $config['api_key'];
            }

            $response = Http::withHeaders($headers)
                ->timeout(30)
                ->{strtolower($method)}($url, $data);

            if ($response->successful()) {
                return [
                    'success' => true,
                    'data' => $response->json(),
                    'status' => $response->status(),
                ];
            }

            return [
                'success' => false,
                'error' => $response->body(),
                'status' => $response->status(),
            ];
        } catch (\Exception $e) {
            Log::error('Integration request failed', [
                'integration_id' => $this->integration->id,
                'endpoint' => $endpoint,
                'error' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'error' => $e->getMessage(),
                'status' => 500,
            ];
        }
    }

    /**
     * Handle sync conflict resolution (last write wins).
     */
    protected function resolveConflict(array $localData, array $remoteData, string $field = 'updated_at'): array
    {
        $localTimestamp = strtotime($localData[$field] ?? '1970-01-01');
        $remoteTimestamp = strtotime($remoteData[$field] ?? '1970-01-01');

        if ($remoteTimestamp > $localTimestamp) {
            Log::info('Integration conflict resolved: remote data is newer', [
                'integration_id' => $this->integration->id,
                'local_timestamp' => $localData[$field] ?? null,
                'remote_timestamp' => $remoteData[$field] ?? null,
            ]);
            return $remoteData;
        }

        Log::info('Integration conflict resolved: local data is newer', [
            'integration_id' => $this->integration->id,
            'local_timestamp' => $localData[$field] ?? null,
            'remote_timestamp' => $remoteData[$field] ?? null,
        ]);
        return $localData;
    }

    /**
     * Validate the integration configuration.
     */
    public function validateConfig(): array
    {
        $errors = [];
        $config = $this->integration->config;

        if (empty($config['api_url'])) {
            $errors[] = 'API URL is required';
        }

        if (empty($config['api_key'])) {
            $errors[] = 'API key is required';
        }

        return [
            'valid' => empty($errors),
            'errors' => $errors,
        ];
    }

    /**
     * Test the connection to the integration.
     */
    abstract public function testConnection(): array;

    /**
     * Sync data with the integration.
     */
    abstract public function sync(string $action): array;
}
