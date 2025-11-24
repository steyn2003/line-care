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
        Schema::create('spare_parts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->foreignId('category_id')->nullable()->constrained('part_categories')->nullOnDelete();
            $table->foreignId('supplier_id')->nullable()->constrained('suppliers')->nullOnDelete();
            $table->string('part_number')->unique();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('manufacturer')->nullable();
            $table->string('unit_of_measure')->default('pieces'); // pieces, kg, liters, meters, etc.
            $table->decimal('unit_cost', 10, 2)->default(0);
            $table->integer('reorder_point')->default(0); // minimum quantity before reordering
            $table->integer('reorder_quantity')->default(0); // how many to order when below reorder point
            $table->integer('lead_time_days')->default(0); // days for supplier to deliver
            $table->string('location')->nullable(); // physical location in warehouse
            $table->string('image_url')->nullable();
            $table->boolean('is_critical')->default(false); // critical spare parts get priority
            $table->string('status')->default('active'); // active, discontinued
            $table->timestamps();

            $table->index('company_id');
            $table->index('category_id');
            $table->index('supplier_id');
            $table->index('status');
            $table->index('is_critical');
            $table->index(['company_id', 'status']);
            $table->unique(['company_id', 'part_number']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('spare_parts');
    }
};
