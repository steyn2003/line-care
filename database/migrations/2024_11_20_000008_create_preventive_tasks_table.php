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
        Schema::create('preventive_tasks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->foreignId('machine_id')->constrained()->cascadeOnDelete();
            $table->foreignId('assigned_to')->nullable()->constrained('users')->nullOnDelete();

            $table->string('title');
            $table->text('description')->nullable();

            $table->integer('schedule_interval_value'); // e.g., 3
            $table->string('schedule_interval_unit'); // days, weeks, months

            $table->date('next_due_date');
            $table->timestamp('last_completed_at')->nullable();
            $table->boolean('is_active')->default(true);

            $table->timestamps();

            $table->index('company_id');
            $table->index('machine_id');
            $table->index('assigned_to');
            $table->index(['is_active', 'next_due_date']);
            $table->index(['company_id', 'is_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('preventive_tasks');
    }
};
