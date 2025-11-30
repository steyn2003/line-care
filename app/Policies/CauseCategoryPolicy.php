<?php

namespace App\Policies;

use App\Enums\Role;
use App\Models\CauseCategory;
use App\Models\User;

class CauseCategoryPolicy
{
    /**
     * Determine if the user can view any cause categories.
     */
    public function viewAny(User $user): bool
    {
        // All authenticated users can view cause categories
        return true;
    }

    /**
     * Determine if the user can view the cause category.
     */
    public function view(User $user, CauseCategory $causeCategory): bool
    {
        // Super admins can view all cause categories
        if ($user->isSuperAdmin()) {
            return true;
        }

        // Users can only view cause categories from their own company
        return $user->company_id === $causeCategory->company_id;
    }

    /**
     * Determine if the user can create cause categories.
     */
    public function create(User $user): bool
    {
        // Only Managers and Super Admins can create cause categories
        return $user->canActAsManager();
    }

    /**
     * Determine if the user can update the cause category.
     */
    public function update(User $user, CauseCategory $causeCategory): bool
    {
        // Super admins can update all cause categories
        if ($user->isSuperAdmin()) {
            return true;
        }

        // Must belong to same company
        if ($user->company_id !== $causeCategory->company_id) {
            return false;
        }

        // Only Managers can update cause categories
        return $user->canActAsManager();
    }

    /**
     * Determine if the user can delete the cause category.
     */
    public function delete(User $user, CauseCategory $causeCategory): bool
    {
        // Super admins can delete all cause categories
        if ($user->isSuperAdmin()) {
            return true;
        }

        // Must belong to same company
        if ($user->company_id !== $causeCategory->company_id) {
            return false;
        }

        // Only Managers can delete cause categories
        return $user->canActAsManager();
    }
}
