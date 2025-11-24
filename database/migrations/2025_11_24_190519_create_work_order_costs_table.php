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
        Schema::create('work_order_costs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('work_order_id')->constrained()->onDelete('cascade');
            $table->decimal('labor_cost', 10, 2)->default(0); // Sum of technician time costs
            $table->decimal('parts_cost', 10, 2)->default(0); // Sum of parts used
            $table->decimal('external_service_cost', 10, 2)->default(0); // Sum of contractor/vendor costs
            $table->decimal('downtime_cost', 10, 2)->default(0); // Production loss cost
            $table->decimal('total_cost', 10, 2)->default(0); // Sum of all costs
            $table->timestamp('calculated_at')->nullable(); // Last calculation timestamp
            $table->timestamps();

            // Indexes
            $table->index('work_order_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('work_order_costs');
    }
};
