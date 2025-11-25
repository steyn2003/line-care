<?php

namespace App\Services\Notifications;

use App\Models\User;
use Illuminate\Support\Facades\Log;

class SmsNotificationChannel implements NotificationChannelInterface
{
    /**
     * Send SMS notification
     *
     * NOTE: This is a stub implementation ready for activation.
     * To activate:
     * 1. Install SMS provider package (e.g., Twilio SDK: composer require twilio/sdk)
     * 2. Add SMS credentials to .env (TWILIO_SID, TWILIO_TOKEN, TWILIO_FROM)
     * 3. Implement the actual SMS sending logic below
     * 4. Update isAvailable() to check for configured credentials
     */
    public function send(User $user, string $type, array $data): bool
    {
        try {
            if (!$this->canSendToUser($user)) {
                Log::info("User {$user->id} cannot receive SMS notifications (no phone number)");
                return false;
            }

            $message = $this->getMessageForType($type, $data);

            // TODO: Implement actual SMS sending
            // Example with Twilio:
            // $twilio = new \Twilio\Rest\Client(
            //     config('services.twilio.sid'),
            //     config('services.twilio.token')
            // );
            //
            // $twilio->messages->create($user->phone, [
            //     'from' => config('services.twilio.from'),
            //     'body' => $message
            // ]);

            Log::info("SMS notification would be sent to {$user->phone} (stub mode)", [
                'user_id' => $user->id,
                'type' => $type,
                'message' => $message
            ]);

            // Return false until actual implementation is added
            return false;
        } catch (\Exception $e) {
            Log::error("Failed to send SMS notification", [
                'user_id' => $user->id,
                'type' => $type,
                'error' => $e->getMessage()
            ]);

            return false;
        }
    }

    /**
     * Check if SMS is configured
     */
    public function isAvailable(): bool
    {
        // Check if Twilio credentials are configured
        return !empty(config('services.twilio.sid'))
            && !empty(config('services.twilio.token'))
            && !empty(config('services.twilio.from'));
    }

    /**
     * Get channel name
     */
    public function getName(): string
    {
        return 'sms';
    }

    /**
     * Validate user can receive SMS
     */
    public function canSendToUser(User $user): bool
    {
        // Check if user has phone number
        // Assuming phone field exists on users table (needs to be added if not present)
        return !empty($user->phone);
    }

    /**
     * Get SMS message for notification type
     */
    protected function getMessageForType(string $type, array $data): string
    {
        $messages = [
            'work_order_assigned' => 'New work order assigned: ' . ($data['work_order_title'] ?? 'Task') . '. Check LineCare for details.',
            'work_order_overdue' => 'OVERDUE: ' . ($data['work_order_title'] ?? 'Work order') . ' is past due date.',
            'preventive_task_due' => 'PM due: ' . ($data['task_title'] ?? 'Task') . ' on ' . ($data['machine_name'] ?? 'machine') . '.',
            'part_low_stock' => 'LOW STOCK: ' . ($data['part_name'] ?? 'Part') . ' - only ' . ($data['quantity'] ?? '0') . ' remaining.',
            'sensor_alert' => 'ALERT: ' . ($data['machine_name'] ?? 'Machine') . ' - ' . ($data['sensor_type'] ?? 'sensor') . ' ' . ($data['alert_type'] ?? 'alert') . '.',
            'budget_exceeded' => 'Budget alert: Monthly maintenance budget has been exceeded.',
            'production_run_complete' => 'Production complete on ' . ($data['machine_name'] ?? 'machine') . '. OEE: ' . ($data['oee'] ?? 'N/A') . '%',
        ];

        return $messages[$type] ?? 'LineCare notification: ' . $type;
    }
}
