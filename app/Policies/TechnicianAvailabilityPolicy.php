<?php

namespace App\Policies;

use App\Enums\Role;
use App\Models\TechnicianAvailability;
use App\Models\User;

class TechnicianAvailabilityPolicy
{
    /**
     * Determine if the user can view any availability records.
     */
    public function viewAny(User $user): bool
    {
        // All authenticated users can view availability
        return true;
    }

    /**
     * Determine if the user can view the availability record.
     */
    public function view(User $user, TechnicianAvailability $availability): bool
    {
        // Super admins can view all availability records
        if ($user->isSuperAdmin()) {
            return true;
        }

        // Must belong to same company
        return $user->company_id === $availability->company_id;
    }

    /**
     * Determine if the user can create availability records.
     */
    public function create(User $user): bool
    {
        // Technicians can create their own, Managers and Super Admins can create for anyone
        return $user->canActAsTechnician();
    }

    /**
     * Determine if the user can update the availability record.
     */
    public function update(User $user, TechnicianAvailability $availability): bool
    {
        // Super admins can update all availability records
        if ($user->isSuperAdmin()) {
            return true;
        }

        // Must belong to same company
        if ($user->company_id !== $availability->company_id) {
            return false;
        }

        // Managers can update any, Technicians can only update their own
        if ($user->canActAsManager()) {
            return true;
        }

        return $user->isTechnician() && $availability->technician_id === $user->id;
    }

    /**
     * Determine if the user can delete the availability record.
     */
    public function delete(User $user, TechnicianAvailability $availability): bool
    {
        // Super admins can delete all availability records
        if ($user->isSuperAdmin()) {
            return true;
        }

        // Must belong to same company
        if ($user->company_id !== $availability->company_id) {
            return false;
        }

        // Managers can delete any, Technicians can only delete their own
        if ($user->canActAsManager()) {
            return true;
        }

        return $user->isTechnician() && $availability->technician_id === $user->id;
    }
}
