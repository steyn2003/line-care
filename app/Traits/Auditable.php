<?php

namespace App\Traits;

use App\Models\AuditLog;
use App\Services\AuditService;

trait Auditable
{
    /**
     * Boot the auditable trait.
     */
    public static function bootAuditable(): void
    {
        static::created(function ($model) {
            if ($model->shouldAudit('created')) {
                app(AuditService::class)->logCreated($model);
            }
        });

        static::updated(function ($model) {
            if ($model->shouldAudit('updated') && $model->wasChanged()) {
                $oldValues = collect($model->getOriginal())
                    ->only(array_keys($model->getChanges()))
                    ->toArray();

                app(AuditService::class)->logUpdated($model, $oldValues);
            }
        });

        static::deleted(function ($model) {
            if ($model->shouldAudit('deleted')) {
                app(AuditService::class)->logDeleted($model);
            }
        });
    }

    /**
     * Get the audit logs for this model.
     */
    public function auditLogs()
    {
        return $this->morphMany(AuditLog::class, 'model');
    }

    /**
     * Check if a specific event should be audited.
     */
    public function shouldAudit(string $event): bool
    {
        // If auditEvents is defined, check if the event is in the list
        if (property_exists($this, 'auditEvents')) {
            return in_array($event, $this->auditEvents);
        }

        // If auditExclude is defined, check if the event is NOT in the list
        if (property_exists($this, 'auditExclude')) {
            return !in_array($event, $this->auditExclude);
        }

        // Default: audit all events
        return true;
    }

    /**
     * Get the attributes that should be audited.
     * Override this method in the model to customize.
     */
    public function getAuditableAttributes(): array
    {
        $attributes = $this->attributesToArray();

        // If auditInclude is defined, only include those attributes
        if (property_exists($this, 'auditInclude')) {
            return array_intersect_key($attributes, array_flip($this->auditInclude));
        }

        // If auditExcludeAttributes is defined, exclude those attributes
        if (property_exists($this, 'auditExcludeAttributes')) {
            return array_diff_key($attributes, array_flip($this->auditExcludeAttributes));
        }

        // Default exclusions
        $defaultExclude = [
            'password',
            'remember_token',
            'two_factor_secret',
            'two_factor_recovery_codes',
            'created_at',
            'updated_at',
        ];

        return array_diff_key($attributes, array_flip($defaultExclude));
    }

    /**
     * Disable auditing for a callback.
     */
    public static function withoutAuditing(callable $callback)
    {
        $dispatcher = static::getEventDispatcher();
        static::unsetEventDispatcher();

        try {
            return $callback();
        } finally {
            static::setEventDispatcher($dispatcher);
        }
    }
}
