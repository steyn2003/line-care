<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PreventiveTask extends Model
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
        'title',
        'description',
        'schedule_interval_value',
        'schedule_interval_unit',
        'assigned_to',
        'next_due_date',
        'last_completed_at',
        'is_active',
    ];

    /**
     * Get the attributes that should be cast.
     */
    protected function casts(): array
    {
        return [
            'schedule_interval_value' => 'integer',
            'next_due_date' => 'date',
            'last_completed_at' => 'datetime',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Get the company that owns the preventive task.
     */
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * Get the machine that owns the preventive task.
     */
    public function machine(): BelongsTo
    {
        return $this->belongsTo(Machine::class);
    }

    /**
     * Get the user assigned to the preventive task.
     */
    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    /**
     * Alias for assignee relationship.
     */
    public function assignedUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    /**
     * Get the work orders generated from this preventive task.
     */
    public function workOrders(): HasMany
    {
        return $this->hasMany(WorkOrder::class);
    }

    /**
     * Scope a query to only include active tasks.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope a query to only include tasks for a specific company.
     */
    public function scopeForCompany($query, int $companyId)
    {
        return $query->where('company_id', $companyId);
    }

    /**
     * Scope a query to only include overdue tasks.
     */
    public function scopeOverdue($query)
    {
        return $query->where('next_due_date', '<', now())
                     ->where('is_active', true);
    }

    /**
     * Calculate the next due date based on interval.
     */
    public function calculateNextDueDate(): void
    {
        $baseDate = $this->last_completed_at ?? $this->created_at ?? now();

        $this->next_due_date = match($this->schedule_interval_unit) {
            'days' => $baseDate->addDays($this->schedule_interval_value),
            'weeks' => $baseDate->addWeeks($this->schedule_interval_value),
            'months' => $baseDate->addMonths($this->schedule_interval_value),
            default => $baseDate->addDays($this->schedule_interval_value),
        };
    }
}
