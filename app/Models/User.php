<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Enums\Role;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'phone',
        'password',
        'company_id',
        'role',
        'preferred_locale',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'role' => Role::class,
        ];
    }

    /**
     * Get the company that owns the user.
     */
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * Get the user's notification preferences.
     */
    public function notificationPreferences(): HasMany
    {
        return $this->hasMany(NotificationPreference::class);
    }

    /**
     * Get the user's notifications.
     */
    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class);
    }

    /**
     * Get unread notifications count.
     */
    public function unreadNotificationsCount(): int
    {
        return $this->notifications()->where('is_read', false)->count();
    }

    /**
     * Get the user's device tokens for push notifications.
     */
    public function deviceTokens(): HasMany
    {
        return $this->hasMany(DeviceToken::class);
    }

    /**
     * Check if user has any device tokens registered.
     */
    public function hasDeviceTokens(): bool
    {
        return $this->deviceTokens()->exists();
    }

    /**
     * Get the planning slots assigned to this user (as technician).
     */
    public function planningSlots(): HasMany
    {
        return $this->hasMany(PlanningSlot::class, 'technician_id');
    }

    /**
     * Get the availability records for this user (as technician).
     */
    public function availability(): HasMany
    {
        return $this->hasMany(TechnicianAvailability::class, 'technician_id');
    }

    /**
     * Check if this user is a technician.
     */
    public function isTechnician(): bool
    {
        return $this->role === Role::TECHNICIAN;
    }

    /**
     * Check if this user is a manager.
     */
    public function isManager(): bool
    {
        return $this->role === Role::MANAGER;
    }

    /**
     * Check if this user is an operator.
     */
    public function isOperator(): bool
    {
        return $this->role === Role::OPERATOR;
    }

    /**
     * Check if this user is a super admin.
     */
    public function isSuperAdmin(): bool
    {
        return $this->role->isSuperAdmin();
    }

    /**
     * Check if a feature is enabled for this user.
     *
     * @param string $feature
     * @return bool
     */
    public function hasFeature(string $feature): bool
    {
        return app(\App\Services\FeatureService::class)->enabledForUser($this, $feature);
    }

    /**
     * Get all features for this user.
     *
     * @return array<string, bool>
     */
    public function getFeatures(): array
    {
        return app(\App\Services\FeatureService::class)->getAllFeaturesForUser($this);
    }
}
