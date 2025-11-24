<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WorkOrderCost extends Model
{
    protected $fillable = [
        'work_order_id',
        'labor_cost',
        'parts_cost',
        'external_service_cost',
        'downtime_cost',
        'total_cost',
        'calculated_at',
    ];

    protected $casts = [
        'labor_cost' => 'decimal:2',
        'parts_cost' => 'decimal:2',
        'external_service_cost' => 'decimal:2',
        'downtime_cost' => 'decimal:2',
        'total_cost' => 'decimal:2',
        'calculated_at' => 'datetime',
    ];

    // Relationships
    public function workOrder(): BelongsTo
    {
        return $this->belongsTo(WorkOrder::class);
    }

    // Calculate total cost from components
    public function calculateTotal(): void
    {
        $this->total_cost = $this->labor_cost + $this->parts_cost + $this->external_service_cost + $this->downtime_cost;
        $this->calculated_at = now();
        $this->save();
    }
}
