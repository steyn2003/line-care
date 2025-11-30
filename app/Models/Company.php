<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Company extends Model
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
        'name',
        'email',
        'phone',
        'address',
        'plan',
        'feature_flags',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'feature_flags' => 'array',
    ];

    /**
     * Get the users for the company.
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    /**
     * Get the locations for the company.
     */
    public function locations(): HasMany
    {
        return $this->hasMany(Location::class);
    }

    /**
     * Get the machines for the company.
     */
    public function machines(): HasMany
    {
        return $this->hasMany(Machine::class);
    }

    /**
     * Get the work orders for the company.
     */
    public function workOrders(): HasMany
    {
        return $this->hasMany(WorkOrder::class);
    }

    /**
     * Get the preventive tasks for the company.
     */
    public function preventiveTasks(): HasMany
    {
        return $this->hasMany(PreventiveTask::class);
    }

    /**
     * Get the integrations for the company.
     */
    public function integrations(): HasMany
    {
        return $this->hasMany(Integration::class);
    }

    /**
     * Get the sensors for the company.
     */
    public function sensors(): HasMany
    {
        return $this->hasMany(Sensor::class);
    }

    /**
     * Check if a feature is enabled for this company.
     *
     * @param string $feature
     * @return bool
     */
    public function hasFeature(string $feature): bool
    {
        return app(\App\Services\FeatureService::class)->enabledForCompany($this, $feature);
    }

    /**
     * Get all features for this company.
     *
     * @return array<string, bool>
     */
    public function getFeatures(): array
    {
        return app(\App\Services\FeatureService::class)->getAllFeaturesForCompany($this);
    }

    /**
     * Get the plan label for display.
     *
     * @return string
     */
    public function getPlanLabel(): string
    {
        return match($this->plan) {
            'basic' => 'Basic',
            'pro' => 'Pro',
            'enterprise' => 'Enterprise',
            default => ucfirst($this->plan ?? 'basic'),
        };
    }
}
