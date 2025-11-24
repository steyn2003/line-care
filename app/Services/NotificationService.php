<?php

namespace App\Services;

use App\Models\User;
use App\Models\NotificationPreference;
use App\Services\Notifications\NotificationChannelInterface;
use App\Services\Notifications\EmailNotificationChannel;
use App\Services\Notifications\SmsNotificationChannel;
use App\Services\Notifications\PushNotificationChannel;
use Illuminate\Support\Facades\Log;

class NotificationService
{
    /**
     * Available notification channels
     */
    protected array $channels = [];

    /**
     * Constructor - Register all available channels
     */
    public function __construct()
    {
        $this->registerChannel(new EmailNotificationChannel());
        $this->registerChannel(new SmsNotificationChannel());
        $this->registerChannel(new PushNotificationChannel());
    }

    /**
     * Register a notification channel
     */
    public function registerChannel(NotificationChannelInterface $channel): void
    {
        $this->channels[$channel->getName()] = $channel;
    }

    /**
     * Get a specific channel
     */
    public function getChannel(string $name): ?NotificationChannelInterface
    {
        return $this->channels[$name] ?? null;
    }

    /**
     * Get all registered channels
     */
    public function getChannels(): array
    {
        return $this->channels;
    }

    /**
     * Get all available (configured) channels
     */
    public function getAvailableChannels(): array
    {
        return array_filter($this->channels, function (NotificationChannelInterface $channel) {
            return $channel->isAvailable();
        });
    }

    /**
     * Send notification to a user through all enabled channels
     *
     * @param User $user The recipient
     * @param string $type Notification type (work_order_assigned, part_low_stock, etc.)
     * @param array $data Notification data
     * @return array Results from each channel ['email' => true, 'sms' => false, 'push' => true]
     */
    public function notify(User $user, string $type, array $data): array
    {
        $preferences = $this->getUserPreferences($user, $type);
        $results = [];

        Log::info("Sending notification to user {$user->id}", [
            'type' => $type,
            'preferences' => $preferences
        ]);

        // Send through each enabled channel
        foreach ($preferences as $channelName => $enabled) {
            if (!$enabled) {
                $results[$channelName] = [
                    'sent' => false,
                    'reason' => 'disabled_by_user'
                ];
                continue;
            }

            $channel = $this->getChannel($channelName);

            if (!$channel) {
                $results[$channelName] = [
                    'sent' => false,
                    'reason' => 'channel_not_found'
                ];
                continue;
            }

            if (!$channel->isAvailable()) {
                $results[$channelName] = [
                    'sent' => false,
                    'reason' => 'channel_not_available'
                ];
                continue;
            }

            try {
                $sent = $channel->send($user, $type, $data);
                $results[$channelName] = [
                    'sent' => $sent,
                    'reason' => $sent ? 'success' : 'send_failed'
                ];
            } catch (\Exception $e) {
                $results[$channelName] = [
                    'sent' => false,
                    'reason' => 'exception',
                    'error' => $e->getMessage()
                ];

                Log::error("Exception sending notification via {$channelName}", [
                    'user_id' => $user->id,
                    'type' => $type,
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]);
            }
        }

        Log::info("Notification send complete", [
            'user_id' => $user->id,
            'type' => $type,
            'results' => $results
        ]);

        return $results;
    }

    /**
     * Send notification to multiple users
     *
     * @param array $users Array of User models
     * @param string $type Notification type
     * @param array $data Notification data
     * @return array Results keyed by user ID
     */
    public function notifyMany(array $users, string $type, array $data): array
    {
        $results = [];

        foreach ($users as $user) {
            if (!$user instanceof User) {
                Log::warning("Invalid user object in notifyMany", [
                    'type' => gettype($user)
                ]);
                continue;
            }

            $results[$user->id] = $this->notify($user, $type, $data);
        }

        return $results;
    }

    /**
     * Send notification to all users with a specific role
     *
     * @param string $role User role (operator, technician, manager)
     * @param string $type Notification type
     * @param array $data Notification data
     * @param int|null $companyId Optional company filter
     * @return array Results keyed by user ID
     */
    public function notifyByRole(string $role, string $type, array $data, ?int $companyId = null): array
    {
        $query = User::where('role', $role);

        if ($companyId) {
            $query->where('company_id', $companyId);
        }

        $users = $query->get();

        Log::info("Notifying users by role", [
            'role' => $role,
            'type' => $type,
            'company_id' => $companyId,
            'user_count' => $users->count()
        ]);

        return $this->notifyMany($users->all(), $type, $data);
    }

    /**
     * Get user preferences for a notification type
     *
     * @param User $user
     * @param string $type
     * @return array ['email' => true, 'sms' => false, 'push' => true]
     */
    protected function getUserPreferences(User $user, string $type): array
    {
        $preference = NotificationPreference::where('user_id', $user->id)
            ->where('notification_type', $type)
            ->first();

        // If no preference exists, return defaults (email enabled, others disabled)
        if (!$preference) {
            return $this->getDefaultPreferences($type);
        }

        return [
            'email' => $preference->email_enabled,
            'sms' => $preference->sms_enabled,
            'push' => $preference->push_enabled,
        ];
    }

    /**
     * Get default preferences for a notification type
     */
    protected function getDefaultPreferences(string $type): array
    {
        // Critical notifications: enable email by default
        $criticalTypes = [
            'work_order_overdue',
            'sensor_alert',
            'budget_exceeded',
        ];

        $isCritical = in_array($type, $criticalTypes);

        return [
            'email' => $isCritical, // Critical: email on, others: email off by default
            'sms' => false,         // SMS off by default
            'push' => false,        // Push off by default
        ];
    }

    /**
     * Test notification sending to a user
     *
     * @param User $user
     * @param string $channel Channel name (email, sms, push)
     * @return array Test result
     */
    public function testChannel(User $user, string $channel): array
    {
        $channelInstance = $this->getChannel($channel);

        if (!$channelInstance) {
            return [
                'success' => false,
                'error' => 'Channel not found'
            ];
        }

        if (!$channelInstance->isAvailable()) {
            return [
                'success' => false,
                'error' => 'Channel not available (not configured)'
            ];
        }

        if (!$channelInstance->canSendToUser($user)) {
            return [
                'success' => false,
                'error' => 'User cannot receive notifications on this channel'
            ];
        }

        $testData = [
            'title' => 'Test Notification',
            'message' => 'This is a test notification from LineCare',
            'timestamp' => now()->toDateTimeString(),
        ];

        try {
            $sent = $channelInstance->send($user, 'test', $testData);

            return [
                'success' => $sent,
                'message' => $sent ? 'Test notification sent successfully' : 'Failed to send test notification'
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Get notification statistics for a user
     *
     * @param User $user
     * @param int $days Number of days to look back
     * @return array Statistics
     */
    public function getUserStatistics(User $user, int $days = 30): array
    {
        // This assumes notifications table exists (from MVP)
        $notifications = \DB::table('notifications')
            ->where('user_id', $user->id)
            ->where('created_at', '>=', now()->subDays($days))
            ->get();

        $total = $notifications->count();
        $read = $notifications->where('read_at', '!=', null)->count();
        $unread = $total - $read;

        $byType = $notifications->groupBy('type')->map(function ($group) {
            return $group->count();
        })->toArray();

        return [
            'total' => $total,
            'read' => $read,
            'unread' => $unread,
            'by_type' => $byType,
            'period_days' => $days,
        ];
    }
}
