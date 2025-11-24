<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Supplier extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'company_id',
        'name',
        'contact_person',
        'email',
        'phone',
        'address',
        'website',
        'notes',
        'is_preferred',
    ];

    /**
     * Get the attributes that should be cast.
     */
    protected function casts(): array
    {
        return [
            'is_preferred' => 'boolean',
        ];
    }

    /**
     * Get the company that owns the supplier.
     */
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * Get the spare parts from this supplier.
     */
    public function spareParts(): HasMany
    {
        return $this->hasMany(SparePart::class);
    }

    /**
     * Get the purchase orders for this supplier.
     */
    public function purchaseOrders(): HasMany
    {
        return $this->hasMany(PurchaseOrder::class);
    }

    /**
     * Get the vendor API keys for this supplier.
     */
    public function vendorApiKeys(): HasMany
    {
        return $this->hasMany(VendorApiKey::class);
    }

    /**
     * Get the active vendor API keys for this supplier.
     */
    public function activeVendorApiKeys(): HasMany
    {
        return $this->hasMany(VendorApiKey::class)->where('is_active', true);
    }

    /**
     * Scope a query to only include suppliers for a specific company.
     */
    public function scopeForCompany($query, int $companyId)
    {
        return $query->where('company_id', $companyId);
    }

    /**
     * Scope a query to only include preferred suppliers.
     */
    public function scopePreferred($query)
    {
        return $query->where('is_preferred', true);
    }
}
