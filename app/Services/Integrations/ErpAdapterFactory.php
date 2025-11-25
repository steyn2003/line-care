<?php

namespace App\Services\Integrations;

use App\Models\Integration;
use App\Services\Integrations\Adapters\DynamicsAdapter;
use App\Services\Integrations\Adapters\NetSuiteAdapter;
use App\Services\Integrations\Adapters\OdooAdapter;
use App\Services\Integrations\Adapters\SapAdapter;

/**
 * Factory for creating ERP integration adapters.
 *
 * Creates the appropriate adapter based on the integration provider.
 */
class ErpAdapterFactory
{
    /**
     * Supported ERP providers and their adapter classes.
     */
    protected static array $adapters = [
        'SAP' => SapAdapter::class,
        'SAP S/4HANA' => SapAdapter::class,
        'Oracle NetSuite' => NetSuiteAdapter::class,
        'NetSuite' => NetSuiteAdapter::class,
        'Microsoft Dynamics' => DynamicsAdapter::class,
        'Dynamics 365' => DynamicsAdapter::class,
        'Odoo' => OdooAdapter::class,
    ];

    /**
     * Create an ERP adapter for the given integration.
     */
    public static function make(Integration $integration): ErpIntegration
    {
        $provider = $integration->provider;

        // Check if we have a specific adapter for this provider
        if (isset(self::$adapters[$provider])) {
            $adapterClass = self::$adapters[$provider];
            return new $adapterClass($integration);
        }

        // Fall back to generic ERP integration
        return new ErpIntegration($integration);
    }

    /**
     * Get list of supported providers.
     */
    public static function getSupportedProviders(): array
    {
        return array_unique(array_keys(self::$adapters));
    }

    /**
     * Check if a provider has a specialized adapter.
     */
    public static function hasSpecializedAdapter(string $provider): bool
    {
        return isset(self::$adapters[$provider]);
    }

    /**
     * Register a custom adapter for a provider.
     */
    public static function registerAdapter(string $provider, string $adapterClass): void
    {
        self::$adapters[$provider] = $adapterClass;
    }
}
