<?php

namespace App\Http\Controllers;

use App\Enums\AvailabilityType;
use App\Enums\Role;
use App\Models\TechnicianAvailability;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TechnicianAvailabilityController extends Controller
{
    /**
     * Display a listing of availability records.
     */
    public function index(Request $request): Response
    {
        $companyId = $request->user()->company_id;

        // Default to current week
        $dateFrom = $request->date_from ?? now()->startOfWeek()->toDateString();
        $dateTo = $request->date_to ?? now()->endOfWeek()->toDateString();

        $query = TechnicianAvailability::forCompany($companyId)
            ->with(['technician:id,name'])
            ->inDateRange($dateFrom, $dateTo);

        // Filter by technician
        if ($request->technician_id) {
            $query->forTechnician($request->technician_id);
        }

        // Filter by availability type
        if ($request->availability_type) {
            $type = AvailabilityType::tryFrom($request->availability_type);
            if ($type) {
                $query->where('availability_type', $type);
            }
        }

        $availability = $query->orderBy('date', 'asc')
            ->orderBy('start_time', 'asc')
            ->get();

        // Get technicians
        $technicians = User::where('company_id', $companyId)
            ->whereIn('role', [Role::TECHNICIAN->value, Role::MANAGER->value])
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('planning/availability/index', [
            'availability' => $availability,
            'technicians' => $technicians,
            'availability_types' => collect(AvailabilityType::cases())->map(fn($t) => [
                'value' => $t->value,
                'label' => $t->label(),
                'color' => $t->color(),
            ]),
            'filters' => [
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
                'technician_id' => $request->technician_id,
                'availability_type' => $request->availability_type,
            ],
            'user' => [
                'id' => $request->user()->id,
                'role' => $request->user()->role->value,
            ],
        ]);
    }

    /**
     * Store a newly created availability record.
     */
    public function store(Request $request)
    {
        $this->authorize('create', TechnicianAvailability::class);

        $validated = $request->validate([
            'technician_id' => 'required|exists:users,id',
            'date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'availability_type' => 'required|in:' . implode(',', AvailabilityType::values()),
            'notes' => 'nullable|string',
        ]);

        // Verify technician belongs to same company
        $technician = User::findOrFail($validated['technician_id']);
        if ($technician->company_id !== $request->user()->company_id) {
            abort(403, 'Technician not found');
        }

        // Technicians can only create for themselves
        if ($request->user()->role === Role::TECHNICIAN && $validated['technician_id'] != $request->user()->id) {
            abort(403, 'You can only set your own availability');
        }

        TechnicianAvailability::create([
            'company_id' => $request->user()->company_id,
            'technician_id' => $validated['technician_id'],
            'date' => $validated['date'],
            'start_time' => $validated['start_time'],
            'end_time' => $validated['end_time'],
            'availability_type' => $validated['availability_type'],
            'notes' => $validated['notes'],
        ]);

        return back()->with('success', 'Availability record created successfully');
    }

    /**
     * Update the specified availability record.
     */
    public function update(Request $request, TechnicianAvailability $availability)
    {
        $this->authorize('update', $availability);

        $validated = $request->validate([
            'date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'availability_type' => 'required|in:' . implode(',', AvailabilityType::values()),
            'notes' => 'nullable|string',
        ]);

        $availability->update($validated);

        return back()->with('success', 'Availability record updated successfully');
    }

    /**
     * Remove the specified availability record.
     */
    public function destroy(Request $request, TechnicianAvailability $availability)
    {
        $this->authorize('delete', $availability);

        $availability->delete();

        return back()->with('success', 'Availability record deleted successfully');
    }
}
