<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Available Plans
    |--------------------------------------------------------------------------
    |
    | This array defines the available subscription plans. Each plan has a
    | unique key and can be assigned to companies via the 'plan' column.
    |
    */

    'available_plans' => ['basic', 'pro', 'enterprise'],

    /*
    |--------------------------------------------------------------------------
    | Default Plan
    |--------------------------------------------------------------------------
    |
    | The default plan assigned to new companies when they are created.
    |
    */

    'default_plan' => env('DEFAULT_PLAN', 'basic'),

    /*
    |--------------------------------------------------------------------------
    | Feature Definitions
    |--------------------------------------------------------------------------
    |
    | This array defines all available features in the system. Each feature
    | has a key, display name, and description for documentation purposes.
    |
    */

    'definitions' => [
        'inventory' => [
            'name' => 'Inventory Management',
            'description' => 'Spare parts catalog, stock tracking, and purchase orders',
        ],
        'oee' => [
            'name' => 'OEE Tracking',
            'description' => 'Production runs, downtime tracking, and OEE calculations',
        ],
        'costs' => [
            'name' => 'Cost Management',
            'description' => 'Labor costs, parts costs, downtime costs, and budgeting',
        ],
        'planning' => [
            'name' => 'Planning Module',
            'description' => 'Work order scheduling, technician availability, and planning board',
        ],
        'analytics' => [
            'name' => 'Advanced Analytics',
            'description' => 'Custom dashboards, MTBF/MTTR metrics, and predictive maintenance',
        ],
        'api' => [
            'name' => 'API Access',
            'description' => 'Public API endpoints for external integrations',
        ],
        'webhooks' => [
            'name' => 'Webhooks',
            'description' => 'Real-time event notifications to external systems',
        ],
        'vendor_portal' => [
            'name' => 'Vendor Portal',
            'description' => 'Supplier access for purchase order management',
        ],
        'iot' => [
            'name' => 'IoT & Sensors',
            'description' => 'Sensor monitoring, alerts, and automated work order creation',
        ],
        'integrations' => [
            'name' => 'Integrations',
            'description' => 'ERP and third-party system integrations',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Plan Feature Defaults
    |--------------------------------------------------------------------------
    |
    | This array defines which features are enabled by default for each plan.
    | These defaults can be overridden per-company using the feature_flags
    | JSON column in the companies table.
    |
    */

    'plans' => [
        'basic' => [
            'inventory' => false,
            'oee' => false,
            'costs' => false,
            'planning' => true,
            'analytics' => false,
            'api' => false,
            'webhooks' => false,
            'vendor_portal' => false,
            'iot' => false,
            'integrations' => false,
        ],
        'pro' => [
            'inventory' => true,
            'oee' => true,
            'costs' => true,
            'planning' => true,
            'analytics' => true,
            'api' => false,
            'webhooks' => false,
            'vendor_portal' => false,
            'iot' => true,
            'integrations' => false,
        ],
        'enterprise' => [
            'inventory' => true,
            'oee' => true,
            'costs' => true,
            'planning' => true,
            'analytics' => true,
            'api' => true,
            'webhooks' => true,
            'vendor_portal' => true,
            'iot' => true,
            'integrations' => true,
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Superadmin Feature Override
    |--------------------------------------------------------------------------
    |
    | When true, superadmin users have access to all features regardless
    | of their company's plan or feature flags.
    |
    */

    'superadmin_has_all_features' => env('SUPERADMIN_HAS_ALL_FEATURES', true),

];
