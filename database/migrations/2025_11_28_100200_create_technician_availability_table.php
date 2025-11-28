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
        Schema::create('technician_availability', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->foreignId('technician_id')->constrained('users')->cascadeOnDelete();

            $table->date('date');
            $table->time('start_time');
            $table->time('end_time');

            $table->string('availability_type')->default('available');
            $table->text('notes')->nullable();

            $table->timestamps();

            $table->index(['company_id', 'technician_id', 'date']);
            $table->index(['technician_id', 'date']);
            $table->index(['company_id', 'date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('technician_availability');
    }
};
