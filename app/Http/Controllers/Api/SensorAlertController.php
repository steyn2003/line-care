<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SensorAlert;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SensorAlertController extends Controller
{
    /**
     * Get all sensor alerts for the authenticated user's company.
     */
    public function index(Request $request): JsonResponse
    {
        $query = SensorAlert::whereHas('sensor', function ($q) use ($request) {
            $q->where('company_id', $request->user()->company_id);
        })->with(['sensor', 'machine', 'workOrder', 'acknowledgedByUser']);

        // Filter by acknowledged status
        if ($request->has('unacknowledged_only') && $request->boolean('unacknowledged_only')) {
            $query->unacknowledged();
        }

        // Filter by alert type
        if ($request->has('alert_type')) {
            $query->where('alert_type', $request->alert_type);
        }

        // Filter by machine
        if ($request->has('machine_id')) {
            $query->where('machine_id', $request->machine_id);
        }

        $alerts = $query->orderBy('triggered_at', 'desc')
            ->paginate($request->input('per_page', 20));

        return response()->json($alerts);
    }

    /**
     * Show a specific alert.
     */
    public function show(Request $request, SensorAlert $alert): JsonResponse
    {
        $alert->load(['sensor', 'machine', 'workOrder', 'acknowledgedByUser']);

        if ($alert->sensor->company_id !== $request->user()->company_id) {
            abort(403);
        }

        return response()->json($alert);
    }

    /**
     * Acknowledge an alert.
     */
    public function acknowledge(Request $request, SensorAlert $alert): JsonResponse
    {
        if ($alert->sensor->company_id !== $request->user()->company_id) {
            abort(403);
        }

        if ($alert->isAcknowledged()) {
            return response()->json([
                'message' => 'Alert is already acknowledged',
                'alert' => $alert,
            ], 400);
        }

        $validator = Validator::make($request->all(), [
            'note' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $alert->acknowledge($request->user(), $request->note);

        return response()->json([
            'message' => 'Alert acknowledged successfully',
            'alert' => $alert->load(['acknowledgedByUser']),
        ]);
    }
}
