<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProductionRun extends Model
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
        'work_order_id',
        'product_id',
        'shift_id',
        'start_time',
        'end_time',
        'planned_production_time',
        'actual_production_time',
        'theoretical_output',
        'actual_output',
        'good_output',
        'defect_output',
        'availability_pct',
        'performance_pct',
        'quality_pct',
        'oee_pct',
        'created_by',
    ];

    /**
     * Get the attributes that should be cast.
     */
    protected function casts(): array
    {
        return [
            'start_time' => 'datetime',
            'end_time' => 'datetime',
            'planned_production_time' => 'integer',
            'actual_production_time' => 'integer',
            'theoretical_output' => 'integer',
            'actual_output' => 'integer',
            'good_output' => 'integer',
            'defect_output' => 'integer',
            'availability_pct' => 'decimal:2',
            'performance_pct' => 'decimal:2',
            'quality_pct' => 'decimal:2',
            'oee_pct' => 'decimal:2',
        ];
    }

    /**
     * Get the company that owns the production run.
     */
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * Get the machine that the production run belongs to.
     */
    public function machine(): BelongsTo
    {
        return $this->belongsTo(Machine::class);
    }

    /**
     * Get the work order associated with the production run.
     */
    public function workOrder(): BelongsTo
    {
        return $this->belongsTo(WorkOrder::class);
    }

    /**
     * Get the product that was produced in the run.
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Get the shift during which the run occurred.
     */
    public function shift(): BelongsTo
    {
        return $this->belongsTo(Shift::class);
    }

    /**
     * Get the user who created the production run.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the downtime events for this production run.
     */
    public function downtimes(): HasMany
    {
        return $this->hasMany(Downtime::class);
    }

    /**
     * Scope a query to only include production runs for a specific company.
     */
    public function scopeForCompany($query, int $companyId)
    {
        return $query->where('company_id', $companyId);
    }

    /**
     * Scope a query to only include production runs for a specific machine.
     */
    public function scopeForMachine($query, int $machineId)
    {
        return $query->where('machine_id', $machineId);
    }

    /**
     * Scope a query to only include active (ongoing) production runs.
     */
    public function scopeActive($query)
    {
        return $query->whereNull('end_time');
    }

    /**
     * Scope a query to only include completed production runs.
     */
    public function scopeCompleted($query)
    {
        return $query->whereNotNull('end_time');
    }

    /**
     * Scope a query to filter by date range.
     */
    public function scopeDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('start_time', [$startDate, $endDate]);
    }

    /**
     * Calculate and update OEE metrics for this production run.
     */
    public function calculateOEE(): void
    {
        // Calculate Availability: (Operating Time / Planned Production Time) × 100%
        // Operating Time = Planned Production Time - Unplanned Downtime
        $totalDowntime = $this->downtimes()
            ->whereHas('category', function ($query) {
                $query->where('is_included_in_oee', true);
            })
            ->sum('duration_minutes');

        $operatingTime = $this->planned_production_time - $totalDowntime;
        $this->availability_pct = $this->planned_production_time > 0
            ? ($operatingTime / $this->planned_production_time) * 100
            : 0;

        // Calculate Performance: (Actual Output / Theoretical Output) × 100%
        $this->performance_pct = $this->theoretical_output > 0
            ? ($this->actual_output / $this->theoretical_output) * 100
            : 0;

        // Calculate Quality: (Good Output / Total Output) × 100%
        $this->quality_pct = $this->actual_output > 0
            ? ($this->good_output / $this->actual_output) * 100
            : 0;

        // Calculate Overall OEE: Availability × Performance × Quality
        $this->oee_pct = ($this->availability_pct / 100) * ($this->performance_pct / 100) * ($this->quality_pct / 100) * 100;

        $this->save();
    }

    /**
     * Check if the production run is currently active.
     */
    public function isActive(): bool
    {
        return is_null($this->end_time);
    }

    /**
     * Get the total downtime duration in minutes.
     */
    public function getTotalDowntimeAttribute(): int
    {
        return $this->downtimes->sum('duration_minutes');
    }

    /**
     * Get the actual duration of the run in minutes.
     */
    public function getActualDurationAttribute(): ?int
    {
        if (is_null($this->end_time)) {
            return null;
        }

        return $this->start_time->diffInMinutes($this->end_time);
    }
}
