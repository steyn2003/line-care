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
        // All authenticated users can access the work orders list
        // Operators see only their own work orders (filtered in controller)
        // Technicians and Managers see all work orders for their company
        return true;
    }

    /**
     * Determine if the user can view the work order.
     */
    public function view(User $user, WorkOrder $workOrder): bool
    {
        // Super admins can view all work orders
        if ($user->isSuperAdmin()) {
            return true;
        }

        // Must belong to same company
        if ($user->company_id !== $workOrder->company_id) {
            return false;
        }

        // Managers and Technicians can view all
        if ($user->canActAsTechnician()) {
            return true;
        }

        // Operators can only view work orders they created
        return $user->isOperator() && $workOrder->created_by === $user->id;
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
        // Super admins can update all work orders
        if ($user->isSuperAdmin()) {
            return true;
        }

        // Must belong to same company
        if ($user->company_id !== $workOrder->company_id) {
            return false;
        }

        // Only Technicians and Managers can update work orders
        return $user->canActAsTechnician();
    }

    /**
     * Determine if the user can delete the work order.
     */
    public function delete(User $user, WorkOrder $workOrder): bool
    {
        // Super admins can delete all work orders
        if ($user->isSuperAdmin()) {
            return true;
        }

        // Must belong to same company
        if ($user->company_id !== $workOrder->company_id) {
            return false;
        }

        // Only Managers can delete work orders
        return $user->canActAsManager();
    }

    /**
     * Determine if the user can assign work orders.
     */
    public function assign(User $user, WorkOrder $workOrder): bool
    {
        // Super admins can assign all work orders
        if ($user->isSuperAdmin()) {
            return true;
        }

        // Must belong to same company
        if ($user->company_id !== $workOrder->company_id) {
            return false;
        }

        // Technicians can assign to themselves, Managers can assign to anyone
        return $user->canActAsTechnician();
    }

    /**
     * Determine if the user can complete work orders.
     */
    public function complete(User $user, WorkOrder $workOrder): bool
    {
        // Super admins can complete all work orders
        if ($user->isSuperAdmin()) {
            return true;
        }

        // Must belong to same company
        if ($user->company_id !== $workOrder->company_id) {
            return false;
        }

        // Only Technicians and Managers can complete work orders
        return $user->canActAsTechnician();
    }
}
