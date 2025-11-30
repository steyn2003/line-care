<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Location extends Model
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
        'company_id',
    ];

    /**
     * Get the company that owns the location.
     */
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * Get the machines for the location.
     */
    public function machines(): HasMany
    {
        return $this->hasMany(Machine::class);
    }
}
