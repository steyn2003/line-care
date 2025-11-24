<?php

namespace App\Services\Notifications;

use App\Models\User;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class EmailNotificationChannel implements NotificationChannelInterface
{
    /**
     * Send email notification
     */
    public function send(User $user, string $type, array $data): bool
    {
        try {
            if (!$this->canSendToUser($user)) {
                Log::info("User {$user->id} cannot receive email notifications (no email or invalid)");
                return false;
            }

            $template = $this->getTemplateForType($type);
            $subject = $this->getSubjectForType($type, $data);

            Mail::send($template, $data, function ($message) use ($user, $subject) {
                $message->to($user->email, $user->name)
                    ->subject($subject);
            });

            Log::info("Email notification sent to {$user->email}", [
                'user_id' => $user->id,
                'type' => $type
            ]);

            return true;
        } catch (\Exception $e) {
            Log::error("Failed to send email notification", [
                'user_id' => $user->id,
                'type' => $type,
                'error' => $e->getMessage()
            ]);

            return false;
        }
    }

    /**
     * Check if email is configured
     */
    public function isAvailable(): bool
    {
        // Check if mail driver is configured
        try {
            $driver = config('mail.default');
            return !empty($driver) && $driver !== 'log';
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Get channel name
     */
    public function getName(): string
    {
        return 'email';
    }

    /**
     * Validate user can receive emails
     */
    public function canSendToUser(User $user): bool
    {
        return !empty($user->email) && filter_var($user->email, FILTER_VALIDATE_EMAIL);
    }

    /**
     * Get email template for notification type
     */
    protected function getTemplateForType(string $type): string
    {
        $templates = [
            'work_order_assigned' => 'emails.notifications.work-order-assigned',
            'work_order_overdue' => 'emails.notifications.work-order-overdue',
            'preventive_task_due' => 'emails.notifications.preventive-task-due',
            'part_low_stock' => 'emails.notifications.part-low-stock',
            'sensor_alert' => 'emails.notifications.sensor-alert',
            'budget_exceeded' => 'emails.notifications.budget-exceeded',
            'production_run_complete' => 'emails.notifications.production-run-complete',
        ];

        return $templates[$type] ?? 'emails.notifications.default';
    }

    /**
     * Get email subject for notification type
     */
    protected function getSubjectForType(string $type, array $data): string
    {
        $subjects = [
            'work_order_assigned' => 'Work Order Assigned: ' . ($data['work_order_title'] ?? 'New Task'),
            'work_order_overdue' => 'Work Order Overdue: ' . ($data['work_order_title'] ?? 'Task'),
            'preventive_task_due' => 'Preventive Maintenance Due: ' . ($data['task_title'] ?? 'Task'),
            'part_low_stock' => 'Low Stock Alert: ' . ($data['part_name'] ?? 'Part'),
            'sensor_alert' => 'Sensor Alert: ' . ($data['machine_name'] ?? 'Machine') . ' - ' . ($data['alert_type'] ?? 'Alert'),
            'budget_exceeded' => 'Budget Alert: Monthly Budget Exceeded',
            'production_run_complete' => 'Production Run Complete: ' . ($data['machine_name'] ?? 'Machine'),
        ];

        return $subjects[$type] ?? 'LineCare Notification';
    }
}
