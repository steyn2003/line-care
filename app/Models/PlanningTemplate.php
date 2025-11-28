<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;

class PlanningTemplate extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'company_id',
        'name',
        'description',
        'template_data',
        'recurrence_rule',
        'created_by',
    ];

    /**
     * Get the attributes that should be cast.
     */
    protected function casts(): array
    {
        return [
            'template_data' => 'array',
        ];
    }

    /**
     * Get the company that owns the template.
     */
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * Get the user who created the template.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Scope a query to only include templates for a specific company.
     */
    public function scopeForCompany(Builder $query, int $companyId): Builder
    {
        return $query->where('company_id', $companyId);
    }

    /**
     * Check if the template has a recurrence rule.
     */
    public function hasRecurrence(): bool
    {
        return !empty($this->recurrence_rule);
    }

    /**
     * Get the slots defined in the template data.
     *
     * @return array<int, array<string, mixed>>
     */
    public function getSlots(): array
    {
        return $this->template_data['slots'] ?? [];
    }

    /**
     * Get the number of slots in the template.
     */
    public function getSlotCountAttribute(): int
    {
        return count($this->getSlots());
    }

    /**
     * Get the total duration in minutes of all slots in the template.
     */
    public function getTotalDurationMinutesAttribute(): int
    {
        $slots = $this->getSlots();
        $total = 0;

        foreach ($slots as $slot) {
            $total += $slot['duration_minutes'] ?? 0;
        }

        return $total;
    }

    /**
     * Get the total duration in hours of all slots in the template.
     */
    public function getTotalDurationHoursAttribute(): float
    {
        return round($this->total_duration_minutes / 60, 2);
    }

    /**
     * Generate planning slots from this template for a given date range.
     *
     * @param string $startDate
     * @param string $endDate
     * @param int $createdBy
     * @return array<int, PlanningSlot>
     */
    public function generateSlots(string $startDate, string $endDate, int $createdBy): array
    {
        $slots = [];
        $templateSlots = $this->getSlots();

        foreach ($templateSlots as $templateSlot) {
            $slot = new PlanningSlot([
                'company_id' => $this->company_id,
                'work_order_id' => $templateSlot['work_order_id'] ?? null,
                'technician_id' => $templateSlot['technician_id'] ?? null,
                'machine_id' => $templateSlot['machine_id'] ?? null,
                'location_id' => $templateSlot['location_id'] ?? null,
                'duration_minutes' => $templateSlot['duration_minutes'] ?? 60,
                'status' => 'tentative',
                'source' => 'recurring',
                'color' => $templateSlot['color'] ?? null,
                'notes' => $templateSlot['notes'] ?? null,
                'created_by' => $createdBy,
            ]);

            $slots[] = $slot;
        }

        return $slots;
    }
}
