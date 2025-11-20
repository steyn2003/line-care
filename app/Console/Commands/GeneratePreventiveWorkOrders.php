<?php

namespace App\Console\Commands;

use App\Enums\WorkOrderStatus;
use App\Enums\WorkOrderType;
use App\Models\PreventiveTask;
use App\Models\WorkOrder;
use Illuminate\Console\Command;

class GeneratePreventiveWorkOrders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'preventive:generate-work-orders {--days=3 : Number of days ahead to generate work orders}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate work orders for preventive tasks that are due soon';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $daysAhead = $this->option('days');
        $dueDate = now()->addDays($daysAhead);

        $this->info("Generating work orders for preventive tasks due by {$dueDate->format('Y-m-d')}...");

        // Find all active preventive tasks that are due soon
        $tasks = PreventiveTask::query()
            ->active()
            ->where('next_due_date', '<=', $dueDate)
            ->get();

        $generated = 0;
        $skipped = 0;

        foreach ($tasks as $task) {
            // Check if a work order already exists for this task and due date
            $existingWorkOrder = WorkOrder::query()
                ->where('preventive_task_id', $task->id)
                ->where('type', WorkOrderType::PREVENTIVE)
                ->whereIn('status', [WorkOrderStatus::OPEN, WorkOrderStatus::IN_PROGRESS])
                ->whereDate('created_at', '>=', $task->next_due_date->subDays(7))
                ->exists();

            if ($existingWorkOrder) {
                $this->warn("  Skipping task #{$task->id} - Work order already exists");
                $skipped++;
                continue;
            }

            // Create the work order
            WorkOrder::create([
                'company_id' => $task->company_id,
                'machine_id' => $task->machine_id,
                'created_by' => $task->assigned_to ?? $task->company->users()->where('role', 'manager')->first()->id,
                'assigned_to' => $task->assigned_to,
                'type' => WorkOrderType::PREVENTIVE,
                'status' => WorkOrderStatus::OPEN,
                'title' => $task->title,
                'description' => $task->description,
                'preventive_task_id' => $task->id,
            ]);

            $this->info("  ✓ Generated work order for task #{$task->id} - {$task->title}");
            $generated++;
        }

        $this->info("\nSummary:");
        $this->info("  Generated: {$generated}");
        $this->info("  Skipped: {$skipped}");
        $this->info("  Total: " . ($generated + $skipped));

        return Command::SUCCESS;
    }
}
