<?php

namespace App\Http\Controllers;

use App\Models\Location;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LocationController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Location::class);

        $locations = Location::where('company_id', $request->user()->company_id)
            ->withCount('machines')
            ->orderBy('name')
            ->get();

        return Inertia::render('locations/index', [
            'locations' => $locations,
        ]);
    }

    public function store(Request $request)
    {
        $this->authorize('create', Location::class);

        $user = $request->user();

        if (!$user->company_id) {
            return back()->withErrors([
                'company' => 'You must be assigned to a company to create locations.'
            ]);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $validated['company_id'] = $user->company_id;

        Location::create($validated);

        return redirect()->route('locations.index')
            ->with('success', 'Location created successfully');
    }

    public function update(Request $request, Location $location)
    {
        $this->authorize('update', $location);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $location->update($validated);

        return redirect()->route('locations.index')
            ->with('success', 'Location updated successfully');
    }

    public function destroy(Location $location)
    {
        $this->authorize('delete', $location);

        $location->delete();

        return redirect()->route('locations.index')
            ->with('success', 'Location deleted successfully');
    }
}
