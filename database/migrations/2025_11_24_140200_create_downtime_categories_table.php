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
        Schema::create('downtime_categories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->string('name'); // e.g., "Breakdown", "Changeover", "Break", "Material Shortage"
            $table->enum('category_type', ['planned', 'unplanned'])->default('unplanned');
            $table->boolean('is_included_in_oee')->default(true); // Whether to count this in OEE calculation
            $table->text('description')->nullable();
            $table->timestamps();

            $table->index('company_id');
            $table->index('category_type');
            $table->index(['company_id', 'category_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('downtime_categories');
    }
};
