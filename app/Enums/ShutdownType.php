<?php

namespace App\Enums;

enum ShutdownType: string
{
    case PLANNED_MAINTENANCE = 'planned_maintenance';
    case CHANGEOVER = 'changeover';
    case HOLIDAY = 'holiday';

    /**
     * Get all type values as an array.
     *
     * @return array<string>
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * Get a human-readable label for the type.
     */
    public function label(): string
    {
        return match($this) {
            self::PLANNED_MAINTENANCE => 'Planned Maintenance',
            self::CHANGEOVER => 'Changeover',
            self::HOLIDAY => 'Holiday',
        };
    }

    /**
     * Get a color for the type (for UI).
     */
    public function color(): string
    {
        return match($this) {
            self::PLANNED_MAINTENANCE => 'blue',
            self::CHANGEOVER => 'orange',
            self::HOLIDAY => 'purple',
        };
    }
}
