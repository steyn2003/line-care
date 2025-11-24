<?php

namespace App\Services;

use App\Models\Sensor;
use App\Models\SensorReading;
use App\Models\SensorAlert;
use App\Models\WorkOrder;
use App\Models\Notification;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SensorReadingProcessor
{
    /**
     * Process a sensor reading and check thresholds.
     */
    public function process(Sensor $sensor, float $value, ?Carbon $readingTime = null, ?array $metadata = null): SensorReading
    {
        $readingTime = $readingTime ?? now();

        DB::beginTransaction();

        try {
            // Store the reading
            $reading = SensorReading::create([
                'sensor_id' => $sensor->id,
                'reading_value' => $value,
                'unit' => $sensor->unit,
                'reading_time' => $readingTime,
                'metadata' => $metadata,
            ]);

            // Update sensor's last reading
            $sensor->updateLastReading($value);

            // Check if alert should be triggered
            if ($sensor->shouldTriggerAlert($value)) {
                $this->handleAlert($sensor, $value);
            }

            DB::commit();

            return $reading;
        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Failed to process sensor reading', [
                'sensor_id' => $sensor->id,
                'value' => $value,
                'error' => $e->getMessage(),
            ]);

            throw $e;
        }
    }

    /**
     * Handle alert creation and work order generation.
     */
    protected function handleAlert(Sensor $sensor, float $value): void
    {
        $alertType = $sensor->getAlertType($value);
        $thresholdValue = $alertType === 'critical'
            ? $sensor->critical_threshold
            : $sensor->warning_threshold;

        // Check if there's already an unacknowledged alert of the same type
        $existingAlert = SensorAlert::where('sensor_id', $sensor->id)
            ->where('alert_type', $alertType)
            ->whereNull('acknowledged_at')
            ->first();

        if ($existingAlert) {
            // Update existing alert with new reading
            $existingAlert->update([
                'current_value' => $value,
                'triggered_at' => now(),
            ]);

            Log::info('Updated existing sensor alert', [
                'sensor_id' => $sensor->id,
                'alert_id' => $existingAlert->id,
                'current_value' => $value,
            ]);

            return;
        }

        // Create new alert
        $alert = SensorAlert::create([
            'sensor_id' => $sensor->id,
            'machine_id' => $sensor->machine_id,
            'alert_type' => $alertType,
            'threshold_value' => $thresholdValue,
            'current_value' => $value,
            'triggered_at' => now(),
            'auto_created_work_order' => false,
        ]);

        Log::info('Created sensor alert', [
            'sensor_id' => $sensor->id,
            'alert_id' => $alert->id,
            'alert_type' => $alertType,
            'current_value' => $value,
        ]);

        // Auto-create work order for critical alerts
        if ($alertType === 'critical') {
            $this->createWorkOrderFromAlert($alert);
        }

        // Send notifications
        $this->sendAlertNotifications($alert);
    }

    /**
     * Create a work order from a sensor alert.
     */
    protected function createWorkOrderFromAlert(SensorAlert $alert): void
    {
        $sensor = $alert->sensor;
        $machine = $alert->machine;

        // Find a technician to assign (prefer technicians, fallback to managers)
        $assignee = DB::table('users')
            ->where('company_id', $machine->company_id)
            ->where('role', 'technician')
            ->inRandomOrder()
            ->first();

        if (!$assignee) {
            $assignee = DB::table('users')
                ->where('company_id', $machine->company_id)
                ->where('role', 'manager')
                ->inRandomOrder()
                ->first();
        }

        $workOrder = WorkOrder::create([
            'company_id' => $machine->company_id,
            'machine_id' => $machine->id,
            'work_order_number' => 'WO-' . now()->format('YmdHis'),
            'type' => 'breakdown',
            'priority' => 'high',
            'status' => 'open',
            'title' => "High {$sensor->sensor_type} detected on {$machine->name}",
            'description' => "Sensor '{$sensor->name}' detected {$sensor->sensor_type} reading of {$alert->current_value} {$sensor->unit}, " .
                            "exceeding critical threshold of {$alert->threshold_value} {$sensor->unit}. " .
                            "Immediate attention required.",
            'assigned_to' => $assignee?->id,
            'reported_at' => now(),
        ]);

        // Link work order to alert
        $alert->update([
            'work_order_id' => $workOrder->id,
            'auto_created_work_order' => true,
        ]);

        Log::info('Auto-created work order from sensor alert', [
            'sensor_id' => $sensor->id,
            'alert_id' => $alert->id,
            'work_order_id' => $workOrder->id,
        ]);
    }

    /**
     * Send notifications for sensor alerts.
     */
    protected function sendAlertNotifications(SensorAlert $alert): void
    {
        $sensor = $alert->sensor;
        $machine = $alert->machine;

        // Get all managers and technicians for the company
        $users = DB::table('users')
            ->where('company_id', $machine->company_id)
            ->whereIn('role', ['manager', 'technician'])
            ->get();

        foreach ($users as $user) {
            Notification::create([
                'user_id' => $user->id,
                'type' => 'sensor_alert',
                'title' => "{$alert->alert_type} alert on {$machine->name}",
                'message' => "Sensor '{$sensor->name}' detected {$sensor->sensor_type} reading of {$alert->current_value} {$sensor->unit}, " .
                            "exceeding {$alert->alert_type} threshold of {$alert->threshold_value} {$sensor->unit}.",
                'link' => "/iot/sensors/{$sensor->id}",
                'is_read' => false,
            ]);
        }

        Log::info('Sent sensor alert notifications', [
            'sensor_id' => $sensor->id,
            'alert_id' => $alert->id,
            'users_notified' => $users->count(),
        ]);
    }

    /**
     * Get recent readings for a sensor.
     */
    public function getRecentReadings(Sensor $sensor, int $hours = 24): \Illuminate\Database\Eloquent\Collection
    {
        return $sensor->readings()
            ->where('reading_time', '>=', now()->subHours($hours))
            ->orderBy('reading_time', 'desc')
            ->get();
    }

    /**
     * Get statistical data for sensor readings.
     */
    public function getStatistics(Sensor $sensor, Carbon $from, Carbon $to): array
    {
        $readings = $sensor->readings()
            ->whereBetween('reading_time', [$from, $to])
            ->get();

        if ($readings->isEmpty()) {
            return [
                'count' => 0,
                'min' => null,
                'max' => null,
                'avg' => null,
                'std_dev' => null,
            ];
        }

        $values = $readings->pluck('reading_value');

        return [
            'count' => $readings->count(),
            'min' => $values->min(),
            'max' => $values->max(),
            'avg' => round($values->avg(), 2),
            'std_dev' => $this->calculateStdDev($values->toArray()),
        ];
    }

    /**
     * Calculate standard deviation.
     */
    protected function calculateStdDev(array $values): float
    {
        $count = count($values);
        if ($count === 0) {
            return 0.0;
        }

        $mean = array_sum($values) / $count;
        $variance = array_sum(array_map(function ($value) use ($mean) {
            return pow($value - $mean, 2);
        }, $values)) / $count;

        return round(sqrt($variance), 2);
    }
}
