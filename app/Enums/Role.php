<?php

namespace App\Enums;

enum Role: string
{
    case SUPER_ADMIN = 'super_admin';
    case OPERATOR = 'operator';
    case TECHNICIAN = 'technician';
    case MANAGER = 'manager';

    /**
     * Get all role values as an array.
     *
     * @return array<string>
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * Get company role values (excluding super admin).
     *
     * @return array<string>
     */
    public static function companyRoles(): array
    {
        return [
            self::OPERATOR->value,
            self::TECHNICIAN->value,
            self::MANAGER->value,
        ];
    }

    /**
     * Get a human-readable label for the role.
     */
    public function label(): string
    {
        return match($this) {
            self::SUPER_ADMIN => 'Super Admin',
            self::OPERATOR => 'Operator',
            self::TECHNICIAN => 'Technician',
            self::MANAGER => 'Manager',
        };
    }

    /**
     * Check if this role is a super admin.
     */
    public function isSuperAdmin(): bool
    {
        return $this === self::SUPER_ADMIN;
    }
}
