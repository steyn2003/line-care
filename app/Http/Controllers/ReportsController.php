<?php

namespace App\Http\Controllers;

use App\Enums\WorkOrderType;
use App\Models\Location;
use App\Models\Machine;
use App\Models\WorkOrder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ReportsController extends Controller
{
    public function downtime(Request $request): Response
    {
        $user = $request->user();

        // Parse date range (default to last 30 days)
        $dateFrom = $request->date_from ? \Carbon\Carbon::parse($request->date_from)->startOfDay() : now()->subDays(30)->startOfDay();
        $dateTo = $request->date_to ? \Carbon\Carbon::parse($request->date_to)->endOfDay() : now()->endOfDay();
        $locationId = $request->location_id;

        // Get locations for filter
        $locations = Location::where('company_id', $user->company_id)
            ->orderBy('name')
            ->get(['id', 'name']);

        // Build machine downtime report query
        $downtimeQuery = DB::table('work_orders')
            ->join('machines', 'work_orders.machine_id', '=', 'machines.id')
            ->leftJoin('locations', 'machines.location_id', '=', 'locations.id')
            ->where('work_orders.company_id', $user->company_id)
            ->where('work_orders.type', WorkOrderType::BREAKDOWN->value)
            ->where('work_orders.status', 'completed')
            ->whereBetween('work_orders.created_at', [$dateFrom, $dateTo])
            ->whereNotNull('work_orders.started_at')
            ->whereNotNull('work_orders.completed_at');

        if ($locationId) {
            $downtimeQuery->where('machines.location_id', $locationId);
        }

        // Use database-agnostic time difference calculation
        $driver = DB::connection()->getDriverName();
        $minutesDiff = match ($driver) {
            'sqlite' => 'CAST((julianday(work_orders.completed_at) - julianday(work_orders.started_at)) * 24 * 60 AS INTEGER)',
            'mysql', 'mariadb' => 'TIMESTAMPDIFF(MINUTE, work_orders.started_at, work_orders.completed_at)',
            'pgsql' => 'EXTRACT(EPOCH FROM (work_orders.completed_at - work_orders.started_at)) / 60',
            default => 'TIMESTAMPDIFF(MINUTE, work_orders.started_at, work_orders.completed_at)',
        };

        $machineDowntime = $downtimeQuery
            ->select(
                'machines.id as machine_id',
                'machines.name as machine_name',
                'machines.code as machine_code',
                'machines.criticality',
                'locations.name as location_name',
                DB::raw('COUNT(*) as breakdown_count'),
                DB::raw("SUM({$minutesDiff}) as total_downtime_minutes"),
                DB::raw("AVG({$minutesDiff}) as avg_downtime_minutes"),
                DB::raw("MIN({$minutesDiff}) as min_downtime_minutes"),
                DB::raw("MAX({$minutesDiff}) as max_downtime_minutes")
            )
            ->groupBy('machines.id', 'machines.name', 'machines.code', 'machines.criticality', 'locations.name')
            ->orderByDesc('total_downtime_minutes')
            ->get();

        // Calculate summary statistics
        $totalBreakdowns = $machineDowntime->sum('breakdown_count');
        $totalDowntimeMinutes = $machineDowntime->sum('total_downtime_minutes');
        $totalMachines = $machineDowntime->count();

        // Get breakdown count by criticality
        $breakdownsByCriticality = DB::table('work_orders')
            ->join('machines', 'work_orders.machine_id', '=', 'machines.id')
            ->where('work_orders.company_id', $user->company_id)
            ->where('work_orders.type', WorkOrderType::BREAKDOWN->value)
            ->whereBetween('work_orders.created_at', [$dateFrom, $dateTo]);

        if ($locationId) {
            $breakdownsByCriticality->where('machines.location_id', $locationId);
        }

        $breakdownsByCriticality = $breakdownsByCriticality
            ->select('machines.criticality', DB::raw('COUNT(*) as count'))
            ->groupBy('machines.criticality')
            ->get()
            ->pluck('count', 'criticality')
            ->toArray();

        return Inertia::render('reports/downtime', [
            'machine_downtime' => $machineDowntime,
            'summary' => [
                'total_breakdowns' => $totalBreakdowns,
                'total_downtime_minutes' => $totalDowntimeMinutes,
                'total_downtime_hours' => round($totalDowntimeMinutes / 60, 1),
                'total_machines_affected' => $totalMachines,
                'avg_downtime_per_breakdown' => $totalBreakdowns > 0 ? round($totalDowntimeMinutes / $totalBreakdowns, 1) : 0,
            ],
            'breakdowns_by_criticality' => $breakdownsByCriticality,
            'locations' => $locations,
            'filters' => [
                'location_id' => $locationId,
                'date_from' => $dateFrom->format('Y-m-d'),
                'date_to' => $dateTo->format('Y-m-d'),
            ],
            'user' => [
                'role' => $user->role ? $user->role->value : 'operator',
            ],
        ]);
    }
}
