<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Company;
use App\Models\Location;
use App\Models\Machine;
use App\Models\WorkOrder;
use App\Models\PreventiveTask;
use App\Models\CauseCategory;
use App\Models\SparePart;
use App\Models\PartCategory;
use App\Models\Supplier;
use App\Models\Stock;
use App\Models\PurchaseOrder;
use App\Models\Product;
use App\Models\Shift;
use App\Models\DowntimeCategory;
use App\Models\ProductionRun;
use App\Models\LaborRate;
use App\Models\MaintenanceBudget;
use App\Enums\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class ComprehensiveDemoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create 3 demo companies first (so we can assign super admin to one)
        $companiesData = [
            [
                'name' => 'Acme Manufacturing Inc.',
                'email' => 'contact@acme-mfg.com',
                'phone' => '+1 (555) 123-4567',
                'address' => '1234 Industrial Parkway, Manufacturing City, MC 12345',
            ],
            [
                'name' => 'Precision Engineering Ltd.',
                'email' => 'info@precision-eng.com',
                'phone' => '+1 (555) 234-5678',
                'address' => '5678 Factory Avenue, Tech Valley, TV 23456',
            ],
            [
                'name' => 'Global Auto Parts Corp.',
                'email' => 'support@globalauto.com',
                'phone' => '+1 (555) 345-6789',
                'address' => '9012 Assembly Boulevard, Auto Town, AT 34567',
            ],
        ];

        $companies = [];
        foreach ($companiesData as $companyData) {
            // Check if email column exists
            $hasContactFields = \Schema::hasColumn('companies', 'email');

            if ($hasContactFields) {
                $company = Company::create($companyData);
            } else {
                // Only create with name if migration hasn't run
                $company = Company::create(['name' => $companyData['name']]);
            }

            $companies[] = $company;
            $this->seedCompanyData($company);
            $this->command->info("✓ Seeded complete data for {$company->name}");
        }

        // Create Super Admin connected to the first company
        $superAdmin = User::firstOrCreate(
            ['email' => 'admin@linecare.com'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'role' => Role::SUPER_ADMIN,
                'company_id' => $companies[0]->id, // Connect to first company
            ]
        );

        // Update existing super admin if they don't have a company
        if (!$superAdmin->wasRecentlyCreated && $superAdmin->company_id === null) {
            $superAdmin->update(['company_id' => $companies[0]->id]);
            $this->command->info('✓ Updated Super Admin to connect to ' . $companies[0]->name);
        } elseif ($superAdmin->wasRecentlyCreated) {
            $this->command->info('✓ Created Super Admin (admin@linecare.com / password) connected to ' . $companies[0]->name);
        } else {
            $this->command->info('✓ Super Admin already exists (admin@linecare.com)');
        }

        $this->command->info('✓ All demo data created successfully!');
    }

    private function seedCompanyData(Company $company): void
    {
        // Create Users (25 per company)
        $manager = User::create([
            'company_id' => $company->id,
            'name' => 'John Manager',
            'email' => "manager@{$company->id}.test",
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
            'role' => Role::MANAGER,
        ]);

        // Create 10 technicians
        $technicians = [];
        for ($i = 1; $i <= 10; $i++) {
            $technicians[] = User::create([
                'company_id' => $company->id,
                'name' => "Technician {$i}",
                'email' => "tech{$i}@{$company->id}.test",
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'role' => Role::TECHNICIAN,
            ]);
        }

        // Create 14 operators
        for ($i = 1; $i <= 14; $i++) {
            User::create([
                'company_id' => $company->id,
                'name' => "Operator {$i}",
                'email' => "operator{$i}@{$company->id}.test",
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'role' => Role::OPERATOR,
            ]);
        }

        // Create Locations (5 per company)
        $locations = [];
        $locationNames = ['Main Factory', 'Warehouse A', 'Warehouse B', 'Assembly Line', 'Quality Control'];
        foreach ($locationNames as $name) {
            $locations[] = Location::create([
                'company_id' => $company->id,
                'name' => $name,
            ]);
        }

        // Create Cause Categories (12)
        $causeCategories = [];
        $categories = [
            'Mechanical Failure', 'Electrical Fault', 'Hydraulic Leak', 'Pneumatic Issue',
            'Bearing Wear', 'Belt Failure', 'Motor Burnout', 'Sensor Malfunction',
            'Lubrication Issue', 'Overheating', 'Misalignment', 'Wear and Tear'
        ];
        foreach ($categories as $cat) {
            $causeCategories[] = CauseCategory::create([
                'company_id' => $company->id,
                'name' => $cat,
            ]);
        }

        // Create Machines (30 per company)
        $machines = [];
        $machineTypes = [
            'CNC Mill', 'CNC Lathe', 'Press', 'Grinder', 'Drill Press',
            'Welding Robot', 'Assembly Robot', 'Conveyor Belt', 'Packaging Machine',
            'Injection Molder'
        ];

        $hasDetailedFields = \Schema::hasColumn('machines', 'model');

        for ($i = 1; $i <= 30; $i++) {
            $type = $machineTypes[array_rand($machineTypes)];

            $machineData = [
                'company_id' => $company->id,
                'location_id' => $locations[array_rand($locations)]->id,
                'name' => "{$type} {$i}",
            ];

            if ($hasDetailedFields) {
                $machineData = array_merge($machineData, [
                    'model' => "Model-" . strtoupper(substr(md5($type . $i), 0, 8)),
                    'serial_number' => "SN-" . strtoupper(substr(md5($company->id . $i), 0, 12)),
                    'manufacturer' => ['Siemens', 'Fanuc', 'Haas', 'Mazak', 'DMG Mori'][array_rand(['Siemens', 'Fanuc', 'Haas', 'Mazak', 'DMG Mori'])],
                    'installation_date' => now()->subYears(rand(1, 10)),
                    'notes' => "Demo machine for testing",
                ]);
            }

            if (\Schema::hasColumn('machines', 'hourly_production_value')) {
                $machineData['hourly_production_value'] = rand(200, 800);
            }

            $machines[] = Machine::create($machineData);
        }

        // Create Suppliers (8)
        $suppliers = [];
        $supplierNames = [
            'Industrial Parts Supply Co.', 'Bearing Specialists Inc.', 'Hydraulic Components Ltd.',
            'Electrical Supplies Direct', 'Precision Tools Warehouse', 'Manufacturing Materials Co.',
            'Factory Equipment Suppliers', 'Maintenance Pro Supply'
        ];
        foreach ($supplierNames as $name) {
            $suppliers[] = Supplier::create([
                'company_id' => $company->id,
                'name' => $name,
                'email' => strtolower(str_replace(' ', '', $name)) . '@example.com',
                'phone' => '+1 (555) ' . rand(100, 999) . '-' . rand(1000, 9999),
                'address' => rand(100, 9999) . ' Supplier Street, City, ST ' . rand(10000, 99999),
            ]);
        }

        // Create Part Categories (10)
        $partCategories = [];
        $catNames = [
            'Bearings', 'Belts', 'Filters', 'Lubricants', 'Electrical Components',
            'Hydraulic Parts', 'Pneumatic Parts', 'Sensors', 'Motors', 'Seals & Gaskets'
        ];
        foreach ($catNames as $catName) {
            $partCategories[] = PartCategory::create([
                'company_id' => $company->id,
                'name' => $catName,
            ]);
        }

        // Create Spare Parts (50)
        $spareParts = [];
        for ($i = 1; $i <= 50; $i++) {
            $category = $partCategories[array_rand($partCategories)];
            $supplier = $suppliers[array_rand($suppliers)];

            $sparePart = SparePart::create([
                'company_id' => $company->id,
                'category_id' => $category->id,
                'supplier_id' => $supplier->id,
                'part_number' => 'PN-' . strtoupper(substr(md5($company->id . $i), 0, 10)),
                'name' => $category->name . ' Part ' . $i,
                'description' => "High quality {$category->name} component for industrial machinery",
                'unit_cost' => rand(10, 500),
                'unit_of_measure' => ['pieces', 'kg', 'liters', 'meters'][array_rand(['pieces', 'kg', 'liters', 'meters'])],
                'reorder_point' => rand(5, 20),
                'reorder_quantity' => rand(20, 100),
                'lead_time_days' => rand(3, 30),
                'is_critical' => rand(0, 100) > 70, // 30% critical
            ]);
            $spareParts[] = $sparePart;

            // Create stock for this part in random locations
            $numLocations = rand(1, min(3, count($locations)));
            $selectedLocationIndexes = (array) array_rand($locations, $numLocations);

            foreach ($selectedLocationIndexes as $locIndex) {
                Stock::create([
                    'company_id' => $company->id,
                    'spare_part_id' => $sparePart->id,
                    'location_id' => $locations[$locIndex]->id,
                    'quantity_on_hand' => rand(0, 100),
                    'quantity_reserved' => 0,
                ]);
            }
        }

        // Create Products (15)
        $products = [];
        for ($i = 1; $i <= 15; $i++) {
            $products[] = Product::create([
                'company_id' => $company->id,
                'name' => "Product {$i}",
                'sku' => 'PROD-' . str_pad($i, 4, '0', STR_PAD_LEFT),
                'description' => "Manufacturing product for company operations",
                'theoretical_cycle_time' => rand(30, 300), // seconds
                'target_units_per_hour' => rand(10, 100),
            ]);
        }

        // Create Shifts (3)
        $shifts = [];
        $shiftData = [
            ['name' => 'Day Shift', 'start_time' => '06:00:00', 'end_time' => '14:00:00'],
            ['name' => 'Evening Shift', 'start_time' => '14:00:00', 'end_time' => '22:00:00'],
            ['name' => 'Night Shift', 'start_time' => '22:00:00', 'end_time' => '06:00:00'],
        ];
        foreach ($shiftData as $data) {
            $shifts[] = Shift::create([
                'company_id' => $company->id,
                ...$data,
            ]);
        }

        // Create Downtime Categories (10)
        $downtimeCategories = [];
        $downtimeCats = [
            ['name' => 'Breakdown', 'category_type' => 'unplanned', 'is_included_in_oee' => true],
            ['name' => 'Material Shortage', 'category_type' => 'unplanned', 'is_included_in_oee' => true],
            ['name' => 'Quality Issue', 'category_type' => 'unplanned', 'is_included_in_oee' => true],
            ['name' => 'Operator Error', 'category_type' => 'unplanned', 'is_included_in_oee' => true],
            ['name' => 'Changeover', 'category_type' => 'planned', 'is_included_in_oee' => true],
            ['name' => 'Preventive Maintenance', 'category_type' => 'planned', 'is_included_in_oee' => true],
            ['name' => 'Break', 'category_type' => 'planned', 'is_included_in_oee' => false],
            ['name' => 'Meeting', 'category_type' => 'planned', 'is_included_in_oee' => false],
            ['name' => 'Setup', 'category_type' => 'planned', 'is_included_in_oee' => true],
            ['name' => 'Testing', 'category_type' => 'planned', 'is_included_in_oee' => true],
        ];
        foreach ($downtimeCats as $cat) {
            $downtimeCategories[] = DowntimeCategory::create([
                'company_id' => $company->id,
                ...$cat,
            ]);
        }

        // Create Labor Rates for technicians (10)
        foreach ($technicians as $tech) {
            LaborRate::create([
                'company_id' => $company->id,
                'user_id' => $tech->id,
                'hourly_rate' => rand(25, 45),
                'overtime_rate' => rand(35, 60),
                'effective_from' => now()->subMonths(6),
                'effective_to' => null,
            ]);
        }

        // Create Preventive Tasks (20)
        $preventiveTasks = [];
        $intervals = [
            ['value' => 7, 'unit' => 'days'],
            ['value' => 14, 'unit' => 'days'],
            ['value' => 1, 'unit' => 'months'],
            ['value' => 2, 'unit' => 'months'],
            ['value' => 3, 'unit' => 'months'],
            ['value' => 6, 'unit' => 'months'],
        ];

        for ($i = 1; $i <= 20; $i++) {
            $machine = $machines[array_rand($machines)];
            $interval = $intervals[array_rand($intervals)];
            $lastCompleted = now()->subDays(rand(1, 60));

            // Calculate next due date based on interval
            $nextDueDate = $lastCompleted->copy();
            if ($interval['unit'] === 'days') {
                $nextDueDate->addDays($interval['value']);
            } else {
                $nextDueDate->addMonths($interval['value']);
            }

            $preventiveTasks[] = PreventiveTask::create([
                'company_id' => $company->id,
                'machine_id' => $machine->id,
                'title' => "PM Task {$i} - {$machine->name}",
                'description' => "Regular preventive maintenance procedure",
                'schedule_interval_value' => $interval['value'],
                'schedule_interval_unit' => $interval['unit'],
                'next_due_date' => $nextDueDate,
                'last_completed_at' => $lastCompleted,
                'assigned_to' => $technicians[array_rand($technicians)]->id,
            ]);
        }

        // Create Work Orders (40 - mix of completed and open)
        for ($i = 1; $i <= 40; $i++) {
            $machine = $machines[array_rand($machines)];
            $assignedTo = $technicians[array_rand($technicians)];
            $isCompleted = $i <= 30; // 30 completed, 10 open

            $workOrder = WorkOrder::create([
                'company_id' => $company->id,
                'machine_id' => $machine->id,
                'type' => ['breakdown', 'preventive', 'corrective'][array_rand(['breakdown', 'preventive', 'corrective'])],
                'title' => "Work Order {$i} - {$machine->name}",
                'description' => "Maintenance work required on {$machine->name}",
                'status' => $isCompleted ? 'completed' : ['open', 'in_progress'][array_rand(['open', 'in_progress'])],
                'created_by' => $manager->id,
                'assigned_to' => $assignedTo->id,
                'started_at' => $isCompleted ? now()->subDays(rand(5, 30)) : null,
                'completed_at' => $isCompleted ? now()->subDays(rand(1, 25)) : null,
                'cause_category_id' => $isCompleted ? $causeCategories[array_rand($causeCategories)]->id : null,
            ]);

            // Add maintenance log for completed work orders
            if ($isCompleted) {
                $hoursWorked = rand(1, 8);
                $laborRate = LaborRate::where('user_id', $assignedTo->id)->first();
                $laborCost = $laborRate ? $hoursWorked * $laborRate->hourly_rate : 0;

                $workOrder->maintenanceLogs()->create([
                    'user_id' => $assignedTo->id,
                    'machine_id' => $machine->id,
                    'notes' => 'Maintenance completed successfully',
                    'work_done' => 'Performed necessary repairs and adjustments',
                    'time_started' => $workOrder->started_at,
                    'time_completed' => $workOrder->completed_at,
                    'hours_worked' => $hoursWorked,
                    'labor_cost' => $laborCost,
                ]);

                // Attach some spare parts (30% chance)
                if (rand(0, 100) > 70) {
                    $numParts = rand(1, min(3, count($spareParts)));
                    $selectedPartIndexes = (array) array_rand($spareParts, $numParts);

                    foreach ($selectedPartIndexes as $partIndex) {
                        $part = $spareParts[$partIndex];
                        $quantity = rand(1, 5);

                        $workOrder->spareParts()->attach($part->id, [
                            'quantity_used' => $quantity,
                            'unit_cost' => $part->unit_cost,
                        ]);
                    }
                }

                // Create work order cost
                $partsCost = $workOrder->spareParts()->sum(\DB::raw('work_order_spare_parts.quantity_used * work_order_spare_parts.unit_cost'));
                $downtimeHours = \Carbon\Carbon::parse($workOrder->started_at)->diffInHours($workOrder->completed_at, true);
                $downtimeCost = $downtimeHours * $machine->hourly_production_value;

                $workOrder->cost()->create([
                    'labor_cost' => $laborCost,
                    'parts_cost' => $partsCost,
                    'downtime_cost' => $downtimeCost,
                    'external_service_cost' => 0,
                    'total_cost' => $laborCost + $partsCost + $downtimeCost,
                ]);
            }
        }

        // Create Purchase Orders (10)
        for ($i = 1; $i <= 10; $i++) {
            $supplier = $suppliers[array_rand($suppliers)];
            $status = ['draft', 'sent', 'received'][array_rand(['draft', 'sent', 'received'])];

            $po = PurchaseOrder::create([
                'company_id' => $company->id,
                'supplier_id' => $supplier->id,
                'po_number' => 'PO-' . $company->id . '-' . str_pad($i, 5, '0', STR_PAD_LEFT),
                'status' => $status,
                'order_date' => now()->subDays(rand(1, 60)),
                'expected_delivery_date' => now()->addDays(rand(1, 30)),
                'received_date' => $status === 'received' ? now()->subDays(rand(1, 10)) : null,
                'notes' => 'Standard parts order',
                'created_by' => $manager->id,
            ]);

            // Attach parts to PO
            $numParts = rand(2, min(5, count($spareParts)));
            $selectedPartIndexes = (array) array_rand($spareParts, $numParts);

            foreach ($selectedPartIndexes as $partIndex) {
                $part = $spareParts[$partIndex];
                $po->spareParts()->attach($part->id, [
                    'quantity' => rand(10, 100),
                    'unit_cost' => $part->unit_cost,
                    'quantity_received' => $status === 'received' ? rand(10, 100) : 0,
                ]);
            }
        }

        // Create Production Runs (25)
        for ($i = 1; $i <= 25; $i++) {
            $machine = $machines[array_rand($machines)];
            $product = $products[array_rand($products)];
            $shift = $shifts[array_rand($shifts)];
            $isCompleted = $i <= 20; // 20 completed, 5 active

            $startTime = now()->subDays(rand(1, 30))->setTimeFromTimeString($shift->start_time);
            $endTime = $isCompleted ? $startTime->copy()->addHours(8) : null;

            $plannedProductionTime = 8 * 60; // 8 hours in minutes
            $actualProductionTime = $isCompleted ? rand(420, 480) : null; // 7-8 hours
            $theoreticalOutput = $isCompleted ? ($plannedProductionTime * 60) / $product->theoretical_cycle_time : 0;
            $actualOutput = $isCompleted ? (int)(rand(80, 95) * $theoreticalOutput / 100) : 0;
            $goodOutput = $isCompleted ? (int)(rand(95, 100) * $actualOutput / 100) : 0;
            $defectOutput = $isCompleted ? $actualOutput - $goodOutput : 0;

            $availabilityPct = $isCompleted ? rand(8500, 9800) / 100 : null;
            $performancePct = $isCompleted ? rand(8000, 9500) / 100 : null;
            $qualityPct = $isCompleted ? rand(9500, 10000) / 100 : null;
            $oeePct = $isCompleted ? ($availabilityPct * $performancePct * $qualityPct) / 10000 : null;

            ProductionRun::create([
                'company_id' => $company->id,
                'machine_id' => $machine->id,
                'product_id' => $product->id,
                'shift_id' => $shift->id,
                'start_time' => $startTime,
                'end_time' => $endTime,
                'planned_production_time' => $plannedProductionTime,
                'actual_production_time' => $actualProductionTime,
                'theoretical_output' => (int)$theoreticalOutput,
                'actual_output' => $actualOutput,
                'good_output' => $goodOutput,
                'defect_output' => $defectOutput,
                'availability_pct' => $availabilityPct,
                'performance_pct' => $performancePct,
                'quality_pct' => $qualityPct,
                'oee_pct' => $oeePct,
                'created_by' => $manager->id,
            ]);
        }

        // Create Maintenance Budgets (12 months)
        for ($month = 1; $month <= 12; $month++) {
            $budgetedLabor = rand(2000, 6000);
            $budgetedParts = rand(1500, 5000);
            $budgetedTotal = $budgetedLabor + $budgetedParts;

            $actualLabor = $month <= now()->month ? rand(1800, 6500) : 0;
            $actualParts = $month <= now()->month ? rand(1200, 5500) : 0;
            $actualTotal = $actualLabor + $actualParts;

            $variance = $budgetedTotal - $actualTotal;

            MaintenanceBudget::create([
                'company_id' => $company->id,
                'year' => now()->year,
                'month' => $month,
                'budgeted_labor' => $budgetedLabor,
                'budgeted_parts' => $budgetedParts,
                'budgeted_total' => $budgetedTotal,
                'actual_labor' => $actualLabor,
                'actual_parts' => $actualParts,
                'actual_total' => $actualTotal,
                'variance' => $variance,
            ]);
        }
    }
}
