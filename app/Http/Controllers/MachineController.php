<?php

namespace App\Http\Controllers;

use App\Models\Location;
use App\Models\Machine;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class MachineController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $query = Machine::with('location')
            ->where('company_id', $user->company_id);

        // Apply filters
        if ($request->location_id) {
            $query->where('location_id', $request->location_id);
        }

        if ($request->status) {
            $query->where('status', $request->status);
        } else {
            $query->where('status', 'active');
        }

        $machines = $query->orderBy('name')->get();

        $locations = Location::where('company_id', $user->company_id)
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('machines/index', [
            'machines' => $machines,
            'locations' => $locations,
            'filters' => [
                'location_id' => $request->location_id,
                'status' => $request->status,
            ],
        ]);
    }

    public function show(Request $request, Machine $machine): Response
    {
        // Verify user can access this machine
        if ($machine->company_id !== $request->user()->company_id) {
            abort(403);
        }

        $machine->load('location');

        // Get recent work orders
        $workOrders = $machine->workOrders()
            ->with(['creator:id,name', 'assignee:id,name'])
            ->latest()
            ->limit(10)
            ->get();

        // Calculate analytics (last 90 days)
        $startDate = now()->subDays(90);

        $breakdownCount = $machine->workOrders()
            ->where('type', \App\Enums\WorkOrderType::BREAKDOWN)
            ->where('created_at', '>=', $startDate)
            ->count();

        $preventiveCount = $machine->workOrders()
            ->where('type', \App\Enums\WorkOrderType::PREVENTIVE)
            ->where('created_at', '>=', $startDate)
            ->count();

        $totalDowntimeMinutes = $machine->workOrders()
            ->where('type', \App\Enums\WorkOrderType::BREAKDOWN)
            ->where('created_at', '>=', $startDate)
            ->whereNotNull('started_at')
            ->whereNotNull('completed_at')
            ->get()
            ->sum(function ($wo) {
                return $wo->started_at->diffInMinutes($wo->completed_at);
            });

        $completedWorkOrders = $machine->workOrders()
            ->where('created_at', '>=', $startDate)
            ->whereNotNull('completed_at')
            ->get();

        $avgResolutionTimeMinutes = $completedWorkOrders->count() > 0
            ? $completedWorkOrders->avg(function ($wo) {
                return $wo->created_at->diffInMinutes($wo->completed_at);
            })
            : 0;

        $breakdownsByCause = DB::table('work_orders')
            ->join('cause_categories', 'work_orders.cause_category_id', '=', 'cause_categories.id')
            ->where('work_orders.machine_id', $machine->id)
            ->where('work_orders.type', \App\Enums\WorkOrderType::BREAKDOWN->value)
            ->where('work_orders.created_at', '>=', $startDate)
            ->whereNotNull('work_orders.cause_category_id')
            ->select('cause_categories.name as cause', DB::raw('count(*) as count'))
            ->groupBy('cause_categories.id', 'cause_categories.name')
            ->orderByDesc('count')
            ->get();

        $analytics = [
            'breakdown_count' => $breakdownCount,
            'preventive_count' => $preventiveCount,
            'total_downtime_minutes' => round($totalDowntimeMinutes),
            'avg_resolution_time_minutes' => round($avgResolutionTimeMinutes),
            'breakdowns_by_cause' => $breakdownsByCause,
        ];

        return Inertia::render('machines/show', [
            'machine' => $machine,
            'work_orders' => $workOrders,
            'analytics' => $analytics,
        ]);
    }

    public function create(Request $request): Response
    {
        $locations = Location::where('company_id', $request->user()->company_id)
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('machines/create', [
            'locations' => $locations,
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        // Check if user has a company assigned
        if (!$user->company_id) {
            return back()->withErrors([
                'company' => 'You must be assigned to a company to create machines. Please contact your administrator.'
            ]);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'nullable|string|max:255',
            'location_id' => 'nullable|exists:locations,id',
            'criticality' => 'required|in:low,medium,high',
            'status' => 'required|in:active,archived',
            'description' => 'nullable|string',
        ]);

        $validated['company_id'] = $user->company_id;

        Machine::create($validated);

        return redirect()->route('machines.index')
            ->with('success', 'Machine created successfully');
    }
}
