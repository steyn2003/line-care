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
        Schema::create('maintenance_budgets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->onDelete('cascade');
            $table->integer('year'); // Budget year
            $table->integer('month'); // Budget month (1-12)
            $table->decimal('budgeted_labor', 10, 2)->default(0); // Budgeted labor costs
            $table->decimal('budgeted_parts', 10, 2)->default(0); // Budgeted parts costs
            $table->decimal('budgeted_total', 10, 2)->default(0); // Total budgeted amount
            $table->decimal('actual_labor', 10, 2)->default(0); // Actual labor costs
            $table->decimal('actual_parts', 10, 2)->default(0); // Actual parts costs
            $table->decimal('actual_total', 10, 2)->default(0); // Total actual amount
            $table->decimal('variance', 10, 2)->default(0); // Variance (budgeted - actual)
            $table->timestamps();

            // Indexes
            $table->index(['company_id', 'year', 'month']);
            $table->unique(['company_id', 'year', 'month']); // One budget per company per month
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('maintenance_budgets');
    }
};
