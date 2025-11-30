<?php

namespace App\Services;

use App\Models\Company;
use App\Models\User;
use Illuminate\Support\Facades\Cache;

class FeatureService
{
    /**
     * Cache TTL in seconds (5 minutes)
     */
    protected const CACHE_TTL = 300;

    /**
     * Check if a feature is enabled for a company.
     *
     * @param Company $company
     * @param string $feature
     * @return bool
     */
    public function enabledForCompany(Company $company, string $feature): bool
    {
        $features = $this->getAllFeaturesForCompany($company);

        return $features[$feature] ?? false;
    }

    /**
     * Check if a feature is enabled for a user.
     * Superadmins have access to all features if configured.
     *
     * @param User $user
     * @param string $feature
     * @return bool
     */
    public function enabledForUser(User $user, string $feature): bool
    {
        // Superadmin override: grant all features if configured
        if ($this->superadminHasAllFeatures() && $user->role->isSuperAdmin()) {
            return true;
        }

        // User must have a company to have features
        if (!$user->company) {
            return false;
        }

        return $this->enabledForCompany($user->company, $feature);
    }

    /**
     * Get all features for a company with their enabled status.
     *
     * @param Company $company
     * @return array<string, bool>
     */
    public function getAllFeaturesForCompany(Company $company): array
    {
        $cacheKey = "company_features_{$company->id}";

        return Cache::remember($cacheKey, self::CACHE_TTL, function () use ($company) {
            return $this->resolveFeatures($company);
        });
    }

    /**
     * Get all features for a user.
     * Superadmins get all features enabled if configured.
     *
     * @param User $user
     * @return array<string, bool>
     */
    public function getAllFeaturesForUser(User $user): array
    {
        // Superadmin override
        if ($this->superadminHasAllFeatures() && $user->role->isSuperAdmin()) {
            return $this->getAllFeaturesEnabled();
        }

        // User must have a company
        if (!$user->company) {
            return $this->getAllFeaturesDisabled();
        }

        return $this->getAllFeaturesForCompany($user->company);
    }

    /**
     * Get the plan defaults for a specific plan.
     *
     * @param string $plan
     * @return array<string, bool>
     */
    public function getPlanDefaults(string $plan): array
    {
        $plans = config('features.plans', []);

        return $plans[$plan] ?? $this->getAllFeaturesDisabled();
    }

    /**
     * Get all available plans.
     *
     * @return array<string>
     */
    public function getAvailablePlans(): array
    {
        return config('features.available_plans', ['basic', 'pro', 'enterprise']);
    }

    /**
     * Get feature definitions (name, description).
     *
     * @return array<string, array>
     */
    public function getFeatureDefinitions(): array
    {
        return config('features.definitions', []);
    }

    /**
     * Get all feature keys.
     *
     * @return array<string>
     */
    public function getFeatureKeys(): array
    {
        return array_keys($this->getFeatureDefinitions());
    }

    /**
     * Check if a feature key is valid.
     *
     * @param string $feature
     * @return bool
     */
    public function isValidFeature(string $feature): bool
    {
        return array_key_exists($feature, $this->getFeatureDefinitions());
    }

    /**
     * Clear the feature cache for a company.
     *
     * @param Company $company
     * @return void
     */
    public function clearCacheForCompany(Company $company): void
    {
        Cache::forget("company_features_{$company->id}");
    }

    /**
     * Update a company's plan and clear the cache.
     *
     * @param Company $company
     * @param string $plan
     * @return void
     */
    public function updateCompanyPlan(Company $company, string $plan): void
    {
        if (!in_array($plan, $this->getAvailablePlans())) {
            throw new \InvalidArgumentException("Invalid plan: {$plan}");
        }

        $company->update(['plan' => $plan]);
        $this->clearCacheForCompany($company);
    }

    /**
     * Update a company's feature flags and clear the cache.
     *
     * @param Company $company
     * @param array<string, bool> $featureFlags
     * @return void
     */
    public function updateCompanyFeatureFlags(Company $company, array $featureFlags): void
    {
        // Validate feature keys
        $validKeys = $this->getFeatureKeys();
        $filteredFlags = array_intersect_key($featureFlags, array_flip($validKeys));

        // Ensure all values are boolean
        $filteredFlags = array_map(fn($value) => (bool) $value, $filteredFlags);

        $company->update(['feature_flags' => $filteredFlags]);
        $this->clearCacheForCompany($company);
    }

    /**
     * Toggle a single feature for a company.
     *
     * @param Company $company
     * @param string $feature
     * @param bool $enabled
     * @return void
     */
    public function toggleFeature(Company $company, string $feature, bool $enabled): void
    {
        if (!$this->isValidFeature($feature)) {
            throw new \InvalidArgumentException("Invalid feature: {$feature}");
        }

        $currentFlags = $company->feature_flags ?? [];
        $currentFlags[$feature] = $enabled;

        $company->update(['feature_flags' => $currentFlags]);
        $this->clearCacheForCompany($company);
    }

    /**
     * Resolve the actual feature flags for a company.
     * Merges plan defaults with company-specific overrides.
     *
     * @param Company $company
     * @return array<string, bool>
     */
    protected function resolveFeatures(Company $company): array
    {
        // 1. Get defaults from config based on company's plan
        $plan = $company->plan ?? config('features.default_plan', 'basic');
        $defaults = $this->getPlanDefaults($plan);

        // 2. Get company-specific overrides
        $overrides = $company->feature_flags ?? [];

        // 3. Merge: overrides take precedence
        return array_merge($defaults, $overrides);
    }

    /**
     * Get all features with enabled = true.
     *
     * @return array<string, bool>
     */
    protected function getAllFeaturesEnabled(): array
    {
        $features = [];
        foreach ($this->getFeatureKeys() as $key) {
            $features[$key] = true;
        }
        return $features;
    }

    /**
     * Get all features with enabled = false.
     *
     * @return array<string, bool>
     */
    protected function getAllFeaturesDisabled(): array
    {
        $features = [];
        foreach ($this->getFeatureKeys() as $key) {
            $features[$key] = false;
        }
        return $features;
    }

    /**
     * Check if superadmins should have all features.
     *
     * @return bool
     */
    protected function superadminHasAllFeatures(): bool
    {
        return config('features.superadmin_has_all_features', true);
    }

    /**
     * Get a summary of features for display purposes.
     * Includes feature metadata alongside enabled status.
     *
     * @param Company $company
     * @return array<string, array>
     */
    public function getFeatureSummaryForCompany(Company $company): array
    {
        $features = $this->getAllFeaturesForCompany($company);
        $definitions = $this->getFeatureDefinitions();
        $summary = [];

        foreach ($features as $key => $enabled) {
            $summary[$key] = [
                'key' => $key,
                'enabled' => $enabled,
                'name' => $definitions[$key]['name'] ?? ucfirst($key),
                'description' => $definitions[$key]['description'] ?? '',
            ];
        }

        return $summary;
    }

    /**
     * Get the plan comparison matrix for pricing page.
     *
     * @return array<string, array<string, bool>>
     */
    public function getPlanComparisonMatrix(): array
    {
        $plans = $this->getAvailablePlans();
        $matrix = [];

        foreach ($plans as $plan) {
            $matrix[$plan] = $this->getPlanDefaults($plan);
        }

        return $matrix;
    }
}
