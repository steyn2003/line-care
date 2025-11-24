<?php

namespace App\Http\Controllers;

use App\Models\Sensor;
use App\Models\Machine;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SensorManagementController extends Controller
{
    /**
     * Display a listing of sensors
     */
    public function index(Request $request): Response
    {
        $sensors = Sensor::where('company_id', $request->user()->company_id)
            ->with('machine:id,name')
            ->orderBy('machine_id')
            ->orderBy('sensor_type')
            ->get();

        return Inertia::render('IoT/sensors/index', [
            'sensors' => $sensors,
        ]);
    }

    /**
     * Show the form for creating a new sensor
     */
    public function create(Request $request): Response
    {
        $machines = Machine::where('company_id', $request->user()->company_id)
            ->select('id', 'name')
            ->orderBy('name')
            ->get();

        return Inertia::render('IoT/sensors/create', [
            'machines' => $machines,
            'sensorTypes' => $this->getSensorTypes(),
            'protocols' => $this->getProtocols(),
        ]);
    }

    /**
     * Store a newly created sensor
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'machine_id' => 'required|exists:machines,id',
            'sensor_type' => 'required|in:vibration,temperature,pressure,current,speed',
            'sensor_id' => 'required|string|max:255|unique:sensors,sensor_id',
            'name' => 'required|string|max:255',
            'unit' => 'required|string|max:50',
            'protocol' => 'required|in:mqtt,rest_webhook,opc_ua,modbus_tcp',
            'mqtt_topic' => 'nullable|string|max:255',
            'warning_threshold' => 'nullable|numeric',
            'critical_threshold' => 'nullable|numeric',
            'is_active' => 'boolean',
        ]);

        $sensor = Sensor::create([
            'company_id' => $request->user()->company_id,
            'machine_id' => $validated['machine_id'],
            'sensor_type' => $validated['sensor_type'],
            'sensor_id' => $validated['sensor_id'],
            'name' => $validated['name'],
            'unit' => $validated['unit'],
            'protocol' => $validated['protocol'],
            'mqtt_topic' => $validated['mqtt_topic'] ?? null,
            'warning_threshold' => $validated['warning_threshold'] ?? null,
            'critical_threshold' => $validated['critical_threshold'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return redirect()->route('sensors.index')
            ->with('success', 'Sensor created successfully');
    }

    /**
     * Show the form for editing the specified sensor
     */
    public function edit(Request $request, Sensor $sensor): Response
    {
        // Ensure user can only edit their company's sensors
        if ($sensor->company_id !== $request->user()->company_id) {
            abort(403);
        }

        $machines = Machine::where('company_id', $request->user()->company_id)
            ->select('id', 'name')
            ->orderBy('name')
            ->get();

        return Inertia::render('IoT/Sensors/Edit', [
            'sensor' => $sensor,
            'machines' => $machines,
            'sensorTypes' => $this->getSensorTypes(),
            'protocols' => $this->getProtocols(),
        ]);
    }

    /**
     * Update the specified sensor
     */
    public function update(Request $request, Sensor $sensor)
    {
        // Ensure user can only update their company's sensors
        if ($sensor->company_id !== $request->user()->company_id) {
            abort(403);
        }

        $validated = $request->validate([
            'machine_id' => 'sometimes|exists:machines,id',
            'sensor_type' => 'sometimes|in:vibration,temperature,pressure,current,speed',
            'name' => 'sometimes|string|max:255',
            'unit' => 'sometimes|string|max:50',
            'protocol' => 'sometimes|in:mqtt,rest_webhook,opc_ua,modbus_tcp',
            'mqtt_topic' => 'nullable|string|max:255',
            'warning_threshold' => 'nullable|numeric',
            'critical_threshold' => 'nullable|numeric',
            'is_active' => 'sometimes|boolean',
        ]);

        $sensor->update($validated);

        return back()->with('success', 'Sensor updated successfully');
    }

    /**
     * Remove the specified sensor
     */
    public function destroy(Request $request, Sensor $sensor)
    {
        // Ensure user can only delete their company's sensors
        if ($sensor->company_id !== $request->user()->company_id) {
            abort(403);
        }

        $sensor->delete();

        return redirect()->route('sensors.index')
            ->with('success', 'Sensor deleted successfully');
    }

    /**
     * Get available sensor types
     */
    protected function getSensorTypes(): array
    {
        return [
            ['value' => 'vibration', 'label' => 'Vibration', 'unit' => 'mm/s'],
            ['value' => 'temperature', 'label' => 'Temperature', 'unit' => '°C'],
            ['value' => 'pressure', 'label' => 'Pressure', 'unit' => 'bar'],
            ['value' => 'current', 'label' => 'Current', 'unit' => 'A'],
            ['value' => 'speed', 'label' => 'Speed', 'unit' => 'RPM'],
        ];
    }

    /**
     * Get available protocols
     */
    protected function getProtocols(): array
    {
        return [
            ['value' => 'mqtt', 'label' => 'MQTT', 'description' => 'Message Queue Telemetry Transport'],
            ['value' => 'rest_webhook', 'label' => 'REST Webhook', 'description' => 'HTTP POST to webhook endpoint'],
            ['value' => 'opc_ua', 'label' => 'OPC UA', 'description' => 'OPC Unified Architecture'],
            ['value' => 'modbus_tcp', 'label' => 'Modbus TCP', 'description' => 'Modbus over TCP/IP'],
        ];
    }
}
