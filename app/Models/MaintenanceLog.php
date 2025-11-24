<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MaintenanceLog extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'work_order_id',
        'machine_id',
        'user_id',
        'notes',
        'work_done',
        'parts_used',
        'time_started',
        'time_completed',
        'hours_worked',
        'break_time',
        'labor_cost',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'time_started' => 'datetime',
        'time_completed' => 'datetime',
        'hours_worked' => 'decimal:2',
        'break_time' => 'decimal:2',
        'labor_cost' => 'decimal:2',
    ];

    /**
     * Get the work order that owns the maintenance log.
     */
    public function workOrder(): BelongsTo
    {
        return $this->belongsTo(WorkOrder::class);
    }

    /**
     * Get the machine that owns the maintenance log.
     */
    public function machine(): BelongsTo
    {
        return $this->belongsTo(Machine::class);
    }

    /**
     * Get the user who created the maintenance log.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
