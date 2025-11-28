<?php

namespace App\Models;

use App\Enums\PlanningSlotStatus;
use App\Enums\PlanningSlotSource;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;

class PlanningSlot extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'company_id',
        'work_order_id',
        'technician_id',
        'machine_id',
        'location_id',
        'start_at',
        'end_at',
        'duration_minutes',
        'status',
        'source',
        'color',
        'notes',
        'created_by',
        'updated_by',
    ];

    /**
     * Get the attributes that should be cast.
     */
    protected function casts(): array
    {
        return [
            'start_at' => 'datetime',
            'end_at' => 'datetime',
            'duration_minutes' => 'integer',
            'status' => PlanningSlotStatus::class,
            'source' => PlanningSlotSource::class,
        ];
    }

    /**
     * Get the company that owns the planning slot.
     */
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * Get the work order for the planning slot.
     */
    public function workOrder(): BelongsTo
    {
        return $this->belongsTo(WorkOrder::class);
    }

    /**
     * Get the technician assigned to the planning slot.
     */
    public function technician(): BelongsTo
    {
        return $this->belongsTo(User::class, 'technician_id');
    }

    /**
     * Get the machine for the planning slot.
     */
    public function machine(): BelongsTo
    {
        return $this->belongsTo(Machine::class);
    }

    /**
     * Get the location for the planning slot.
     */
    public function location(): BelongsTo
    {
        return $this->belongsTo(Location::class);
    }

    /**
     * Get the user who created the planning slot.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the user who last updated the planning slot.
     */
    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    /**
     * Scope a query to only include slots for a specific company.
     */
    public function scopeForCompany(Builder $query, int $companyId): Builder
    {
        return $query->where('company_id', $companyId);
    }

    /**
     * Scope a query to only include slots for a specific technician.
     */
    public function scopeForTechnician(Builder $query, int $technicianId): Builder
    {
        return $query->where('technician_id', $technicianId);
    }

    /**
     * Scope a query to only include slots for a specific machine.
     */
    public function scopeForMachine(Builder $query, int $machineId): Builder
    {
        return $query->where('machine_id', $machineId);
    }

    /**
     * Scope a query to only include slots within a date range.
     */
    public function scopeInDateRange(Builder $query, string $from, string $to): Builder
    {
        return $query->where('start_at', '>=', $from)
            ->where('end_at', '<=', $to);
    }

    /**
     * Scope a query to only include slots that overlap with a date range.
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
     * Scope a query to only include slots with a specific status.
     */
    public function scopeWithStatus(Builder $query, PlanningSlotStatus $status): Builder
    {
        return $query->where('status', $status);
    }

    /**
     * Scope a query to only include active slots (not cancelled or completed).
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->whereNotIn('status', [
            PlanningSlotStatus::CANCELLED,
            PlanningSlotStatus::COMPLETED,
        ]);
    }

    /**
     * Check if this slot conflicts with another slot for the same technician.
     */
    public function conflictsWithTechnician(PlanningSlot $other): bool
    {
        if ($this->technician_id !== $other->technician_id) {
            return false;
        }

        if ($this->id === $other->id) {
            return false;
        }

        return $this->start_at < $other->end_at && $this->end_at > $other->start_at;
    }

    /**
     * Check if this slot conflicts with another slot for the same machine.
     */
    public function conflictsWithMachine(PlanningSlot $other): bool
    {
        if ($this->machine_id !== $other->machine_id) {
            return false;
        }

        if ($this->id === $other->id) {
            return false;
        }

        return $this->start_at < $other->end_at && $this->end_at > $other->start_at;
    }

    /**
     * Calculate duration in hours.
     */
    public function getDurationHoursAttribute(): float
    {
        return round($this->duration_minutes / 60, 2);
    }
}
