<?php

namespace App\Services\Notifications;

use App\Models\User;

interface NotificationChannelInterface
{
    /**
     * Send a notification through this channel
     *
     * @param User $user The recipient
     * @param string $type The notification type (work_order_assigned, part_low_stock, etc.)
     * @param array $data The notification data
     * @return bool Success status
     */
    public function send(User $user, string $type, array $data): bool;

    /**
     * Check if this channel is available/configured
     *
     * @return bool
     */
    public function isAvailable(): bool;

    /**
     * Get the channel name
     *
     * @return string
     */
    public function getName(): string;

    /**
     * Validate that the user can receive notifications on this channel
     *
     * @param User $user
     * @return bool
     */
    public function canSendToUser(User $user): bool;
}
