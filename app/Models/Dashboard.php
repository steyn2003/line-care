<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Dashboard extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'company_id',
        'created_by',
        'name',
        'description',
        'layout',
        'is_default',
        'is_shared',
        'shared_with_role',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'layout' => 'array',
        'is_default' => 'boolean',
        'is_shared' => 'boolean',
    ];

    /**
     * Get the company that owns the dashboard.
     */
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * Get the user who created the dashboard.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the widgets for this dashboard.
     */
    public function widgets(): HasMany
    {
        return $this->hasMany(Widget::class)->orderBy('sort_order');
    }

    /**
     * Check if dashboard is accessible by a user.
     */
    public function isAccessibleBy(User $user): bool
    {
        // Creator can always access
        if ($this->created_by === $user->id) {
            return true;
        }

        // Must be same company
        if ($this->company_id !== $user->company_id) {
            return false;
        }

        // Check if shared
        if (!$this->is_shared) {
            return false;
        }

        // Check role restriction
        if ($this->shared_with_role && $user->role !== $this->shared_with_role) {
            return false;
        }

        return true;
    }

    /**
     * Duplicate the dashboard for a user.
     */
    public function duplicate(User $user): self
    {
        $newDashboard = $this->replicate();
        $newDashboard->name = $this->name . ' (Copy)';
        $newDashboard->created_by = $user->id;
        $newDashboard->company_id = $user->company_id;
        $newDashboard->is_default = false;
        $newDashboard->is_shared = false;
        $newDashboard->shared_with_role = null;
        $newDashboard->save();

        // Duplicate widgets
        foreach ($this->widgets as $widget) {
            $newWidget = $widget->replicate();
            $newWidget->dashboard_id = $newDashboard->id;
            $newWidget->save();
        }

        return $newDashboard;
    }

    /**
     * Scope to get shared dashboards.
     */
    public function scopeShared($query)
    {
        return $query->where('is_shared', true);
    }

    /**
     * Scope to get dashboards for a specific role.
     */
    public function scopeForRole($query, string $role)
    {
        return $query->where(function ($q) use ($role) {
            $q->whereNull('shared_with_role')
              ->orWhere('shared_with_role', $role);
        });
    }

    /**
     * Scope to get default dashboards.
     */
    public function scopeDefault($query)
    {
        return $query->where('is_default', true);
    }
}
