<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DowntimeCategory extends Model
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
        'category_type',
        'is_included_in_oee',
        'description',
    ];

    /**
     * Get the attributes that should be cast.
     */
    protected function casts(): array
    {
        return [
            'category_type' => 'string', // 'planned' or 'unplanned'
            'is_included_in_oee' => 'boolean',
        ];
    }

    /**
     * Get the company that owns the downtime category.
     */
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * Get the downtime records for this category.
     */
    public function downtimes(): HasMany
    {
        return $this->hasMany(Downtime::class);
    }

    /**
     * Scope a query to only include downtime categories for a specific company.
     */
    public function scopeForCompany($query, int $companyId)
    {
        return $query->where('company_id', $companyId);
    }

    /**
     * Scope a query to only include planned downtime categories.
     */
    public function scopePlanned($query)
    {
        return $query->where('category_type', 'planned');
    }

    /**
     * Scope a query to only include unplanned downtime categories.
     */
    public function scopeUnplanned($query)
    {
        return $query->where('category_type', 'unplanned');
    }

    /**
     * Scope a query to only include categories that are included in OEE calculation.
     */
    public function scopeIncludedInOEE($query)
    {
        return $query->where('is_included_in_oee', true);
    }

    /**
     * Check if this is a planned downtime category.
     */
    public function isPlanned(): bool
    {
        return $this->category_type === 'planned';
    }

    /**
     * Check if this is an unplanned downtime category.
     */
    public function isUnplanned(): bool
    {
        return $this->category_type === 'unplanned';
    }
}
