<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PartCategory extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'company_id',
        'parent_category_id',
        'name',
        'description',
    ];

    /**
     * Get the company that owns the part category.
     */
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * Get the parent category.
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(PartCategory::class, 'parent_category_id');
    }

    /**
     * Get the child categories.
     */
    public function children(): HasMany
    {
        return $this->hasMany(PartCategory::class, 'parent_category_id');
    }

    /**
     * Get the spare parts in this category.
     */
    public function spareParts(): HasMany
    {
        return $this->hasMany(SparePart::class, 'category_id');
    }

    /**
     * Scope a query to only include categories for a specific company.
     */
    public function scopeForCompany($query, int $companyId)
    {
        return $query->where('company_id', $companyId);
    }

    /**
     * Scope a query to only include root categories (no parent).
     */
    public function scopeRootCategories($query)
    {
        return $query->whereNull('parent_category_id');
    }
}
