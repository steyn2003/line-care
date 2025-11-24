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
        Schema::create('labor_rates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade'); // Specific user rate
            $table->string('role')->nullable(); // Or general role rate (operator, technician, manager)
            $table->decimal('hourly_rate', 10, 2); // Regular hourly rate
            $table->decimal('overtime_rate', 10, 2)->nullable(); // Overtime hourly rate
            $table->date('effective_from'); // When this rate becomes effective
            $table->date('effective_to')->nullable(); // When this rate expires (null = current)
            $table->timestamps();

            // Indexes
            $table->index(['company_id', 'user_id']);
            $table->index(['company_id', 'role']);
            $table->index(['effective_from', 'effective_to']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('labor_rates');
    }
};
