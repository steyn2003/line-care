<?php

namespace App\Policies;

use App\Models\AuditLog;
use App\Models\User;

class AuditLogPolicy
{
    /**
     * Determine whether the user can view any audit logs.
     * Only managers and superadmins can view audit logs.
     */
    public function viewAny(User $user): bool
    {
        return $user->isSuperAdmin() || $user->isManager();
    }

    /**
     * Determine whether the user can view the audit log.
     */
    public function view(User $user, AuditLog $auditLog): bool
    {
        // Superadmins can view all logs
        if ($user->isSuperAdmin()) {
            return true;
        }

        // Managers can only view logs from their own company
        if ($user->isManager()) {
            return $auditLog->company_id === $user->company_id;
        }

        return false;
    }
}
