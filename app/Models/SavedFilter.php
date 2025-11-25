<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SavedFilter extends Model
{
    use HasFactory;

    /**
     * Available filter types.
     */
    public const TYPE_WORK_ORDERS = 'work_orders';
    public const TYPE_MACHINES = 'machines';
    public const TYPE_SPARE_PARTS = 'spare_parts';
    public const TYPE_PRODUCTION_RUNS = 'production_runs';
    public const TYPE_PURCHASE_ORDERS = 'purchase_orders';
    public const TYPE_COSTS = 'costs';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'company_id',
        'user_id',
        'name',
        'filter_type',
        'filters',
        'is_default',
        'is_shared',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'filters' => 'array',
        'is_default' => 'boolean',
        'is_shared' => 'boolean',
    ];

    /**
     * Get the company that owns the filter.
     */
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * Get the user who created the filter.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get available filter types.
     */
    public static function getFilterTypes(): array
    {
        return [
            self::TYPE_WORK_ORDERS => 'Work Orders',
            self::TYPE_MACHINES => 'Machines',
            self::TYPE_SPARE_PARTS => 'Spare Parts',
            self::TYPE_PRODUCTION_RUNS => 'Production Runs',
            self::TYPE_PURCHASE_ORDERS => 'Purchase Orders',
            self::TYPE_COSTS => 'Costs',
        ];
    }

    /**
     * Apply filters to a query builder.
     */
    public function applyToQuery($query)
    {
        foreach ($this->filters as $field => $value) {
            if (is_array($value)) {
                // Range or multiple values
                if (isset($value['from']) || isset($value['to'])) {
                    if (isset($value['from'])) {
                        $query->where($field, '>=', $value['from']);
                    }
                    if (isset($value['to'])) {
                        $query->where($field, '<=', $value['to']);
                    }
                } else {
                    $query->whereIn($field, $value);
                }
            } elseif ($value !== null && $value !== '') {
                $query->where($field, $value);
            }
        }

        return $query;
    }

    /**
     * Scope to get filters by type.
     */
    public function scopeOfType($query, string $type)
    {
        return $query->where('filter_type', $type);
    }

    /**
     * Scope to get shared filters.
     */
    public function scopeShared($query)
    {
        return $query->where('is_shared', true);
    }

    /**
     * Scope to get default filters.
     */
    public function scopeDefault($query)
    {
        return $query->where('is_default', true);
    }

    /**
     * Scope to get filters accessible by a user.
     */
    public function scopeAccessibleBy($query, User $user)
    {
        return $query->where(function ($q) use ($user) {
            $q->where('user_id', $user->id)
              ->orWhere(function ($q2) use ($user) {
                  $q2->where('company_id', $user->company_id)
                     ->where('is_shared', true);
              });
        });
    }
}
