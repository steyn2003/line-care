<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Services\FeatureService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CompanyController extends Controller
{
    public function __construct(
        protected FeatureService $featureService
    ) {}

    public function index(Request $request): Response
    {
        $companies = Company::withCount(['users', 'machines', 'workOrders'])
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->when($request->plan, function ($query, $plan) {
                $query->where('plan', $plan);
            })
            ->latest()
            ->paginate(20);

        return Inertia::render('admin/companies/index', [
            'companies' => $companies,
            'filters' => [
                'search' => $request->search,
                'plan' => $request->plan,
            ],
            'availablePlans' => $this->featureService->getAvailablePlans(),
        ]);
    }

    public function show(Company $company): Response
    {
        $company->loadCount(['users', 'machines', 'workOrders', 'locations']);
        $company->load(['users' => function ($query) {
            $query->select('id', 'name', 'email', 'role', 'company_id')
                ->orderBy('name')
                ->limit(10);
        }]);

        return Inertia::render('admin/companies/show', [
            'company' => array_merge($company->toArray(), [
                'is_trial' => $company->is_trial,
                'trial_ends_at' => $company->trial_ends_at?->toISOString(),
                'is_demo' => $company->is_demo,
                'industry' => $company->industry,
                'company_size' => $company->company_size,
            ]),
            'featureSummary' => $this->featureService->getFeatureSummaryForCompany($company),
            'availablePlans' => $this->featureService->getAvailablePlans(),
            'featureDefinitions' => $this->featureService->getFeatureDefinitions(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'address' => 'nullable|string',
            'plan' => 'nullable|string|in:' . implode(',', $this->featureService->getAvailablePlans()),
        ]);

        Company::create($validated);

        return redirect()->route('admin.companies.index')
            ->with('success', __('admin.companies.created'));
    }

    public function update(Request $request, Company $company): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'address' => 'nullable|string',
        ]);

        $company->update($validated);

        return back()->with('success', __('admin.companies.updated'));
    }

    public function updatePlan(Request $request, Company $company): RedirectResponse
    {
        $validated = $request->validate([
            'plan' => 'required|string|in:' . implode(',', $this->featureService->getAvailablePlans()),
        ]);

        $this->featureService->updateCompanyPlan($company, $validated['plan']);

        return back()->with('success', __('admin.companies.plan_updated'));
    }

    public function updateFeatures(Request $request, Company $company): RedirectResponse
    {
        $featureKeys = $this->featureService->getFeatureKeys();

        $validated = $request->validate([
            'features' => 'required|array',
            'features.*' => 'boolean',
        ]);

        // Filter to only valid feature keys
        $featureFlags = [];
        foreach ($validated['features'] as $key => $value) {
            if (in_array($key, $featureKeys)) {
                $featureFlags[$key] = (bool) $value;
            }
        }

        $this->featureService->updateCompanyFeatureFlags($company, $featureFlags);

        return back()->with('success', __('admin.companies.features_updated'));
    }

    public function toggleFeature(Request $request, Company $company, string $feature): RedirectResponse
    {
        $validated = $request->validate([
            'enabled' => 'required|boolean',
        ]);

        try {
            $this->featureService->toggleFeature($company, $feature, $validated['enabled']);
            return back()->with('success', __('admin.companies.feature_toggled'));
        } catch (\InvalidArgumentException $e) {
            return back()->withErrors(['feature' => $e->getMessage()]);
        }
    }

    public function destroy(Company $company): RedirectResponse
    {
        // Check if company has users
        if ($company->users()->count() > 0) {
            return back()->withErrors([
                'company' => __('admin.companies.cannot_delete_with_users'),
            ]);
        }

        $company->delete();

        return redirect()->route('admin.companies.index')
            ->with('success', __('admin.companies.deleted'));
    }

    /**
     * Extend the trial period for a company.
     */
    public function extendTrial(Request $request, Company $company): RedirectResponse
    {
        if (! $company->is_trial) {
            return back()->withErrors([
                'trial' => __('admin.companies.not_a_trial'),
            ]);
        }

        $validated = $request->validate([
            'days' => 'required|integer|min:1|max:90',
        ]);

        $company->extendTrial($validated['days']);

        return back()->with('success', __('admin.companies.trial_extended', [
            'days' => $validated['days'],
        ]));
    }

    /**
     * Convert a trial company to a paid plan.
     */
    public function convertToPaid(Request $request, Company $company): RedirectResponse
    {
        if (! $company->is_trial) {
            return back()->withErrors([
                'trial' => __('admin.companies.not_a_trial'),
            ]);
        }

        $validated = $request->validate([
            'plan' => 'required|string|in:' . implode(',', $this->featureService->getAvailablePlans()),
        ]);

        $company->convertToPaid($validated['plan']);

        return back()->with('success', __('admin.companies.converted_to_paid', [
            'plan' => $validated['plan'],
        ]));
    }
}
