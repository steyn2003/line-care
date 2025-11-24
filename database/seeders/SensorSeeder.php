<?php

namespace Database\Seeders;

use App\Models\Sensor;
use App\Models\SensorReading;
use App\Models\Machine;
use App\Models\Company;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class SensorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $company = Company::first();

        if (!$company) {
            $this->command->warn('No company found. Please run CompanySeeder first.');
            return;
        }

        $this->command->info('Seeding sensors and sensor data...');

        // Get demo machines (assuming they exist from previous seeders)
        $machines = Machine::where('company_id', $company->id)->take(5)->get();

        if ($machines->isEmpty()) {
            $this->command->warn('No machines found. Please run MachineSeeder first.');
            return;
        }

        $sensorsCreated = 0;
        $readingsCreated = 0;

        foreach ($machines as $index => $machine) {
            // Each machine gets 2-3 sensors based on type

            // 1. Vibration Sensor (for rotating equipment)
            $vibrationSensor = Sensor::create([
                'company_id' => $company->id,
                'machine_id' => $machine->id,
                'sensor_type' => 'vibration',
                'sensor_id' => "VIB-{$machine->id}-001",
                'name' => "Vibration Sensor - {$machine->name}",
                'unit' => 'mm/s',
                'protocol' => 'mqtt',
                'config' => ['mqtt_topic' => "sensors/vibration/{$machine->id}"],
                'warning_threshold' => 8.0,
                'critical_threshold' => 12.0,
                'last_reading_value' => rand(20, 70) / 10, // 2.0 - 7.0
                'last_reading_at' => now()->subMinutes(rand(1, 30)),
                'is_active' => true,
            ]);
            $sensorsCreated++;

            // Generate historical vibration readings (last 24 hours, every 15 minutes)
            $this->generateReadings($vibrationSensor, 24 * 4, 15, 2.0, 7.0);
            $readingsCreated += 24 * 4;

            // 2. Temperature Sensor
            $tempSensor = Sensor::create([
                'company_id' => $company->id,
                'machine_id' => $machine->id,
                'sensor_type' => 'temperature',
                'sensor_id' => "TEMP-{$machine->id}-001",
                'name' => "Temperature Sensor - {$machine->name}",
                'unit' => '°C',
                'protocol' => 'mqtt',
                'config' => ['mqtt_topic' => "sensors/temperature/{$machine->id}"],
                'warning_threshold' => 75.0,
                'critical_threshold' => 85.0,
                'last_reading_value' => rand(450, 700) / 10, // 45.0 - 70.0
                'last_reading_at' => now()->subMinutes(rand(1, 30)),
                'is_active' => true,
            ]);
            $sensorsCreated++;

            // Generate historical temperature readings
            $this->generateReadings($tempSensor, 24 * 4, 15, 45.0, 70.0);
            $readingsCreated += 24 * 4;

            // 3. Pressure Sensor (for some machines)
            if ($index % 2 === 0) {
                $pressureSensor = Sensor::create([
                    'company_id' => $company->id,
                    'machine_id' => $machine->id,
                    'sensor_type' => 'pressure',
                    'sensor_id' => "PRES-{$machine->id}-001",
                    'name' => "Hydraulic Pressure - {$machine->name}",
                    'unit' => 'bar',
                    'protocol' => 'rest_webhook',
                    'config' => null,
                    'warning_threshold' => 180.0,
                    'critical_threshold' => 200.0,
                    'last_reading_value' => rand(1400, 1700) / 10, // 140.0 - 170.0
                    'last_reading_at' => now()->subMinutes(rand(1, 30)),
                    'is_active' => true,
                ]);
                $sensorsCreated++;

                // Generate historical pressure readings
                $this->generateReadings($pressureSensor, 24 * 4, 15, 140.0, 170.0);
                $readingsCreated += 24 * 4;
            }

            // 4. Current Sensor (electrical consumption)
            if ($index % 3 === 0) {
                $currentSensor = Sensor::create([
                    'company_id' => $company->id,
                    'machine_id' => $machine->id,
                    'sensor_type' => 'current',
                    'sensor_id' => "CURR-{$machine->id}-001",
                    'name' => "Current Monitor - {$machine->name}",
                    'unit' => 'A',
                    'protocol' => 'mqtt',
                    'config' => ['mqtt_topic' => "sensors/current/{$machine->id}"],
                    'warning_threshold' => 45.0,
                    'critical_threshold' => 50.0,
                    'last_reading_value' => rand(200, 400) / 10, // 20.0 - 40.0
                    'last_reading_at' => now()->subMinutes(rand(1, 30)),
                    'is_active' => true,
                ]);
                $sensorsCreated++;

                // Generate historical current readings
                $this->generateReadings($currentSensor, 24 * 4, 15, 20.0, 40.0);
                $readingsCreated += 24 * 4;
            }
        }

        // Create one sensor with abnormal reading (for demo alerts)
        $firstMachine = $machines->first();
        $alertSensor = Sensor::create([
            'company_id' => $company->id,
            'machine_id' => $firstMachine->id,
            'sensor_type' => 'vibration',
            'sensor_id' => "VIB-{$firstMachine->id}-002",
            'name' => "Bearing Vibration Monitor - {$firstMachine->name}",
            'unit' => 'mm/s',
            'protocol' => 'mqtt',
            'config' => ['mqtt_topic' => "sensors/vibration/{$firstMachine->id}/bearing"],
            'warning_threshold' => 8.0,
            'critical_threshold' => 12.0,
            'last_reading_value' => 13.5, // Above critical threshold
            'last_reading_at' => now()->subMinutes(5),
            'is_active' => true,
        ]);
        $sensorsCreated++;

        // Generate readings showing gradual increase (predictive maintenance scenario)
        $this->generateAbnormalReadings($alertSensor);
        $readingsCreated += 48;

        $this->command->info("✓ Created {$sensorsCreated} sensors");
        $this->command->info("✓ Created {$readingsCreated} historical sensor readings");
    }

    /**
     * Generate normal historical readings
     */
    protected function generateReadings(Sensor $sensor, int $count, int $intervalMinutes, float $min, float $max): void
    {
        $startTime = now()->subMinutes($count * $intervalMinutes);

        for ($i = 0; $i < $count; $i++) {
            $readingTime = $startTime->copy()->addMinutes($i * $intervalMinutes);

            // Normal reading with slight variation
            $baseValue = ($min + $max) / 2;
            $variation = ($max - $min) / 4;
            $value = $baseValue + (mt_rand(-1000, 1000) / 1000) * $variation;

            SensorReading::create([
                'sensor_id' => $sensor->id,
                'reading_value' => round($value, 2),
                'reading_time' => $readingTime,
                'metadata' => null,
            ]);
        }
    }

    /**
     * Generate abnormal readings showing gradual increase (for alert demo)
     */
    protected function generateAbnormalReadings(Sensor $sensor): void
    {
        $startTime = now()->subHours(24);

        // Generate 48 readings (every 30 minutes for 24 hours)
        for ($i = 0; $i < 48; $i++) {
            $readingTime = $startTime->copy()->addMinutes($i * 30);

            // Gradual increase from normal (3.0) to critical (13.5)
            $progress = $i / 47; // 0.0 to 1.0
            $baseValue = 3.0 + ($progress * 10.5); // 3.0 to 13.5

            // Add some randomness
            $noise = (mt_rand(-100, 100) / 1000) * 0.5;
            $value = $baseValue + $noise;

            SensorReading::create([
                'sensor_id' => $sensor->id,
                'reading_value' => round($value, 2),
                'reading_time' => $readingTime,
                'metadata' => [
                    'source' => 'demo_abnormal_pattern',
                    'trend' => 'increasing',
                ],
            ]);
        }
    }
}
