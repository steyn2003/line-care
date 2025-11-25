<?php

namespace App\Services\Integrations\Adapters;

use App\Services\Integrations\ErpIntegration;
use Illuminate\Support\Facades\Log;

/**
 * SAP ERP Integration Adapter
 *
 * Implements SAP-specific API communication and data transformations.
 * Supports SAP S/4HANA Cloud and on-premise systems via OData APIs.
 */
class SapAdapter extends ErpIntegration
{
    /**
     * SAP-specific API version
     */
    protected string $apiVersion = 'v2';

    /**
     * Test the connection to the SAP system.
     */
    public function testConnection(): array
    {
        // SAP uses OData $metadata endpoint to verify connectivity
        $response = $this->makeRequest('GET', '/sap/opu/odata/sap/API_BUSINESS_PARTNER/$metadata');

        if ($response['success']) {
            return [
                'success' => true,
                'message' => 'SAP connection successful',
                'sap_version' => $response['data']['version'] ?? 'Unknown',
            ];
        }

        return [
            'success' => false,
            'message' => 'SAP connection failed: ' . ($response['error'] ?? 'Unknown error'),
        ];
    }

    /**
     * Override makeRequest to add SAP-specific headers and authentication.
     */
    protected function makeRequest(string $method, string $endpoint, array $data = []): array
    {
        $config = $this->integration->config;

        // SAP requires specific headers
        $headers = [
            'x-csrf-token' => $this->getCsrfToken(),
            'sap-client' => $config['sap_client'] ?? '100',
            'Accept' => 'application/json',
        ];

        // Add SAP-specific authentication (Basic or OAuth)
        if (!empty($config['oauth_token'])) {
            $headers['Authorization'] = 'Bearer ' . $config['oauth_token'];
        } else {
            $headers['Authorization'] = 'Basic ' . base64_encode(
                ($config['username'] ?? '') . ':' . ($config['password'] ?? '')
            );
        }

        try {
            $client = new \GuzzleHttp\Client([
                'base_uri' => $config['endpoint'],
                'timeout' => 60, // SAP can be slow
                'verify' => $config['verify_ssl'] ?? true,
            ]);

            $options = ['headers' => $headers];

            if (!empty($data)) {
                $options['json'] = $data;
            }

            $response = $client->request($method, $endpoint, $options);
            $body = json_decode($response->getBody()->getContents(), true);

            return [
                'success' => true,
                'data' => $body['d'] ?? $body, // SAP wraps data in 'd' property
            ];
        } catch (\Exception $e) {
            Log::error('SAP API request failed', [
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
     * Get CSRF token required for SAP write operations.
     */
    protected function getCsrfToken(): string
    {
        // In a real implementation, this would fetch the token from SAP
        // SAP requires a GET request with 'x-csrf-token: fetch' header first
        return 'fetch';
    }

    /**
     * Transform SAP inventory format to LineCare format.
     */
    protected function transformSapInventory(array $sapData): array
    {
        return [
            'part_number' => $sapData['Material'] ?? $sapData['ProductID'],
            'quantity' => (float) ($sapData['MatlWrhsStkQtyInMatlBaseUnit'] ?? $sapData['Quantity']),
            'location' => $sapData['Plant'] ?? $sapData['StorageLocation'],
            'unit' => $sapData['MaterialBaseUnit'] ?? 'EA',
        ];
    }

    /**
     * Transform LineCare inventory to SAP format.
     */
    protected function transformToSapInventory(array $lineCareData): array
    {
        return [
            'Material' => $lineCareData['part_number'],
            'Plant' => $lineCareData['location'] ?? '1000',
            'StorageLocation' => '0001',
            'MatlWrhsStkQtyInMatlBaseUnit' => $lineCareData['quantity'],
            'MaterialBaseUnit' => 'EA',
        ];
    }
}
