<?php

namespace App\Models;

use App\Enums\AvailabilityType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;

class TechnicianAvailability extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'technician_availability';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'company_id',
        'technician_id',
        'date',
        'start_time',
        'end_time',
        'availability_type',
        'notes',
    ];

    /**
     * Get the attributes that should be cast.
     */
    protected function casts(): array
    {
        return [
            'date' => 'date',
            'start_time' => 'datetime:H:i',
            'end_time' => 'datetime:H:i',
            'availability_type' => AvailabilityType::class,
        ];
    }

    /**
     * Get the company that owns the availability record.
     */
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * Get the technician for the availability record.
     */
    public function technician(): BelongsTo
    {
        return $this->belongsTo(User::class, 'technician_id');
    }

    /**
     * Scope a query to only include records for a specific company.
     */
    public function scopeForCompany(Builder $query, int $companyId): Builder
    {
        return $query->where('company_id', $companyId);
    }

    /**
     * Scope a query to only include records for a specific technician.
     */
    public function scopeForTechnician(Builder $query, int $technicianId): Builder
    {
        return $query->where('technician_id', $technicianId);
    }

    /**
     * Scope a query to only include records for a specific date.
     */
    public function scopeForDate(Builder $query, string $date): Builder
    {
        return $query->where('date', $date);
    }

    /**
     * Scope a query to only include records within a date range.
     */
    public function scopeInDateRange(Builder $query, string $from, string $to): Builder
    {
        return $query->whereBetween('date', [$from, $to]);
    }

    /**
     * Scope a query to only include available records.
     */
    public function scopeAvailable(Builder $query): Builder
    {
        return $query->where('availability_type', AvailabilityType::AVAILABLE);
    }

    /**
     * Scope a query to only include unavailable records.
     */
    public function scopeUnavailable(Builder $query): Builder
    {
        return $query->whereIn('availability_type', [
            AvailabilityType::VACATION,
            AvailabilityType::SICK,
            AvailabilityType::TRAINING,
        ]);
    }

    /**
     * Get the duration in minutes.
     */
    public function getDurationMinutesAttribute(): int
    {
        $start = \Carbon\Carbon::parse($this->start_time);
        $end = \Carbon\Carbon::parse($this->end_time);

        return (int) $start->diffInMinutes($end);
    }

    /**
     * Get the duration in hours.
     */
    public function getDurationHoursAttribute(): float
    {
        return round($this->duration_minutes / 60, 2);
    }

    /**
     * Check if the technician is available during this record.
     */
    public function isAvailable(): bool
    {
        return $this->availability_type === AvailabilityType::AVAILABLE;
    }

    /**
     * Check if the technician is unavailable during this record.
     */
    public function isUnavailable(): bool
    {
        return $this->availability_type->isUnavailable();
    }
}
