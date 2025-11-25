<?php

namespace App\Jobs;

use App\Services\SensorReadingProcessor;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ProcessSensorReadingJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The number of times the job may be attempted.
     */
    public int $tries = 3;

    /**
     * The number of seconds to wait before retrying the job.
     */
    public int $backoff = 10;

    /**
     * Create a new job instance.
     *
     * @param string $sensorId The sensor identifier
     * @param float $value The reading value
     * @param string|null $timestamp The reading timestamp (ISO 8601)
     */
    public function __construct(
        public string $sensorId,
        public float $value,
        public ?string $timestamp = null
    ) {}

    /**
     * Execute the job.
     */
    public function handle(SensorReadingProcessor $processor): void
    {
        Log::info("Processing sensor reading job", [
            'sensor_id' => $this->sensorId,
            'value' => $this->value,
        ]);

        $result = $processor->processReading(
            $this->sensorId,
            $this->value,
            $this->timestamp
        );

        Log::info("Sensor reading job completed", [
            'sensor_id' => $this->sensorId,
            'result' => $result,
        ]);
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error("Sensor reading job failed", [
            'sensor_id' => $this->sensorId,
            'value' => $this->value,
            'error' => $exception->getMessage(),
        ]);
    }
}
