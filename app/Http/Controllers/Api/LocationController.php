<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Location;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class LocationController extends Controller
{
    /**
     * Display a listing of locations.
     */
    public function index(Request $request): JsonResponse
    {
        Gate::authorize('viewAny', Location::class);

        $locations = Location::query()
            ->where('company_id', $request->user()->company_id)
            ->orderBy('name')
            ->get();

        return response()->json([
            'locations' => $locations,
        ]);
    }

    /**
     * Store a newly created location.
     */
    public function store(Request $request): JsonResponse
    {
        Gate::authorize('create', Location::class);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        $location = Location::create([
            ...$validated,
            'company_id' => $request->user()->company_id,
        ]);

        return response()->json([
            'location' => $location,
        ], 201);
    }

    /**
     * Display the specified location.
     */
    public function show(Request $request, Location $location): JsonResponse
    {
        Gate::authorize('view', $location);

        $location->load('machines:id,name,code,location_id');

        return response()->json([
            'location' => $location,
        ]);
    }

    /**
     * Update the specified location.
     */
    public function update(Request $request, Location $location): JsonResponse
    {
        Gate::authorize('update', $location);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        $location->update($validated);

        return response()->json([
            'location' => $location,
        ]);
    }

    /**
     * Remove the specified location.
     */
    public function destroy(Request $request, Location $location): JsonResponse
    {
        Gate::authorize('delete', $location);

        $location->delete();

        return response()->json([
            'message' => 'Location deleted successfully',
        ]);
    }
}
