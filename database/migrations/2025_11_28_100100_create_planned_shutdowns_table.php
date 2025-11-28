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
        Schema::create('planned_shutdowns', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->text('description')->nullable();

            $table->foreignId('machine_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('location_id')->constrained()->cascadeOnDelete();

            $table->dateTime('start_at');
            $table->dateTime('end_at');

            $table->string('shutdown_type')->default('planned_maintenance');
            $table->string('status')->default('scheduled');

            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index(['company_id', 'status']);
            $table->index(['company_id', 'start_at', 'end_at']);
            $table->index(['machine_id', 'start_at', 'end_at']);
            $table->index(['location_id', 'start_at', 'end_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('planned_shutdowns');
    }
};
