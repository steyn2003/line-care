<?php

namespace App\Http\Controllers\Api;

use App\Enums\Role;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class UserController extends Controller
{
    /**
     * Display a listing of users.
     */
    public function index(Request $request): JsonResponse
    {
        // Only managers can view users list
        if ($request->user()->role !== Role::MANAGER) {
            return response()->json([
                'message' => 'Only managers can view users.',
            ], 403);
        }

        $query = User::query()
            ->where('company_id', $request->user()->company_id)
            ->select('id', 'name', 'email', 'role', 'created_at');

        // Filter by role
        if ($request->has('role')) {
            $query->where('role', $request->role);
        }

        $users = $query->orderBy('name')->get();

        return response()->json([
            'users' => $users,
        ]);
    }

    /**
     * Store a newly created user.
     */
    public function store(Request $request): JsonResponse
    {
        // Only managers can create users
        if ($request->user()->role !== Role::MANAGER) {
            return response()->json([
                'message' => 'Only managers can create users.',
            ], 403);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'confirmed', Password::defaults()],
            'role' => ['required', Rule::in(Role::values())],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'company_id' => $request->user()->company_id,
            'role' => Role::from($validated['role']),
        ]);

        return response()->json([
            'user' => $user,
            'message' => 'User created successfully',
        ], 201);
    }

    /**
     * Display the specified user.
     */
    public function show(Request $request, User $user): JsonResponse
    {
        // Users can view their own profile, managers can view all users in company
        if ($request->user()->id !== $user->id && $request->user()->role !== Role::MANAGER) {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        // Verify same company
        if ($user->company_id !== $request->user()->company_id) {
            return response()->json([
                'message' => 'User not found.',
            ], 404);
        }

        return response()->json([
            'user' => $user->only('id', 'name', 'email', 'role', 'created_at'),
        ]);
    }

    /**
     * Update the specified user.
     */
    public function update(Request $request, User $user): JsonResponse
    {
        // Users can update their own profile, managers can update all users
        if ($request->user()->id !== $user->id && $request->user()->role !== Role::MANAGER) {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        // Verify same company
        if ($user->company_id !== $request->user()->company_id) {
            return response()->json([
                'message' => 'User not found.',
            ], 404);
        }

        $rules = [
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'password' => ['sometimes', 'confirmed', Password::defaults()],
        ];

        // Only managers can change roles
        if ($request->user()->role === Role::MANAGER && $request->has('role')) {
            $rules['role'] = [Rule::in(Role::values())];
        }

        $validated = $request->validate($rules);

        // Hash password if provided
        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        // Convert role to enum if provided
        if (isset($validated['role'])) {
            $validated['role'] = Role::from($validated['role']);
        }

        $user->update($validated);

        return response()->json([
            'user' => $user->only('id', 'name', 'email', 'role', 'created_at'),
            'message' => 'User updated successfully',
        ]);
    }

    /**
     * Remove the specified user.
     */
    public function destroy(Request $request, User $user): JsonResponse
    {
        // Only managers can delete users
        if ($request->user()->role !== Role::MANAGER) {
            return response()->json([
                'message' => 'Only managers can delete users.',
            ], 403);
        }

        // Verify same company
        if ($user->company_id !== $request->user()->company_id) {
            return response()->json([
                'message' => 'User not found.',
            ], 404);
        }

        // Don't allow deleting yourself
        if ($request->user()->id === $user->id) {
            return response()->json([
                'message' => 'You cannot delete your own account.',
            ], 400);
        }

        $user->delete();

        return response()->json([
            'message' => 'User deleted successfully',
        ]);
    }
}
