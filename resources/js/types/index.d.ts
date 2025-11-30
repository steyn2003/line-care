import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavSection {
    label: string;
    items: NavItem[];
}

export interface NavSubGroup {
    label: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
    items?: NavItem[];
    groups?: NavSubGroup[];
}

/**
 * Feature flags available to the current user based on their company's plan.
 */
export interface Features {
    inventory: boolean;
    oee: boolean;
    costs: boolean;
    planning: boolean;
    analytics: boolean;
    api: boolean;
    webhooks: boolean;
    vendor_portal: boolean;
    iot: boolean;
    integrations: boolean;
}

/**
 * Impersonation state when a superadmin is impersonating another user.
 */
export interface ImpersonationData {
    is_impersonating: boolean;
    impersonator: {
        id: number;
        name: string;
        email: string;
    };
    impersonated_user: {
        id: number;
        name: string;
        email: string;
        company: {
            id: number;
            name: string;
        } | null;
    };
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    features: Features;
    impersonation: ImpersonationData | null;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

/**
 * User roles in the system.
 */
export type UserRole = 'operator' | 'technician' | 'manager' | 'super_admin';

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    role?: UserRole;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

/**
 * Helper functions for role-based access control.
 * These mirror the backend Role enum methods.
 */
export const RoleHelpers = {
    /**
     * Check if role is super admin.
     */
    isSuperAdmin: (role: UserRole | string | undefined): boolean => {
        return role === 'super_admin';
    },

    /**
     * Check if role can perform manager-level actions.
     * Super admins can do everything managers can do.
     */
    canActAsManager: (role: UserRole | string | undefined): boolean => {
        return role === 'manager' || role === 'super_admin';
    },

    /**
     * Check if role can perform technician-level actions.
     * Managers and super admins can do everything technicians can do.
     */
    canActAsTechnician: (role: UserRole | string | undefined): boolean => {
        return (
            role === 'technician' ||
            role === 'manager' ||
            role === 'super_admin'
        );
    },

    /**
     * Check if role has elevated permissions (not just operator).
     * Technicians, managers, and super admins have elevated permissions.
     */
    hasElevatedPermissions: (role: UserRole | string | undefined): boolean => {
        return role !== 'operator' && role !== undefined;
    },
};
