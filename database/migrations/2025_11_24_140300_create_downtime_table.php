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
        Schema::create('downtime', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->foreignId('machine_id')->constrained()->cascadeOnDelete();
            $table->foreignId('production_run_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('downtime_category_id')->constrained()->restrictOnDelete();
            $table->timestamp('start_time');
            $table->timestamp('end_time')->nullable();
            $table->integer('duration_minutes')->nullable(); // Calculated when end_time is set
            $table->text('description')->nullable();
            $table->foreignId('recorded_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index('company_id');
            $table->index('machine_id');
            $table->index('production_run_id');
            $table->index('downtime_category_id');
            $table->index('start_time');
            $table->index(['company_id', 'machine_id']);
            $table->index(['production_run_id', 'start_time']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('downtime');
    }
};
