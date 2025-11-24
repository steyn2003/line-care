<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MaintenanceBudget extends Model
{
    protected $fillable = [
        'company_id',
        'year',
        'month',
        'budgeted_labor',
        'budgeted_parts',
        'budgeted_total',
        'actual_labor',
        'actual_parts',
        'actual_total',
        'variance',
    ];

    protected $casts = [
        'year' => 'integer',
        'month' => 'integer',
        'budgeted_labor' => 'decimal:2',
        'budgeted_parts' => 'decimal:2',
        'budgeted_total' => 'decimal:2',
        'actual_labor' => 'decimal:2',
        'actual_parts' => 'decimal:2',
        'actual_total' => 'decimal:2',
        'variance' => 'decimal:2',
    ];

    // Relationships
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    // Calculate variance
    public function calculateVariance(): void
    {
        $this->variance = $this->budgeted_total - $this->actual_total;
        $this->save();
    }

    // Update budget totals
    public function calculateTotals(): void
    {
        $this->budgeted_total = $this->budgeted_labor + $this->budgeted_parts;
        $this->actual_total = $this->actual_labor + $this->actual_parts;
        $this->calculateVariance();
    }

    // Helper method to get budget for a specific month
    public static function getBudget($companyId, $year, $month)
    {
        return self::where('company_id', $companyId)
            ->where('year', $year)
            ->where('month', $month)
            ->first();
    }
}
