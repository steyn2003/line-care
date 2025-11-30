<?php

namespace App\Models;

use App\Enums\WorkOrderStatus;
use App\Enums\WorkOrderType;
use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class WorkOrder extends Model
{
    use HasFactory, Auditable;

    /**
     * The events to audit.
     */
    protected array $auditEvents = ['created', 'updated', 'deleted'];

    /**
     * Fields to exclude from audit logs.
     */
    protected array $auditExclude = ['updated_at'];

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
        'planned_start_at',
        'planned_end_at',
        'planned_duration_minutes',
        'is_firm_planned',
        'planning_priority',
        'requires_shutdown',
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
            'planned_start_at' => 'datetime',
            'planned_end_at' => 'datetime',
            'planned_duration_minutes' => 'integer',
            'is_firm_planned' => 'boolean',
            'planning_priority' => 'integer',
            'requires_shutdown' => 'boolean',
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
     * Get the production runs linked to this work order.
     */
    public function productionRuns(): HasMany
    {
        return $this->hasMany(ProductionRun::class);
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
     * Get the cost breakdown for this work order.
     */
    public function cost(): HasOne
    {
        return $this->hasOne(WorkOrderCost::class);
    }

    /**
     * Get the external services for this work order.
     */
    public function externalServices(): HasMany
    {
        return $this->hasMany(ExternalService::class);
    }

    /**
     * Get the planning slots for this work order.
     */
    public function planningSlots(): HasMany
    {
        return $this->hasMany(PlanningSlot::class);
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

    /**
     * Scope a query to only include unplanned work orders.
     */
    public function scopeUnplanned($query)
    {
        return $query->whereNull('planned_start_at')
            ->whereIn('status', [WorkOrderStatus::OPEN, WorkOrderStatus::IN_PROGRESS]);
    }

    /**
     * Scope a query to only include planned work orders.
     */
    public function scopePlanned($query)
    {
        return $query->whereNotNull('planned_start_at');
    }

    /**
     * Scope a query to only include work orders requiring shutdown.
     */
    public function scopeRequiresShutdown($query)
    {
        return $query->where('requires_shutdown', true);
    }

    /**
     * Scope a query to order by planning priority.
     */
    public function scopeByPlanningPriority($query)
    {
        return $query->orderBy('planning_priority', 'asc');
    }

    /**
     * Check if this work order is planned.
     */
    public function isPlanned(): bool
    {
        return $this->planned_start_at !== null;
    }

    /**
     * Check if this work order is firmly planned (locked).
     */
    public function isFirmPlanned(): bool
    {
        return $this->is_firm_planned;
    }

    /**
     * Get the planning variance in minutes (actual vs planned duration).
     */
    public function getPlanningVarianceMinutesAttribute(): ?int
    {
        if (!$this->planned_duration_minutes || !$this->downtime_minutes) {
            return null;
        }

        return $this->downtime_minutes - $this->planned_duration_minutes;
    }
}
