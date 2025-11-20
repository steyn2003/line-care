<?php

namespace App\Policies;

use App\Enums\Role;
use App\Models\Location;
use App\Models\User;

class LocationPolicy
{
    /**
     * Determine if the user can view any locations.
     */
    public function viewAny(User $user): bool
    {
        // All authenticated users can view locations
        return true;
    }

    /**
     * Determine if the user can view the location.
     */
    public function view(User $user, Location $location): bool
    {
        // Users can only view locations from their own company
        return $user->company_id === $location->company_id;
    }

    /**
     * Determine if the user can create locations.
     */
    public function create(User $user): bool
    {
        // Only Managers can create locations
        return $user->role === Role::MANAGER;
    }

    /**
     * Determine if the user can update the location.
     */
    public function update(User $user, Location $location): bool
    {
        // Must belong to same company
        if ($user->company_id !== $location->company_id) {
            return false;
        }

        // Only Managers can update locations
        return $user->role === Role::MANAGER;
    }

    /**
     * Determine if the user can delete the location.
     */
    public function delete(User $user, Location $location): bool
    {
        // Must belong to same company
        if ($user->company_id !== $location->company_id) {
            return false;
        }

        // Only Managers can delete locations
        return $user->role === Role::MANAGER;
    }
}
