<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            // Plan column: determines which features are available by default
            // Options: basic, pro, enterprise
            $table->string('plan')->default('basic')->after('address');

            // Feature flags: JSON column for per-company feature overrides
            // Allows enabling/disabling specific features regardless of plan
            // Structure: {"inventory": true, "oee": false, ...}
            $table->json('feature_flags')->nullable()->after('plan');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            $table->dropColumn(['plan', 'feature_flags']);
        });
    }
};
