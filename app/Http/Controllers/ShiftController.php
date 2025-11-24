<?php

namespace App\Http\Controllers;

use App\Models\Shift;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShiftController extends Controller
{
    public function index(Request $request): Response
    {
        $shifts = Shift::query()
            ->forCompany($request->user()->company_id)
            ->orderBy('start_time')
            ->get();

        return Inertia::render('shifts/index', [
            'shifts' => $shifts,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i',
            'is_active' => 'boolean',
        ]);

        $validated['company_id'] = $request->user()->company_id;
        $validated['is_active'] = $validated['is_active'] ?? true;

        Shift::create($validated);

        return redirect()->route('shifts.index');
    }

    public function update(Request $request, Shift $shift)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i',
            'is_active' => 'boolean',
        ]);

        $shift->update($validated);

        return redirect()->route('shifts.index');
    }

    public function destroy(Shift $shift)
    {
        $shift->delete();

        return redirect()->route('shifts.index');
    }
}
