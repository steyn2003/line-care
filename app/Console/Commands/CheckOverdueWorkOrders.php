<?php

namespace App\Console\Commands;

use App\Models\WorkOrder;
use App\Models\User;
use App\Services\NotificationService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class CheckOverdueWorkOrders extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'linecare:check-overdue-work-orders';

    /**
     * The console command description.
     */
    protected $description = 'Check for overdue work orders and send notifications';

    /**
     * Execute the console command.
     */
    public function handle(NotificationService $notificationService): int
    {
        $this->info('Checking for overdue work orders...');

        // Find all overdue work orders that are not completed
        $overdueWorkOrders = WorkOrder::where('status', '!=', 'completed')
            ->whereNotNull('due_date')
            ->where('due_date', '<', now())
            ->with(['assignedTo', 'machine', 'company'])
            ->get();

        if ($overdueWorkOrders->isEmpty()) {
            $this->info('No overdue work orders found.');
            return Command::SUCCESS;
        }

        $this->info("Found {$overdueWorkOrders->count()} overdue work orders.");

        $notificationCount = 0;

        foreach ($overdueWorkOrders as $workOrder) {
            try {
                // Check if we already sent an overdue notification today
                if ($this->wasNotifiedToday($workOrder)) {
                    continue;
                }

                $daysOverdue = now()->diffInDays($workOrder->due_date);

                $notificationData = [
                    'work_order_id' => $workOrder->id,
                    'work_order_title' => $workOrder->title,
                    'work_order_number' => $workOrder->work_order_number ?? "WO-{$workOrder->id}",
                    'machine_name' => $workOrder->machine->name ?? 'N/A',
                    'due_date' => $workOrder->due_date->format('Y-m-d H:i'),
                    'days_overdue' => $daysOverdue,
                    'priority' => $workOrder->priority,
                    'status' => $workOrder->status,
                ];

                // Notify assigned user
                if ($workOrder->assignedTo) {
                    $this->info("Notifying {$workOrder->assignedTo->name} about WO#{$workOrder->id}");
                    $notificationService->notify(
                        $workOrder->assignedTo,
                        'work_order_overdue',
                        $notificationData
                    );
                    $notificationCount++;
                }

                // Also notify managers in the same company
                $managers = User::where('company_id', $workOrder->company_id)
                    ->where('role', 'manager')
                    ->get();

                foreach ($managers as $manager) {
                    $this->info("Notifying manager {$manager->name} about WO#{$workOrder->id}");
                    $notificationService->notify(
                        $manager,
                        'work_order_overdue',
                        $notificationData
                    );
                    $notificationCount++;
                }

                // Mark that we sent notification (store in notifications table)
                $this->recordNotification($workOrder);

                Log::info("Overdue notification sent for work order", [
                    'work_order_id' => $workOrder->id,
                    'days_overdue' => $daysOverdue
                ]);

            } catch (\Exception $e) {
                $this->error("Failed to process WO#{$workOrder->id}: {$e->getMessage()}");
                Log::error("Failed to send overdue notification", [
                    'work_order_id' => $workOrder->id,
                    'error' => $e->getMessage()
                ]);
            }
        }

        $this->info("Sent {$notificationCount} notifications for overdue work orders.");

        return Command::SUCCESS;
    }

    /**
     * Check if we already sent an overdue notification today
     */
    protected function wasNotifiedToday(WorkOrder $workOrder): bool
    {
        // Check if there's a notification sent today for this work order
        $todayNotification = \DB::table('notifications')
            ->where('type', 'work_order_overdue')
            ->where('data->work_order_id', $workOrder->id)
            ->whereDate('created_at', today())
            ->exists();

        return $todayNotification;
    }

    /**
     * Record that we sent notification (store in notifications table)
     */
    protected function recordNotification(WorkOrder $workOrder): void
    {
        // This is recorded automatically when NotificationService sends notifications
        // But we can add a marker here if needed
    }
}
