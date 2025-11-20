<?php

namespace App\Policies;

use App\Enums\Role;
use App\Models\User;
use App\Models\WorkOrder;

class WorkOrderPolicy
{
    /**
     * Determine if the user can view any work orders.
     */
    public function viewAny(User $user): bool
    {
        // Technicians and Managers can view all work orders
        // Operators can only view their own created work orders (handled in controller)
        return in_array($user->role, [Role::TECHNICIAN, Role::MANAGER]);
    }

    /**
     * Determine if the user can view the work order.
     */
    public function view(User $user, WorkOrder $workOrder): bool
    {
        // Must belong to same company
        if ($user->company_id !== $workOrder->company_id) {
            return false;
        }

        // Managers and Technicians can view all
        if (in_array($user->role, [Role::TECHNICIAN, Role::MANAGER])) {
            return true;
        }

        // Operators can only view work orders they created
        return $user->role === Role::OPERATOR && $workOrder->created_by === $user->id;
    }

    /**
     * Determine if the user can create work orders.
     */
    public function create(User $user): bool
    {
        // All roles can create work orders
        // (Operators can only create breakdown type - enforced in controller)
        return true;
    }

    /**
     * Determine if the user can update the work order.
     */
    public function update(User $user, WorkOrder $workOrder): bool
    {
        // Must belong to same company
        if ($user->company_id !== $workOrder->company_id) {
            return false;
        }

        // Only Technicians and Managers can update work orders
        return in_array($user->role, [Role::TECHNICIAN, Role::MANAGER]);
    }

    /**
     * Determine if the user can delete the work order.
     */
    public function delete(User $user, WorkOrder $workOrder): bool
    {
        // Must belong to same company
        if ($user->company_id !== $workOrder->company_id) {
            return false;
        }

        // Only Managers can delete work orders
        return $user->role === Role::MANAGER;
    }

    /**
     * Determine if the user can assign work orders.
     */
    public function assign(User $user, WorkOrder $workOrder): bool
    {
        // Must belong to same company
        if ($user->company_id !== $workOrder->company_id) {
            return false;
        }

        // Technicians can assign to themselves, Managers can assign to anyone
        return in_array($user->role, [Role::TECHNICIAN, Role::MANAGER]);
    }

    /**
     * Determine if the user can complete work orders.
     */
    public function complete(User $user, WorkOrder $workOrder): bool
    {
        // Must belong to same company
        if ($user->company_id !== $workOrder->company_id) {
            return false;
        }

        // Only Technicians and Managers can complete work orders
        return in_array($user->role, [Role::TECHNICIAN, Role::MANAGER]);
    }
}
