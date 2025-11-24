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
        Schema::create('external_services', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->onDelete('cascade');
            $table->foreignId('work_order_id')->constrained()->onDelete('cascade');
            $table->string('vendor_name'); // Contractor or vendor name
            $table->text('description'); // Service description
            $table->decimal('cost', 10, 2); // Service cost
            $table->string('invoice_number')->nullable(); // Invoice reference
            $table->date('invoice_date')->nullable(); // Invoice date
            $table->timestamps();

            // Indexes
            $table->index(['company_id', 'work_order_id']);
            $table->index('vendor_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('external_services');
    }
};
