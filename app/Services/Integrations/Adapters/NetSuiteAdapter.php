<?php

namespace App\Services\Integrations\Adapters;

use App\Services\Integrations\ErpIntegration;
use Illuminate\Support\Facades\Log;

/**
 * Oracle NetSuite ERP Integration Adapter
 *
 * Implements NetSuite-specific API communication using SuiteQL and REST APIs.
 */
class NetSuiteAdapter extends ErpIntegration
{
    /**
     * NetSuite API version
     */
    protected string $apiVersion = '2023.1';

    /**
     * Test the connection to NetSuite.
     */
    public function testConnection(): array
    {
        $response = $this->makeRequest('GET', '/services/rest/record/v1/metadata-catalog');

        if ($response['success']) {
            return [
                'success' => true,
                'message' => 'NetSuite connection successful',
            ];
        }

        return [
            'success' => false,
            'message' => 'NetSuite connection failed: ' . ($response['error'] ?? 'Unknown error'),
        ];
    }

    /**
     * Override makeRequest for NetSuite OAuth 1.0a authentication.
     */
    protected function makeRequest(string $method, string $endpoint, array $data = []): array
    {
        $config = $this->integration->config;

        try {
            // NetSuite uses OAuth 1.0a with Token-Based Authentication (TBA)
            $oauthParams = $this->generateOAuthParams($method, $endpoint, $config);

            $headers = [
                'Authorization' => $this->buildOAuthHeader($oauthParams),
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
            ];

            $client = new \GuzzleHttp\Client([
                'base_uri' => $this->buildNetSuiteUrl($config),
                'timeout' => 45,
            ]);

            $options = ['headers' => $headers];

            if (!empty($data)) {
                $options['json'] = $data;
            }

            $response = $client->request($method, $endpoint, $options);
            $body = json_decode($response->getBody()->getContents(), true);

            return [
                'success' => true,
                'data' => $body,
            ];
        } catch (\Exception $e) {
            Log::error('NetSuite API request failed', [
                'endpoint' => $endpoint,
                'error' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Build NetSuite account-specific URL.
     */
    protected function buildNetSuiteUrl(array $config): string
    {
        $accountId = str_replace('_', '-', strtolower($config['account_id'] ?? ''));
        return "https://{$accountId}.suitetalk.api.netsuite.com";
    }

    /**
     * Generate OAuth 1.0a parameters.
     */
    protected function generateOAuthParams(string $method, string $endpoint, array $config): array
    {
        return [
            'oauth_consumer_key' => $config['consumer_key'] ?? '',
            'oauth_token' => $config['token_id'] ?? '',
            'oauth_signature_method' => 'HMAC-SHA256',
            'oauth_timestamp' => time(),
            'oauth_nonce' => bin2hex(random_bytes(16)),
            'oauth_version' => '1.0',
            'realm' => $config['account_id'] ?? '',
        ];
    }

    /**
     * Build OAuth Authorization header.
     */
    protected function buildOAuthHeader(array $params): string
    {
        $parts = [];
        foreach ($params as $key => $value) {
            $parts[] = $key . '="' . rawurlencode($value) . '"';
        }
        return 'OAuth ' . implode(', ', $parts);
    }

    /**
     * Transform NetSuite inventory to LineCare format.
     */
    protected function transformNetSuiteInventory(array $nsData): array
    {
        return [
            'part_number' => $nsData['itemId'] ?? $nsData['displayName'],
            'quantity' => (float) ($nsData['quantityOnHand'] ?? 0),
            'location' => $nsData['location']['refName'] ?? 'Default',
            'unit' => $nsData['unitsType']['refName'] ?? 'EA',
        ];
    }
}
