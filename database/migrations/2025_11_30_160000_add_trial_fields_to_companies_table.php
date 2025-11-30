<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            $table->boolean('is_trial')->default(false)->after('feature_flags');
            $table->timestamp('trial_ends_at')->nullable()->after('is_trial');
            $table->boolean('is_demo')->default(false)->after('trial_ends_at');
            $table->string('industry')->nullable()->after('is_demo');
            $table->string('company_size')->nullable()->after('industry');
        });
    }

    public function down(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            $table->dropColumn(['is_trial', 'trial_ends_at', 'is_demo', 'industry', 'company_size']);
        });
    }
};
