<?php

namespace App\Services\Notifications;

use App\Models\User;
use Illuminate\Support\Facades\Log;

class PushNotificationChannel implements NotificationChannelInterface
{
    /**
     * Send push notification
     *
     * NOTE: This is a stub implementation ready for activation.
     * To activate:
     * 1. Install push notification package (e.g., Laravel FCM or OneSignal)
     * 2. Set up Firebase Cloud Messaging or OneSignal account
     * 3. Add credentials to .env (FCM_SERVER_KEY or ONESIGNAL_APP_ID)
     * 4. Add device_tokens table to store user device tokens
     * 5. Implement the actual push sending logic below
     * 6. Update isAvailable() to check for configured credentials
     */
    public function send(User $user, string $type, array $data): bool
    {
        try {
            if (!$this->canSendToUser($user)) {
                Log::info("User {$user->id} cannot receive push notifications (no device tokens)");
                return false;
            }

            $title = $this->getTitleForType($type, $data);
            $body = $this->getBodyForType($type, $data);
            $notificationData = $this->getNotificationData($type, $data);

            // TODO: Implement actual push notification sending
            // Example with Firebase Cloud Messaging:
            // $fcm = new \LaravelFCM\Message\PayloadNotificationBuilder($title);
            // $fcm->setBody($body)
            //     ->setSound('default')
            //     ->setBadge(1);
            //
            // $dataBuilder = new \LaravelFCM\Message\PayloadDataBuilder();
            // $dataBuilder->addData($notificationData);
            //
            // $tokens = $user->deviceTokens->pluck('token')->toArray();
            //
            // FCM::sendTo($tokens, null, $fcm->build(), $dataBuilder->build());

            Log::info("Push notification would be sent to user {$user->id} (stub mode)", [
                'user_id' => $user->id,
                'type' => $type,
                'title' => $title,
                'body' => $body
            ]);

            // Return false until actual implementation is added
            return false;
        } catch (\Exception $e) {
            Log::error("Failed to send push notification", [
                'user_id' => $user->id,
                'type' => $type,
                'error' => $e->getMessage()
            ]);

            return false;
        }
    }

    /**
     * Check if push notifications are configured
     */
    public function isAvailable(): bool
    {
        // Check if Firebase Cloud Messaging credentials are configured
        return !empty(config('services.fcm.server_key'))
            || !empty(config('services.fcm.credentials_file'));
    }

    /**
     * Get channel name
     */
    public function getName(): string
    {
        return 'push';
    }

    /**
     * Validate user can receive push notifications
     */
    public function canSendToUser(User $user): bool
    {
        // Check if user has registered device tokens
        return $user->deviceTokens()->exists();
    }

    /**
     * Get notification title for type
     */
    protected function getTitleForType(string $type, array $data): string
    {
        $titles = [
            'work_order_assigned' => 'New Work Order',
            'work_order_overdue' => 'Work Order Overdue',
            'preventive_task_due' => 'Preventive Maintenance Due',
            'part_low_stock' => 'Low Stock Alert',
            'sensor_alert' => 'Sensor Alert',
            'budget_exceeded' => 'Budget Alert',
            'production_run_complete' => 'Production Complete',
        ];

        return $titles[$type] ?? 'LineCare Notification';
    }

    /**
     * Get notification body for type
     */
    protected function getBodyForType(string $type, array $data): string
    {
        $bodies = [
            'work_order_assigned' => 'You have been assigned: ' . ($data['work_order_title'] ?? 'New task'),
            'work_order_overdue' => ($data['work_order_title'] ?? 'A work order') . ' is overdue',
            'preventive_task_due' => ($data['task_title'] ?? 'A task') . ' is due on ' . ($data['machine_name'] ?? 'a machine'),
            'part_low_stock' => ($data['part_name'] ?? 'A part') . ' is running low (' . ($data['quantity'] ?? '0') . ' remaining)',
            'sensor_alert' => ($data['machine_name'] ?? 'Machine') . ' triggered a ' . ($data['alert_type'] ?? 'sensor') . ' alert',
            'budget_exceeded' => 'Monthly maintenance budget has been exceeded',
            'production_run_complete' => 'Run completed on ' . ($data['machine_name'] ?? 'machine') . ' - OEE: ' . ($data['oee'] ?? 'N/A') . '%',
        ];

        return $bodies[$type] ?? 'You have a new notification';
    }

    /**
     * Get additional data to send with notification
     */
    protected function getNotificationData(string $type, array $data): array
    {
        return [
            'notification_type' => $type,
            'click_action' => $this->getClickActionForType($type, $data),
            'timestamp' => now()->toIso8601String(),
        ];
    }

    /**
     * Get deep link/action for notification type
     */
    protected function getClickActionForType(string $type, array $data): string
    {
        $actions = [
            'work_order_assigned' => '/work-orders/' . ($data['work_order_id'] ?? ''),
            'work_order_overdue' => '/work-orders/' . ($data['work_order_id'] ?? ''),
            'preventive_task_due' => '/preventive-tasks/' . ($data['task_id'] ?? ''),
            'part_low_stock' => '/spare-parts/' . ($data['part_id'] ?? ''),
            'sensor_alert' => '/machines/' . ($data['machine_id'] ?? '') . '/sensors',
            'budget_exceeded' => '/cost-management/budget',
            'production_run_complete' => '/oee/production-runs/' . ($data['production_run_id'] ?? ''),
        ];

        return $actions[$type] ?? '/notifications';
    }
}
