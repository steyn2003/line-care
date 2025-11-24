<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Stock extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'company_id',
        'spare_part_id',
        'location_id',
        'quantity_on_hand',
        'quantity_reserved',
        'last_counted_at',
    ];

    /**
     * Get the attributes that should be cast.
     */
    protected function casts(): array
    {
        return [
            'quantity_on_hand' => 'integer',
            'quantity_reserved' => 'integer',
            'last_counted_at' => 'datetime',
        ];
    }

    /**
     * Get the company that owns the stock.
     */
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * Get the spare part that owns the stock.
     */
    public function sparePart(): BelongsTo
    {
        return $this->belongsTo(SparePart::class);
    }

    /**
     * Get the location that owns the stock.
     */
    public function location(): BelongsTo
    {
        return $this->belongsTo(Location::class);
    }

    /**
     * Scope a query to only include stock for a specific company.
     */
    public function scopeForCompany($query, int $companyId)
    {
        return $query->where('company_id', $companyId);
    }

    /**
     * Scope a query to only include stock for a specific location.
     */
    public function scopeAtLocation($query, int $locationId)
    {
        return $query->where('location_id', $locationId);
    }

    /**
     * Get the available quantity (on hand minus reserved).
     */
    public function getQuantityAvailableAttribute(): int
    {
        return max(0, $this->quantity_on_hand - $this->quantity_reserved);
    }

    /**
     * Check if there's sufficient stock available.
     */
    public function hasSufficientStock(int $quantity): bool
    {
        return $this->quantity_available >= $quantity;
    }

    /**
     * Reserve stock for a work order.
     */
    public function reserve(int $quantity): void
    {
        if (!$this->hasSufficientStock($quantity)) {
            throw new \Exception('Insufficient stock available to reserve');
        }

        $this->increment('quantity_reserved', $quantity);
    }

    /**
     * Release reserved stock.
     */
    public function releaseReservation(int $quantity): void
    {
        $this->decrement('quantity_reserved', min($quantity, $this->quantity_reserved));
    }

    /**
     * Consume reserved stock (when work order is completed).
     */
    public function consumeReserved(int $quantity): void
    {
        $actualQuantity = min($quantity, $this->quantity_reserved);

        $this->decrement('quantity_on_hand', $actualQuantity);
        $this->decrement('quantity_reserved', $actualQuantity);
    }

    /**
     * Add stock (incoming inventory).
     */
    public function addStock(int $quantity): void
    {
        $this->increment('quantity_on_hand', $quantity);
    }

    /**
     * Remove stock (outgoing inventory).
     */
    public function removeStock(int $quantity): void
    {
        if ($quantity > $this->quantity_available) {
            throw new \Exception('Cannot remove more stock than available');
        }

        $this->decrement('quantity_on_hand', $quantity);
    }

    /**
     * Adjust stock (for manual corrections).
     */
    public function adjustStock(int $newQuantity): void
    {
        $this->update(['quantity_on_hand' => $newQuantity]);
    }
}
