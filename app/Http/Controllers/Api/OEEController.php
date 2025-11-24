<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProductionRun;
use App\Models\Machine;
use App\Models\Shift;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class OEEController extends Controller
{
    /**
     * Get OEE metrics for a specific time period.
     */
    public function metrics(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'machine_id' => ['nullable', 'exists:machines,id'],
            'shift_id' => ['nullable', 'exists:shifts,id'],
            'date_from' => ['required', 'date'],
            'date_to' => ['required', 'date', 'after_or_equal:date_from'],
        ]);

        $query = ProductionRun::query()
            ->forCompany($request->user()->company_id)
            ->completed() // Only completed runs
            ->whereBetween('start_time', [$validated['date_from'], $validated['date_to']]);

        if (isset($validated['machine_id'])) {
            $query->where('machine_id', $validated['machine_id']);
        }

        if (isset($validated['shift_id'])) {
            $query->where('shift_id', $validated['shift_id']);
        }

        $runs = $query->get();

        if ($runs->isEmpty()) {
            return response()->json([
                'message' => 'No production runs found for the specified criteria.',
                'data' => [
                    'avg_availability' => 0,
                    'avg_performance' => 0,
                    'avg_quality' => 0,
                    'avg_oee' => 0,
                    'total_runs' => 0,
                    'total_output' => 0,
                    'total_good_output' => 0,
                    'total_downtime' => 0,
                ],
            ]);
        }

        $avgAvailability = $runs->avg('availability_pct');
        $avgPerformance = $runs->avg('performance_pct');
        $avgQuality = $runs->avg('quality_pct');
        $avgOEE = $runs->avg('oee_pct');
        $totalOutput = $runs->sum('actual_output');
        $totalGoodOutput = $runs->sum('good_output');
        $totalDowntime = $runs->sum(function ($run) {
            return $run->downtimes->sum('duration_minutes');
        });

        return response()->json([
            'data' => [
                'avg_availability' => round($avgAvailability, 2),
                'avg_performance' => round($avgPerformance, 2),
                'avg_quality' => round($avgQuality, 2),
                'avg_oee' => round($avgOEE, 2),
                'total_runs' => $runs->count(),
                'total_output' => $totalOutput,
                'total_good_output' => $totalGoodOutput,
                'total_downtime' => $totalDowntime,
            ],
        ]);
    }

    /**
     * Get OEE trends over time (daily or weekly).
     */
    public function trends(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'machine_id' => ['nullable', 'exists:machines,id'],
            'date_from' => ['required', 'date'],
            'date_to' => ['required', 'date', 'after_or_equal:date_from'],
            'interval' => ['sometimes', 'in:daily,weekly'], // daily or weekly grouping
        ]);

        $interval = $validated['interval'] ?? 'daily';

        $query = ProductionRun::query()
            ->forCompany($request->user()->company_id)
            ->completed()
            ->whereBetween('start_time', [$validated['date_from'], $validated['date_to']]);

        if (isset($validated['machine_id'])) {
            $query->where('machine_id', $validated['machine_id']);
        }

        if ($interval === 'daily') {
            $runs = $query->get()->groupBy(function ($run) {
                return Carbon::parse($run->start_time)->format('Y-m-d');
            });
        } else {
            // Weekly grouping
            $runs = $query->get()->groupBy(function ($run) {
                return Carbon::parse($run->start_time)->format('Y-W');
            });
        }

        $trends = [];
        foreach ($runs as $period => $periodRuns) {
            $trends[] = [
                'period' => $period,
                'avg_oee' => round($periodRuns->avg('oee_pct'), 2),
                'avg_availability' => round($periodRuns->avg('availability_pct'), 2),
                'avg_performance' => round($periodRuns->avg('performance_pct'), 2),
                'avg_quality' => round($periodRuns->avg('quality_pct'), 2),
                'total_runs' => $periodRuns->count(),
                'total_output' => $periodRuns->sum('actual_output'),
            ];
        }

        // Sort by period
        usort($trends, function ($a, $b) {
            return strcmp($a['period'], $b['period']);
        });

        return response()->json([
            'data' => $trends,
            'interval' => $interval,
        ]);
    }

    /**
     * Compare OEE across machines or shifts.
     */
    public function comparison(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'date_from' => ['required', 'date'],
            'date_to' => ['required', 'date', 'after_or_equal:date_from'],
            'compare_by' => ['required', 'in:machine,shift'], // machine or shift
        ]);

        $compareBy = $validated['compare_by'];

        $query = ProductionRun::query()
            ->forCompany($request->user()->company_id)
            ->completed()
            ->whereBetween('start_time', [$validated['date_from'], $validated['date_to']]);

        if ($compareBy === 'machine') {
            $query->with('machine');
            $runs = $query->get()->groupBy('machine_id');

            $comparison = [];
            foreach ($runs as $machineId => $machineRuns) {
                $machine = $machineRuns->first()->machine;
                $comparison[] = [
                    'id' => $machineId,
                    'name' => $machine->name,
                    'type' => 'machine',
                    'avg_oee' => round($machineRuns->avg('oee_pct'), 2),
                    'avg_availability' => round($machineRuns->avg('availability_pct'), 2),
                    'avg_performance' => round($machineRuns->avg('performance_pct'), 2),
                    'avg_quality' => round($machineRuns->avg('quality_pct'), 2),
                    'total_runs' => $machineRuns->count(),
                    'total_output' => $machineRuns->sum('actual_output'),
                    'total_downtime' => $machineRuns->sum(function ($run) {
                        return $run->downtimes->sum('duration_minutes');
                    }),
                ];
            }
        } else {
            // Compare by shift
            $query->with('shift');
            $runs = $query->get()->groupBy('shift_id');

            $comparison = [];
            foreach ($runs as $shiftId => $shiftRuns) {
                $shift = $shiftRuns->first()->shift;
                $comparison[] = [
                    'id' => $shiftId,
                    'name' => $shift->name,
                    'type' => 'shift',
                    'avg_oee' => round($shiftRuns->avg('oee_pct'), 2),
                    'avg_availability' => round($shiftRuns->avg('availability_pct'), 2),
                    'avg_performance' => round($shiftRuns->avg('performance_pct'), 2),
                    'avg_quality' => round($shiftRuns->avg('quality_pct'), 2),
                    'total_runs' => $shiftRuns->count(),
                    'total_output' => $shiftRuns->sum('actual_output'),
                    'total_downtime' => $shiftRuns->sum(function ($run) {
                        return $run->downtimes->sum('duration_minutes');
                    }),
                ];
            }
        }

        // Sort by OEE descending
        usort($comparison, function ($a, $b) {
            return $b['avg_oee'] <=> $a['avg_oee'];
        });

        return response()->json([
            'data' => $comparison,
            'compare_by' => $compareBy,
        ]);
    }

    /**
     * Get current/active production runs.
     */
    public function current(Request $request): JsonResponse
    {
        $activeRuns = ProductionRun::query()
            ->with(['machine', 'product', 'shift', 'downtimes'])
            ->forCompany($request->user()->company_id)
            ->active()
            ->get();

        // Calculate current metrics for each active run
        $activeRuns->transform(function ($run) {
            $run->elapsed_time = $run->start_time->diffInMinutes(now());
            $run->current_downtime = $run->downtimes()
                ->whereNull('end_time')
                ->sum('duration_minutes');
            return $run;
        });

        return response()->json([
            'data' => $activeRuns,
        ]);
    }

    /**
     * Get loss analysis (Pareto chart data).
     */
    public function lossAnalysis(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'machine_id' => ['nullable', 'exists:machines,id'],
            'date_from' => ['required', 'date'],
            'date_to' => ['required', 'date', 'after_or_equal:date_from'],
        ]);

        $query = ProductionRun::query()
            ->forCompany($request->user()->company_id)
            ->completed()
            ->with('downtimes.category')
            ->whereBetween('start_time', [$validated['date_from'], $validated['date_to']]);

        if (isset($validated['machine_id'])) {
            $query->where('machine_id', $validated['machine_id']);
        }

        $runs = $query->get();

        // Group downtime by category
        $downtimeByCategory = [];
        foreach ($runs as $run) {
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

        // Sort by total duration descending
        uasort($downtimeByCategory, function ($a, $b) {
            return $b['total_duration'] <=> $a['total_duration'];
        });

        // Calculate cumulative percentage
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

        return response()->json([
            'data' => $lossData,
            'total_downtime' => $totalDowntime,
        ]);
    }
}
