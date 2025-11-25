<?php

namespace App\Services;

use App\Models\Machine;
use App\Models\WorkOrder;
use App\Models\Downtime;
use App\Models\ProductionRun;
use App\Models\CauseCategory;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AnalyticsService
{
    /**
     * Calculate MTBF (Mean Time Between Failures) for machines.
     *
     * MTBF = Total Operating Time / Number of Failures
     *
     * @param int $companyId
     * @param array $filters [machine_id, date_from, date_to]
     * @return array
     */
    public function calculateMTBF(int $companyId, array $filters = []): array
    {
        $query = Machine::where('company_id', $companyId);

        if (!empty($filters['machine_id'])) {
            $query->where('id', $filters['machine_id']);
        }

        $machines = $query->get();
        $results = [];
        $totalOperatingHours = 0;
        $totalFailures = 0;

        $dateFrom = $filters['date_from'] ?? now()->subMonths(6)->startOfDay();
        $dateTo = $filters['date_to'] ?? now()->endOfDay();

        foreach ($machines as $machine) {
            // Count breakdown work orders (failures)
            $failureCount = WorkOrder::where('machine_id', $machine->id)
                ->where('type', 'breakdown')
                ->whereBetween('created_at', [$dateFrom, $dateTo])
                ->count();

            // Calculate operating hours from production runs
            $operatingMinutes = ProductionRun::where('machine_id', $machine->id)
                ->whereBetween('start_time', [$dateFrom, $dateTo])
                ->whereNotNull('end_time')
                ->sum('actual_production_time');

            // If no production runs, estimate from date range
            if ($operatingMinutes == 0) {
                // Assume 8 hours/day, 5 days/week operation
                $days = Carbon::parse($dateFrom)->diffInWeekdays(Carbon::parse($dateTo));
                $operatingMinutes = $days * 8 * 60;
            }

            $operatingHours = $operatingMinutes / 60;
            $mtbf = $failureCount > 0 ? round($operatingHours / $failureCount, 2) : null;

            $results[] = [
                'machine_id' => $machine->id,
                'machine_name' => $machine->name,
                'operating_hours' => round($operatingHours, 2),
                'failure_count' => $failureCount,
                'mtbf_hours' => $mtbf,
                'mtbf_days' => $mtbf ? round($mtbf / 24, 2) : null,
            ];

            $totalOperatingHours += $operatingHours;
            $totalFailures += $failureCount;
        }

        // Sort by MTBF descending (higher is better)
        usort($results, function ($a, $b) {
            if ($a['mtbf_hours'] === null) return 1;
            if ($b['mtbf_hours'] === null) return -1;
            return $b['mtbf_hours'] <=> $a['mtbf_hours'];
        });

        return [
            'machines' => $results,
            'summary' => [
                'total_operating_hours' => round($totalOperatingHours, 2),
                'total_failures' => $totalFailures,
                'average_mtbf_hours' => $totalFailures > 0 ? round($totalOperatingHours / $totalFailures, 2) : null,
                'average_mtbf_days' => $totalFailures > 0 ? round(($totalOperatingHours / $totalFailures) / 24, 2) : null,
            ],
            'period' => [
                'from' => Carbon::parse($dateFrom)->toDateString(),
                'to' => Carbon::parse($dateTo)->toDateString(),
            ],
        ];
    }

    /**
     * Calculate MTTR (Mean Time To Repair) for machines.
     *
     * MTTR = Total Repair Time / Number of Repairs
     *
     * @param int $companyId
     * @param array $filters [machine_id, date_from, date_to]
     * @return array
     */
    public function calculateMTTR(int $companyId, array $filters = []): array
    {
        $dateFrom = $filters['date_from'] ?? now()->subMonths(6)->startOfDay();
        $dateTo = $filters['date_to'] ?? now()->endOfDay();

        $query = WorkOrder::where('company_id', $companyId)
            ->where('type', 'breakdown')
            ->where('status', 'completed')
            ->whereNotNull('started_at')
            ->whereNotNull('completed_at')
            ->whereBetween('created_at', [$dateFrom, $dateTo]);

        if (!empty($filters['machine_id'])) {
            $query->where('machine_id', $filters['machine_id']);
        }

        // Get work orders and calculate repair times in PHP (database-agnostic approach)
        $workOrders = $query->select('id', 'machine_id', 'started_at', 'completed_at')->get();

        // Group by machine and calculate stats
        $machineData = $workOrders->groupBy('machine_id')->map(function ($group) {
            $totalMinutes = $group->sum(function ($wo) {
                return Carbon::parse($wo->started_at)->diffInMinutes(Carbon::parse($wo->completed_at));
            });
            return [
                'repair_count' => $group->count(),
                'total_repair_minutes' => $totalMinutes,
            ];
        });

        $results = [];
        $totalRepairMinutes = 0;
        $totalRepairs = 0;

        foreach ($machineData as $machineId => $stats) {
            $machine = Machine::find($machineId);
            if (!$machine) continue;

            $avgRepairMinutes = $stats['repair_count'] > 0
                ? $stats['total_repair_minutes'] / $stats['repair_count']
                : 0;

            $results[] = [
                'machine_id' => $machine->id,
                'machine_name' => $machine->name,
                'repair_count' => $stats['repair_count'],
                'total_repair_hours' => round($stats['total_repair_minutes'] / 60, 2),
                'mttr_minutes' => round($avgRepairMinutes, 2),
                'mttr_hours' => round($avgRepairMinutes / 60, 2),
            ];

            $totalRepairMinutes += $stats['total_repair_minutes'];
            $totalRepairs += $stats['repair_count'];
        }

        // Sort by MTTR ascending (lower is better)
        usort($results, function ($a, $b) {
            return $a['mttr_minutes'] <=> $b['mttr_minutes'];
        });

        return [
            'machines' => $results,
            'summary' => [
                'total_repair_hours' => round($totalRepairMinutes / 60, 2),
                'total_repairs' => $totalRepairs,
                'average_mttr_minutes' => $totalRepairs > 0 ? round($totalRepairMinutes / $totalRepairs, 2) : 0,
                'average_mttr_hours' => $totalRepairs > 0 ? round(($totalRepairMinutes / $totalRepairs) / 60, 2) : 0,
            ],
            'period' => [
                'from' => Carbon::parse($dateFrom)->toDateString(),
                'to' => Carbon::parse($dateTo)->toDateString(),
            ],
        ];
    }

    /**
     * Pareto Analysis - Identify the 20% of causes responsible for 80% of issues.
     *
     * @param int $companyId
     * @param string $analysisType machines, causes, parts
     * @param array $filters [date_from, date_to]
     * @return array
     */
    public function paretoAnalysis(int $companyId, string $analysisType = 'machines', array $filters = []): array
    {
        $dateFrom = $filters['date_from'] ?? now()->subMonths(6)->startOfDay();
        $dateTo = $filters['date_to'] ?? now()->endOfDay();

        switch ($analysisType) {
            case 'causes':
                return $this->paretoByCause($companyId, $dateFrom, $dateTo);
            case 'downtime':
                return $this->paretoByDowntime($companyId, $dateFrom, $dateTo);
            case 'costs':
                return $this->paretoByCost($companyId, $dateFrom, $dateTo);
            case 'machines':
            default:
                return $this->paretoByMachine($companyId, $dateFrom, $dateTo);
        }
    }

    /**
     * Pareto by machine - which machines cause most breakdowns.
     */
    private function paretoByMachine(int $companyId, $dateFrom, $dateTo): array
    {
        $data = WorkOrder::where('company_id', $companyId)
            ->where('type', 'breakdown')
            ->whereBetween('created_at', [$dateFrom, $dateTo])
            ->select('machine_id', DB::raw('COUNT(*) as count'))
            ->groupBy('machine_id')
            ->orderByDesc('count')
            ->get();

        $total = $data->sum('count');
        $cumulative = 0;
        $results = [];

        foreach ($data as $item) {
            $machine = Machine::find($item->machine_id);
            $cumulative += $item->count;
            $percentage = $total > 0 ? round(($item->count / $total) * 100, 2) : 0;
            $cumulativePercentage = $total > 0 ? round(($cumulative / $total) * 100, 2) : 0;

            $results[] = [
                'id' => $item->machine_id,
                'name' => $machine ? $machine->name : 'Unknown',
                'count' => $item->count,
                'percentage' => $percentage,
                'cumulative_percentage' => $cumulativePercentage,
                'is_vital_few' => $cumulativePercentage <= 80,
            ];
        }

        return [
            'type' => 'machines',
            'data' => $results,
            'total' => $total,
            'vital_few_count' => count(array_filter($results, fn($r) => $r['is_vital_few'])),
            'period' => [
                'from' => Carbon::parse($dateFrom)->toDateString(),
                'to' => Carbon::parse($dateTo)->toDateString(),
            ],
        ];
    }

    /**
     * Pareto by cause category - which causes are most frequent.
     */
    private function paretoByCause(int $companyId, $dateFrom, $dateTo): array
    {
        $data = WorkOrder::where('company_id', $companyId)
            ->where('type', 'breakdown')
            ->whereNotNull('cause_category_id')
            ->whereBetween('created_at', [$dateFrom, $dateTo])
            ->select('cause_category_id', DB::raw('COUNT(*) as count'))
            ->groupBy('cause_category_id')
            ->orderByDesc('count')
            ->get();

        $total = $data->sum('count');
        $cumulative = 0;
        $results = [];

        foreach ($data as $item) {
            $cause = CauseCategory::find($item->cause_category_id);
            $cumulative += $item->count;
            $percentage = $total > 0 ? round(($item->count / $total) * 100, 2) : 0;
            $cumulativePercentage = $total > 0 ? round(($cumulative / $total) * 100, 2) : 0;

            $results[] = [
                'id' => $item->cause_category_id,
                'name' => $cause ? $cause->name : 'Unknown',
                'count' => $item->count,
                'percentage' => $percentage,
                'cumulative_percentage' => $cumulativePercentage,
                'is_vital_few' => $cumulativePercentage <= 80,
            ];
        }

        return [
            'type' => 'causes',
            'data' => $results,
            'total' => $total,
            'vital_few_count' => count(array_filter($results, fn($r) => $r['is_vital_few'])),
            'period' => [
                'from' => Carbon::parse($dateFrom)->toDateString(),
                'to' => Carbon::parse($dateTo)->toDateString(),
            ],
        ];
    }

    /**
     * Pareto by downtime - which machines have most downtime hours.
     */
    private function paretoByDowntime(int $companyId, $dateFrom, $dateTo): array
    {
        $data = Downtime::where('company_id', $companyId)
            ->whereBetween('start_time', [$dateFrom, $dateTo])
            ->whereNotNull('end_time')
            ->select('machine_id', DB::raw('SUM(duration_minutes) as total_minutes'))
            ->groupBy('machine_id')
            ->orderByDesc('total_minutes')
            ->get();

        $total = $data->sum('total_minutes');
        $cumulative = 0;
        $results = [];

        foreach ($data as $item) {
            $machine = Machine::find($item->machine_id);
            $cumulative += $item->total_minutes;
            $percentage = $total > 0 ? round(($item->total_minutes / $total) * 100, 2) : 0;
            $cumulativePercentage = $total > 0 ? round(($cumulative / $total) * 100, 2) : 0;

            $results[] = [
                'id' => $item->machine_id,
                'name' => $machine ? $machine->name : 'Unknown',
                'total_hours' => round($item->total_minutes / 60, 2),
                'percentage' => $percentage,
                'cumulative_percentage' => $cumulativePercentage,
                'is_vital_few' => $cumulativePercentage <= 80,
            ];
        }

        return [
            'type' => 'downtime',
            'data' => $results,
            'total_hours' => round($total / 60, 2),
            'vital_few_count' => count(array_filter($results, fn($r) => $r['is_vital_few'])),
            'period' => [
                'from' => Carbon::parse($dateFrom)->toDateString(),
                'to' => Carbon::parse($dateTo)->toDateString(),
            ],
        ];
    }

    /**
     * Pareto by cost - which machines are most expensive to maintain.
     */
    private function paretoByCost(int $companyId, $dateFrom, $dateTo): array
    {
        $data = WorkOrder::where('company_id', $companyId)
            ->whereBetween('created_at', [$dateFrom, $dateTo])
            ->whereHas('cost')
            ->with('cost')
            ->get()
            ->groupBy('machine_id')
            ->map(function ($workOrders, $machineId) {
                return [
                    'machine_id' => $machineId,
                    'total_cost' => $workOrders->sum(fn($wo) => $wo->cost?->total_cost ?? 0),
                ];
            })
            ->sortByDesc('total_cost')
            ->values();

        $total = $data->sum('total_cost');
        $cumulative = 0;
        $results = [];

        foreach ($data as $item) {
            $machine = Machine::find($item['machine_id']);
            $cumulative += $item['total_cost'];
            $percentage = $total > 0 ? round(($item['total_cost'] / $total) * 100, 2) : 0;
            $cumulativePercentage = $total > 0 ? round(($cumulative / $total) * 100, 2) : 0;

            $results[] = [
                'id' => $item['machine_id'],
                'name' => $machine ? $machine->name : 'Unknown',
                'total_cost' => round($item['total_cost'], 2),
                'percentage' => $percentage,
                'cumulative_percentage' => $cumulativePercentage,
                'is_vital_few' => $cumulativePercentage <= 80,
            ];
        }

        return [
            'type' => 'costs',
            'data' => $results,
            'total_cost' => round($total, 2),
            'vital_few_count' => count(array_filter($results, fn($r) => $r['is_vital_few'])),
            'period' => [
                'from' => Carbon::parse($dateFrom)->toDateString(),
                'to' => Carbon::parse($dateTo)->toDateString(),
            ],
        ];
    }

    /**
     * Failure mode analysis - categorize and analyze failure types.
     */
    public function failureModeAnalysis(int $companyId, array $filters = []): array
    {
        $dateFrom = $filters['date_from'] ?? now()->subMonths(6)->startOfDay();
        $dateTo = $filters['date_to'] ?? now()->endOfDay();

        $query = WorkOrder::where('company_id', $companyId)
            ->where('type', 'breakdown')
            ->whereBetween('created_at', [$dateFrom, $dateTo])
            ->with(['causeCategory', 'machine']);

        if (!empty($filters['machine_id'])) {
            $query->where('machine_id', $filters['machine_id']);
        }

        $workOrders = $query->get();

        // Group by cause category
        $byCategory = $workOrders->groupBy('cause_category_id')->map(function ($group, $categoryId) {
            $category = CauseCategory::find($categoryId);
            return [
                'category_id' => $categoryId,
                'category_name' => $category ? $category->name : 'Uncategorized',
                'count' => $group->count(),
                'machines_affected' => $group->pluck('machine_id')->unique()->count(),
                'avg_repair_time_hours' => $group->filter(fn($wo) => $wo->started_at && $wo->completed_at)
                    ->avg(fn($wo) => $wo->started_at->diffInMinutes($wo->completed_at) / 60),
            ];
        })->sortByDesc('count')->values();

        // Trends by month
        $monthlyTrends = $workOrders->groupBy(fn($wo) => $wo->created_at->format('Y-m'))
            ->map(fn($group, $month) => [
                'month' => $month,
                'count' => $group->count(),
            ])
            ->sortKeys()
            ->values();

        return [
            'by_category' => $byCategory,
            'monthly_trends' => $monthlyTrends,
            'summary' => [
                'total_failures' => $workOrders->count(),
                'unique_machines' => $workOrders->pluck('machine_id')->unique()->count(),
                'categories_count' => $byCategory->count(),
            ],
            'period' => [
                'from' => Carbon::parse($dateFrom)->toDateString(),
                'to' => Carbon::parse($dateTo)->toDateString(),
            ],
        ];
    }

    /**
     * Root cause trends - track how root causes change over time.
     */
    public function rootCauseTrends(int $companyId, array $filters = []): array
    {
        $dateFrom = $filters['date_from'] ?? now()->subMonths(12)->startOfDay();
        $dateTo = $filters['date_to'] ?? now()->endOfDay();

        $workOrders = WorkOrder::where('company_id', $companyId)
            ->where('type', 'breakdown')
            ->whereNotNull('cause_category_id')
            ->whereBetween('created_at', [$dateFrom, $dateTo])
            ->with('causeCategory')
            ->get();

        // Group by month and category
        $data = $workOrders->groupBy(fn($wo) => $wo->created_at->format('Y-m'))
            ->map(function ($monthGroup, $month) {
                return [
                    'month' => $month,
                    'total' => $monthGroup->count(),
                    'by_cause' => $monthGroup->groupBy('cause_category_id')
                        ->map(function ($causeGroup, $categoryId) {
                            $category = CauseCategory::find($categoryId);
                            return [
                                'category_id' => $categoryId,
                                'category_name' => $category ? $category->name : 'Unknown',
                                'count' => $causeGroup->count(),
                            ];
                        })
                        ->values(),
                ];
            })
            ->sortKeys()
            ->values();

        // Get all unique categories for chart legend
        $categories = CauseCategory::where('company_id', $companyId)->get()
            ->map(fn($c) => ['id' => $c->id, 'name' => $c->name]);

        return [
            'trends' => $data,
            'categories' => $categories,
            'period' => [
                'from' => Carbon::parse($dateFrom)->toDateString(),
                'to' => Carbon::parse($dateTo)->toDateString(),
            ],
        ];
    }

    /**
     * Maintenance effectiveness - compare PM vs breakdown metrics.
     */
    public function maintenanceEffectiveness(int $companyId, array $filters = []): array
    {
        $dateFrom = $filters['date_from'] ?? now()->subMonths(12)->startOfDay();
        $dateTo = $filters['date_to'] ?? now()->endOfDay();

        $query = WorkOrder::where('company_id', $companyId)
            ->whereBetween('created_at', [$dateFrom, $dateTo]);

        // PM work orders
        $pmWorkOrders = (clone $query)->where('type', 'preventive')->get();

        // Breakdown work orders
        $breakdownWorkOrders = (clone $query)->where('type', 'breakdown')->get();

        // Calculate metrics by month
        $monthlyData = collect();
        $current = Carbon::parse($dateFrom)->startOfMonth();
        $end = Carbon::parse($dateTo)->endOfMonth();

        while ($current <= $end) {
            $monthStr = $current->format('Y-m');

            $pmCount = $pmWorkOrders->filter(fn($wo) => $wo->created_at->format('Y-m') === $monthStr)->count();
            $breakdownCount = $breakdownWorkOrders->filter(fn($wo) => $wo->created_at->format('Y-m') === $monthStr)->count();

            $monthlyData->push([
                'month' => $monthStr,
                'preventive_count' => $pmCount,
                'breakdown_count' => $breakdownCount,
                'pm_ratio' => ($pmCount + $breakdownCount) > 0
                    ? round($pmCount / ($pmCount + $breakdownCount) * 100, 1)
                    : 0,
            ]);

            $current->addMonth();
        }

        // Overall statistics
        $pmTotal = $pmWorkOrders->count();
        $breakdownTotal = $breakdownWorkOrders->count();
        $totalWorkOrders = $pmTotal + $breakdownTotal;

        return [
            'monthly' => $monthlyData,
            'summary' => [
                'total_preventive' => $pmTotal,
                'total_breakdowns' => $breakdownTotal,
                'pm_percentage' => $totalWorkOrders > 0 ? round($pmTotal / $totalWorkOrders * 100, 1) : 0,
                'breakdown_percentage' => $totalWorkOrders > 0 ? round($breakdownTotal / $totalWorkOrders * 100, 1) : 0,
                'pm_to_breakdown_ratio' => $breakdownTotal > 0 ? round($pmTotal / $breakdownTotal, 2) : null,
            ],
            'recommendation' => $this->getEffectivenessRecommendation($pmTotal, $breakdownTotal),
            'period' => [
                'from' => Carbon::parse($dateFrom)->toDateString(),
                'to' => Carbon::parse($dateTo)->toDateString(),
            ],
        ];
    }

    /**
     * Get recommendation based on PM ratio.
     */
    private function getEffectivenessRecommendation(int $pmCount, int $breakdownCount): string
    {
        $total = $pmCount + $breakdownCount;
        if ($total === 0) {
            return 'No maintenance data available for analysis.';
        }

        $pmRatio = $pmCount / $total;

        if ($pmRatio >= 0.8) {
            return 'Excellent! Your preventive maintenance program is very mature. Focus on optimizing PM schedules and reducing unnecessary tasks.';
        } elseif ($pmRatio >= 0.6) {
            return 'Good PM coverage. Consider analyzing recurring breakdowns to add targeted preventive tasks.';
        } elseif ($pmRatio >= 0.4) {
            return 'Moderate PM coverage. Increase preventive maintenance frequency for high-breakdown machines.';
        } else {
            return 'Reactive maintenance dominates. Implement a preventive maintenance program to reduce unplanned downtime.';
        }
    }

    /**
     * Generate predictions based on historical data (simplified ML-like approach).
     */
    public function generatePredictions(int $companyId, int $machineId): array
    {
        $machine = Machine::findOrFail($machineId);

        // Get historical breakdown data
        $breakdowns = WorkOrder::where('machine_id', $machineId)
            ->where('type', 'breakdown')
            ->orderBy('created_at')
            ->get();

        if ($breakdowns->count() < 3) {
            return [
                'machine_id' => $machineId,
                'machine_name' => $machine->name,
                'prediction' => null,
                'message' => 'Insufficient data for prediction. Need at least 3 historical breakdowns.',
            ];
        }

        // Calculate average time between failures
        $intervals = [];
        for ($i = 1; $i < $breakdowns->count(); $i++) {
            $intervals[] = $breakdowns[$i]->created_at->diffInDays($breakdowns[$i - 1]->created_at);
        }

        $avgInterval = array_sum($intervals) / count($intervals);
        $stdDev = $this->standardDeviation($intervals);

        // Last breakdown
        $lastBreakdown = $breakdowns->last();
        $daysSinceLastBreakdown = $lastBreakdown->created_at->diffInDays(now());

        // Predict next failure
        $predictedDaysUntilFailure = max(0, $avgInterval - $daysSinceLastBreakdown);
        $predictedDate = now()->addDays(round($predictedDaysUntilFailure));

        // Calculate probability (increases as we approach predicted date)
        $probability = min(95, max(5, 50 + (($daysSinceLastBreakdown / $avgInterval) - 0.5) * 100));

        // Determine severity
        $severity = 'low';
        if ($predictedDaysUntilFailure <= 7) {
            $severity = 'critical';
        } elseif ($predictedDaysUntilFailure <= 14) {
            $severity = 'high';
        } elseif ($predictedDaysUntilFailure <= 30) {
            $severity = 'medium';
        }

        return [
            'machine_id' => $machineId,
            'machine_name' => $machine->name,
            'prediction' => [
                'predicted_failure_date' => $predictedDate->toDateString(),
                'days_until_failure' => round($predictedDaysUntilFailure),
                'probability' => round($probability, 1),
                'severity' => $severity,
                'confidence' => $stdDev < $avgInterval * 0.3 ? 'high' : ($stdDev < $avgInterval * 0.6 ? 'medium' : 'low'),
            ],
            'historical_data' => [
                'total_breakdowns' => $breakdowns->count(),
                'average_days_between_failures' => round($avgInterval, 1),
                'standard_deviation' => round($stdDev, 1),
                'last_breakdown' => $lastBreakdown->created_at->toDateString(),
                'days_since_last_breakdown' => $daysSinceLastBreakdown,
            ],
            'recommended_action' => $this->getRecommendedAction($severity, $predictedDaysUntilFailure),
        ];
    }

    /**
     * Calculate standard deviation.
     */
    private function standardDeviation(array $values): float
    {
        $count = count($values);
        if ($count < 2) return 0;

        $mean = array_sum($values) / $count;
        $sumSquaredDiff = 0;

        foreach ($values as $value) {
            $sumSquaredDiff += pow($value - $mean, 2);
        }

        return sqrt($sumSquaredDiff / ($count - 1));
    }

    /**
     * Get recommended action based on prediction.
     */
    private function getRecommendedAction(string $severity, float $daysUntilFailure): string
    {
        switch ($severity) {
            case 'critical':
                return 'Immediate inspection recommended. Schedule preventive maintenance within the next 3 days.';
            case 'high':
                return 'Schedule preventive maintenance within the next week. Order necessary spare parts.';
            case 'medium':
                return 'Plan preventive maintenance for the coming month. Review maintenance history for patterns.';
            default:
                return 'Continue regular maintenance schedule. Monitor for any unusual behavior.';
        }
    }
}
