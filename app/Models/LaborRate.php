<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LaborRate extends Model
{
    protected $fillable = [
        'company_id',
        'user_id',
        'role',
        'hourly_rate',
        'overtime_rate',
        'effective_from',
        'effective_to',
    ];

    protected $casts = [
        'hourly_rate' => 'decimal:2',
        'overtime_rate' => 'decimal:2',
        'effective_from' => 'date',
        'effective_to' => 'date',
    ];

    // Relationships
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Helper method to get current rate for a user or role
    public static function getCurrentRate($companyId, $userId = null, $role = null)
    {
        $query = self::where('company_id', $companyId)
            ->where('effective_from', '<=', now())
            ->where(function ($q) {
                $q->whereNull('effective_to')
                    ->orWhere('effective_to', '>=', now());
            });

        if ($userId) {
            $query->where('user_id', $userId);
        } elseif ($role) {
            $query->where('role', $role);
        }

        return $query->orderBy('effective_from', 'desc')->first();
    }
}
