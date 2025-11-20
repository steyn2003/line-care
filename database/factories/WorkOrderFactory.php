<?php

namespace Database\Factories;

use App\Enums\WorkOrderStatus;
use App\Enums\WorkOrderType;
use App\Models\CauseCategory;
use App\Models\Company;
use App\Models\Machine;
use App\Models\User;
use App\Models\WorkOrder;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\WorkOrder>
 */
class WorkOrderFactory extends Factory
{
    protected $model = WorkOrder::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $type = fake()->randomElement(WorkOrderType::cases());
        $status = fake()->randomElement(WorkOrderStatus::cases());

        $createdAt = fake()->dateTimeBetween('-30 days', 'now');
        $startedAt = null;
        $completedAt = null;

        if ($status === WorkOrderStatus::IN_PROGRESS || $status === WorkOrderStatus::COMPLETED) {
            $startedAt = fake()->dateTimeBetween($createdAt, 'now');
        }

        if ($status === WorkOrderStatus::COMPLETED) {
            $completedAt = fake()->dateTimeBetween($startedAt, 'now');
        }

        return [
            'company_id' => Company::factory(),
            'machine_id' => Machine::factory(),
            'created_by' => User::factory(),
            'assigned_to' => fake()->optional(0.7)->randomElement([User::factory()]),
            'preventive_task_id' => null,
            'type' => $type,
            'status' => $status,
            'title' => fake()->randomElement([
                'Motor not starting',
                'Strange noise from machine',
                'Oil leak detected',
                'Conveyor belt slipping',
                'Emergency stop button stuck',
                'Hydraulic pressure low',
                'Preventive maintenance due',
                'Quarterly inspection',
            ]),
            'description' => fake()->optional()->paragraph(),
            'started_at' => $startedAt,
            'completed_at' => $completedAt,
            'cause_category_id' => $status === WorkOrderStatus::COMPLETED ? CauseCategory::factory() : null,
            'created_at' => $createdAt,
            'updated_at' => $completedAt ?? $startedAt ?? $createdAt,
        ];
    }
}
