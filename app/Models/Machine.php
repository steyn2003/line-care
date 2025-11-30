<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Machine extends Model
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
        'name',
        'code',
        'company_id',
        'location_id',
        'criticality',
        'status',
        'hourly_production_value',
    ];

    /**
     * Get the attributes that should be cast.
     */
    protected function casts(): array
    {
        return [
            'status' => 'string',
            'criticality' => 'string',
            'hourly_production_value' => 'decimal:2',
        ];
    }

    /**
     * Get the company that owns the machine.
     */
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * Get the location that owns the machine.
     */
    public function location(): BelongsTo
    {
        return $this->belongsTo(Location::class);
    }

    /**
     * Get the work orders for the machine.
     */
    public function workOrders(): HasMany
    {
        return $this->hasMany(WorkOrder::class);
    }

    /**
     * Get the preventive tasks for the machine.
     */
    public function preventiveTasks(): HasMany
    {
        return $this->hasMany(PreventiveTask::class);
    }

    /**
     * Get the maintenance logs for the machine.
     */
    public function maintenanceLogs(): HasMany
    {
        return $this->hasMany(MaintenanceLog::class);
    }

    /**
     * Get the sensors for the machine.
     */
    public function sensors(): HasMany
    {
        return $this->hasMany(Sensor::class);
    }

    /**
     * Get the active sensors for the machine.
     */
    public function activeSensors(): HasMany
    {
        return $this->hasMany(Sensor::class)->where('is_active', true);
    }

    /**
     * Get the sensor alerts for the machine.
     */
    public function sensorAlerts(): HasMany
    {
        return $this->hasMany(SensorAlert::class);
    }

    /**
     * Scope a query to only include active machines.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope a query to only include machines for a specific company.
     */
    public function scopeForCompany($query, int $companyId)
    {
        return $query->where('company_id', $companyId);
    }
}
