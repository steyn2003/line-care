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
        Schema::create('production_runs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->foreignId('machine_id')->constrained()->cascadeOnDelete();
            $table->foreignId('work_order_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('product_id')->constrained()->restrictOnDelete();
            $table->foreignId('shift_id')->constrained()->restrictOnDelete();
            $table->timestamp('start_time');
            $table->timestamp('end_time')->nullable();
            $table->integer('planned_production_time')->comment('in minutes'); // Shift duration or planned time
            $table->integer('actual_production_time')->nullable()->comment('in minutes'); // Actual time machine was running
            $table->integer('theoretical_output')->default(0)->comment('Expected units based on cycle time');
            $table->integer('actual_output')->default(0)->comment('Total units produced');
            $table->integer('good_output')->default(0)->comment('Good quality units');
            $table->integer('defect_output')->default(0)->comment('Defective units');
            $table->decimal('availability_pct', 5, 2)->nullable()->comment('% of planned time machine was running');
            $table->decimal('performance_pct', 5, 2)->nullable()->comment('% of theoretical output achieved');
            $table->decimal('quality_pct', 5, 2)->nullable()->comment('% of good units vs total output');
            $table->decimal('oee_pct', 5, 2)->nullable()->comment('Overall Equipment Effectiveness %');
            $table->foreignId('created_by')->constrained('users')->restrictOnDelete();
            $table->timestamps();

            $table->index('company_id');
            $table->index('machine_id');
            $table->index('product_id');
            $table->index('shift_id');
            $table->index('work_order_id');
            $table->index('start_time');
            $table->index(['company_id', 'machine_id']);
            $table->index(['company_id', 'start_time']);
            $table->index(['machine_id', 'start_time']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('production_runs');
    }
};
