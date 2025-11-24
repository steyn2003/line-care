<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed comprehensive demo data with 20-30 records per entity
        $this->call([
            ComprehensiveDemoSeeder::class,

            // Phase 8: Integrations & Automation seeders
            IntegrationSeeder::class,
            SensorSeeder::class,
            NotificationPreferenceSeeder::class,
        ]);
    }
}
