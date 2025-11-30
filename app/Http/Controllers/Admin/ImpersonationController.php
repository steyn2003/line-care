<?php

namespace App\Http\Controllers\Admin;

use App\Enums\Role;
use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\User;
use App\Services\ImpersonationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ImpersonationController extends Controller
{
    public function __construct(
        protected ImpersonationService $impersonationService
    ) {}

    /**
     * Start impersonating a user from a company.
     * Typically impersonates the first manager of the company.
     */
    public function startFromCompany(Request $request, Company $company): RedirectResponse
    {
        $impersonator = $request->user();

        // Find a user to impersonate (prefer manager, then technician, then operator)
        $targetUser = $company->users()
            ->where('role', Role::MANAGER->value)
            ->first();

        if (!$targetUser) {
            $targetUser = $company->users()
                ->whereIn('role', [Role::TECHNICIAN->value, Role::OPERATOR->value])
                ->first();
        }

        if (!$targetUser) {
            return back()->withErrors([
                'impersonation' => __('admin.impersonation.no_users_found'),
            ]);
        }

        try {
            $this->impersonationService->start($impersonator, $targetUser);

            return redirect()->route('dashboard')
                ->with('success', __('admin.impersonation.started', [
                    'user' => $targetUser->name,
                    'company' => $company->name,
                ]));
        } catch (\InvalidArgumentException $e) {
            return back()->withErrors([
                'impersonation' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Start impersonating a specific user.
     */
    public function startFromUser(Request $request, User $user): RedirectResponse
    {
        $impersonator = $request->user();

        try {
            $this->impersonationService->start($impersonator, $user);

            return redirect()->route('dashboard')
                ->with('success', __('admin.impersonation.started', [
                    'user' => $user->name,
                    'company' => $user->company?->name ?? 'N/A',
                ]));
        } catch (\InvalidArgumentException $e) {
            return back()->withErrors([
                'impersonation' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Stop impersonating and return to superadmin account.
     */
    public function stop(): RedirectResponse
    {
        try {
            $this->impersonationService->stop();

            return redirect()->route('admin.dashboard')
                ->with('success', __('admin.impersonation.stopped'));
        } catch (\RuntimeException $e) {
            return redirect()->route('dashboard')
                ->withErrors([
                    'impersonation' => $e->getMessage(),
                ]);
        }
    }
}
