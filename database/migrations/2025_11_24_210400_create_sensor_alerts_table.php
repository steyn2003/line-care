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
        Schema::create('sensor_alerts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sensor_id')->constrained()->cascadeOnDelete();
            $table->foreignId('machine_id')->constrained()->cascadeOnDelete();
            $table->foreignId('work_order_id')->nullable()->constrained()->nullOnDelete();
            $table->string('alert_type'); // warning, critical
            $table->decimal('threshold_value', 10, 2);
            $table->decimal('current_value', 10, 2);
            $table->timestamp('triggered_at');
            $table->timestamp('acknowledged_at')->nullable();
            $table->foreignId('acknowledged_by')->nullable()->constrained('users')->nullOnDelete();
            $table->text('acknowledgment_note')->nullable();
            $table->boolean('auto_created_work_order')->default(false);
            $table->timestamps();

            $table->index('sensor_id');
            $table->index('machine_id');
            $table->index('work_order_id');
            $table->index('alert_type');
            $table->index('triggered_at');
            $table->index(['sensor_id', 'triggered_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sensor_alerts');
    }
};
