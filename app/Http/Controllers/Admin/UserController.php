<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Company;
use App\Enums\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        $query = User::with('company:id,name')
            ->select('id', 'name', 'email', 'role', 'company_id', 'created_at');

        // Search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Company filter
        if ($request->filled('company_id')) {
            $query->where('company_id', $request->company_id);
        }

        // Role filter
        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }

        $users = $query->latest()->paginate(15)->withQueryString();

        $companies = Company::select('id', 'name')->orderBy('name')->get();

        return Inertia::render('admin/users/index', [
            'users' => $users,
            'companies' => $companies,
            'roles' => array_map(fn($role) => [
                'value' => $role->value,
                'label' => $role->label(),
            ], Role::cases()),
            'filters' => [
                'search' => $request->search,
                'company_id' => $request->company_id,
                'role' => $request->role,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'company_id' => 'required|exists:companies,id',
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => ['required', Rule::in(Role::companyRoles())],
        ]);

        $validated['password'] = Hash::make($validated['password']);
        $validated['email_verified_at'] = now(); // Auto-verify admin-created users

        User::create($validated);

        return back()->with('success', 'User created successfully');
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'company_id' => 'required|exists:companies,id',
            'name' => 'required|string|max:255',
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'role' => ['required', Rule::in(Role::companyRoles())],
            'password' => 'nullable|string|min:8',
        ]);

        // Update password only if provided
        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        return back()->with('success', 'User updated successfully');
    }

    public function destroy(User $user)
    {
        // Prevent deleting super admins
        if ($user->role->isSuperAdmin()) {
            return back()->withErrors(['user' => 'Cannot delete super admin users']);
        }

        // Check if user has work orders assigned
        if ($user->workOrders()->exists()) {
            return back()->withErrors(['user' => 'Cannot delete user with assigned work orders. Reassign or complete them first.']);
        }

        $user->delete();

        return back()->with('success', 'User deleted successfully');
    }
}
