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
        Schema::table('work_orders', function (Blueprint $table) {
            $table->dateTime('planned_start_at')->nullable()->after('completed_at');
            $table->dateTime('planned_end_at')->nullable()->after('planned_start_at');
            $table->unsignedInteger('planned_duration_minutes')->nullable()->after('planned_end_at');
            $table->boolean('is_firm_planned')->default(false)->after('planned_duration_minutes');
            $table->unsignedTinyInteger('planning_priority')->default(3)->after('is_firm_planned');
            $table->boolean('requires_shutdown')->default(false)->after('planning_priority');

            $table->index(['planned_start_at', 'planned_end_at']);
            $table->index(['company_id', 'is_firm_planned']);
            $table->index(['company_id', 'requires_shutdown']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('work_orders', function (Blueprint $table) {
            $table->dropIndex(['planned_start_at', 'planned_end_at']);
            $table->dropIndex(['company_id', 'is_firm_planned']);
            $table->dropIndex(['company_id', 'requires_shutdown']);

            $table->dropColumn([
                'planned_start_at',
                'planned_end_at',
                'planned_duration_minutes',
                'is_firm_planned',
                'planning_priority',
                'requires_shutdown',
            ]);
        });
    }
};
