<?php

namespace Database\Seeders;

use App\Models\NotificationPreference;
use App\Models\User;
use Illuminate\Database\Seeder;

class NotificationPreferenceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('Seeding notification preferences...');

        $users = User::all();

        if ($users->isEmpty()) {
            $this->command->warn('No users found. Please run UserSeeder first.');
            return;
        }

        $notificationTypes = [
            'work_order_assigned',
            'work_order_overdue',
            'preventive_task_due',
            'part_low_stock',
            'sensor_alert',
            'budget_exceeded',
            'production_run_complete',
        ];

        $preferencesCreated = 0;

        foreach ($users as $user) {
            // Set preferences based on user role
            $preferences = $this->getDefaultPreferencesForRole($user->role);

            foreach ($notificationTypes as $type) {
                NotificationPreference::create([
                    'user_id' => $user->id,
                    'notification_type' => $type,
                    'email_enabled' => $preferences[$type]['email'] ?? true,
                    'sms_enabled' => $preferences[$type]['sms'] ?? false,
                    'push_enabled' => $preferences[$type]['push'] ?? false,
                ]);
                $preferencesCreated++;
            }
        }

        $this->command->info("✓ Created {$preferencesCreated} notification preferences for {$users->count()} users");
    }

    /**
     * Get default notification preferences based on user role
     */
    protected function getDefaultPreferencesForRole(string $role): array
    {
        switch ($role) {
            case 'manager':
                // Managers get email for everything
                return [
                    'work_order_assigned' => [
                        'email' => true,
                        'sms' => false,
                        'push' => false,
                    ],
                    'work_order_overdue' => [
                        'email' => true,
                        'sms' => false, // Could enable SMS for critical alerts
                        'push' => false,
                    ],
                    'preventive_task_due' => [
                        'email' => true,
                        'sms' => false,
                        'push' => false,
                    ],
                    'part_low_stock' => [
                        'email' => true,
                        'sms' => false,
                        'push' => false,
                    ],
                    'sensor_alert' => [
                        'email' => true,
                        'sms' => false, // Could enable SMS for critical sensors
                        'push' => false,
                    ],
                    'budget_exceeded' => [
                        'email' => true,
                        'sms' => false,
                        'push' => false,
                    ],
                    'production_run_complete' => [
                        'email' => true,
                        'sms' => false,
                        'push' => false,
                    ],
                ];

            case 'technician':
                // Technicians get email for work-related notifications
                return [
                    'work_order_assigned' => [
                        'email' => true,
                        'sms' => false,
                        'push' => false, // Could enable push for mobile app
                    ],
                    'work_order_overdue' => [
                        'email' => true,
                        'sms' => false,
                        'push' => false,
                    ],
                    'preventive_task_due' => [
                        'email' => true,
                        'sms' => false,
                        'push' => false,
                    ],
                    'part_low_stock' => [
                        'email' => false, // Not relevant for technicians
                        'sms' => false,
                        'push' => false,
                    ],
                    'sensor_alert' => [
                        'email' => true, // They need to know about alerts
                        'sms' => false,
                        'push' => false,
                    ],
                    'budget_exceeded' => [
                        'email' => false, // Not relevant for technicians
                        'sms' => false,
                        'push' => false,
                    ],
                    'production_run_complete' => [
                        'email' => false, // Not relevant for technicians
                        'sms' => false,
                        'push' => false,
                    ],
                ];

            case 'operator':
                // Operators get minimal notifications
                return [
                    'work_order_assigned' => [
                        'email' => true, // If they're assigned work orders
                        'sms' => false,
                        'push' => false,
                    ],
                    'work_order_overdue' => [
                        'email' => false,
                        'sms' => false,
                        'push' => false,
                    ],
                    'preventive_task_due' => [
                        'email' => false,
                        'sms' => false,
                        'push' => false,
                    ],
                    'part_low_stock' => [
                        'email' => false,
                        'sms' => false,
                        'push' => false,
                    ],
                    'sensor_alert' => [
                        'email' => false, // They see it on the machine
                        'sms' => false,
                        'push' => false,
                    ],
                    'budget_exceeded' => [
                        'email' => false,
                        'sms' => false,
                        'push' => false,
                    ],
                    'production_run_complete' => [
                        'email' => false,
                        'sms' => false,
                        'push' => false,
                    ],
                ];

            default:
                // Default: email enabled for critical notifications only
                return [
                    'work_order_assigned' => [
                        'email' => true,
                        'sms' => false,
                        'push' => false,
                    ],
                    'work_order_overdue' => [
                        'email' => true,
                        'sms' => false,
                        'push' => false,
                    ],
                    'preventive_task_due' => [
                        'email' => false,
                        'sms' => false,
                        'push' => false,
                    ],
                    'part_low_stock' => [
                        'email' => false,
                        'sms' => false,
                        'push' => false,
                    ],
                    'sensor_alert' => [
                        'email' => true,
                        'sms' => false,
                        'push' => false,
                    ],
                    'budget_exceeded' => [
                        'email' => false,
                        'sms' => false,
                        'push' => false,
                    ],
                    'production_run_complete' => [
                        'email' => false,
                        'sms' => false,
                        'push' => false,
                    ],
                ];
        }
    }
}
