<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class IntegrationLog extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'integration_id',
        'action',
        'status',
        'records_processed',
        'records_succeeded',
        'records_failed',
        'message',
        'error_details',
        'started_at',
        'completed_at',
        'duration_seconds',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'error_details' => 'array',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
        'records_processed' => 'integer',
        'records_succeeded' => 'integer',
        'records_failed' => 'integer',
        'duration_seconds' => 'integer',
    ];

    /**
     * Get the integration that owns the log.
     */
    public function integration(): BelongsTo
    {
        return $this->belongsTo(Integration::class);
    }

    /**
     * Check if the log represents a successful sync.
     */
    public function isSuccess(): bool
    {
        return $this->status === 'success';
    }

    /**
     * Check if the log represents a failed sync.
     */
    public function isError(): bool
    {
        return $this->status === 'error';
    }

    /**
     * Get the success rate percentage.
     */
    public function getSuccessRateAttribute(): float
    {
        if ($this->records_processed === 0) {
            return 0.0;
        }

        return round(($this->records_succeeded / $this->records_processed) * 100, 2);
    }
}
