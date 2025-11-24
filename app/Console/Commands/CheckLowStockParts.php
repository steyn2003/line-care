<?php

namespace App\Console\Commands;

use App\Models\SparePart;
use App\Models\User;
use App\Services\NotificationService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class CheckLowStockParts extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'linecare:check-low-stock-parts';

    /**
     * The console command description.
     */
    protected $description = 'Check for low stock parts and send notifications to managers';

    /**
     * Execute the console command.
     */
    public function handle(NotificationService $notificationService): int
    {
        $this->info('Checking for low stock parts...');

        // Find all parts where available stock is below reorder point
        $lowStockParts = SparePart::whereNotNull('reorder_point')
            ->whereRaw('quantity_available < reorder_point')
            ->with(['company', 'supplier', 'category'])
            ->get();

        if ($lowStockParts->isEmpty()) {
            $this->info('No low stock parts found.');
            return Command::SUCCESS;
        }

        $this->info("Found {$lowStockParts->count()} low stock parts.");

        // Group by company to send one notification per company
        $partsByCompany = $lowStockParts->groupBy('company_id');

        $notificationCount = 0;

        foreach ($partsByCompany as $companyId => $parts) {
            try {
                // Get all managers for this company
                $managers = User::where('company_id', $companyId)
                    ->where('role', 'manager')
                    ->get();

                if ($managers->isEmpty()) {
                    $this->warn("No managers found for company ID {$companyId}");
                    continue;
                }

                // Prepare notification data
                $partsData = [];
                foreach ($parts as $part) {
                    // Check if we already sent a low stock notification today
                    if ($this->wasNotifiedToday($part)) {
                        continue;
                    }

                    $partsData[] = [
                        'part_id' => $part->id,
                        'part_name' => $part->name,
                        'part_number' => $part->part_number,
                        'quantity_available' => $part->quantity_available,
                        'reorder_point' => $part->reorder_point,
                        'reorder_quantity' => $part->reorder_quantity,
                        'unit_cost' => $part->unit_cost,
                        'supplier_name' => $part->supplier->name ?? 'N/A',
                        'category_name' => $part->category->name ?? 'N/A',
                        'is_critical' => $part->is_critical,
                    ];
                }

                // Skip if all parts were already notified today
                if (empty($partsData)) {
                    continue;
                }

                $notificationData = [
                    'low_stock_count' => count($partsData),
                    'parts' => $partsData,
                    'company_id' => $companyId,
                ];

                // Send notification to all managers
                foreach ($managers as $manager) {
                    $this->info("Notifying manager {$manager->name} about {$notificationData['low_stock_count']} low stock parts");

                    // Send individual notification for each part
                    foreach ($partsData as $partData) {
                        $notificationService->notify(
                            $manager,
                            'part_low_stock',
                            $partData
                        );
                    }

                    $notificationCount++;
                }

                // Record notifications
                foreach ($parts as $part) {
                    $this->recordNotification($part);
                }

                Log::info("Low stock notifications sent", [
                    'company_id' => $companyId,
                    'parts_count' => count($partsData),
                    'managers_notified' => $managers->count()
                ]);

            } catch (\Exception $e) {
                $this->error("Failed to process company ID {$companyId}: {$e->getMessage()}");
                Log::error("Failed to send low stock notifications", [
                    'company_id' => $companyId,
                    'error' => $e->getMessage()
                ]);
            }
        }

        $this->info("Sent notifications to {$notificationCount} managers about low stock parts.");

        return Command::SUCCESS;
    }

    /**
     * Check if we already sent a low stock notification today
     */
    protected function wasNotifiedToday(SparePart $part): bool
    {
        // Check if there's a notification sent today for this part
        $todayNotification = \DB::table('notifications')
            ->where('type', 'part_low_stock')
            ->where('data->part_id', $part->id)
            ->whereDate('created_at', today())
            ->exists();

        return $todayNotification;
    }

    /**
     * Record that we sent notification
     */
    protected function recordNotification(SparePart $part): void
    {
        // Notifications are recorded automatically by NotificationService
        // This is a placeholder for any additional logging if needed
    }
}
