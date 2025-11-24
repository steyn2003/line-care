<?php

namespace App\Http\Controllers;

use App\Models\LaborRate;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LaborRateController extends Controller
{
    /**
     * Display the labor rate management page.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $companyId = $user->company_id;

        // Get all labor rates with user relationships
        $laborRates = LaborRate::where('company_id', $companyId)
            ->with(['user:id,name,email,role'])
            ->orderBy('effective_from', 'desc')
            ->get();

        // Get all users in the company for the dropdown
        $users = User::where('company_id', $companyId)
            ->select('id', 'name', 'email', 'role')
            ->orderBy('name')
            ->get();

        return Inertia::render('costs/labor-rates', [
            'laborRates' => $laborRates,
            'users' => $users,
        ]);
    }

    /**
     * Store a new labor rate.
     */
    public function store(Request $request)
    {
        $user = $request->user();
        $companyId = $user->company_id;

        $validated = $request->validate([
            'user_id' => 'nullable|exists:users,id',
            'role' => 'nullable|string|in:operator,technician,manager',
            'hourly_rate' => 'required|numeric|min:0',
            'overtime_rate' => 'nullable|numeric|min:0',
            'effective_from' => 'required|date',
            'effective_to' => 'nullable|date|after:effective_from',
        ]);

        // Ensure either user_id or role is provided, but not both
        if (!$validated['user_id'] && !$validated['role']) {
            return back()->withErrors([
                'user_id' => 'Either user or role must be selected.',
            ]);
        }

        if ($validated['user_id'] && $validated['role']) {
            return back()->withErrors([
                'user_id' => 'Cannot specify both user and role.',
            ]);
        }

        // If user_id is provided, verify user belongs to company
        if ($validated['user_id']) {
            $targetUser = User::find($validated['user_id']);
            if ($targetUser->company_id !== $companyId) {
                return back()->withErrors([
                    'user_id' => 'User not found.',
                ]);
            }
        }

        LaborRate::create([
            'company_id' => $companyId,
            'user_id' => $validated['user_id'],
            'role' => $validated['role'],
            'hourly_rate' => $validated['hourly_rate'],
            'overtime_rate' => $validated['overtime_rate'],
            'effective_from' => $validated['effective_from'],
            'effective_to' => $validated['effective_to'],
        ]);

        return back()->with('success', 'Labor rate created successfully.');
    }

    /**
     * Update an existing labor rate.
     */
    public function update(Request $request, LaborRate $laborRate)
    {
        $user = $request->user();

        // Ensure labor rate belongs to user's company
        if ($laborRate->company_id !== $user->company_id) {
            abort(403);
        }

        $validated = $request->validate([
            'hourly_rate' => 'required|numeric|min:0',
            'overtime_rate' => 'nullable|numeric|min:0',
            'effective_from' => 'required|date',
            'effective_to' => 'nullable|date|after:effective_from',
        ]);

        $laborRate->update([
            'hourly_rate' => $validated['hourly_rate'],
            'overtime_rate' => $validated['overtime_rate'],
            'effective_from' => $validated['effective_from'],
            'effective_to' => $validated['effective_to'],
        ]);

        return back()->with('success', 'Labor rate updated successfully.');
    }

    /**
     * Delete a labor rate.
     */
    public function destroy(Request $request, LaborRate $laborRate)
    {
        $user = $request->user();

        // Ensure labor rate belongs to user's company
        if ($laborRate->company_id !== $user->company_id) {
            abort(403);
        }

        $laborRate->delete();

        return back()->with('success', 'Labor rate deleted successfully.');
    }
}
