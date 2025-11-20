<?php

namespace App\Enums;

enum WorkOrderType: string
{
    case BREAKDOWN = 'breakdown';
    case CORRECTIVE = 'corrective';
    case PREVENTIVE = 'preventive';

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
            self::BREAKDOWN => 'Breakdown',
            self::CORRECTIVE => 'Corrective',
            self::PREVENTIVE => 'Preventive',
        };
    }

    /**
     * Get a color for the type (for UI).
     */
    public function color(): string
    {
        return match($this) {
            self::BREAKDOWN => 'red',
            self::CORRECTIVE => 'orange',
            self::PREVENTIVE => 'blue',
        };
    }
}
