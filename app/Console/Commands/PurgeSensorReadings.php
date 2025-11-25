<?php

namespace App\Console\Commands;

use App\Models\SensorReading;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PurgeSensorReadings extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'linecare:purge-sensor-readings
                            {--days=90 : Number of days to retain readings}
                            {--batch=1000 : Number of records to delete per batch}
                            {--dry-run : Show what would be deleted without actually deleting}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Purge old sensor readings to manage database size';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $days = (int) $this->option('days');
        $batchSize = (int) $this->option('batch');
        $dryRun = $this->option('dry-run');

        $cutoffDate = now()->subDays($days);

        $this->info("Purging sensor readings older than {$days} days (before {$cutoffDate->toDateTimeString()})");

        if ($dryRun) {
            $this->warn('DRY RUN MODE - No records will be deleted');
        }

        // Count records to be deleted
        $totalCount = SensorReading::where('reading_time', '<', $cutoffDate)->count();

        if ($totalCount === 0) {
            $this->info('No sensor readings found older than the retention period.');
            return Command::SUCCESS;
        }

        $this->info("Found {$totalCount} sensor readings to purge");

        if ($dryRun) {
            // Show breakdown by sensor
            $breakdown = DB::table('sensor_readings')
                ->select('sensor_id', DB::raw('COUNT(*) as count'))
                ->where('reading_time', '<', $cutoffDate)
                ->groupBy('sensor_id')
                ->get();

            $this->table(
                ['Sensor ID', 'Records to Delete'],
                $breakdown->map(fn ($row) => [$row->sensor_id, $row->count])->toArray()
            );

            $this->info('Run without --dry-run to actually delete these records.');
            return Command::SUCCESS;
        }

        // Confirm deletion
        if (!$this->option('no-interaction') && !$this->confirm("Are you sure you want to delete {$totalCount} sensor readings?")) {
            $this->info('Operation cancelled.');
            return Command::SUCCESS;
        }

        $deletedCount = 0;
        $progressBar = $this->output->createProgressBar($totalCount);
        $progressBar->start();

        // Delete in batches to avoid memory issues and long locks
        do {
            $deleted = SensorReading::where('reading_time', '<', $cutoffDate)
                ->limit($batchSize)
                ->delete();

            $deletedCount += $deleted;
            $progressBar->advance($deleted);

            // Small delay to reduce database load
            if ($deleted > 0) {
                usleep(10000); // 10ms
            }
        } while ($deleted > 0);

        $progressBar->finish();
        $this->newLine();

        $this->info("Successfully purged {$deletedCount} sensor readings");

        Log::info('Sensor readings purged', [
            'retention_days' => $days,
            'cutoff_date' => $cutoffDate->toDateTimeString(),
            'records_deleted' => $deletedCount,
        ]);

        return Command::SUCCESS;
    }
}
