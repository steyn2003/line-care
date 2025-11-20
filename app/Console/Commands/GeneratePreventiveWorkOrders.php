<?php

namespace App\Console\Commands;

use App\Enums\WorkOrderStatus;
use App\Enums\WorkOrderType;
use App\Models\PreventiveTask;
use App\Models\WorkOrder;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class GeneratePreventiveWorkOrders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'preventive:generate-work-orders {--days-ahead=3 : Number of days ahead to generate work orders}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate work orders for preventive tasks that are due or will be due soon';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $daysAhead = (int) $this->option('days-ahead');
        $dueDate = now()->addDays($daysAhead)->startOfDay();

        $this->info("Checking for preventive tasks due on or before: {$dueDate->format('Y-m-d')}");

        // Find active preventive tasks that are due (or overdue) and don't have a pending/in-progress work order
        $dueTasks = PreventiveTask::query()
            ->where('is_active', true)
            ->where('next_due_date', '<=', $dueDate)
            ->with(['machine', 'company', 'assignee'])
            ->get();

        if ($dueTasks->isEmpty()) {
            $this->info('No preventive tasks are due.');
            return self::SUCCESS;
        }

        $this->info("Found {$dueTasks->count()} preventive task(s) due for work order generation.");

        $generated = 0;
        $skipped = 0;

        DB::transaction(function () use ($dueTasks, &$generated, &$skipped) {
            foreach ($dueTasks as $task) {
                // Check if there's already an open or in-progress work order for this task
                $existingWorkOrder = WorkOrder::query()
                    ->where('preventive_task_id', $task->id)
                    ->whereIn('status', [WorkOrderStatus::OPEN->value, WorkOrderStatus::IN_PROGRESS->value])
                    ->exists();

                if ($existingWorkOrder) {
                    $this->warn("Skipping task #{$task->id} ({$task->title}) - already has an open work order");
                    $skipped++;
                    continue;
                }

                // Create work order for this preventive task
                $workOrder = WorkOrder::create([
                    'company_id' => $task->company_id,
                    'machine_id' => $task->machine_id,
                    'preventive_task_id' => $task->id,
                    'created_by' => $task->assigned_to ?? 1, // Use assigned user or fallback to system user
                    'assigned_to' => $task->assigned_to,
                    'type' => WorkOrderType::PREVENTIVE,
                    'status' => WorkOrderStatus::OPEN,
                    'title' => $task->title,
                    'description' => $task->description . "\n\n[Auto-generated from preventive task #{$task->id}]",
                    'started_at' => null,
                    'completed_at' => null,
                ]);

                $this->info("✓ Created work order #{$workOrder->id} for task #{$task->id} ({$task->title}) on machine {$task->machine->name}");
                $generated++;
            }
        });

        $this->newLine();
        $this->info("Summary:");
        $this->info("- Generated: {$generated} work order(s)");
        $this->info("- Skipped: {$skipped} task(s) (already have open work orders)");

        return self::SUCCESS;
    }
}
