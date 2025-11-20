<?php

namespace App\Policies;

use App\Enums\Role;
use App\Models\Machine;
use App\Models\User;

class MachinePolicy
{
    /**
     * Determine if the user can view any machines.
     */
    public function viewAny(User $user): bool
    {
        // All authenticated users can view machines
        return true;
    }

    /**
     * Determine if the user can view the machine.
     */
    public function view(User $user, Machine $machine): bool
    {
        // Users can only view machines from their own company
        return $user->company_id === $machine->company_id;
    }

    /**
     * Determine if the user can create machines.
     */
    public function create(User $user): bool
    {
        // Only Technicians and Managers can create machines
        return in_array($user->role, [Role::TECHNICIAN, Role::MANAGER]);
    }

    /**
     * Determine if the user can update the machine.
     */
    public function update(User $user, Machine $machine): bool
    {
        // Must belong to same company
        if ($user->company_id !== $machine->company_id) {
            return false;
        }

        // Only Technicians and Managers can update machines
        return in_array($user->role, [Role::TECHNICIAN, Role::MANAGER]);
    }

    /**
     * Determine if the user can delete the machine.
     */
    public function delete(User $user, Machine $machine): bool
    {
        // Must belong to same company
        if ($user->company_id !== $machine->company_id) {
            return false;
        }

        // Only Managers can delete machines
        return $user->role === Role::MANAGER;
    }

    /**
     * Determine if the user can import machines.
     */
    public function import(User $user): bool
    {
        // Only Managers can import machines
        return $user->role === Role::MANAGER;
    }
}
