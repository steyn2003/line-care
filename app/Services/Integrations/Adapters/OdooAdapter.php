<?php

namespace App\Services\Integrations\Adapters;

use App\Services\Integrations\ErpIntegration;
use Illuminate\Support\Facades\Log;

/**
 * Odoo ERP Integration Adapter
 *
 * Implements Odoo JSON-RPC API communication.
 * Supports Odoo Community and Enterprise editions.
 */
class OdooAdapter extends ErpIntegration
{
    /**
     * Odoo API version
     */
    protected string $apiVersion = '2';

    /**
     * Authenticated user ID
     */
    protected ?int $uid = null;

    /**
     * Test the connection to Odoo.
     */
    public function testConnection(): array
    {
        $uid = $this->authenticate();

        if ($uid) {
            return [
                'success' => true,
                'message' => 'Odoo connection successful',
                'user_id' => $uid,
            ];
        }

        return [
            'success' => false,
            'message' => 'Odoo authentication failed',
        ];
    }

    /**
     * Authenticate with Odoo and get user ID.
     */
    protected function authenticate(): ?int
    {
        if ($this->uid !== null) {
            return $this->uid;
        }

        $config = $this->integration->config;

        try {
            $response = $this->jsonRpcCall(
                '/web/session/authenticate',
                [
                    'db' => $config['database'] ?? '',
                    'login' => $config['username'] ?? '',
                    'password' => $config['password'] ?? '',
                ]
            );

            if (isset($response['result']['uid']) && $response['result']['uid']) {
                $this->uid = $response['result']['uid'];
                return $this->uid;
            }

            return null;
        } catch (\Exception $e) {
            Log::error('Odoo authentication failed', [
                'error' => $e->getMessage(),
            ]);
            return null;
        }
    }

    /**
     * Make a JSON-RPC call to Odoo.
     */
    protected function jsonRpcCall(string $endpoint, array $params): array
    {
        $config = $this->integration->config;

        $client = new \GuzzleHttp\Client([
            'base_uri' => rtrim($config['endpoint'], '/'),
            'timeout' => 30,
            'cookies' => true,
        ]);

        $response = $client->post($endpoint, [
            'json' => [
                'jsonrpc' => '2.0',
                'method' => 'call',
                'params' => $params,
                'id' => random_int(1, 999999),
            ],
            'headers' => [
                'Content-Type' => 'application/json',
            ],
        ]);

        return json_decode($response->getBody()->getContents(), true);
    }

    /**
     * Override makeRequest for Odoo JSON-RPC.
     */
    protected function makeRequest(string $method, string $endpoint, array $data = []): array
    {
        try {
            $uid = $this->authenticate();

            if (!$uid) {
                return [
                    'success' => false,
                    'error' => 'Authentication required',
                ];
            }

            $config = $this->integration->config;

            // Odoo uses a different pattern for model operations
            if (str_starts_with($endpoint, '/model/')) {
                $model = str_replace('/model/', '', $endpoint);
                return $this->callModel($model, $method, $data);
            }

            $response = $this->jsonRpcCall($endpoint, $data);

            if (isset($response['error'])) {
                return [
                    'success' => false,
                    'error' => $response['error']['data']['message'] ?? 'Unknown error',
                ];
            }

            return [
                'success' => true,
                'data' => $response['result'] ?? [],
            ];
        } catch (\Exception $e) {
            Log::error('Odoo API request failed', [
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
     * Call Odoo model method.
     */
    protected function callModel(string $model, string $method, array $args = []): array
    {
        $config = $this->integration->config;

        $response = $this->jsonRpcCall('/web/dataset/call_kw', [
            'model' => $model,
            'method' => $method,
            'args' => $args['args'] ?? [],
            'kwargs' => $args['kwargs'] ?? [],
        ]);

        if (isset($response['error'])) {
            return [
                'success' => false,
                'error' => $response['error']['data']['message'] ?? 'Unknown error',
            ];
        }

        return [
            'success' => true,
            'data' => $response['result'] ?? [],
        ];
    }

    /**
     * Transform Odoo inventory to LineCare format.
     */
    protected function transformOdooInventory(array $odooData): array
    {
        return [
            'part_number' => $odooData['default_code'] ?? $odooData['name'],
            'quantity' => (float) ($odooData['qty_available'] ?? 0),
            'location' => $odooData['location_id'][1] ?? 'Default',
            'unit' => $odooData['uom_id'][1] ?? 'Units',
        ];
    }
}
