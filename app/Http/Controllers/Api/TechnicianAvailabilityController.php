<?php

namespace App\Http\Controllers\Api;

use App\Enums\AvailabilityType;
use App\Enums\Role;
use App\Http\Controllers\Controller;
use App\Models\TechnicianAvailability;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class TechnicianAvailabilityController extends Controller
{
    /**
     * Display a listing of technician availability.
     */
    public function index(Request $request): JsonResponse
    {
        Gate::authorize('viewAny', TechnicianAvailability::class);

        $query = TechnicianAvailability::query()
            ->with(['technician:id,name,email'])
            ->forCompany($request->user()->company_id);

        // Filter by technician
        if ($request->has('technician_id')) {
            $query->forTechnician($request->technician_id);
        }

        // Filter by date range
        if ($request->has('date_from') && $request->has('date_to')) {
            $query->inDateRange($request->date_from, $request->date_to);
        }

        // Filter by specific date
        if ($request->has('date')) {
            $query->forDate($request->date);
        }

        // Filter by availability type
        if ($request->has('availability_type')) {
            $type = AvailabilityType::tryFrom($request->availability_type);
            if ($type) {
                $query->where('availability_type', $type);
            }
        }

        // Filter only unavailable
        if ($request->boolean('unavailable_only')) {
            $query->unavailable();
        }

        // Sort
        $query->orderBy('date', 'asc')->orderBy('start_time', 'asc');

        $availability = $query->paginate($request->input('per_page', 50));

        return response()->json($availability);
    }

    /**
     * Store a newly created availability record.
     */
    public function store(Request $request): JsonResponse
    {
        Gate::authorize('create', TechnicianAvailability::class);

        $validated = $request->validate([
            'technician_id' => ['required', 'exists:users,id'],
            'date' => ['required', 'date'],
            'start_time' => ['required', 'date_format:H:i'],
            'end_time' => ['required', 'date_format:H:i', 'after:start_time'],
            'availability_type' => ['required', Rule::in(AvailabilityType::values())],
            'notes' => ['nullable', 'string'],
        ]);

        // Verify technician is in the same company
        $technician = User::findOrFail($validated['technician_id']);
        if ($technician->company_id !== $request->user()->company_id) {
            return response()->json(['message' => 'Technician not found'], 404);
        }

        // Technicians can only create for themselves
        if ($request->user()->role === Role::TECHNICIAN && $validated['technician_id'] != $request->user()->id) {
            return response()->json(['message' => 'You can only set your own availability'], 403);
        }

        $availability = TechnicianAvailability::create([
            'company_id' => $request->user()->company_id,
            'technician_id' => $validated['technician_id'],
            'date' => $validated['date'],
            'start_time' => $validated['start_time'],
            'end_time' => $validated['end_time'],
            'availability_type' => $validated['availability_type'],
            'notes' => $validated['notes'],
        ]);

        return response()->json([
            'availability' => $availability->load('technician'),
            'message' => 'Availability record created successfully',
        ], 201);
    }

    /**
     * Display the specified availability record.
     */
    public function show(Request $request, TechnicianAvailability $technicianAvailability): JsonResponse
    {
        Gate::authorize('view', $technicianAvailability);

        $technicianAvailability->load('technician');

        return response()->json([
            'availability' => $technicianAvailability,
        ]);
    }

    /**
     * Update the specified availability record.
     */
    public function update(Request $request, TechnicianAvailability $technicianAvailability): JsonResponse
    {
        Gate::authorize('update', $technicianAvailability);

        $validated = $request->validate([
            'date' => ['sometimes', 'date'],
            'start_time' => ['sometimes', 'date_format:H:i'],
            'end_time' => ['sometimes', 'date_format:H:i'],
            'availability_type' => ['sometimes', Rule::in(AvailabilityType::values())],
            'notes' => ['nullable', 'string'],
        ]);

        // Validate times if both provided
        if (isset($validated['start_time']) && isset($validated['end_time'])) {
            if ($validated['end_time'] <= $validated['start_time']) {
                return response()->json(['message' => 'End time must be after start time'], 422);
            }
        }

        $technicianAvailability->update($validated);

        return response()->json([
            'availability' => $technicianAvailability->fresh()->load('technician'),
            'message' => 'Availability record updated successfully',
        ]);
    }

    /**
     * Delete the specified availability record.
     */
    public function destroy(Request $request, TechnicianAvailability $technicianAvailability): JsonResponse
    {
        Gate::authorize('delete', $technicianAvailability);

        $technicianAvailability->delete();

        return response()->json([
            'message' => 'Availability record deleted successfully',
        ]);
    }

    /**
     * Get availability summary for all technicians.
     */
    public function summary(Request $request): JsonResponse
    {
        Gate::authorize('viewAny', TechnicianAvailability::class);

        $request->validate([
            'date_from' => ['required', 'date'],
            'date_to' => ['required', 'date', 'after_or_equal:date_from'],
        ]);

        $companyId = $request->user()->company_id;
        $dateFrom = $request->date_from;
        $dateTo = $request->date_to;

        // Get all technicians
        $technicians = User::where('company_id', $companyId)
            ->where('role', Role::TECHNICIAN->value)
            ->get();

        $summary = [];

        foreach ($technicians as $technician) {
            // Get availability records
            $availabilityRecords = TechnicianAvailability::forCompany($companyId)
                ->forTechnician($technician->id)
                ->inDateRange($dateFrom, $dateTo)
                ->get();

            // Calculate available and unavailable hours
            $availableMinutes = 0;
            $unavailableMinutes = 0;
            $unavailableByType = [];

            foreach ($availabilityRecords as $record) {
                $duration = $record->duration_minutes;

                if ($record->isAvailable()) {
                    $availableMinutes += $duration;
                } else {
                    $unavailableMinutes += $duration;
                    $type = $record->availability_type->value;
                    $unavailableByType[$type] = ($unavailableByType[$type] ?? 0) + $duration;
                }
            }

            $summary[] = [
                'technician_id' => $technician->id,
                'technician_name' => $technician->name,
                'available_hours' => round($availableMinutes / 60, 2),
                'unavailable_hours' => round($unavailableMinutes / 60, 2),
                'unavailable_by_type' => array_map(fn($m) => round($m / 60, 2), $unavailableByType),
            ];
        }

        return response()->json([
            'summary' => $summary,
            'date_from' => $dateFrom,
            'date_to' => $dateTo,
        ]);
    }

    /**
     * Bulk create availability records (e.g., set default work hours).
     */
    public function bulkStore(Request $request): JsonResponse
    {
        Gate::authorize('create', TechnicianAvailability::class);

        $validated = $request->validate([
            'technician_id' => ['required', 'exists:users,id'],
            'date_from' => ['required', 'date'],
            'date_to' => ['required', 'date', 'after_or_equal:date_from'],
            'start_time' => ['required', 'date_format:H:i'],
            'end_time' => ['required', 'date_format:H:i', 'after:start_time'],
            'availability_type' => ['required', Rule::in(AvailabilityType::values())],
            'exclude_weekends' => ['nullable', 'boolean'],
            'notes' => ['nullable', 'string'],
        ]);

        // Verify technician is in the same company
        $technician = User::findOrFail($validated['technician_id']);
        if ($technician->company_id !== $request->user()->company_id) {
            return response()->json(['message' => 'Technician not found'], 404);
        }

        // Technicians can only create for themselves
        if ($request->user()->role === Role::TECHNICIAN && $validated['technician_id'] != $request->user()->id) {
            return response()->json(['message' => 'You can only set your own availability'], 403);
        }

        $createdRecords = [];
        $dateFrom = \Carbon\Carbon::parse($validated['date_from']);
        $dateTo = \Carbon\Carbon::parse($validated['date_to']);
        $excludeWeekends = $validated['exclude_weekends'] ?? true;

        $currentDate = $dateFrom->copy();
        while ($currentDate <= $dateTo) {
            // Skip weekends if requested
            if ($excludeWeekends && $currentDate->isWeekend()) {
                $currentDate->addDay();
                continue;
            }

            // Check if record already exists for this date
            $existing = TechnicianAvailability::forCompany($request->user()->company_id)
                ->forTechnician($validated['technician_id'])
                ->forDate($currentDate->toDateString())
                ->first();

            if (!$existing) {
                $record = TechnicianAvailability::create([
                    'company_id' => $request->user()->company_id,
                    'technician_id' => $validated['technician_id'],
                    'date' => $currentDate->toDateString(),
                    'start_time' => $validated['start_time'],
                    'end_time' => $validated['end_time'],
                    'availability_type' => $validated['availability_type'],
                    'notes' => $validated['notes'],
                ]);
                $createdRecords[] = $record;
            }

            $currentDate->addDay();
        }

        return response()->json([
            'records' => $createdRecords,
            'count' => count($createdRecords),
            'message' => count($createdRecords) . ' availability records created',
        ], 201);
    }
}
