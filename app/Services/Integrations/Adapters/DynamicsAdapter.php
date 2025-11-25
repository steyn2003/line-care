<?php

namespace App\Services\Integrations\Adapters;

use App\Services\Integrations\ErpIntegration;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

/**
 * Microsoft Dynamics 365 ERP Integration Adapter
 *
 * Implements Dynamics 365 Finance & Operations Web API communication.
 * Uses Azure AD OAuth 2.0 for authentication.
 */
class DynamicsAdapter extends ErpIntegration
{
    /**
     * Dynamics API version
     */
    protected string $apiVersion = '1.0';

    /**
     * Test the connection to Dynamics 365.
     */
    public function testConnection(): array
    {
        $response = $this->makeRequest('GET', '/data/Companies');

        if ($response['success']) {
            return [
                'success' => true,
                'message' => 'Microsoft Dynamics 365 connection successful',
                'companies_count' => count($response['data']['value'] ?? []),
            ];
        }

        return [
            'success' => false,
            'message' => 'Dynamics 365 connection failed: ' . ($response['error'] ?? 'Unknown error'),
        ];
    }

    /**
     * Override makeRequest for Azure AD OAuth authentication.
     */
    protected function makeRequest(string $method, string $endpoint, array $data = []): array
    {
        $config = $this->integration->config;

        try {
            $accessToken = $this->getAccessToken($config);

            $headers = [
                'Authorization' => 'Bearer ' . $accessToken,
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
                'OData-MaxVersion' => '4.0',
                'OData-Version' => '4.0',
            ];

            $client = new \GuzzleHttp\Client([
                'base_uri' => rtrim($config['endpoint'], '/'),
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
            Log::error('Dynamics 365 API request failed', [
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
     * Get Azure AD access token (with caching).
     */
    protected function getAccessToken(array $config): string
    {
        $cacheKey = 'dynamics_token_' . $this->integration->id;

        return Cache::remember($cacheKey, 3500, function () use ($config) {
            $tenantId = $config['tenant_id'] ?? '';
            $clientId = $config['client_id'] ?? '';
            $clientSecret = $config['client_secret'] ?? '';
            $resource = $config['endpoint'] ?? '';

            $client = new \GuzzleHttp\Client();

            $response = $client->post(
                "https://login.microsoftonline.com/{$tenantId}/oauth2/token",
                [
                    'form_params' => [
                        'grant_type' => 'client_credentials',
                        'client_id' => $clientId,
                        'client_secret' => $clientSecret,
                        'resource' => $resource,
                    ],
                ]
            );

            $data = json_decode($response->getBody()->getContents(), true);

            return $data['access_token'];
        });
    }

    /**
     * Transform Dynamics inventory to LineCare format.
     */
    protected function transformDynamicsInventory(array $d365Data): array
    {
        return [
            'part_number' => $d365Data['ItemId'] ?? $d365Data['ItemNumber'],
            'quantity' => (float) ($d365Data['AvailableOnHandQuantity'] ?? 0),
            'location' => $d365Data['WarehouseId'] ?? 'Default',
            'unit' => $d365Data['UnitOfMeasure'] ?? 'EA',
        ];
    }
}
