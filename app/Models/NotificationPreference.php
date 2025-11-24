<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NotificationPreference extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'notification_type',
        'email_enabled',
        'sms_enabled',
        'push_enabled',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_enabled' => 'boolean',
        'sms_enabled' => 'boolean',
        'push_enabled' => 'boolean',
    ];

    /**
     * Available notification types.
     */
    const TYPE_WORK_ORDER_ASSIGNED = 'work_order_assigned';
    const TYPE_WORK_ORDER_OVERDUE = 'work_order_overdue';
    const TYPE_PREVENTIVE_TASK_DUE = 'preventive_task_due';
    const TYPE_PART_LOW_STOCK = 'part_low_stock';
    const TYPE_SENSOR_ALERT = 'sensor_alert';
    const TYPE_BUDGET_EXCEEDED = 'budget_exceeded';
    const TYPE_PRODUCTION_RUN_COMPLETE = 'production_run_complete';

    /**
     * Get all available notification types.
     */
    public static function getAvailableTypes(): array
    {
        return [
            self::TYPE_WORK_ORDER_ASSIGNED,
            self::TYPE_WORK_ORDER_OVERDUE,
            self::TYPE_PREVENTIVE_TASK_DUE,
            self::TYPE_PART_LOW_STOCK,
            self::TYPE_SENSOR_ALERT,
            self::TYPE_BUDGET_EXCEEDED,
            self::TYPE_PRODUCTION_RUN_COMPLETE,
        ];
    }

    /**
     * Get the user that owns the preference.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Check if any channel is enabled.
     */
    public function hasAnyChannelEnabled(): bool
    {
        return $this->email_enabled || $this->sms_enabled || $this->push_enabled;
    }

    /**
     * Get enabled channels as an array.
     */
    public function getEnabledChannels(): array
    {
        $channels = [];

        if ($this->email_enabled) {
            $channels[] = 'email';
        }

        if ($this->sms_enabled) {
            $channels[] = 'sms';
        }

        if ($this->push_enabled) {
            $channels[] = 'push';
        }

        return $channels;
    }
}
