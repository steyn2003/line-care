<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Shift extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'company_id',
        'name',
        'start_time',
        'end_time',
        'is_active',
    ];

    /**
     * Get the attributes that should be cast.
     */
    protected function casts(): array
    {
        return [
            'start_time' => 'datetime:H:i', // Time only (e.g., "08:00")
            'end_time' => 'datetime:H:i',   // Time only (e.g., "16:00")
            'is_active' => 'boolean',
        ];
    }

    /**
     * Get the company that owns the shift.
     */
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * Get the production runs for this shift.
     */
    public function productionRuns(): HasMany
    {
        return $this->hasMany(ProductionRun::class);
    }

    /**
     * Scope a query to only include shifts for a specific company.
     */
    public function scopeForCompany($query, int $companyId)
    {
        return $query->where('company_id', $companyId);
    }

    /**
     * Scope a query to only include active shifts.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Calculate the shift duration in minutes.
     */
    public function getDurationInMinutes(): int
    {
        $start = \Carbon\Carbon::parse($this->start_time);
        $end = \Carbon\Carbon::parse($this->end_time);

        // Handle shifts that cross midnight
        if ($end->lessThan($start)) {
            $end->addDay();
        }

        return $start->diffInMinutes($end);
    }

    /**
     * Get the shift duration in a human-readable format.
     */
    public function getFormattedDurationAttribute(): string
    {
        $minutes = $this->getDurationInMinutes();
        $hours = floor($minutes / 60);
        $mins = $minutes % 60;

        if ($mins === 0) {
            return $hours . ' hour' . ($hours > 1 ? 's' : '');
        }

        return $hours . 'h ' . $mins . 'm';
    }

    /**
     * Check if the shift is currently active based on the time.
     */
    public function isCurrentlyActive(): bool
    {
        if (!$this->is_active) {
            return false;
        }

        $now = now()->format('H:i');
        $start = \Carbon\Carbon::parse($this->start_time)->format('H:i');
        $end = \Carbon\Carbon::parse($this->end_time)->format('H:i');

        // Handle shifts that cross midnight
        if ($end < $start) {
            return $now >= $start || $now <= $end;
        }

        return $now >= $start && $now <= $end;
    }
}
