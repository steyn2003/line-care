<?php

namespace App\Enums;

enum AvailabilityType: string
{
    case AVAILABLE = 'available';
    case VACATION = 'vacation';
    case SICK = 'sick';
    case TRAINING = 'training';

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
            self::AVAILABLE => 'Available',
            self::VACATION => 'Vacation',
            self::SICK => 'Sick',
            self::TRAINING => 'Training',
        };
    }

    /**
     * Get a color for the type (for UI).
     */
    public function color(): string
    {
        return match($this) {
            self::AVAILABLE => 'green',
            self::VACATION => 'purple',
            self::SICK => 'red',
            self::TRAINING => 'blue',
        };
    }

    /**
     * Check if this type means the technician is unavailable.
     */
    public function isUnavailable(): bool
    {
        return match($this) {
            self::AVAILABLE => false,
            self::VACATION, self::SICK, self::TRAINING => true,
        };
    }
}
