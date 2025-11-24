<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
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
        'sku',
        'description',
        'theoretical_cycle_time',
        'target_units_per_hour',
        'is_active',
    ];

    /**
     * Get the attributes that should be cast.
     */
    protected function casts(): array
    {
        return [
            'theoretical_cycle_time' => 'integer', // in seconds
            'target_units_per_hour' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Get the company that owns the product.
     */
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * Get the production runs for this product.
     */
    public function productionRuns(): HasMany
    {
        return $this->hasMany(ProductionRun::class);
    }

    /**
     * Scope a query to only include products for a specific company.
     */
    public function scopeForCompany($query, int $companyId)
    {
        return $query->where('company_id', $companyId);
    }

    /**
     * Scope a query to only include active products.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Calculate theoretical output for a given time period in minutes.
     */
    public function calculateTheoreticalOutput(int $minutes): int
    {
        if ($this->theoretical_cycle_time <= 0) {
            return 0;
        }

        // Convert minutes to seconds and divide by cycle time
        return (int) floor(($minutes * 60) / $this->theoretical_cycle_time);
    }

    /**
     * Get the theoretical cycle time in a human-readable format.
     */
    public function getFormattedCycleTimeAttribute(): string
    {
        if ($this->theoretical_cycle_time < 60) {
            return $this->theoretical_cycle_time . ' seconds';
        }

        $minutes = floor($this->theoretical_cycle_time / 60);
        $seconds = $this->theoretical_cycle_time % 60;

        if ($seconds === 0) {
            return $minutes . ' minute' . ($minutes > 1 ? 's' : '');
        }

        return $minutes . 'm ' . $seconds . 's';
    }
}
