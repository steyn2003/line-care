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
        Schema::create('dashboards', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->foreignId('created_by')->constrained('users')->cascadeOnDelete();
            $table->string('name');
            $table->text('description')->nullable();
            $table->json('layout')->nullable(); // grid layout configuration
            $table->boolean('is_default')->default(false);
            $table->boolean('is_shared')->default(false);
            $table->string('shared_with_role')->nullable(); // operator, technician, manager, or null for all
            $table->timestamps();

            $table->index('company_id');
            $table->index('created_by');
            $table->index('is_default');
            $table->index('is_shared');
            $table->index(['company_id', 'is_shared']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dashboards');
    }
};
