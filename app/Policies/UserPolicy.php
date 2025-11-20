<?php

namespace App\Policies;

use App\Enums\Role;
use App\Models\User;

class UserPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        // Only Managers can view the users list
        return $user->role === Role::MANAGER;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, User $model): bool
    {
        // Must belong to same company
        if ($user->company_id !== $model->company_id) {
            return false;
        }

        // Only Managers can view user details
        return $user->role === Role::MANAGER;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        // Only Managers can create users
        return $user->role === Role::MANAGER;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, User $model): bool
    {
        // Must belong to same company
        if ($user->company_id !== $model->company_id) {
            return false;
        }

        // Only Managers can update users
        return $user->role === Role::MANAGER;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, User $model): bool
    {
        // Must belong to same company
        if ($user->company_id !== $model->company_id) {
            return false;
        }

        // Can't delete yourself
        if ($user->id === $model->id) {
            return false;
        }

        // Only Managers can delete users
        return $user->role === Role::MANAGER;
    }
}
