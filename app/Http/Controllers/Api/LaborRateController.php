<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LaborRate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class LaborRateController extends Controller
{
    /**
     * Display a listing of labor rates for the authenticated user's company.
     */
    public function index(Request $request)
    {
        $companyId = $request->user()->company_id;

        $laborRates = LaborRate::where('company_id', $companyId)
            ->with(['user'])
            ->orderBy('effective_from', 'desc')
            ->get();

        return response()->json($laborRates);
    }

    /**
     * Store a newly created labor rate.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'nullable|exists:users,id',
            'role' => 'nullable|string|in:operator,technician,manager',
            'hourly_rate' => 'required|numeric|min:0',
            'overtime_rate' => 'nullable|numeric|min:0',
            'effective_from' => 'required|date',
            'effective_to' => 'nullable|date|after:effective_from',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Ensure either user_id or role is provided, but not both
        if (!$request->user_id && !$request->role) {
            return response()->json(['error' => 'Either user_id or role must be provided'], 422);
        }

        if ($request->user_id && $request->role) {
            return response()->json(['error' => 'Cannot specify both user_id and role'], 422);
        }

        $laborRate = LaborRate::create([
            'company_id' => $request->user()->company_id,
            'user_id' => $request->user_id,
            'role' => $request->role,
            'hourly_rate' => $request->hourly_rate,
            'overtime_rate' => $request->overtime_rate,
            'effective_from' => $request->effective_from,
            'effective_to' => $request->effective_to,
        ]);

        return response()->json($laborRate->load('user'), 201);
    }

    /**
     * Display the specified labor rate.
     */
    public function show(Request $request, $id)
    {
        $laborRate = LaborRate::where('company_id', $request->user()->company_id)
            ->with(['user'])
            ->findOrFail($id);

        return response()->json($laborRate);
    }

    /**
     * Update the specified labor rate.
     */
    public function update(Request $request, $id)
    {
        $laborRate = LaborRate::where('company_id', $request->user()->company_id)
            ->findOrFail($id);

        $validator = Validator::make($request->all(), [
            'user_id' => 'nullable|exists:users,id',
            'role' => 'nullable|string|in:operator,technician,manager',
            'hourly_rate' => 'sometimes|required|numeric|min:0',
            'overtime_rate' => 'nullable|numeric|min:0',
            'effective_from' => 'sometimes|required|date',
            'effective_to' => 'nullable|date|after:effective_from',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $laborRate->update($request->only([
            'user_id',
            'role',
            'hourly_rate',
            'overtime_rate',
            'effective_from',
            'effective_to',
        ]));

        return response()->json($laborRate->load('user'));
    }

    /**
     * Remove the specified labor rate.
     */
    public function destroy(Request $request, $id)
    {
        $laborRate = LaborRate::where('company_id', $request->user()->company_id)
            ->findOrFail($id);

        $laborRate->delete();

        return response()->json(['message' => 'Labor rate deleted successfully']);
    }

    /**
     * Get current labor rate for a user or role.
     */
    public function getCurrent(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'nullable|exists:users,id',
            'role' => 'nullable|string|in:operator,technician,manager',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $rate = LaborRate::getCurrentRate(
            $request->user()->company_id,
            $request->user_id,
            $request->role
        );

        if (!$rate) {
            return response()->json(['error' => 'No current labor rate found'], 404);
        }

        return response()->json($rate->load('user'));
    }
}
