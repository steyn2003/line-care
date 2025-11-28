<?php

namespace App\Http\Controllers;

use App\Enums\ShutdownStatus;
use App\Enums\ShutdownType;
use App\Models\Location;
use App\Models\Machine;
use App\Models\PlannedShutdown;
use App\Models\WorkOrder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PlannedShutdownController extends Controller
{
    /**
     * Display a listing of shutdowns.
     */
    public function index(Request $request): Response
    {
        $companyId = $request->user()->company_id;

        $query = PlannedShutdown::forCompany($companyId)
            ->with(['machine:id,name,code', 'location:id,name', 'creator:id,name']);

        // Filter by status
        if ($request->status) {
            $status = ShutdownStatus::tryFrom($request->status);
            if ($status) {
                $query->withStatus($status);
            }
        }

        // Filter by location
        if ($request->location_id) {
            $query->forLocation($request->location_id);
        }

        // Filter by machine
        if ($request->machine_id) {
            $query->forMachine($request->machine_id);
        }

        // Date range filter
        if ($request->date_from && $request->date_to) {
            $query->overlapping($request->date_from, $request->date_to);
        }

        $shutdowns = $query->orderBy('start_at', 'desc')->paginate(20);

        $locations = Location::where('company_id', $companyId)
            ->orderBy('name')
            ->get(['id', 'name']);

        $machines = Machine::where('company_id', $companyId)
            ->where('status', 'active')
            ->orderBy('name')
            ->get(['id', 'name', 'code']);

        return Inertia::render('planning/shutdowns/index', [
            'shutdowns' => $shutdowns,
            'locations' => $locations,
            'machines' => $machines,
            'shutdown_types' => collect(ShutdownType::cases())->map(fn($t) => [
                'value' => $t->value,
                'label' => $t->label(),
            ]),
            'shutdown_statuses' => collect(ShutdownStatus::cases())->map(fn($s) => [
                'value' => $s->value,
                'label' => $s->label(),
            ]),
            'filters' => [
                'status' => $request->status,
                'location_id' => $request->location_id,
                'machine_id' => $request->machine_id,
                'date_from' => $request->date_from,
                'date_to' => $request->date_to,
            ],
            'user' => [
                'id' => $request->user()->id,
                'role' => $request->user()->role->value,
            ],
        ]);
    }

    /**
     * Show the form for creating a new shutdown.
     */
    public function create(Request $request): Response
    {
        $companyId = $request->user()->company_id;

        $locations = Location::where('company_id', $companyId)
            ->orderBy('name')
            ->get(['id', 'name']);

        $machines = Machine::where('company_id', $companyId)
            ->where('status', 'active')
            ->orderBy('name')
            ->get(['id', 'name', 'code', 'location_id']);

        return Inertia::render('planning/shutdowns/create', [
            'locations' => $locations,
            'machines' => $machines,
            'shutdown_types' => collect(ShutdownType::cases())->map(fn($t) => [
                'value' => $t->value,
                'label' => $t->label(),
            ]),
        ]);
    }

    /**
     * Store a newly created shutdown.
     */
    public function store(Request $request)
    {
        $this->authorize('create', PlannedShutdown::class);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'machine_id' => 'nullable|exists:machines,id',
            'location_id' => 'required|exists:locations,id',
            'start_at' => 'required|date',
            'end_at' => 'required|date|after:start_at',
            'shutdown_type' => 'required|in:' . implode(',', ShutdownType::values()),
        ]);

        PlannedShutdown::create([
            'company_id' => $request->user()->company_id,
            'name' => $validated['name'],
            'description' => $validated['description'],
            'machine_id' => $validated['machine_id'],
            'location_id' => $validated['location_id'],
            'start_at' => $validated['start_at'],
            'end_at' => $validated['end_at'],
            'shutdown_type' => $validated['shutdown_type'],
            'status' => ShutdownStatus::SCHEDULED->value,
            'created_by' => $request->user()->id,
        ]);

        return redirect()->route('planning.shutdowns.index')
            ->with('success', 'Planned shutdown created successfully');
    }

    /**
     * Display the specified shutdown.
     */
    public function show(Request $request, PlannedShutdown $plannedShutdown): Response
    {
        if ($plannedShutdown->company_id !== $request->user()->company_id) {
            abort(403);
        }

        $plannedShutdown->load(['machine.location', 'location', 'creator']);

        // Get work orders that could be scheduled during this shutdown
        $eligibleWorkOrders = WorkOrder::forCompany($request->user()->company_id)
            ->whereIn('status', ['open', 'in_progress'])
            ->when($plannedShutdown->machine_id, function ($query) use ($plannedShutdown) {
                $query->where('machine_id', $plannedShutdown->machine_id);
            })
            ->with(['machine:id,name', 'assignee:id,name'])
            ->orderBy('planning_priority', 'asc')
            ->get();

        // Get already scheduled work orders during this shutdown
        $scheduledWorkOrders = WorkOrder::forCompany($request->user()->company_id)
            ->whereHas('planningSlots', function ($query) use ($plannedShutdown) {
                $query->where('source', 'shutdown')
                    ->where('start_at', '>=', $plannedShutdown->start_at)
                    ->where('end_at', '<=', $plannedShutdown->end_at);
            })
            ->with(['machine:id,name', 'assignee:id,name', 'planningSlots'])
            ->get();

        return Inertia::render('planning/shutdowns/show', [
            'shutdown' => $plannedShutdown,
            'eligible_work_orders' => $eligibleWorkOrders,
            'scheduled_work_orders' => $scheduledWorkOrders,
            'shutdown_types' => collect(ShutdownType::cases())->map(fn($t) => [
                'value' => $t->value,
                'label' => $t->label(),
            ]),
            'shutdown_statuses' => collect(ShutdownStatus::cases())->map(fn($s) => [
                'value' => $s->value,
                'label' => $s->label(),
            ]),
            'user' => [
                'id' => $request->user()->id,
                'role' => $request->user()->role->value,
            ],
        ]);
    }

    /**
     * Show the form for editing the specified shutdown.
     */
    public function edit(Request $request, PlannedShutdown $plannedShutdown): Response
    {
        if ($plannedShutdown->company_id !== $request->user()->company_id) {
            abort(403);
        }

        $companyId = $request->user()->company_id;

        $locations = Location::where('company_id', $companyId)
            ->orderBy('name')
            ->get(['id', 'name']);

        $machines = Machine::where('company_id', $companyId)
            ->where('status', 'active')
            ->orderBy('name')
            ->get(['id', 'name', 'code', 'location_id']);

        return Inertia::render('planning/shutdowns/edit', [
            'shutdown' => $plannedShutdown,
            'locations' => $locations,
            'machines' => $machines,
            'shutdown_types' => collect(ShutdownType::cases())->map(fn($t) => [
                'value' => $t->value,
                'label' => $t->label(),
            ]),
        ]);
    }

    /**
     * Update the specified shutdown.
     */
    public function update(Request $request, PlannedShutdown $plannedShutdown)
    {
        $this->authorize('update', $plannedShutdown);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'machine_id' => 'nullable|exists:machines,id',
            'location_id' => 'required|exists:locations,id',
            'start_at' => 'required|date',
            'end_at' => 'required|date|after:start_at',
            'shutdown_type' => 'required|in:' . implode(',', ShutdownType::values()),
        ]);

        $plannedShutdown->update($validated);

        return redirect()->route('planning.shutdowns.show', $plannedShutdown)
            ->with('success', 'Planned shutdown updated successfully');
    }

    /**
     * Remove the specified shutdown.
     */
    public function destroy(Request $request, PlannedShutdown $plannedShutdown)
    {
        $this->authorize('delete', $plannedShutdown);

        $plannedShutdown->delete();

        return redirect()->route('planning.shutdowns.index')
            ->with('success', 'Planned shutdown deleted successfully');
    }
}
