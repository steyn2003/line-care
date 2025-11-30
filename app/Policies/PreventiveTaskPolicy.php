<?php

namespace App\Policies;

use App\Enums\Role;
use App\Models\PreventiveTask;
use App\Models\User;

class PreventiveTaskPolicy
{
    /**
     * Determine if the user can view any preventive tasks.
     */
    public function viewAny(User $user): bool
    {
        // Technicians, Managers, and Super Admins can view preventive tasks
        // Operators don't need to see preventive tasks (they only handle breakdowns)
        return $user->canActAsTechnician();
    }

    /**
     * Determine if the user can view the preventive task.
     */
    public function view(User $user, PreventiveTask $preventiveTask): bool
    {
        // Super admins can view all preventive tasks
        if ($user->isSuperAdmin()) {
            return true;
        }

        // Must belong to same company
        if ($user->company_id !== $preventiveTask->company_id) {
            return false;
        }

        // Technicians and Managers can view
        return $user->canActAsTechnician();
    }

    /**
     * Determine if the user can create preventive tasks.
     */
    public function create(User $user): bool
    {
        // Only Managers and Super Admins can create preventive tasks
        return $user->canActAsManager();
    }

    /**
     * Determine if the user can update the preventive task.
     */
    public function update(User $user, PreventiveTask $preventiveTask): bool
    {
        // Super admins can update all preventive tasks
        if ($user->isSuperAdmin()) {
            return true;
        }

        // Must belong to same company
        if ($user->company_id !== $preventiveTask->company_id) {
            return false;
        }

        // Only Managers can update preventive tasks
        return $user->canActAsManager();
    }

    /**
     * Determine if the user can delete the preventive task.
     */
    public function delete(User $user, PreventiveTask $preventiveTask): bool
    {
        // Super admins can delete all preventive tasks
        if ($user->isSuperAdmin()) {
            return true;
        }

        // Must belong to same company
        if ($user->company_id !== $preventiveTask->company_id) {
            return false;
        }

        // Only Managers can delete preventive tasks
        return $user->canActAsManager();
    }
}
