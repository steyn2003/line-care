<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PurchaseOrder extends Model
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
        'supplier_id',
        'po_number',
        'status',
        'order_date',
        'expected_delivery_date',
        'received_date',
        'total_cost',
        'notes',
        'created_by',
    ];

    /**
     * Get the attributes that should be cast.
     */
    protected function casts(): array
    {
        return [
            'order_date' => 'date',
            'expected_delivery_date' => 'date',
            'received_date' => 'date',
            'total_cost' => 'decimal:2',
        ];
    }

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($purchaseOrder) {
            if (!$purchaseOrder->po_number) {
                $purchaseOrder->po_number = static::generatePoNumber($purchaseOrder->company_id);
            }
        });
    }

    /**
     * Generate a unique PO number.
     */
    public static function generatePoNumber(int $companyId): string
    {
        $prefix = 'PO-' . date('Y') . '-';
        $lastPo = static::where('company_id', $companyId)
            ->where('po_number', 'like', $prefix . '%')
            ->orderBy('po_number', 'desc')
            ->first();

        if ($lastPo) {
            $lastNumber = (int) substr($lastPo->po_number, strlen($prefix));
            $newNumber = $lastNumber + 1;
        } else {
            $newNumber = 1;
        }

        return $prefix . str_pad($newNumber, 5, '0', STR_PAD_LEFT);
    }

    /**
     * Get the company that owns the purchase order.
     */
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * Get the supplier that owns the purchase order.
     */
    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    /**
     * Get the user who created the purchase order.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the spare parts in this purchase order.
     */
    public function spareParts(): BelongsToMany
    {
        return $this->belongsToMany(SparePart::class, 'purchase_order_spare_parts')
            ->withPivot('quantity', 'unit_cost', 'quantity_received')
            ->withTimestamps();
    }

    /**
     * Get the inventory transactions for this purchase order.
     */
    public function inventoryTransactions(): HasMany
    {
        return $this->hasMany(InventoryTransaction::class, 'reference_id')
            ->where('reference_type', 'purchase_order');
    }

    /**
     * Scope a query to only include purchase orders for a specific company.
     */
    public function scopeForCompany($query, int $companyId)
    {
        return $query->where('company_id', $companyId);
    }

    /**
     * Scope a query to filter by status.
     */
    public function scopeOfStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope a query to only include draft purchase orders.
     */
    public function scopeDraft($query)
    {
        return $query->where('status', 'draft');
    }

    /**
     * Scope a query to only include sent purchase orders.
     */
    public function scopeSent($query)
    {
        return $query->where('status', 'sent');
    }

    /**
     * Scope a query to only include received purchase orders.
     */
    public function scopeReceived($query)
    {
        return $query->where('status', 'received');
    }

    /**
     * Calculate and update the total cost.
     */
    public function calculateTotalCost(): void
    {
        $total = $this->spareParts->sum(function ($part) {
            return $part->pivot->quantity * $part->pivot->unit_cost;
        });

        $this->update(['total_cost' => $total]);
    }

    /**
     * Check if the purchase order can be edited.
     */
    public function canBeEdited(): bool
    {
        return $this->status === 'draft';
    }

    /**
     * Check if the purchase order can be sent.
     */
    public function canBeSent(): bool
    {
        return $this->status === 'draft' && $this->spareParts()->count() > 0;
    }

    /**
     * Check if the purchase order can be received.
     */
    public function canBeReceived(): bool
    {
        return $this->status === 'sent';
    }

    /**
     * Mark the purchase order as sent.
     */
    public function markAsSent(): void
    {
        if (!$this->canBeSent()) {
            throw new \Exception('Purchase order cannot be sent');
        }

        $this->update(['status' => 'sent']);
    }

    /**
     * Mark the purchase order as received.
     */
    public function markAsReceived(): void
    {
        if (!$this->canBeReceived()) {
            throw new \Exception('Purchase order cannot be received');
        }

        $this->update([
            'status' => 'received',
            'received_date' => now(),
        ]);
    }

    /**
     * Cancel the purchase order.
     */
    public function cancel(): void
    {
        if ($this->status === 'received') {
            throw new \Exception('Cannot cancel a received purchase order');
        }

        $this->update(['status' => 'cancelled']);
    }
}
