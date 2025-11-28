<?php

namespace App\Enums;

enum PlanningSlotSource: string
{
    case MANUAL = 'manual';
    case AUTO_PM = 'auto_pm';
    case SHUTDOWN = 'shutdown';
    case RECURRING = 'recurring';

    /**
     * Get all source values as an array.
     *
     * @return array<string>
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * Get a human-readable label for the source.
     */
    public function label(): string
    {
        return match($this) {
            self::MANUAL => 'Manual',
            self::AUTO_PM => 'Auto PM',
            self::SHUTDOWN => 'Shutdown',
            self::RECURRING => 'Recurring',
        };
    }
}
