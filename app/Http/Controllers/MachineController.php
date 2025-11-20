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
        $this->authorize('create', Machine::class);

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

    public function import(Request $request): Response
    {
        $locations = Location::where('company_id', $request->user()->company_id)
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('machines/import', [
            'locations' => $locations,
        ]);
    }

    public function downloadTemplate()
    {
        $csv = "name,code,location,criticality,status\n";
        $csv .= "CNC Mill 1,CNC-001,Production Floor A,high,active\n";
        $csv .= "Lathe Machine,LAT-002,Production Floor B,medium,active\n";
        $csv .= "Drill Press,DRL-003,Workshop,low,active\n";

        return response($csv, 200)
            ->header('Content-Type', 'text/csv')
            ->header('Content-Disposition', 'attachment; filename="machines_template.csv"');
    }

    public function validateImport(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,txt|max:2048',
        ]);

        $file = $request->file('file');
        $csv = array_map('str_getcsv', file($file->getRealPath()));
        $header = array_map('trim', $csv[0]);
        unset($csv[0]);

        $errors = [];
        $validRows = [];
        $previewRows = [];

        foreach ($csv as $rowNum => $row) {
            $rowData = array_combine($header, $row);
            $actualRow = $rowNum + 2; // +2 because array is 0-indexed and header is row 1

            // Validate required fields
            if (empty(trim($rowData['name'] ?? ''))) {
                $errors[] = [
                    'row' => $actualRow,
                    'field' => 'name',
                    'message' => 'Machine name is required'
                ];
                continue;
            }

            // Validate criticality
            $criticality = strtolower(trim($rowData['criticality'] ?? 'medium'));
            if (!in_array($criticality, ['low', 'medium', 'high'])) {
                $errors[] = [
                    'row' => $actualRow,
                    'field' => 'criticality',
                    'message' => 'Criticality must be low, medium, or high'
                ];
                continue;
            }

            // Validate status
            $status = strtolower(trim($rowData['status'] ?? 'active'));
            if (!in_array($status, ['active', 'archived'])) {
                $errors[] = [
                    'row' => $actualRow,
                    'field' => 'status',
                    'message' => 'Status must be active or archived'
                ];
                continue;
            }

            $validRows[] = [
                'name' => trim($rowData['name']),
                'code' => !empty(trim($rowData['code'] ?? '')) ? trim($rowData['code']) : null,
                'location_name' => !empty(trim($rowData['location'] ?? '')) ? trim($rowData['location']) : null,
                'criticality' => $criticality,
                'status' => $status,
            ];

            if (count($previewRows) < 5) {
                $previewRows[] = [
                    'name' => trim($rowData['name']),
                    'code' => !empty(trim($rowData['code'] ?? '')) ? trim($rowData['code']) : null,
                    'location_name' => !empty(trim($rowData['location'] ?? '')) ? trim($rowData['location']) : null,
                    'criticality' => $criticality,
                    'status' => $status,
                ];
            }
        }

        // Store valid rows in session
        $uploadId = uniqid('import_', true);
        session([
            "machine_import_{$uploadId}" => $validRows,
        ]);

        return Inertia::render('machines/import', [
            'locations' => Location::where('company_id', $request->user()->company_id)->get(['id', 'name']),
            'preview' => [
                'valid_count' => count($validRows),
                'invalid_count' => count($errors),
                'total_count' => count($csv),
                'errors' => $errors,
                'preview_rows' => $previewRows,
                'upload_id' => $uploadId,
            ],
        ]);
    }

    public function confirmImport(Request $request)
    {
        $validated = $request->validate([
            'upload_id' => 'required|string',
            'location_handling' => 'required|in:create,skip',
        ]);

        $rows = session("machine_import_{$validated['upload_id']}");

        if (!$rows) {
            return back()->withErrors(['upload_id' => 'Import session expired. Please upload your file again.']);
        }

        $user = $request->user();
        $createdCount = 0;
        $locationsCreated = [];

        DB::beginTransaction();

        try {
            foreach ($rows as $row) {
                $machineData = [
                    'company_id' => $user->company_id,
                    'name' => $row['name'],
                    'code' => $row['code'],
                    'criticality' => $row['criticality'],
                    'status' => $row['status'],
                ];

                // Handle location
                if ($row['location_name']) {
                    $location = Location::where('company_id', $user->company_id)
                        ->where('name', $row['location_name'])
                        ->first();

                    if (!$location && $validated['location_handling'] === 'create') {
                        $location = Location::create([
                            'company_id' => $user->company_id,
                            'name' => $row['location_name'],
                        ]);
                        $locationsCreated[] = $location->name;
                    }

                    if ($location) {
                        $machineData['location_id'] = $location->id;
                    } elseif ($validated['location_handling'] === 'skip') {
                        continue; // Skip this machine
                    }
                }

                Machine::create($machineData);
                $createdCount++;
            }

            DB::commit();

            // Clear session
            session()->forget("machine_import_{$validated['upload_id']}");

            return redirect()->route('machines.index')
                ->with('success', "Successfully imported {$createdCount} machine(s)" .
                    (count($locationsCreated) > 0 ? " and created " . count($locationsCreated) . " location(s)" : ""));

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Import failed: ' . $e->getMessage()]);
        }
    }

    public function edit(Request $request, Machine $machine): Response
    {
        // Verify user can access this machine
        if ($machine->company_id !== $request->user()->company_id) {
            abort(403);
        }

        $locations = Location::where('company_id', $request->user()->company_id)
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('machines/create', [
            'locations' => $locations,
            'machine' => $machine,
        ]);
    }

    public function update(Request $request, Machine $machine)
    {
        // Verify user can access this machine
        if ($machine->company_id !== $request->user()->company_id) {
            abort(403);
        }

        $this->authorize('update', $machine);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'nullable|string|max:255',
            'location_id' => 'nullable|exists:locations,id',
            'criticality' => 'required|in:low,medium,high',
            'status' => 'required|in:active,archived',
            'description' => 'nullable|string',
        ]);

        $machine->update($validated);

        return redirect()->route('machines.show', $machine)
            ->with('success', 'Machine updated successfully');
    }

    public function destroy(Machine $machine)
    {
        // Verify user can access this machine
        if ($machine->company_id !== request()->user()->company_id) {
            abort(403);
        }

        $this->authorize('delete', $machine);

        $machine->delete();

        return redirect()->route('machines.index')
            ->with('success', 'Machine deleted successfully');
    }
}
