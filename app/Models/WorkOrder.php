<?php

namespace App\Models;

use App\Enums\WorkOrderStatus;
use App\Enums\WorkOrderType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class WorkOrder extends Model
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
        'created_by',
        'assigned_to',
        'type',
        'status',
        'title',
        'description',
        'cause_category_id',
        'preventive_task_id',
        'started_at',
        'completed_at',
    ];

    /**
     * Get the attributes that should be cast.
     */
    protected function casts(): array
    {
        return [
            'type' => WorkOrderType::class,
            'status' => WorkOrderStatus::class,
            'started_at' => 'datetime',
            'completed_at' => 'datetime',
        ];
    }

    /**
     * Get the company that owns the work order.
     */
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * Get the machine that owns the work order.
     */
    public function machine(): BelongsTo
    {
        return $this->belongsTo(Machine::class);
    }

    /**
     * Get the user who created the work order.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the user assigned to the work order.
     */
    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    /**
     * Get the cause category for the work order.
     */
    public function causeCategory(): BelongsTo
    {
        return $this->belongsTo(CauseCategory::class);
    }

    /**
     * Get the preventive task for the work order.
     */
    public function preventiveTask(): BelongsTo
    {
        return $this->belongsTo(PreventiveTask::class);
    }

    /**
     * Get the maintenance logs for the work order.
     */
    public function maintenanceLogs(): HasMany
    {
        return $this->hasMany(MaintenanceLog::class);
    }

    /**
     * Get the spare parts used in this work order.
     */
    public function spareParts(): BelongsToMany
    {
        return $this->belongsToMany(SparePart::class, 'work_order_spare_parts')
            ->withPivot('quantity_used', 'unit_cost', 'location_id')
            ->withTimestamps();
    }

    /**
     * Get the inventory transactions for this work order.
     */
    public function inventoryTransactions(): HasMany
    {
        return $this->hasMany(InventoryTransaction::class, 'reference_id')
            ->where('reference_type', 'work_order');
    }

    /**
     * Scope a query to only include work orders for a specific company.
     */
    public function scopeForCompany($query, int $companyId)
    {
        return $query->where('company_id', $companyId);
    }

    /**
     * Scope a query to only include open work orders.
     */
    public function scopeOpen($query)
    {
        return $query->whereIn('status', [WorkOrderStatus::OPEN, WorkOrderStatus::IN_PROGRESS]);
    }

    /**
     * Scope a query to filter by type.
     */
    public function scopeOfType($query, WorkOrderType $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Scope a query to filter by status.
     */
    public function scopeWithStatus($query, WorkOrderStatus $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Get the downtime in minutes.
     * Calculated as the time between started_at and completed_at.
     */
    public function getDowntimeMinutesAttribute(): ?int
    {
        if (!$this->started_at || !$this->completed_at) {
            return null;
        }

        return (int) $this->started_at->diffInMinutes($this->completed_at);
    }

    /**
     * Get the total parts cost for this work order.
     */
    public function getTotalPartsCostAttribute(): float
    {
        return $this->spareParts->sum(function ($part) {
            return $part->pivot->quantity_used * $part->pivot->unit_cost;
        });
    }
}
