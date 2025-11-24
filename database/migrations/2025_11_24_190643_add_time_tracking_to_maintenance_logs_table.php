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
        Schema::table('maintenance_logs', function (Blueprint $table) {
            $table->timestamp('time_started')->nullable()->after('parts_used');
            $table->timestamp('time_completed')->nullable()->after('time_started');
            $table->decimal('hours_worked', 8, 2)->nullable()->after('time_completed'); // Calculated field
            $table->decimal('break_time', 8, 2)->default(0)->after('hours_worked'); // Break time in hours
            $table->decimal('labor_cost', 10, 2)->default(0)->after('break_time'); // Calculated cost
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('maintenance_logs', function (Blueprint $table) {
            $table->dropColumn(['time_started', 'time_completed', 'hours_worked', 'break_time', 'labor_cost']);
        });
    }
};
