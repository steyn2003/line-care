<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\Location;
use App\Models\Machine;
use App\Models\PreventiveTask;
use App\Models\User;
use Illuminate\Database\Seeder;

class PreventiveMaintenanceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get or create test company
        $company = Company::firstOrCreate(
            ['name' => 'Test Factory'],
            ['name' => 'Test Factory']
        );

        // Get or create test user
        $user = User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
                'company_id' => $company->id,
                'role' => 'manager',
            ]
        );

        // Update user's company if not set
        if (!$user->company_id) {
            $user->update(['company_id' => $company->id]);
        }

        // Create test location
        $location = Location::firstOrCreate(
            [
                'company_id' => $company->id,
                'name' => 'Production Floor A'
            ],
            [
                'company_id' => $company->id,
                'name' => 'Production Floor A',
            ]
        );

        // Create test machines
        $machines = [];
        $machineData = [
            ['name' => 'Injection Molder A', 'code' => 'INJ-001', 'criticality' => 'high'],
            ['name' => 'Conveyor Belt B', 'code' => 'CONV-002', 'criticality' => 'medium'],
            ['name' => 'Packaging Machine C', 'code' => 'PKG-003', 'criticality' => 'high'],
        ];

        foreach ($machineData as $data) {
            $machines[] = Machine::firstOrCreate(
                [
                    'company_id' => $company->id,
                    'code' => $data['code']
                ],
                [
                    'company_id' => $company->id,
                    'location_id' => $location->id,
                    'name' => $data['name'],
                    'code' => $data['code'],
                    'criticality' => $data['criticality'],
                    'status' => 'active',
                ]
            );
        }

        // Create preventive tasks with different due dates for testing
        $preventiveTasks = [
            [
                'machine' => $machines[0],
                'title' => 'Monthly lubrication check',
                'description' => 'Check and lubricate all moving parts',
                'interval_value' => 30,
                'interval_unit' => 'days',
                'next_due_date' => now()->addDays(1), // Due tomorrow (should generate WO)
            ],
            [
                'machine' => $machines[0],
                'title' => 'Quarterly hydraulic system inspection',
                'description' => 'Inspect hydraulic system for leaks and pressure',
                'interval_value' => 3,
                'interval_unit' => 'months',
                'next_due_date' => now()->addDays(2), // Due in 2 days (should generate WO)
            ],
            [
                'machine' => $machines[1],
                'title' => 'Weekly belt tension check',
                'description' => 'Check and adjust conveyor belt tension',
                'interval_value' => 7,
                'interval_unit' => 'days',
                'next_due_date' => now()->subDays(2), // Overdue (should generate WO immediately)
            ],
            [
                'machine' => $machines[1],
                'title' => 'Monthly motor bearing inspection',
                'description' => 'Inspect motor bearings for wear and noise',
                'interval_value' => 30,
                'interval_unit' => 'days',
                'next_due_date' => now()->addDays(10), // Due in 10 days (should NOT generate WO with default 3-day look-ahead)
            ],
            [
                'machine' => $machines[2],
                'title' => 'Daily packaging head cleaning',
                'description' => 'Clean packaging heads and check seals',
                'interval_value' => 1,
                'interval_unit' => 'days',
                'next_due_date' => now(), // Due today (should generate WO)
            ],
        ];

        foreach ($preventiveTasks as $taskData) {
            PreventiveTask::firstOrCreate(
                [
                    'company_id' => $company->id,
                    'machine_id' => $taskData['machine']->id,
                    'title' => $taskData['title'],
                ],
                [
                    'company_id' => $company->id,
                    'machine_id' => $taskData['machine']->id,
                    'assigned_to' => $user->id,
                    'title' => $taskData['title'],
                    'description' => $taskData['description'],
                    'schedule_interval_value' => $taskData['interval_value'],
                    'schedule_interval_unit' => $taskData['interval_unit'],
                    'next_due_date' => $taskData['next_due_date'],
                    'is_active' => true,
                ]
            );
        }

        $this->command->info('✓ Created test company, user, machines, and preventive tasks');
        $this->command->info('✓ Test user: test@example.com / password');
        $this->command->info('✓ Created ' . count($preventiveTasks) . ' preventive tasks with various due dates');
        $this->command->newLine();
        $this->command->info('Run "php artisan preventive:generate-work-orders" to test automatic work order generation');
    }
}
