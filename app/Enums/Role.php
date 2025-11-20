<?php

namespace App\Enums;

enum Role: string
{
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
     * Get a human-readable label for the role.
     */
    public function label(): string
    {
        return match($this) {
            self::OPERATOR => 'Operator',
            self::TECHNICIAN => 'Technician',
            self::MANAGER => 'Manager',
        };
    }
}
