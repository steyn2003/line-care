<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SensorAlert extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'sensor_id',
        'machine_id',
        'work_order_id',
        'alert_type',
        'threshold_value',
        'current_value',
        'triggered_at',
        'acknowledged_at',
        'acknowledged_by',
        'acknowledgment_note',
        'auto_created_work_order',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'threshold_value' => 'decimal:2',
        'current_value' => 'decimal:2',
        'triggered_at' => 'datetime',
        'acknowledged_at' => 'datetime',
        'auto_created_work_order' => 'boolean',
    ];

    /**
     * Get the sensor that owns the alert.
     */
    public function sensor(): BelongsTo
    {
        return $this->belongsTo(Sensor::class);
    }

    /**
     * Get the machine associated with the alert.
     */
    public function machine(): BelongsTo
    {
        return $this->belongsTo(Machine::class);
    }

    /**
     * Get the work order associated with the alert.
     */
    public function workOrder(): BelongsTo
    {
        return $this->belongsTo(WorkOrder::class);
    }

    /**
     * Get the user who acknowledged the alert.
     */
    public function acknowledgedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'acknowledged_by');
    }

    /**
     * Check if the alert is acknowledged.
     */
    public function isAcknowledged(): bool
    {
        return $this->acknowledged_at !== null;
    }

    /**
     * Check if the alert is critical.
     */
    public function isCritical(): bool
    {
        return $this->alert_type === 'critical';
    }

    /**
     * Check if the alert is a warning.
     */
    public function isWarning(): bool
    {
        return $this->alert_type === 'warning';
    }

    /**
     * Acknowledge the alert.
     */
    public function acknowledge(User $user, ?string $note = null): void
    {
        $this->update([
            'acknowledged_at' => now(),
            'acknowledged_by' => $user->id,
            'acknowledgment_note' => $note,
        ]);
    }

    /**
     * Scope a query to only include unacknowledged alerts.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeUnacknowledged($query)
    {
        return $query->whereNull('acknowledged_at');
    }

    /**
     * Scope a query to only include critical alerts.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeCritical($query)
    {
        return $query->where('alert_type', 'critical');
    }
}
