<?php

namespace App\Policies;

use App\Enums\Role;
use App\Models\PlanningSlot;
use App\Models\User;

class PlanningSlotPolicy
{
    /**
     * Determine if the user can view any planning slots.
     */
    public function viewAny(User $user): bool
    {
        // All authenticated users can view planning slots
        return true;
    }

    /**
     * Determine if the user can view the planning slot.
     */
    public function view(User $user, PlanningSlot $planningSlot): bool
    {
        // Super admins can view all planning slots
        if ($user->isSuperAdmin()) {
            return true;
        }

        // Must belong to same company
        return $user->company_id === $planningSlot->company_id;
    }

    /**
     * Determine if the user can create planning slots.
     */
    public function create(User $user): bool
    {
        // Only Technicians, Managers, and Super Admins can create planning slots
        return $user->canActAsTechnician();
    }

    /**
     * Determine if the user can update the planning slot.
     */
    public function update(User $user, PlanningSlot $planningSlot): bool
    {
        // Super admins can update all planning slots
        if ($user->isSuperAdmin()) {
            return true;
        }

        // Must belong to same company
        if ($user->company_id !== $planningSlot->company_id) {
            return false;
        }

        // Only Technicians and Managers can update planning slots
        return $user->canActAsTechnician();
    }

    /**
     * Determine if the user can delete the planning slot.
     */
    public function delete(User $user, PlanningSlot $planningSlot): bool
    {
        // Super admins can delete all planning slots
        if ($user->isSuperAdmin()) {
            return true;
        }

        // Must belong to same company
        if ($user->company_id !== $planningSlot->company_id) {
            return false;
        }

        // Only Managers can delete planning slots
        return $user->canActAsManager();
    }
}
