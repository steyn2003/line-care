<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FailurePrediction extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'company_id',
        'predictive_model_id',
        'machine_id',
        'failure_type',
        'probability',
        'predicted_failure_date',
        'days_until_failure',
        'severity',
        'status',
        'recommended_action',
        'contributing_factors',
        'work_order_id',
        'acknowledged_by',
        'acknowledged_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'probability' => 'decimal:2',
        'predicted_failure_date' => 'date',
        'days_until_failure' => 'integer',
        'contributing_factors' => 'array',
        'acknowledged_at' => 'datetime',
    ];

    /**
     * Get the company that owns the prediction.
     */
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * Get the predictive model that generated this prediction.
     */
    public function predictiveModel(): BelongsTo
    {
        return $this->belongsTo(PredictiveModel::class);
    }

    /**
     * Get the machine this prediction is for.
     */
    public function machine(): BelongsTo
    {
        return $this->belongsTo(Machine::class);
    }

    /**
     * Get the work order created for this prediction.
     */
    public function workOrder(): BelongsTo
    {
        return $this->belongsTo(WorkOrder::class);
    }

    /**
     * Get the user who acknowledged the prediction.
     */
    public function acknowledgedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'acknowledged_by');
    }

    /**
     * Check if prediction is high severity.
     */
    public function isHighSeverity(): bool
    {
        return in_array($this->severity, ['high', 'critical']);
    }

    /**
     * Check if prediction is imminent (within 7 days).
     */
    public function isImminent(): bool
    {
        return $this->days_until_failure !== null && $this->days_until_failure <= 7;
    }

    /**
     * Acknowledge the prediction.
     */
    public function acknowledge(User $user): void
    {
        $this->update([
            'status' => 'acknowledged',
            'acknowledged_by' => $user->id,
            'acknowledged_at' => now(),
        ]);
    }

    /**
     * Mark as resolved.
     */
    public function resolve(): void
    {
        $this->update(['status' => 'resolved']);
    }

    /**
     * Mark as false positive.
     */
    public function markAsFalsePositive(): void
    {
        $this->update(['status' => 'false_positive']);
    }

    /**
     * Scope to get only active predictions.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope to get high severity predictions.
     */
    public function scopeHighSeverity($query)
    {
        return $query->whereIn('severity', ['high', 'critical']);
    }

    /**
     * Scope to get imminent predictions.
     */
    public function scopeImminent($query)
    {
        return $query->where('days_until_failure', '<=', 7);
    }
}
