<?php

namespace App\Enums;

enum PlanningSlotStatus: string
{
    case TENTATIVE = 'tentative';
    case PLANNED = 'planned';
    case IN_PROGRESS = 'in_progress';
    case COMPLETED = 'completed';
    case CANCELLED = 'cancelled';

    /**
     * Get all status values as an array.
     *
     * @return array<string>
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * Get a human-readable label for the status.
     */
    public function label(): string
    {
        return match($this) {
            self::TENTATIVE => 'Tentative',
            self::PLANNED => 'Planned',
            self::IN_PROGRESS => 'In Progress',
            self::COMPLETED => 'Completed',
            self::CANCELLED => 'Cancelled',
        };
    }

    /**
     * Get a color for the status (for UI).
     */
    public function color(): string
    {
        return match($this) {
            self::TENTATIVE => 'gray',
            self::PLANNED => 'blue',
            self::IN_PROGRESS => 'yellow',
            self::COMPLETED => 'green',
            self::CANCELLED => 'red',
        };
    }
}
