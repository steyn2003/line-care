<?php

namespace App\Models;

use App\Enums\ShutdownType;
use App\Enums\ShutdownStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Builder;

class PlannedShutdown extends Model
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
        'description',
        'machine_id',
        'location_id',
        'start_at',
        'end_at',
        'shutdown_type',
        'status',
        'created_by',
    ];

    /**
     * Get the attributes that should be cast.
     */
    protected function casts(): array
    {
        return [
            'start_at' => 'datetime',
            'end_at' => 'datetime',
            'shutdown_type' => ShutdownType::class,
            'status' => ShutdownStatus::class,
        ];
    }

    /**
     * Get the company that owns the shutdown.
     */
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * Get the machine for the shutdown (optional).
     */
    public function machine(): BelongsTo
    {
        return $this->belongsTo(Machine::class);
    }

    /**
     * Get the location for the shutdown.
     */
    public function location(): BelongsTo
    {
        return $this->belongsTo(Location::class);
    }

    /**
     * Get the user who created the shutdown.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the planning slots scheduled during this shutdown.
     */
    public function planningSlots(): HasMany
    {
        return $this->hasMany(PlanningSlot::class, 'machine_id', 'machine_id')
            ->where('source', 'shutdown')
            ->where('start_at', '>=', $this->start_at)
            ->where('end_at', '<=', $this->end_at);
    }

    /**
     * Scope a query to only include shutdowns for a specific company.
     */
    public function scopeForCompany(Builder $query, int $companyId): Builder
    {
        return $query->where('company_id', $companyId);
    }

    /**
     * Scope a query to only include shutdowns for a specific location.
     */
    public function scopeForLocation(Builder $query, int $locationId): Builder
    {
        return $query->where('location_id', $locationId);
    }

    /**
     * Scope a query to only include shutdowns for a specific machine.
     */
    public function scopeForMachine(Builder $query, int $machineId): Builder
    {
        return $query->where('machine_id', $machineId);
    }

    /**
     * Scope a query to only include shutdowns within a date range.
     */
    public function scopeInDateRange(Builder $query, string $from, string $to): Builder
    {
        return $query->where('start_at', '>=', $from)
            ->where('end_at', '<=', $to);
    }

    /**
     * Scope a query to only include shutdowns that overlap with a date range.
     */
    public function scopeOverlapping(Builder $query, string $from, string $to): Builder
    {
        return $query->where(function ($q) use ($from, $to) {
            $q->whereBetween('start_at', [$from, $to])
                ->orWhereBetween('end_at', [$from, $to])
                ->orWhere(function ($q2) use ($from, $to) {
                    $q2->where('start_at', '<=', $from)
                        ->where('end_at', '>=', $to);
                });
        });
    }

    /**
     * Scope a query to only include shutdowns with a specific status.
     */
    public function scopeWithStatus(Builder $query, ShutdownStatus $status): Builder
    {
        return $query->where('status', $status);
    }

    /**
     * Scope a query to only include upcoming shutdowns.
     */
    public function scopeUpcoming(Builder $query): Builder
    {
        return $query->where('start_at', '>', now())
            ->where('status', ShutdownStatus::SCHEDULED);
    }

    /**
     * Scope a query to only include active shutdowns (scheduled or in progress).
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->whereIn('status', [
            ShutdownStatus::SCHEDULED,
            ShutdownStatus::IN_PROGRESS,
        ]);
    }

    /**
     * Get the duration in hours.
     */
    public function getDurationHoursAttribute(): float
    {
        return round($this->start_at->diffInMinutes($this->end_at) / 60, 2);
    }

    /**
     * Check if the shutdown is currently active.
     */
    public function isActive(): bool
    {
        $now = now();
        return $this->start_at <= $now && $this->end_at >= $now;
    }

    /**
     * Check if the shutdown is in the future.
     */
    public function isFuture(): bool
    {
        return $this->start_at > now();
    }

    /**
     * Check if the shutdown is in the past.
     */
    public function isPast(): bool
    {
        return $this->end_at < now();
    }
}
