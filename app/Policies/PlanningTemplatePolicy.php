<?php

namespace App\Policies;

use App\Enums\Role;
use App\Models\PlanningTemplate;
use App\Models\User;

class PlanningTemplatePolicy
{
    /**
     * Determine if the user can view any planning templates.
     */
    public function viewAny(User $user): bool
    {
        // Technicians and Managers can view planning templates
        return in_array($user->role, [Role::TECHNICIAN, Role::MANAGER]);
    }

    /**
     * Determine if the user can view the planning template.
     */
    public function view(User $user, PlanningTemplate $planningTemplate): bool
    {
        // Must belong to same company
        if ($user->company_id !== $planningTemplate->company_id) {
            return false;
        }

        // Technicians and Managers can view
        return in_array($user->role, [Role::TECHNICIAN, Role::MANAGER]);
    }

    /**
     * Determine if the user can create planning templates.
     */
    public function create(User $user): bool
    {
        // Only Managers can create planning templates
        return $user->role === Role::MANAGER;
    }

    /**
     * Determine if the user can update the planning template.
     */
    public function update(User $user, PlanningTemplate $planningTemplate): bool
    {
        // Must belong to same company
        if ($user->company_id !== $planningTemplate->company_id) {
            return false;
        }

        // Only Managers can update planning templates
        return $user->role === Role::MANAGER;
    }

    /**
     * Determine if the user can delete the planning template.
     */
    public function delete(User $user, PlanningTemplate $planningTemplate): bool
    {
        // Must belong to same company
        if ($user->company_id !== $planningTemplate->company_id) {
            return false;
        }

        // Only Managers can delete planning templates
        return $user->role === Role::MANAGER;
    }
}
