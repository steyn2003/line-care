<?php

namespace App\Http\Controllers;

use App\Models\Machine;
use App\Models\ProductionRun;
use App\Models\Shift;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OEEController extends Controller
{
    public function dashboard(Request $request): Response
    {
        $machines = Machine::forCompany($request->user()->company_id)
            ->orderBy('name')
            ->get(['id', 'name']);

        $shifts = Shift::forCompany($request->user()->company_id)
            ->active()
            ->orderBy('start_time')
            ->get(['id', 'name']);

        // Set default date range (last 7 days)
        $dateFrom = $request->input('date_from', now()->subDays(7)->format('Y-m-d'));
        $dateTo = $request->input('date_to', now()->format('Y-m-d'));
        $machineId = $request->input('machine_id');
        $shiftId = $request->input('shift_id');

        // Get metrics
        $metricsQuery = ProductionRun::query()
            ->with('downtimes')
            ->forCompany($request->user()->company_id)
            ->completed()
            ->whereBetween('start_time', [$dateFrom, $dateTo]);

        if ($machineId) {
            $metricsQuery->where('machine_id', $machineId);
        }
        if ($shiftId) {
            $metricsQuery->where('shift_id', $shiftId);
        }

        $runs = $metricsQuery->get();

        $metrics = [
            'average_availability' => $runs->count() > 0 ? round($runs->avg('availability_pct'), 2) : 0,
            'average_performance' => $runs->count() > 0 ? round($runs->avg('performance_pct'), 2) : 0,
            'average_quality' => $runs->count() > 0 ? round($runs->avg('quality_pct'), 2) : 0,
            'average_oee' => $runs->count() > 0 ? round($runs->avg('oee_pct'), 2) : 0,
            'total_runs' => $runs->count(),
            'total_output' => $runs->sum('actual_output'),
            'total_good_output' => $runs->sum('good_output'),
            'total_downtime' => $runs->sum(function ($run) {
                return $run->downtimes->sum('duration_minutes');
            }),
        ];

        // Get active runs
        $activeRunsQuery = ProductionRun::query()
            ->with(['machine', 'product', 'shift'])
            ->forCompany($request->user()->company_id)
            ->active();

        if ($machineId) {
            $activeRunsQuery->where('machine_id', $machineId);
        }

        $activeRuns = $activeRunsQuery->get();

        // Get loss analysis
        $lossQuery = ProductionRun::query()
            ->forCompany($request->user()->company_id)
            ->completed()
            ->with('downtimes.category')
            ->whereBetween('start_time', [$dateFrom, $dateTo]);

        if ($machineId) {
            $lossQuery->where('machine_id', $machineId);
        }

        $lossRuns = $lossQuery->get();
        $downtimeByCategory = [];

        foreach ($lossRuns as $run) {
            foreach ($run->downtimes as $downtime) {
                $categoryName = $downtime->category->name;
                if (!isset($downtimeByCategory[$categoryName])) {
                    $downtimeByCategory[$categoryName] = [
                        'category' => $categoryName,
                        'category_type' => $downtime->category->category_type,
                        'total_duration' => 0,
                        'occurrences' => 0,
                    ];
                }
                $downtimeByCategory[$categoryName]['total_duration'] += $downtime->duration_minutes ?? 0;
                $downtimeByCategory[$categoryName]['occurrences']++;
            }
        }

        uasort($downtimeByCategory, function ($a, $b) {
            return $b['total_duration'] <=> $a['total_duration'];
        });

        $totalDowntime = array_sum(array_column($downtimeByCategory, 'total_duration'));
        $cumulativePercentage = 0;
        $lossData = [];

        foreach ($downtimeByCategory as $data) {
            $percentage = $totalDowntime > 0 ? ($data['total_duration'] / $totalDowntime) * 100 : 0;
            $cumulativePercentage += $percentage;

            $lossData[] = [
                'category' => $data['category'],
                'category_type' => $data['category_type'],
                'total_duration' => $data['total_duration'],
                'occurrences' => $data['occurrences'],
                'percentage' => round($percentage, 2),
                'cumulative_percentage' => round($cumulativePercentage, 2),
            ];
        }

        // Get machine comparison
        $comparisonQuery = ProductionRun::query()
            ->with(['machine', 'downtimes'])
            ->forCompany($request->user()->company_id)
            ->completed()
            ->whereBetween('start_time', [$dateFrom, $dateTo]);

        if ($shiftId) {
            $comparisonQuery->where('shift_id', $shiftId);
        }

        $comparisonRuns = $comparisonQuery->get()->groupBy('machine_id');
        $machineComparison = [];

        foreach ($comparisonRuns as $machId => $machRuns) {
            $machine = $machRuns->first()->machine;
            $machineComparison[] = [
                'machine_id' => $machId,
                'machine_name' => $machine->name,
                'average_oee' => round($machRuns->avg('oee_pct'), 2),
                'total_runs' => $machRuns->count(),
                'total_downtime' => $machRuns->sum(function ($run) {
                    return $run->downtimes->sum('duration_minutes');
                }),
            ];
        }

        usort($machineComparison, function ($a, $b) {
            return $b['average_oee'] <=> $a['average_oee'];
        });

        return Inertia::render('oee/dashboard', [
            'machines' => $machines,
            'shifts' => $shifts,
            'metrics' => $metrics,
            'activeRuns' => $activeRuns,
            'lossData' => $lossData,
            'machineComparison' => $machineComparison,
            'filters' => [
                'machine_id' => $machineId,
                'shift_id' => $shiftId,
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
            ],
        ]);
    }

    public function trends(Request $request): Response
    {
        $machines = Machine::forCompany($request->user()->company_id)
            ->orderBy('name')
            ->get(['id', 'name']);

        $shifts = Shift::forCompany($request->user()->company_id)
            ->active()
            ->orderBy('start_time')
            ->get(['id', 'name']);

        // Set defaults
        $dateFrom = $request->input('date_from', now()->subDays(30)->format('Y-m-d'));
        $dateTo = $request->input('date_to', now()->format('Y-m-d'));
        $machineId = $request->input('machine_id');
        $shiftId = $request->input('shift_id');
        $period = $request->input('period', 'daily');

        // Get trends data
        $query = ProductionRun::query()
            ->forCompany($request->user()->company_id)
            ->completed()
            ->whereBetween('start_time', [$dateFrom, $dateTo]);

        if ($machineId) {
            $query->where('machine_id', $machineId);
        }
        if ($shiftId) {
            $query->where('shift_id', $shiftId);
        }

        $runs = $query->get();

        if ($period === 'daily') {
            $grouped = $runs->groupBy(function ($run) {
                return Carbon::parse($run->start_time)->format('Y-m-d');
            });
        } else {
            $grouped = $runs->groupBy(function ($run) {
                return Carbon::parse($run->start_time)->format('Y-W');
            });
        }

        $trends = [];
        foreach ($grouped as $periodKey => $periodRuns) {
            $trends[] = [
                'period' => $periodKey,
                'avg_oee' => round($periodRuns->avg('oee_pct'), 2),
                'avg_availability' => round($periodRuns->avg('availability_pct'), 2),
                'avg_performance' => round($periodRuns->avg('performance_pct'), 2),
                'avg_quality' => round($periodRuns->avg('quality_pct'), 2),
                'total_runs' => $periodRuns->count(),
                'total_output' => $periodRuns->sum('actual_output'),
            ];
        }

        usort($trends, function ($a, $b) {
            return strcmp($a['period'], $b['period']);
        });

        // Get machine comparison
        $comparisonQuery = ProductionRun::query()
            ->with('machine')
            ->forCompany($request->user()->company_id)
            ->completed()
            ->whereBetween('start_time', [$dateFrom, $dateTo]);

        if ($shiftId) {
            $comparisonQuery->where('shift_id', $shiftId);
        }

        $comparisonRuns = $comparisonQuery->get()->groupBy('machine_id');
        $comparison = [];

        foreach ($comparisonRuns as $machId => $machRuns) {
            $machine = $machRuns->first()->machine;
            $comparison[] = [
                'id' => $machId,
                'name' => $machine->name,
                'avg_oee' => round($machRuns->avg('oee_pct'), 2),
                'total_runs' => $machRuns->count(),
            ];
        }

        usort($comparison, function ($a, $b) {
            return $b['avg_oee'] <=> $a['avg_oee'];
        });

        return Inertia::render('oee/trends', [
            'machines' => $machines,
            'shifts' => $shifts,
            'trends' => $trends,
            'comparison' => $comparison,
            'filters' => [
                'machine_id' => $machineId,
                'shift_id' => $shiftId,
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
                'period' => $period,
            ],
        ]);
    }
}
