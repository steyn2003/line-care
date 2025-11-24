<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class SparePart extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'company_id',
        'category_id',
        'supplier_id',
        'part_number',
        'name',
        'description',
        'manufacturer',
        'unit_of_measure',
        'unit_cost',
        'reorder_point',
        'reorder_quantity',
        'lead_time_days',
        'location',
        'image_url',
        'is_critical',
        'status',
    ];

    /**
     * Get the attributes that should be cast.
     */
    protected function casts(): array
    {
        return [
            'unit_cost' => 'decimal:2',
            'reorder_point' => 'integer',
            'reorder_quantity' => 'integer',
            'lead_time_days' => 'integer',
            'is_critical' => 'boolean',
            'status' => 'string',
        ];
    }

    /**
     * Get the company that owns the spare part.
     */
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * Get the category that owns the spare part.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(PartCategory::class, 'category_id');
    }

    /**
     * Get the supplier that owns the spare part.
     */
    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    /**
     * Get the inventory transactions for the spare part.
     */
    public function inventoryTransactions(): HasMany
    {
        return $this->hasMany(InventoryTransaction::class);
    }

    /**
     * Get the stock records for the spare part.
     */
    public function stocks(): HasMany
    {
        return $this->hasMany(Stock::class);
    }

    /**
     * Get the work orders that used this spare part.
     */
    public function workOrders(): BelongsToMany
    {
        return $this->belongsToMany(WorkOrder::class, 'work_order_spare_parts')
            ->withPivot('quantity_used', 'unit_cost', 'location_id')
            ->withTimestamps();
    }

    /**
     * Get the purchase orders for this spare part.
     */
    public function purchaseOrders(): BelongsToMany
    {
        return $this->belongsToMany(PurchaseOrder::class, 'purchase_order_spare_parts')
            ->withPivot('quantity', 'unit_cost')
            ->withTimestamps();
    }

    /**
     * Scope a query to only include active spare parts.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope a query to only include critical spare parts.
     */
    public function scopeCritical($query)
    {
        return $query->where('is_critical', true);
    }

    /**
     * Scope a query to only include spare parts for a specific company.
     */
    public function scopeForCompany($query, int $companyId)
    {
        return $query->where('company_id', $companyId);
    }

    /**
     * Scope a query to include spare parts below reorder point.
     */
    public function scopeLowStock($query)
    {
        return $query->whereHas('stocks', function ($q) {
            $q->whereRaw('quantity_available < spare_parts.reorder_point');
        });
    }

    /**
     * Get the total quantity available across all locations.
     */
    public function getTotalQuantityAvailableAttribute(): int
    {
        return $this->stocks->sum('quantity_available');
    }

    /**
     * Get the total quantity on hand across all locations.
     */
    public function getTotalQuantityOnHandAttribute(): int
    {
        return $this->stocks->sum('quantity_on_hand');
    }

    /**
     * Check if this spare part is below reorder point.
     */
    public function isBelowReorderPoint(): bool
    {
        return $this->total_quantity_available < $this->reorder_point;
    }
}
