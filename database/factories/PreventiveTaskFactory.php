<?php

namespace Database\Factories;

use App\Models\Company;
use App\Models\Machine;
use App\Models\PreventiveTask;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PreventiveTask>
 */
class PreventiveTaskFactory extends Factory
{
    protected $model = PreventiveTask::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $intervalValue = fake()->randomElement([7, 14, 30, 60, 90, 180]);
        $intervalUnit = fake()->randomElement(['days', 'weeks', 'months']);

        return [
            'company_id' => Company::factory(),
            'machine_id' => Machine::factory(),
            'assigned_to' => fake()->optional(0.5)->randomElement([User::factory()]),
            'title' => fake()->randomElement([
                'Quarterly Lubrication',
                'Weekly Visual Inspection',
                'Monthly Filter Replacement',
                'Bi-annual Calibration',
                'Annual Safety Check',
                'Belt Tension Check',
                'Coolant Level Check',
            ]),
            'description' => fake()->paragraph(),
            'schedule_interval_value' => $intervalValue,
            'schedule_interval_unit' => $intervalUnit,
            'last_completed_at' => fake()->optional()->dateTimeBetween('-60 days', '-1 day'),
            'next_due_date' => fake()->dateTimeBetween('now', '+90 days'),
            'is_active' => fake()->boolean(90), // 90% chance of being active
        ];
    }
}
