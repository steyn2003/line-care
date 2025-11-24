<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Sensor;
use App\Models\Machine;
use App\Services\SensorReadingProcessor;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SensorController extends Controller
{
    protected SensorReadingProcessor $readingProcessor;

    public function __construct(SensorReadingProcessor $readingProcessor)
    {
        $this->readingProcessor = $readingProcessor;
    }

    /**
     * Get all sensors for the authenticated user's company.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Sensor::where('company_id', $request->user()->company_id)
            ->with(['machine', 'machine.location']);

        // Filter by machine
        if ($request->has('machine_id')) {
            $query->where('machine_id', $request->machine_id);
        }

        // Filter by sensor type
        if ($request->has('sensor_type')) {
            $query->where('sensor_type', $request->sensor_type);
        }

        // Filter by active status
        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        $sensors = $query->orderBy('created_at', 'desc')->get();

        return response()->json($sensors);
    }

    /**
     * Store a new sensor.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'machine_id' => 'required|exists:machines,id',
            'name' => 'required|string|max:255',
            'sensor_type' => 'required|in:vibration,temperature,pressure,current,speed',
            'sensor_id' => 'required|string|unique:sensors,sensor_id',
            'protocol' => 'nullable|in:mqtt,opcua,rest,modbus',
            'unit' => 'nullable|string|max:50',
            'warning_threshold' => 'nullable|numeric|min:0',
            'critical_threshold' => 'nullable|numeric|min:0',
            'config' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        // Verify machine belongs to user's company
        $machine = Machine::findOrFail($request->machine_id);
        if ($machine->company_id !== $request->user()->company_id) {
            abort(403);
        }

        $sensor = Sensor::create([
            'company_id' => $request->user()->company_id,
            'machine_id' => $request->machine_id,
            'name' => $request->name,
            'sensor_type' => $request->sensor_type,
            'sensor_id' => $request->sensor_id,
            'protocol' => $request->protocol,
            'unit' => $request->unit,
            'warning_threshold' => $request->warning_threshold,
            'critical_threshold' => $request->critical_threshold,
            'is_active' => true,
            'config' => $request->config,
        ]);

        return response()->json([
            'message' => 'Sensor created successfully',
            'sensor' => $sensor->load('machine'),
        ], 201);
    }

    /**
     * Show a specific sensor.
     */
    public function show(Request $request, Sensor $sensor): JsonResponse
    {
        if ($sensor->company_id !== $request->user()->company_id) {
            abort(403);
        }

        $sensor->load(['machine', 'machine.location']);

        return response()->json($sensor);
    }

    /**
     * Update a sensor.
     */
    public function update(Request $request, Sensor $sensor): JsonResponse
    {
        if ($sensor->company_id !== $request->user()->company_id) {
            abort(403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'warning_threshold' => 'nullable|numeric|min:0',
            'critical_threshold' => 'nullable|numeric|min:0',
            'is_active' => 'sometimes|boolean',
            'config' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $sensor->update($request->only([
            'name',
            'warning_threshold',
            'critical_threshold',
            'is_active',
            'config',
        ]));

        return response()->json([
            'message' => 'Sensor updated successfully',
            'sensor' => $sensor->load('machine'),
        ]);
    }

    /**
     * Delete a sensor.
     */
    public function destroy(Request $request, Sensor $sensor): JsonResponse
    {
        if ($sensor->company_id !== $request->user()->company_id) {
            abort(403);
        }

        $sensor->delete();

        return response()->json([
            'message' => 'Sensor deleted successfully',
        ]);
    }

    /**
     * Get readings for a sensor.
     */
    public function readings(Request $request, Sensor $sensor): JsonResponse
    {
        if ($sensor->company_id !== $request->user()->company_id) {
            abort(403);
        }

        $validator = Validator::make($request->all(), [
            'hours' => 'nullable|integer|min:1|max:720',
            'from' => 'nullable|date',
            'to' => 'nullable|date|after_or_equal:from',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $query = $sensor->readings();

        if ($request->has('from') && $request->has('to')) {
            $query->whereBetween('reading_time', [$request->from, $request->to]);
        } else {
            $hours = $request->input('hours', 24);
            $query->where('reading_time', '>=', now()->subHours($hours));
        }

        $readings = $query->orderBy('reading_time', 'desc')
            ->limit(1000) // Limit for performance
            ->get();

        return response()->json([
            'sensor' => $sensor->only(['id', 'name', 'sensor_type', 'unit']),
            'readings' => $readings,
        ]);
    }

    /**
     * Get statistics for a sensor.
     */
    public function statistics(Request $request, Sensor $sensor): JsonResponse
    {
        if ($sensor->company_id !== $request->user()->company_id) {
            abort(403);
        }

        $validator = Validator::make($request->all(), [
            'from' => 'required|date',
            'to' => 'required|date|after_or_equal:from',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $statistics = $this->readingProcessor->getStatistics(
            $sensor,
            \Carbon\Carbon::parse($request->from),
            \Carbon\Carbon::parse($request->to)
        );

        return response()->json([
            'sensor' => $sensor->only(['id', 'name', 'sensor_type', 'unit']),
            'from' => $request->from,
            'to' => $request->to,
            'statistics' => $statistics,
        ]);
    }

    /**
     * Get alerts for a sensor.
     */
    public function alerts(Request $request, Sensor $sensor): JsonResponse
    {
        if ($sensor->company_id !== $request->user()->company_id) {
            abort(403);
        }

        $query = $sensor->alerts()->with(['workOrder', 'acknowledgedByUser']);

        // Filter by acknowledged status
        if ($request->has('unacknowledged_only') && $request->boolean('unacknowledged_only')) {
            $query->unacknowledged();
        }

        // Filter by alert type
        if ($request->has('alert_type')) {
            $query->where('alert_type', $request->alert_type);
        }

        $alerts = $query->orderBy('triggered_at', 'desc')
            ->paginate($request->input('per_page', 20));

        return response()->json($alerts);
    }
}
