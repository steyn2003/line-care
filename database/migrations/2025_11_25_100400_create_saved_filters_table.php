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
        Schema::create('saved_filters', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('filter_type'); // work_orders, machines, spare_parts, production_runs, etc.
            $table->json('filters'); // the actual filter criteria
            $table->boolean('is_default')->default(false);
            $table->boolean('is_shared')->default(false);
            $table->timestamps();

            $table->index('company_id');
            $table->index('user_id');
            $table->index('filter_type');
            $table->index(['company_id', 'filter_type']);
            $table->index(['user_id', 'filter_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('saved_filters');
    }
};
