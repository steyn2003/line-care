<?php

namespace App\Http\Controllers;

use App\Models\Sensor;
use App\Models\SensorAlert;
use App\Models\Machine;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class IoTDashboardController extends Controller
{
    /**
     * Display the IoT dashboard
     */
    public function index(Request $request): Response
    {
        $companyId = $request->user()->company_id;

        // Get all sensors with their machines
        $sensors = Sensor::where('company_id', $companyId)
            ->with('machine:id,name')
            ->get()
            ->map(function ($sensor) {
                // Determine sensor status
                $status = $this->getSensorStatus($sensor);
                $trend = $this->getSensorTrend($sensor);

                return [
                    'id' => $sensor->id,
                    'machine_id' => $sensor->machine_id,
                    'machine_name' => $sensor->machine->name,
                    'sensor_type' => $sensor->sensor_type,
                    'name' => $sensor->name,
                    'unit' => $sensor->unit,
                    'last_reading' => $sensor->last_reading_value,
                    'last_reading_at' => $sensor->last_reading_at,
                    'warning_threshold' => $sensor->warning_threshold,
                    'critical_threshold' => $sensor->critical_threshold,
                    'is_active' => $sensor->is_active,
                    'status' => $status,
                    'trend' => $trend,
                ];
            });

        // Get unacknowledged alerts (filter by company through sensor relationship)
        $alerts = SensorAlert::whereHas('sensor', function ($query) use ($companyId) {
                $query->where('company_id', $companyId);
            })
            ->whereNull('acknowledged_at')
            ->with(['sensor', 'machine'])
            ->orderBy('triggered_at', 'desc')
            ->get()
            ->map(function ($alert) {
                return [
                    'id' => $alert->id,
                    'sensor_id' => $alert->sensor_id,
                    'sensor_name' => $alert->sensor->name ?? 'Unknown',
                    'machine_name' => $alert->machine->name ?? 'Unknown',
                    'alert_type' => $alert->alert_type,
                    'triggered_at' => $alert->triggered_at,
                    'acknowledged_at' => $alert->acknowledged_at,
                    'work_order_id' => $alert->work_order_id,
                ];
            });

        // Calculate statistics
        $statistics = [
            'total_sensors' => $sensors->count(),
            'active_sensors' => $sensors->where('status', 'normal')->count(),
            'warning_sensors' => $sensors->where('status', 'warning')->count(),
            'critical_sensors' => $sensors->where('status', 'critical')->count(),
            'unacknowledged_alerts' => $alerts->count(),
        ];

        return Inertia::render('IoT/dashboard', [
            'sensors' => $sensors,
            'alerts' => $alerts,
            'statistics' => $statistics,
        ]);
    }

    /**
     * Display sensors for a specific machine
     */
    public function machineSensors(Request $request, Machine $machine): Response
    {
        // Ensure user can only view their company's machines
        if ($machine->company_id !== $request->user()->company_id) {
            abort(403);
        }

        $sensors = Sensor::where('machine_id', $machine->id)
            ->with(['readings' => function ($query) {
                $query->orderBy('reading_time', 'desc')->limit(100);
            }])
            ->get()
            ->map(function ($sensor) {
                $status = $this->getSensorStatus($sensor);
                $trend = $this->getSensorTrend($sensor);

                return [
                    'id' => $sensor->id,
                    'sensor_type' => $sensor->sensor_type,
                    'name' => $sensor->name,
                    'unit' => $sensor->unit,
                    'last_reading' => $sensor->last_reading_value,
                    'last_reading_at' => $sensor->last_reading_at,
                    'warning_threshold' => $sensor->warning_threshold,
                    'critical_threshold' => $sensor->critical_threshold,
                    'is_active' => $sensor->is_active,
                    'status' => $status,
                    'trend' => $trend,
                    'readings' => $sensor->readings->map(function ($reading) {
                        return [
                            'value' => $reading->reading_value,
                            'time' => $reading->reading_time,
                        ];
                    }),
                ];
            });

        $alerts = SensorAlert::where('machine_id', $machine->id)
            ->with('sensor')
            ->orderBy('triggered_at', 'desc')
            ->limit(20)
            ->get();

        return Inertia::render('Machines/sensors', [
            'machine' => $machine,
            'sensors' => $sensors,
            'alerts' => $alerts,
        ]);
    }

    /**
     * Determine sensor status based on last reading and thresholds
     */
    protected function getSensorStatus(Sensor $sensor): string
    {
        if (!$sensor->is_active) {
            return 'inactive';
        }

        if ($sensor->last_reading_value === null) {
            return 'inactive';
        }

        if ($sensor->critical_threshold && $sensor->last_reading_value >= $sensor->critical_threshold) {
            return 'critical';
        }

        if ($sensor->warning_threshold && $sensor->last_reading_value >= $sensor->warning_threshold) {
            return 'warning';
        }

        return 'normal';
    }

    /**
     * Determine sensor trend (up, down, stable)
     */
    protected function getSensorTrend(Sensor $sensor): string
    {
        // Get last 5 readings to determine trend
        $readings = $sensor->readings()
            ->orderBy('reading_time', 'desc')
            ->limit(5)
            ->pluck('reading_value')
            ->toArray();

        if (count($readings) < 3) {
            return 'stable';
        }

        // Simple trend detection: compare average of first half vs second half
        $mid = (int) (count($readings) / 2);
        $firstHalf = array_slice($readings, 0, $mid);
        $secondHalf = array_slice($readings, $mid);

        $firstAvg = array_sum($firstHalf) / count($firstHalf);
        $secondAvg = array_sum($secondHalf) / count($secondHalf);

        $diff = $firstAvg - $secondAvg;
        $threshold = $firstAvg * 0.05; // 5% change to be considered a trend

        if (abs($diff) < $threshold) {
            return 'stable';
        }

        return $diff > 0 ? 'down' : 'up';
    }
}
