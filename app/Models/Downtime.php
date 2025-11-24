<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Downtime extends Model
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
        'production_run_id',
        'downtime_category_id',
        'start_time',
        'end_time',
        'duration_minutes',
        'description',
        'recorded_by',
    ];

    /**
     * Get the attributes that should be cast.
     */
    protected function casts(): array
    {
        return [
            'start_time' => 'datetime',
            'end_time' => 'datetime',
            'duration_minutes' => 'integer',
        ];
    }

    /**
     * The table associated with the model.
     */
    protected $table = 'downtime';

    /**
     * Get the company that owns the downtime record.
     */
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * Get the machine associated with the downtime.
     */
    public function machine(): BelongsTo
    {
        return $this->belongsTo(Machine::class);
    }

    /**
     * Get the production run associated with the downtime.
     */
    public function productionRun(): BelongsTo
    {
        return $this->belongsTo(ProductionRun::class);
    }

    /**
     * Get the downtime category.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(DowntimeCategory::class, 'downtime_category_id');
    }

    /**
     * Get the user who recorded the downtime.
     */
    public function recorder(): BelongsTo
    {
        return $this->belongsTo(User::class, 'recorded_by');
    }

    /**
     * Scope a query to only include downtime for a specific company.
     */
    public function scopeForCompany($query, int $companyId)
    {
        return $query->where('company_id', $companyId);
    }

    /**
     * Scope a query to only include downtime for a specific machine.
     */
    public function scopeForMachine($query, int $machineId)
    {
        return $query->where('machine_id', $machineId);
    }

    /**
     * Scope a query to only include active (ongoing) downtime.
     */
    public function scopeActive($query)
    {
        return $query->whereNull('end_time');
    }

    /**
     * Scope a query to only include completed downtime.
     */
    public function scopeCompleted($query)
    {
        return $query->whereNotNull('end_time');
    }

    /**
     * Scope a query to only include unplanned downtime.
     */
    public function scopeUnplanned($query)
    {
        return $query->whereHas('category', function ($q) {
            $q->where('category_type', 'unplanned');
        });
    }

    /**
     * Scope a query to only include planned downtime.
     */
    public function scopePlanned($query)
    {
        return $query->whereHas('category', function ($q) {
            $q->where('category_type', 'planned');
        });
    }

    /**
     * Calculate and update the duration based on start and end times.
     */
    public function calculateDuration(): void
    {
        if ($this->start_time && $this->end_time) {
            $this->duration_minutes = $this->start_time->diffInMinutes($this->end_time);
            $this->save();
        }
    }

    /**
     * End the downtime and calculate duration.
     */
    public function end(\DateTimeInterface $endTime = null): void
    {
        $this->end_time = $endTime ?? now();
        $this->calculateDuration();
    }

    /**
     * Check if the downtime is currently active.
     */
    public function isActive(): bool
    {
        return is_null($this->end_time);
    }

    /**
     * Get the duration in a human-readable format.
     */
    public function getFormattedDurationAttribute(): string
    {
        if (!$this->duration_minutes) {
            return 'N/A';
        }

        if ($this->duration_minutes < 60) {
            return $this->duration_minutes . ' min';
        }

        $hours = floor($this->duration_minutes / 60);
        $minutes = $this->duration_minutes % 60;

        if ($minutes === 0) {
            return $hours . ' hour' . ($hours > 1 ? 's' : '');
        }

        return $hours . 'h ' . $minutes . 'm';
    }
}
