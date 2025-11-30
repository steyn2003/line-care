<?php

namespace App\Policies;

use App\Enums\Role;
use App\Models\PlannedShutdown;
use App\Models\User;

class PlannedShutdownPolicy
{
    /**
     * Determine if the user can view any planned shutdowns.
     */
    public function viewAny(User $user): bool
    {
        // All authenticated users can view planned shutdowns
        return true;
    }

    /**
     * Determine if the user can view the planned shutdown.
     */
    public function view(User $user, PlannedShutdown $plannedShutdown): bool
    {
        // Super admins can view all planned shutdowns
        if ($user->isSuperAdmin()) {
            return true;
        }

        // Must belong to same company
        return $user->company_id === $plannedShutdown->company_id;
    }

    /**
     * Determine if the user can create planned shutdowns.
     */
    public function create(User $user): bool
    {
        // Only Managers and Super Admins can create planned shutdowns
        return $user->canActAsManager();
    }

    /**
     * Determine if the user can update the planned shutdown.
     */
    public function update(User $user, PlannedShutdown $plannedShutdown): bool
    {
        // Super admins can update all planned shutdowns
        if ($user->isSuperAdmin()) {
            return true;
        }

        // Must belong to same company
        if ($user->company_id !== $plannedShutdown->company_id) {
            return false;
        }

        // Only Managers can update planned shutdowns
        return $user->canActAsManager();
    }

    /**
     * Determine if the user can delete the planned shutdown.
     */
    public function delete(User $user, PlannedShutdown $plannedShutdown): bool
    {
        // Super admins can delete all planned shutdowns
        if ($user->isSuperAdmin()) {
            return true;
        }

        // Must belong to same company
        if ($user->company_id !== $plannedShutdown->company_id) {
            return false;
        }

        // Only Managers can delete planned shutdowns
        return $user->canActAsManager();
    }
}
