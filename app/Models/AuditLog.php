<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class AuditLog extends Model
{
    /**
     * Indicates if the model should be timestamped.
     * We only use created_at, not updated_at.
     */
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'company_id',
        'user_id',
        'action',
        'model_type',
        'model_id',
        'old_values',
        'new_values',
        'ip_address',
        'user_agent',
        'created_at',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'old_values' => 'array',
        'new_values' => 'array',
        'created_at' => 'datetime',
    ];

    /**
     * Boot the model.
     */
    protected static function boot(): void
    {
        parent::boot();

        static::creating(function (AuditLog $log) {
            $log->created_at = $log->created_at ?? now();
        });
    }

    /**
     * Get the company that owns the audit log.
     */
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * Get the user that performed the action.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the auditable model.
     */
    public function auditable(): MorphTo
    {
        return $this->morphTo('model');
    }

    /**
     * Get a human-readable action name.
     */
    public function getActionLabelAttribute(): string
    {
        $parts = explode('.', $this->action);
        $action = end($parts);

        return match ($action) {
            'created' => 'Created',
            'updated' => 'Updated',
            'deleted' => 'Deleted',
            'restored' => 'Restored',
            'status_changed' => 'Status Changed',
            'assigned' => 'Assigned',
            'completed' => 'Completed',
            'role_changed' => 'Role Changed',
            'plan_changed' => 'Plan Changed',
            'features_updated' => 'Features Updated',
            'stock_adjusted' => 'Stock Adjusted',
            'stock_consumed' => 'Stock Consumed',
            'stock_received' => 'Stock Received',
            'logged_in' => 'Logged In',
            'logged_out' => 'Logged Out',
            default => ucfirst(str_replace('_', ' ', $action)),
        };
    }

    /**
     * Get the model type as a short name.
     */
    public function getModelNameAttribute(): string
    {
        return class_basename($this->model_type);
    }

    /**
     * Get a summary of the changes.
     */
    public function getChangesSummaryAttribute(): ?string
    {
        if (empty($this->old_values) && empty($this->new_values)) {
            return null;
        }

        $changes = [];

        if ($this->action === 'status_changed' || str_ends_with($this->action, '.status_changed')) {
            $old = $this->old_values['status'] ?? 'unknown';
            $new = $this->new_values['status'] ?? 'unknown';
            return "Status: {$old} → {$new}";
        }

        if ($this->action === 'role_changed' || str_ends_with($this->action, '.role_changed')) {
            $old = $this->old_values['role'] ?? 'unknown';
            $new = $this->new_values['role'] ?? 'unknown';
            return "Role: {$old} → {$new}";
        }

        if ($this->action === 'plan_changed' || str_ends_with($this->action, '.plan_changed')) {
            $old = $this->old_values['plan'] ?? 'unknown';
            $new = $this->new_values['plan'] ?? 'unknown';
            return "Plan: {$old} → {$new}";
        }

        // Generic field changes
        $newValues = $this->new_values ?? [];
        $changedFields = array_keys($newValues);

        if (count($changedFields) > 0) {
            if (count($changedFields) <= 3) {
                $changes = array_map(fn($f) => ucfirst(str_replace('_', ' ', $f)), $changedFields);
                return 'Changed: ' . implode(', ', $changes);
            }
            return count($changedFields) . ' fields changed';
        }

        return null;
    }

    /**
     * Scope to filter by company.
     */
    public function scopeForCompany($query, int $companyId)
    {
        return $query->where('company_id', $companyId);
    }

    /**
     * Scope to filter by model type.
     */
    public function scopeForModelType($query, string $modelType)
    {
        // Support both short names and full class names
        if (!str_contains($modelType, '\\')) {
            $modelType = "App\\Models\\{$modelType}";
        }
        return $query->where('model_type', $modelType);
    }

    /**
     * Scope to filter by specific model instance.
     */
    public function scopeForModel($query, string $modelType, int $modelId)
    {
        return $query->forModelType($modelType)->where('model_id', $modelId);
    }

    /**
     * Scope to filter by action.
     */
    public function scopeForAction($query, string $action)
    {
        return $query->where('action', 'like', "%{$action}%");
    }

    /**
     * Scope to filter by date range.
     */
    public function scopeBetweenDates($query, ?string $from, ?string $to)
    {
        return $query
            ->when($from, fn($q) => $q->whereDate('created_at', '>=', $from))
            ->when($to, fn($q) => $q->whereDate('created_at', '<=', $to));
    }
}
