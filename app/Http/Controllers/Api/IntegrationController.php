<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Integration;
use App\Models\IntegrationLog;
use App\Services\Integrations\ErpIntegration;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class IntegrationController extends Controller
{
    /**
     * Get all integrations for the authenticated user's company.
     */
    public function index(Request $request): JsonResponse
    {
        $integrations = Integration::where('company_id', $request->user()->company_id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($integrations);
    }

    /**
     * Store a new integration.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'integration_type' => 'required|in:erp,iot,email,sms',
            'provider' => 'nullable|string|max:255',
            'config' => 'required|array',
            'config.api_url' => 'required_if:integration_type,erp,iot|url',
            'config.api_key' => 'required_if:integration_type,erp,iot|string',
            'sync_frequency' => 'nullable|in:hourly,daily,real-time',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $integration = Integration::create([
            'company_id' => $request->user()->company_id,
            'name' => $request->name,
            'integration_type' => $request->integration_type,
            'provider' => $request->provider,
            'config' => $request->config,
            'sync_frequency' => $request->sync_frequency,
            'is_enabled' => false, // Start disabled until tested
        ]);

        return response()->json([
            'message' => 'Integration created successfully',
            'integration' => $integration,
        ], 201);
    }

    /**
     * Show a specific integration.
     */
    public function show(Request $request, Integration $integration): JsonResponse
    {
        if ($integration->company_id !== $request->user()->company_id) {
            abort(403);
        }

        return response()->json($integration);
    }

    /**
     * Update an integration.
     */
    public function update(Request $request, Integration $integration): JsonResponse
    {
        if ($integration->company_id !== $request->user()->company_id) {
            abort(403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'config' => 'sometimes|array',
            'sync_frequency' => 'nullable|in:hourly,daily,real-time',
            'is_enabled' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $integration->update($request->only(['name', 'config', 'sync_frequency', 'is_enabled']));

        return response()->json([
            'message' => 'Integration updated successfully',
            'integration' => $integration,
        ]);
    }

    /**
     * Delete an integration.
     */
    public function destroy(Request $request, Integration $integration): JsonResponse
    {
        if ($integration->company_id !== $request->user()->company_id) {
            abort(403);
        }

        $integration->delete();

        return response()->json([
            'message' => 'Integration deleted successfully',
        ]);
    }

    /**
     * Test integration connection.
     */
    public function testConnection(Request $request, Integration $integration): JsonResponse
    {
        if ($integration->company_id !== $request->user()->company_id) {
            abort(403);
        }

        $integrationService = $this->getIntegrationService($integration);

        if (!$integrationService) {
            return response()->json([
                'success' => false,
                'message' => 'Integration type not supported',
            ], 400);
        }

        $result = $integrationService->testConnection();

        return response()->json($result);
    }

    /**
     * Trigger manual sync.
     */
    public function sync(Request $request, Integration $integration): JsonResponse
    {
        if ($integration->company_id !== $request->user()->company_id) {
            abort(403);
        }

        if (!$integration->canSync()) {
            return response()->json([
                'success' => false,
                'message' => 'Integration is not enabled or not configured',
            ], 400);
        }

        $validator = Validator::make($request->all(), [
            'action' => 'required|string|in:sync_inventory,sync_purchase_orders,sync_work_order_costs',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $integrationService = $this->getIntegrationService($integration);

        if (!$integrationService) {
            return response()->json([
                'success' => false,
                'message' => 'Integration type not supported',
            ], 400);
        }

        $result = $integrationService->sync($request->action);

        return response()->json($result);
    }

    /**
     * Get integration sync logs.
     */
    public function logs(Request $request, Integration $integration): JsonResponse
    {
        if ($integration->company_id !== $request->user()->company_id) {
            abort(403);
        }

        $logs = IntegrationLog::where('integration_id', $integration->id)
            ->orderBy('started_at', 'desc')
            ->paginate($request->input('per_page', 20));

        return response()->json($logs);
    }

    /**
     * Get the appropriate integration service instance.
     */
    protected function getIntegrationService(Integration $integration): ?object
    {
        return match ($integration->integration_type) {
            'erp' => new ErpIntegration($integration),
            default => null,
        };
    }
}
