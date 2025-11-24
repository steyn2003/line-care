<?php

namespace Database\Seeders;

use App\Models\Integration;
use App\Models\Company;
use Illuminate\Database\Seeder;

class IntegrationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get demo company (assuming ID 1 from previous seeders)
        $company = Company::first();

        if (!$company) {
            $this->command->warn('No company found. Please run CompanySeeder first.');
            return;
        }

        $this->command->info('Seeding sample integrations...');

        // 1. SAP ERP Integration (disabled by default for demo)
        Integration::create([
            'company_id' => $company->id,
            'name' => 'SAP ERP Integration',
            'integration_type' => 'erp',
            'provider' => 'SAP',
            'config' => [
                'api_endpoint' => 'https://sap-demo.example.com/api/v1',
                'username' => 'linecare_user',
                'password' => 'encrypted_password_placeholder',
                'client_id' => 'LINECARE_CLIENT',
                'sync_inventory' => true,
                'sync_purchase_orders' => true,
                'sync_work_order_costs' => true,
                'inventory_mapping' => [
                    'material_number' => 'part_number',
                    'quantity' => 'quantity_on_hand',
                    'warehouse' => 'location_id',
                ],
            ],
            'is_enabled' => false, // Disabled for demo
            'sync_frequency' => 'hourly',
            'last_sync_at' => null,
            'last_sync_status' => null,
        ]);

        // 2. Oracle NetSuite Integration (disabled by default for demo)
        Integration::create([
            'company_id' => $company->id,
            'name' => 'Oracle NetSuite Integration',
            'integration_type' => 'erp',
            'provider' => 'Oracle NetSuite',
            'config' => [
                'account_id' => 'TSTDRV123456',
                'consumer_key' => 'demo_consumer_key',
                'consumer_secret' => 'demo_consumer_secret',
                'token_id' => 'demo_token_id',
                'token_secret' => 'demo_token_secret',
                'api_endpoint' => 'https://tstdrv123456.suitetalk.api.netsuite.com',
                'sync_inventory' => true,
                'sync_purchase_orders' => true,
                'sync_work_order_costs' => false,
            ],
            'is_enabled' => false,
            'sync_frequency' => 'daily',
            'last_sync_at' => null,
            'last_sync_status' => null,
        ]);

        // 3. Email Notification Integration (enabled for demo)
        Integration::create([
            'company_id' => $company->id,
            'name' => 'Email Notifications',
            'integration_type' => 'email',
            'provider' => 'SMTP',
            'config' => [
                'driver' => 'smtp',
                'host' => env('MAIL_HOST', 'smtp.mailtrap.io'),
                'port' => env('MAIL_PORT', 2525),
                'username' => env('MAIL_USERNAME', ''),
                'password' => env('MAIL_PASSWORD', ''),
                'encryption' => env('MAIL_ENCRYPTION', 'tls'),
                'from_address' => env('MAIL_FROM_ADDRESS', 'noreply@linecare.example.com'),
                'from_name' => env('MAIL_FROM_NAME', 'LineCare CMMS'),
            ],
            'is_enabled' => true, // Enabled for demo
            'sync_frequency' => 'real_time',
            'last_sync_at' => now(),
            'last_sync_status' => 'success',
        ]);

        // 4. SMS Integration (disabled, ready for activation)
        Integration::create([
            'company_id' => $company->id,
            'name' => 'SMS Notifications (Twilio)',
            'integration_type' => 'sms',
            'provider' => 'Twilio',
            'config' => [
                'account_sid' => 'ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
                'auth_token' => 'your_auth_token_placeholder',
                'from_number' => '+1234567890',
                'messaging_service_sid' => null,
            ],
            'is_enabled' => false, // Disabled for demo
            'sync_frequency' => 'real_time',
            'last_sync_at' => null,
            'last_sync_status' => null,
        ]);

        // 5. IoT MQTT Integration (enabled for demo)
        Integration::create([
            'company_id' => $company->id,
            'name' => 'IoT MQTT Broker',
            'integration_type' => 'iot',
            'provider' => 'MQTT',
            'config' => [
                'broker_host' => 'mqtt.linecare-demo.com',
                'broker_port' => 1883,
                'username' => 'demo_mqtt_user',
                'password' => 'demo_mqtt_password',
                'client_id' => 'linecare_client_' . $company->id,
                'topics' => [
                    'sensors/+/readings',
                    'machines/+/status',
                ],
                'qos' => 1,
                'clean_session' => true,
            ],
            'is_enabled' => true, // Enabled for demo
            'sync_frequency' => 'real_time',
            'last_sync_at' => now(),
            'last_sync_status' => 'connected',
        ]);

        // 6. IoT REST Webhook Integration (enabled for demo)
        Integration::create([
            'company_id' => $company->id,
            'name' => 'IoT REST Webhook',
            'integration_type' => 'iot',
            'provider' => 'REST Webhook',
            'config' => [
                'webhook_url' => '/webhooks/sensors/reading',
                'authentication_type' => 'none', // Public endpoint
                'accepted_sensor_ids' => [], // Empty means accept all
                'auto_create_sensors' => true,
                'auto_create_work_orders' => true,
            ],
            'is_enabled' => true,
            'sync_frequency' => 'real_time',
            'last_sync_at' => now(),
            'last_sync_status' => 'active',
        ]);

        // 7. Custom ERP Integration Example (disabled)
        Integration::create([
            'company_id' => $company->id,
            'name' => 'Custom ERP API',
            'integration_type' => 'erp',
            'provider' => 'Custom REST API',
            'config' => [
                'api_endpoint' => 'https://erp.yourcompany.com/api',
                'api_key' => 'your_api_key_placeholder',
                'endpoints' => [
                    'inventory' => '/inventory',
                    'purchase_orders' => '/purchase-orders',
                    'cost_centers' => '/cost-centers',
                ],
                'headers' => [
                    'X-API-Key' => 'your_api_key_placeholder',
                    'Accept' => 'application/json',
                ],
                'sync_inventory' => true,
                'sync_purchase_orders' => true,
                'sync_work_order_costs' => true,
            ],
            'is_enabled' => false,
            'sync_frequency' => 'daily',
            'last_sync_at' => null,
            'last_sync_status' => null,
        ]);

        $this->command->info('✓ Created 7 sample integrations (3 enabled, 4 disabled for demo)');
    }
}
