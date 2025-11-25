<?php

namespace App\Jobs;

use App\Services\SensorReadingProcessor;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ProcessSensorReadingBatchJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The number of times the job may be attempted.
     */
    public int $tries = 3;

    /**
     * The number of seconds to wait before retrying the job.
     */
    public int $backoff = 30;

    /**
     * The number of seconds the job can run before timing out.
     */
    public int $timeout = 120;

    /**
     * Create a new job instance.
     *
     * @param array $readings Array of readings with keys: sensor_id, value, timestamp
     */
    public function __construct(
        public array $readings
    ) {}

    /**
     * Execute the job.
     */
    public function handle(SensorReadingProcessor $processor): void
    {
        Log::info("Processing sensor reading batch job", [
            'reading_count' => count($this->readings),
        ]);

        $processed = 0;
        $succeeded = 0;
        $failed = 0;
        $errors = [];

        foreach ($this->readings as $reading) {
            $processed++;

            try {
                $result = $processor->processReading(
                    $reading['sensor_id'],
                    $reading['value'],
                    $reading['timestamp'] ?? null
                );

                if ($result['success'] ?? false) {
                    $succeeded++;
                } else {
                    $failed++;
                    $errors[] = [
                        'sensor_id' => $reading['sensor_id'],
                        'error' => $result['error'] ?? 'Unknown error',
                    ];
                }
            } catch (\Exception $e) {
                $failed++;
                $errors[] = [
                    'sensor_id' => $reading['sensor_id'],
                    'error' => $e->getMessage(),
                ];
            }
        }

        Log::info("Sensor reading batch job completed", [
            'processed' => $processed,
            'succeeded' => $succeeded,
            'failed' => $failed,
            'errors' => $errors,
        ]);
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error("Sensor reading batch job failed", [
            'reading_count' => count($this->readings),
            'error' => $exception->getMessage(),
        ]);
    }
}
