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
        Schema::create('integration_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('integration_id')->constrained()->cascadeOnDelete();
            $table->string('action'); // sync_inventory, sync_costs, sync_purchase_orders, etc.
            $table->string('status'); // success, error, warning
            $table->integer('records_processed')->default(0);
            $table->integer('records_succeeded')->default(0);
            $table->integer('records_failed')->default(0);
            $table->text('message')->nullable();
            $table->json('error_details')->nullable(); // detailed error information
            $table->timestamp('started_at');
            $table->timestamp('completed_at')->nullable();
            $table->integer('duration_seconds')->nullable();
            $table->timestamps();

            $table->index('integration_id');
            $table->index('status');
            $table->index('started_at');
            $table->index(['integration_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('integration_logs');
    }
};
