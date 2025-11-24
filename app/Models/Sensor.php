<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Sensor extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'company_id',
        'machine_id',
        'name',
        'sensor_type',
        'sensor_id',
        'protocol',
        'unit',
        'warning_threshold',
        'critical_threshold',
        'is_active',
        'last_reading_at',
        'last_reading_value',
        'config',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'warning_threshold' => 'decimal:2',
        'critical_threshold' => 'decimal:2',
        'is_active' => 'boolean',
        'last_reading_at' => 'datetime',
        'last_reading_value' => 'decimal:2',
        'config' => 'array',
    ];

    /**
     * Get the company that owns the sensor.
     */
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * Get the machine that owns the sensor.
     */
    public function machine(): BelongsTo
    {
        return $this->belongsTo(Machine::class);
    }

    /**
     * Get the readings for the sensor.
     */
    public function readings(): HasMany
    {
        return $this->hasMany(SensorReading::class);
    }

    /**
     * Get the alerts for the sensor.
     */
    public function alerts(): HasMany
    {
        return $this->hasMany(SensorAlert::class);
    }

    /**
     * Check if a reading value exceeds the critical threshold.
     */
    public function exceedsCriticalThreshold(float $value): bool
    {
        return $this->critical_threshold !== null && $value >= $this->critical_threshold;
    }

    /**
     * Check if a reading value exceeds the warning threshold.
     */
    public function exceedsWarningThreshold(float $value): bool
    {
        return $this->warning_threshold !== null && $value >= $this->warning_threshold;
    }

    /**
     * Check if a reading value triggers any alert.
     */
    public function shouldTriggerAlert(float $value): bool
    {
        return $this->exceedsCriticalThreshold($value) || $this->exceedsWarningThreshold($value);
    }

    /**
     * Get the alert type for a given reading value.
     */
    public function getAlertType(float $value): ?string
    {
        if ($this->exceedsCriticalThreshold($value)) {
            return 'critical';
        }

        if ($this->exceedsWarningThreshold($value)) {
            return 'warning';
        }

        return null;
    }

    /**
     * Update the last reading information.
     */
    public function updateLastReading(float $value): void
    {
        $this->update([
            'last_reading_at' => now(),
            'last_reading_value' => $value,
        ]);
    }
}
