<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Integration extends Model
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
        'integration_type',
        'provider',
        'config',
        'is_enabled',
        'sync_frequency',
        'last_sync_at',
        'last_sync_status',
        'last_sync_message',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'config' => 'array',
        'is_enabled' => 'boolean',
        'last_sync_at' => 'datetime',
    ];

    /**
     * Get the company that owns the integration.
     */
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * Get the logs for the integration.
     */
    public function logs(): HasMany
    {
        return $this->hasMany(IntegrationLog::class);
    }

    /**
     * Check if the integration is an ERP type.
     */
    public function isErp(): bool
    {
        return $this->integration_type === 'erp';
    }

    /**
     * Check if the integration is an IoT type.
     */
    public function isIot(): bool
    {
        return $this->integration_type === 'iot';
    }

    /**
     * Check if the integration is enabled and ready to sync.
     */
    public function canSync(): bool
    {
        return $this->is_enabled && !empty($this->config);
    }

    /**
     * Mark the integration as successfully synced.
     */
    public function markSyncSuccess(string $message = 'Sync completed successfully'): void
    {
        $this->update([
            'last_sync_at' => now(),
            'last_sync_status' => 'success',
            'last_sync_message' => $message,
        ]);
    }

    /**
     * Mark the integration as failed to sync.
     */
    public function markSyncError(string $message): void
    {
        $this->update([
            'last_sync_at' => now(),
            'last_sync_status' => 'error',
            'last_sync_message' => $message,
        ]);
    }
}
