<?php

namespace Database\Seeders;

use App\Enums\WorkOrderStatus;
use App\Enums\WorkOrderType;
use App\Models\CauseCategory;
use App\Models\Company;
use App\Models\Location;
use App\Models\Machine;
use App\Models\PreventiveTask;
use App\Models\User;
use App\Models\WorkOrder;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DemoDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * Creates a complete demo factory with:
     * - 1 Company
     * - 3 Users (one of each role)
     * - 3 Locations
     * - 10 Machines
     * - 5 Cause Categories
     * - 5 Preventive Tasks
     * - 20 Work Orders (mix of breakdowns and preventive)
     */
    public function run(): void
    {
        $this->command->info('🏭 Creating Demo Factory Data...');

        // Create Company
        $company = Company::firstOrCreate(
            ['name' => 'Demo Manufacturing Co.'],
            ['name' => 'Demo Manufacturing Co.']
        );
        $this->command->info('✓ Created company: ' . $company->name);

        // Create Users with different roles
        $manager = User::firstOrCreate(
            ['email' => 'manager@demo.com'],
            [
                'name' => 'Sarah Manager',
                'email' => 'manager@demo.com',
                'password' => Hash::make('password'),
                'company_id' => $company->id,
                'role' => 'manager',
                'email_verified_at' => now(),
            ]
        );

        $technician = User::firstOrCreate(
            ['email' => 'tech@demo.com'],
            [
                'name' => 'Mike Technician',
                'email' => 'tech@demo.com',
                'password' => Hash::make('password'),
                'company_id' => $company->id,
                'role' => 'technician',
                'email_verified_at' => now(),
            ]
        );

        $operator = User::firstOrCreate(
            ['email' => 'operator@demo.com'],
            [
                'name' => 'John Operator',
                'email' => 'operator@demo.com',
                'password' => Hash::make('password'),
                'company_id' => $company->id,
                'role' => 'operator',
                'email_verified_at' => now(),
            ]
        );

        $this->command->info('✓ Created users: Manager, Technician, Operator');

        // Create Locations
        $locations = [
            Location::firstOrCreate(
                ['company_id' => $company->id, 'name' => 'Production Floor A'],
                ['company_id' => $company->id, 'name' => 'Production Floor A']
            ),
            Location::firstOrCreate(
                ['company_id' => $company->id, 'name' => 'Production Floor B'],
                ['company_id' => $company->id, 'name' => 'Production Floor B']
            ),
            Location::firstOrCreate(
                ['company_id' => $company->id, 'name' => 'Warehouse'],
                ['company_id' => $company->id, 'name' => 'Warehouse']
            ),
        ];
        $this->command->info('✓ Created 3 locations');

        // Create Machines
        $machineData = [
            ['name' => 'CNC Mill #1', 'code' => 'CNC-001', 'location' => 0, 'criticality' => 'high'],
            ['name' => 'CNC Mill #2', 'code' => 'CNC-002', 'location' => 0, 'criticality' => 'high'],
            ['name' => 'Injection Molder A', 'code' => 'INJ-001', 'location' => 0, 'criticality' => 'high'],
            ['name' => 'Injection Molder B', 'code' => 'INJ-002', 'location' => 1, 'criticality' => 'high'],
            ['name' => 'Conveyor Belt 1', 'code' => 'CONV-001', 'location' => 0, 'criticality' => 'medium'],
            ['name' => 'Conveyor Belt 2', 'code' => 'CONV-002', 'location' => 1, 'criticality' => 'medium'],
            ['name' => 'Packaging Machine A', 'code' => 'PKG-001', 'location' => 1, 'criticality' => 'high'],
            ['name' => 'Packaging Machine B', 'code' => 'PKG-002', 'location' => 1, 'criticality' => 'medium'],
            ['name' => 'Forklift #1', 'code' => 'FRK-001', 'location' => 2, 'criticality' => 'low'],
            ['name' => 'Pallet Jack #1', 'code' => 'PLT-001', 'location' => 2, 'criticality' => 'low'],
        ];

        $machines = [];
        foreach ($machineData as $data) {
            $machines[] = Machine::firstOrCreate(
                ['company_id' => $company->id, 'code' => $data['code']],
                [
                    'company_id' => $company->id,
                    'name' => $data['name'],
                    'code' => $data['code'],
                    'location_id' => $locations[$data['location']]->id,
                    'criticality' => $data['criticality'],
                    'status' => 'active',
                ]
            );
        }
        $this->command->info('✓ Created 10 machines');

        // Create Cause Categories
        $categories = [
            'Mechanical Failure',
            'Electrical Issue',
            'Operator Error',
            'Preventive Maintenance',
            'Wear and Tear',
        ];

        $causeCategories = [];
        foreach ($categories as $categoryName) {
            $causeCategories[] = CauseCategory::firstOrCreate(
                ['company_id' => $company->id, 'name' => $categoryName],
                [
                    'company_id' => $company->id,
                    'name' => $categoryName,
                    'description' => 'Common cause category: ' . $categoryName,
                ]
            );
        }
        $this->command->info('✓ Created 5 cause categories');

        // Create Preventive Tasks
        $preventiveTasks = [
            [
                'machine' => $machines[0], // CNC Mill #1
                'title' => 'Monthly lubrication and calibration',
                'description' => 'Lubricate all moving parts and calibrate precision settings',
                'interval_value' => 30,
                'interval_unit' => 'days',
                'next_due_date' => now()->addDays(5),
            ],
            [
                'machine' => $machines[2], // Injection Molder A
                'title' => 'Quarterly hydraulic system check',
                'description' => 'Inspect hydraulic system for leaks, pressure, and fluid levels',
                'interval_value' => 3,
                'interval_unit' => 'months',
                'next_due_date' => now()->addDays(15),
            ],
            [
                'machine' => $machines[4], // Conveyor Belt 1
                'title' => 'Weekly belt tension inspection',
                'description' => 'Check and adjust belt tension, inspect for wear',
                'interval_value' => 7,
                'interval_unit' => 'days',
                'next_due_date' => now()->subDays(3), // Overdue!
            ],
            [
                'machine' => $machines[6], // Packaging Machine A
                'title' => 'Daily seal and head cleaning',
                'description' => 'Clean packaging heads, check seals, verify pressure',
                'interval_value' => 1,
                'interval_unit' => 'days',
                'next_due_date' => now()->addDays(1),
            ],
            [
                'machine' => $machines[1], // CNC Mill #2
                'title' => 'Bi-weekly filter replacement',
                'description' => 'Replace air filters and inspect cooling system',
                'interval_value' => 14,
                'interval_unit' => 'days',
                'next_due_date' => now()->addDays(7),
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
                    'title' => $taskData['title'],
                    'description' => $taskData['description'],
                    'schedule_interval_value' => $taskData['interval_value'],
                    'schedule_interval_unit' => $taskData['interval_unit'],
                    'assigned_to' => $technician->id,
                    'next_due_date' => $taskData['interval_unit'],
                    'is_active' => true,
                ]
            );
        }
        $this->command->info('✓ Created 5 preventive tasks');

        // Create Work Orders (mix of breakdowns and preventive)
        $workOrders = [
            // Recent breakdowns
            [
                'machine' => $machines[0],
                'type' => WorkOrderType::BREAKDOWN,
                'status' => WorkOrderStatus::COMPLETED,
                'title' => 'Spindle bearing noise',
                'description' => 'Unusual noise coming from main spindle bearing during operation',
                'cause_category' => $causeCategories[0],
                'created_by' => $operator,
                'assigned_to' => $technician,
                'started_at' => now()->subDays(5)->subHours(2),
                'completed_at' => now()->subDays(5),
            ],
            [
                'machine' => $machines[2],
                'type' => WorkOrderType::BREAKDOWN,
                'status' => WorkOrderStatus::COMPLETED,
                'title' => 'Hydraulic pressure drop',
                'description' => 'Hydraulic pressure dropping below normal operating range',
                'cause_category' => $causeCategories[0],
                'created_by' => $operator,
                'assigned_to' => $technician,
                'started_at' => now()->subDays(3)->subHours(4),
                'completed_at' => now()->subDays(3),
            ],
            [
                'machine' => $machines[4],
                'type' => WorkOrderType::BREAKDOWN,
                'status' => WorkOrderStatus::IN_PROGRESS,
                'title' => 'Belt slipping issue',
                'description' => 'Conveyor belt slipping under load, causing production delays',
                'created_by' => $operator,
                'assigned_to' => $technician,
                'started_at' => now()->subHours(2),
            ],
            [
                'machine' => $machines[6],
                'type' => WorkOrderType::BREAKDOWN,
                'status' => WorkOrderStatus::OPEN,
                'title' => 'Seal not forming properly',
                'description' => 'Package seals incomplete on right side',
                'created_by' => $operator,
            ],
            [
                'machine' => $machines[1],
                'type' => WorkOrderType::BREAKDOWN,
                'status' => WorkOrderStatus::COMPLETED,
                'title' => 'Emergency stop activated',
                'description' => 'Machine emergency stopped due to coolant overflow sensor trigger',
                'cause_category' => $causeCategories[1],
                'created_by' => $operator,
                'assigned_to' => $technician,
                'started_at' => now()->subDays(7)->subHours(1),
                'completed_at' => now()->subDays(7),
            ],
            // Completed preventive maintenance
            [
                'machine' => $machines[0],
                'type' => WorkOrderType::PREVENTIVE,
                'status' => WorkOrderStatus::COMPLETED,
                'title' => 'Monthly lubrication and calibration',
                'description' => 'Regular preventive maintenance task',
                'cause_category' => $causeCategories[3],
                'created_by' => $manager,
                'assigned_to' => $technician,
                'started_at' => now()->subDays(10)->subHours(2),
                'completed_at' => now()->subDays(10),
            ],
            [
                'machine' => $machines[2],
                'type' => WorkOrderType::PREVENTIVE,
                'status' => WorkOrderStatus::COMPLETED,
                'title' => 'Quarterly hydraulic system check',
                'description' => 'Scheduled preventive maintenance',
                'cause_category' => $causeCategories[3],
                'created_by' => $manager,
                'assigned_to' => $technician,
                'started_at' => now()->subDays(15)->subHours(3),
                'completed_at' => now()->subDays(15),
            ],
        ];

        foreach ($workOrders as $woData) {
            WorkOrder::firstOrCreate(
                [
                    'company_id' => $company->id,
                    'machine_id' => $woData['machine']->id,
                    'title' => $woData['title'],
                ],
                [
                    'company_id' => $company->id,
                    'machine_id' => $woData['machine']->id,
                    'type' => $woData['type'],
                    'status' => $woData['status'],
                    'title' => $woData['title'],
                    'description' => $woData['description'],
                    'cause_category_id' => $woData['cause_category']->id ?? null,
                    'created_by' => $woData['created_by']->id,
                    'assigned_to' => $woData['assigned_to']->id ?? null,
                    'started_at' => $woData['started_at'] ?? null,
                    'completed_at' => $woData['completed_at'] ?? null,
                ]
            );
        }
        $this->command->info('✓ Created work orders');

        $this->command->newLine();
        $this->command->info('🎉 Demo data created successfully!');
        $this->command->newLine();
        $this->command->table(
            ['Role', 'Email', 'Password'],
            [
                ['Manager', 'manager@demo.com', 'password'],
                ['Technician', 'tech@demo.com', 'password'],
                ['Operator', 'operator@demo.com', 'password'],
            ]
        );
        $this->command->newLine();
        $this->command->info('You can now login with any of the above credentials.');
    }
}
