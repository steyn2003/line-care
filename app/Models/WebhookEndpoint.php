<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class WebhookEndpoint extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id',
        'name',
        'url',
        'secret',
        'events',
        'is_active',
        'last_triggered_at',
        'failure_count',
    ];

    protected $casts = [
        'events' => 'array',
        'is_active' => 'boolean',
        'last_triggered_at' => 'datetime',
    ];

    protected $hidden = [
        'secret',
    ];

    /**
     * Available webhook events
     */
    public const EVENTS = [
        'work_order.created' => 'Work Order Created',
        'work_order.updated' => 'Work Order Updated',
        'work_order.completed' => 'Work Order Completed',
        'work_order.assigned' => 'Work Order Assigned',
        'machine.created' => 'Machine Created',
        'machine.updated' => 'Machine Updated',
        'machine.deleted' => 'Machine Deleted',
        'spare_part.created' => 'Spare Part Created',
        'spare_part.updated' => 'Spare Part Updated',
        'spare_part.low_stock' => 'Spare Part Low Stock',
        'preventive_task.created' => 'Preventive Task Created',
        'preventive_task.due' => 'Preventive Task Due',
        'purchase_order.created' => 'Purchase Order Created',
        'purchase_order.received' => 'Purchase Order Received',
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function deliveries(): HasMany
    {
        return $this->hasMany(WebhookDelivery::class);
    }

    public function subscribesToEvent(string $event): bool
    {
        return in_array($event, $this->events ?? [], true);
    }

    public function incrementFailureCount(): void
    {
        $this->increment('failure_count');

        // Auto-disable after 10 consecutive failures
        if ($this->failure_count >= 10) {
            $this->update(['is_active' => false]);
        }
    }

    public function resetFailureCount(): void
    {
        $this->update([
            'failure_count' => 0,
            'last_triggered_at' => now(),
        ]);
    }
}
