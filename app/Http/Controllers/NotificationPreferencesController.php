<?php

namespace App\Http\Controllers;

use App\Models\NotificationPreference;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NotificationPreferencesController extends Controller
{
    /**
     * Display notification preferences for the authenticated user
     */
    public function index(Request $request): Response
    {
        $preferences = NotificationPreference::where('user_id', $request->user()->id)
            ->get()
            ->keyBy('notification_type');

        // Get available notification types
        $notificationTypes = NotificationPreference::getAvailableTypes();

        // Ensure all notification types have a preference (create defaults if missing)
        foreach ($notificationTypes as $type) {
            if (!$preferences->has($type)) {
                $preferences[$type] = [
                    'notification_type' => $type,
                    'email_enabled' => false,
                    'sms_enabled' => false,
                    'push_enabled' => false,
                ];
            }
        }

        return Inertia::render('Settings/Notifications/Index', [
            'preferences' => $preferences->values(),
            'notificationTypes' => $this->getNotificationTypesWithDescriptions(),
        ]);
    }

    /**
     * Update notification preferences
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'preferences' => 'required|array',
            'preferences.*.notification_type' => 'required|string',
            'preferences.*.email_enabled' => 'required|boolean',
            'preferences.*.sms_enabled' => 'required|boolean',
            'preferences.*.push_enabled' => 'required|boolean',
        ]);

        foreach ($validated['preferences'] as $preferenceData) {
            NotificationPreference::updateOrCreate(
                [
                    'user_id' => $request->user()->id,
                    'notification_type' => $preferenceData['notification_type'],
                ],
                [
                    'email_enabled' => $preferenceData['email_enabled'],
                    'sms_enabled' => $preferenceData['sms_enabled'],
                    'push_enabled' => $preferenceData['push_enabled'],
                ]
            );
        }

        return back()->with('success', 'Notification preferences updated successfully');
    }

    /**
     * Get notification types with descriptions
     */
    protected function getNotificationTypesWithDescriptions(): array
    {
        return [
            [
                'type' => 'work_order_assigned',
                'label' => 'Work Order Assigned',
                'description' => 'Receive notification when a work order is assigned to you',
                'category' => 'Work Orders',
            ],
            [
                'type' => 'work_order_overdue',
                'label' => 'Work Order Overdue',
                'description' => 'Get alerted when your work orders are overdue',
                'category' => 'Work Orders',
            ],
            [
                'type' => 'preventive_task_due',
                'label' => 'Preventive Task Due',
                'description' => 'Reminder when preventive maintenance tasks are due',
                'category' => 'Maintenance',
            ],
            [
                'type' => 'part_low_stock',
                'label' => 'Low Stock Alert',
                'description' => 'Get notified when spare parts inventory is running low',
                'category' => 'Inventory',
            ],
            [
                'type' => 'sensor_alert',
                'label' => 'Sensor Alert',
                'description' => 'Receive alerts when IoT sensors detect abnormal readings',
                'category' => 'IoT',
            ],
            [
                'type' => 'budget_exceeded',
                'label' => 'Budget Exceeded',
                'description' => 'Get alerted when maintenance budget is exceeded',
                'category' => 'Costs',
            ],
            [
                'type' => 'production_run_complete',
                'label' => 'Production Complete',
                'description' => 'Notification when production runs are completed with OEE data',
                'category' => 'Production',
            ],
        ];
    }
}
