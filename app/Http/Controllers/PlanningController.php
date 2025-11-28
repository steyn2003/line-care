<?php

namespace App\Http\Controllers;

use App\Enums\PlanningSlotStatus;
use App\Enums\Role;
use App\Enums\ShutdownStatus;
use App\Enums\WorkOrderStatus;
use App\Models\Location;
use App\Models\Machine;
use App\Models\PlannedShutdown;
use App\Models\PlanningSlot;
use App\Models\TechnicianAvailability;
use App\Models\User;
use App\Models\WorkOrder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PlanningController extends Controller
{
    /**
     * Display the planning board.
     */
    public function index(Request $request): Response
    {
        $companyId = $request->user()->company_id;

        // Default to current week
        $dateFrom = $request->date_from ?? now()->startOfWeek()->toDateString();
        $dateTo = $request->date_to ?? now()->endOfWeek()->toDateString();

        // Get planning slots for the date range
        $slots = PlanningSlot::forCompany($companyId)
            ->overlapping($dateFrom, $dateTo)
            ->with([
                'workOrder:id,title,type,status,machine_id,planning_priority',
                'technician:id,name',
                'machine:id,name,code',
                'location:id,name',
            ])
            ->orderBy('start_at')
            ->get();

        // Get technicians with their capacity
        $technicians = User::where('company_id', $companyId)
            ->whereIn('role', [Role::TECHNICIAN->value, Role::MANAGER->value])
            ->orderBy('name')
            ->get()
            ->map(function ($tech) use ($companyId, $dateFrom, $dateTo) {
                $capacity = $this->calculateCapacity($companyId, $tech->id, $dateFrom, $dateTo);
                return [
                    'id' => $tech->id,
                    'name' => $tech->name,
                    'planned_hours' => $capacity['planned_hours'],
                    'available_hours' => $capacity['available_hours'],
                    'utilization_pct' => $capacity['utilization_pct'],
                    'status' => $capacity['status'],
                ];
            });

        // Get unplanned work orders
        $unplannedWorkOrders = WorkOrder::forCompany($companyId)
            ->unplanned()
            ->with(['machine:id,name,code', 'assignee:id,name'])
            ->orderBy('planning_priority', 'asc')
            ->orderBy('created_at', 'asc')
            ->get();

        // Get shutdowns for the period
        $shutdowns = PlannedShutdown::forCompany($companyId)
            ->overlapping($dateFrom, $dateTo)
            ->active()
            ->with(['machine:id,name', 'location:id,name'])
            ->get();

        // Get machines for filter
        $machines = Machine::where('company_id', $companyId)
            ->where('status', 'active')
            ->orderBy('name')
            ->get(['id', 'name', 'code']);

        // Get locations for filter
        $locations = Location::where('company_id', $companyId)
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('planning/index', [
            'slots' => $slots,
            'technicians' => $technicians,
            'unplanned_work_orders' => $unplannedWorkOrders,
            'shutdowns' => $shutdowns,
            'machines' => $machines,
            'locations' => $locations,
            'filters' => [
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
                'technician_id' => $request->technician_id,
                'machine_id' => $request->machine_id,
                'location_id' => $request->location_id,
            ],
            'user' => [
                'id' => $request->user()->id,
                'role' => $request->user()->role->value,
            ],
        ]);
    }

    /**
     * Display the capacity dashboard.
     */
    public function capacity(Request $request): Response
    {
        $companyId = $request->user()->company_id;

        // Default to current week
        $dateFrom = $request->date_from ?? now()->startOfWeek()->toDateString();
        $dateTo = $request->date_to ?? now()->endOfWeek()->toDateString();

        // Get daily capacity data
        $daily = [];
        $currentDate = \Carbon\Carbon::parse($dateFrom);
        $endDate = \Carbon\Carbon::parse($dateTo);

        $technicians = User::where('company_id', $companyId)
            ->where('role', Role::TECHNICIAN->value)
            ->orderBy('name')
            ->get();

        while ($currentDate <= $endDate) {
            $dateStr = $currentDate->toDateString();

            $dayData = [
                'date' => $dateStr,
                'day_name' => $currentDate->format('l'),
                'technicians' => [],
                'total_available' => 0,
                'total_planned' => 0,
            ];

            foreach ($technicians as $tech) {
                $capacity = $this->calculateCapacity($companyId, $tech->id, $dateStr, $dateStr);
                $dayData['technicians'][] = [
                    'id' => $tech->id,
                    'name' => $tech->name,
                    'available_hours' => $capacity['available_hours'],
                    'planned_hours' => $capacity['planned_hours'],
                    'utilization_pct' => $capacity['utilization_pct'],
                    'status' => $capacity['status'],
                ];
                $dayData['total_available'] += $capacity['available_hours'];
                $dayData['total_planned'] += $capacity['planned_hours'];
            }

            $dayData['utilization_pct'] = $dayData['total_available'] > 0
                ? round(($dayData['total_planned'] / $dayData['total_available']) * 100, 1)
                : 0;

            $daily[] = $dayData;
            $currentDate->addDay();
        }

        // Summary totals
        $totalAvailable = collect($daily)->sum('total_available');
        $totalPlanned = collect($daily)->sum('total_planned');

        return Inertia::render('planning/capacity', [
            'daily' => $daily,
            'summary' => [
                'total_available' => round($totalAvailable, 2),
                'total_planned' => round($totalPlanned, 2),
                'utilization' => $totalAvailable > 0 ? round(($totalPlanned / $totalAvailable) * 100, 1) : 0,
            ],
            'technicians' => $technicians->map(fn($t) => ['id' => $t->id, 'name' => $t->name]),
            'filters' => [
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
            ],
            'user' => [
                'id' => $request->user()->id,
                'role' => $request->user()->role->value,
            ],
        ]);
    }

    /**
     * Display the planning analytics page.
     */
    public function analytics(Request $request): Response
    {
        $companyId = $request->user()->company_id;

        // Default to last 30 days
        $dateFrom = $request->date_from ?? now()->subDays(30)->toDateString();
        $dateTo = $request->date_to ?? now()->toDateString();

        // Get completed slots with work order data for accuracy metrics
        $completedSlots = PlanningSlot::forCompany($companyId)
            ->whereHas('workOrder', function ($q) {
                $q->where('status', WorkOrderStatus::COMPLETED);
            })
            ->where('status', PlanningSlotStatus::COMPLETED)
            ->whereBetween('start_at', [$dateFrom, $dateTo])
            ->with(['workOrder', 'technician:id,name', 'machine:id,name'])
            ->get();

        // Calculate accuracy metrics
        $onTimeStarts = 0;
        $totalDelayMinutes = 0;
        $durationVariances = [];
        $variances = [];

        foreach ($completedSlots as $slot) {
            $workOrder = $slot->workOrder;
            $startVariance = null;
            $durationVariance = null;

            if ($workOrder->started_at) {
                $plannedStart = $slot->start_at;
                $actualStart = $workOrder->started_at;
                $startDelay = $plannedStart->diffInMinutes($actualStart, false);
                $startVariance = $startDelay;

                if (abs($startDelay) <= 15) {
                    $onTimeStarts++;
                }
                $totalDelayMinutes += max(0, $startDelay);
            }

            if ($workOrder->downtime_minutes && $slot->duration_minutes) {
                $durationVariance = $workOrder->downtime_minutes - $slot->duration_minutes;
                $durationVariances[] = $workOrder->downtime_minutes / $slot->duration_minutes;
            }

            $variances[] = [
                'slot_id' => $slot->id,
                'work_order_id' => $workOrder->id,
                'work_order_title' => $workOrder->title,
                'technician_name' => $slot->technician->name ?? '',
                'machine_name' => $slot->machine->name ?? '',
                'planned_start' => $slot->start_at->toDateTimeString(),
                'actual_start' => $workOrder->started_at?->toDateTimeString(),
                'planned_duration' => $slot->duration_minutes,
                'actual_duration' => $workOrder->downtime_minutes,
                'start_variance_minutes' => $startVariance,
                'duration_variance_minutes' => $durationVariance,
            ];
        }

        $totalSlots = $completedSlots->count();
        $metrics = [
            'on_time_start_rate' => $totalSlots > 0 ? round(($onTimeStarts / $totalSlots) * 100, 1) : 0,
            'duration_accuracy' => !empty($durationVariances) ? round(array_sum($durationVariances) / count($durationVariances), 2) : 1,
            'avg_delay_minutes' => $totalSlots > 0 ? round($totalDelayMinutes / $totalSlots, 0) : 0,
            'total_slots_analyzed' => $totalSlots,
        ];

        $metrics['schedule_adherence'] = min(100, $metrics['on_time_start_rate'] * (1 / max($metrics['duration_accuracy'], 0.5)));

        return Inertia::render('planning/analytics', [
            'metrics' => $metrics,
            'variances' => array_slice($variances, 0, 50),
            'filters' => [
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
            ],
            'user' => [
                'id' => $request->user()->id,
                'role' => $request->user()->role->value,
            ],
        ]);
    }

    /**
     * Calculate technician capacity for a date range.
     */
    private function calculateCapacity(int $companyId, int $technicianId, string $dateFrom, string $dateTo): array
    {
        // Default work hours (8 hours/day, 5 days/week)
        $startDate = \Carbon\Carbon::parse($dateFrom);
        $endDate = \Carbon\Carbon::parse($dateTo);
        $workDays = 0;
        $current = $startDate->copy();
        while ($current <= $endDate) {
            if (!$current->isWeekend()) {
                $workDays++;
            }
            $current->addDay();
        }
        $defaultAvailableHours = $workDays * 8;

        // Get custom availability
        $availabilityRecords = TechnicianAvailability::forCompany($companyId)
            ->forTechnician($technicianId)
            ->inDateRange($dateFrom, $dateTo)
            ->get();

        $customAvailableMinutes = 0;
        $unavailableMinutes = 0;

        foreach ($availabilityRecords as $record) {
            if ($record->isAvailable()) {
                $customAvailableMinutes += $record->duration_minutes;
            } else {
                $unavailableMinutes += $record->duration_minutes;
            }
        }

        $availableHours = $customAvailableMinutes > 0
            ? $customAvailableMinutes / 60
            : max(0, $defaultAvailableHours - ($unavailableMinutes / 60));

        // Get planned hours
        $plannedMinutes = PlanningSlot::forCompany($companyId)
            ->forTechnician($technicianId)
            ->overlapping($dateFrom, $dateTo)
            ->active()
            ->sum('duration_minutes');

        $plannedHours = $plannedMinutes / 60;
        $utilizationPct = $availableHours > 0 ? ($plannedHours / $availableHours) * 100 : 0;

        $status = 'optimal';
        if ($utilizationPct > 100) {
            $status = 'overbooked';
        } elseif ($utilizationPct > 90) {
            $status = 'high';
        } elseif ($utilizationPct < 50) {
            $status = 'low';
        }

        return [
            'available_hours' => round($availableHours, 2),
            'planned_hours' => round($plannedHours, 2),
            'utilization_pct' => round($utilizationPct, 1),
            'status' => $status,
        ];
    }
}
