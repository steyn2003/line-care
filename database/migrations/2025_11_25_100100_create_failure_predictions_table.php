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
        Schema::create('failure_predictions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->foreignId('predictive_model_id')->constrained()->cascadeOnDelete();
            $table->foreignId('machine_id')->constrained()->cascadeOnDelete();
            $table->string('failure_type'); // bearing_failure, motor_failure, etc.
            $table->decimal('probability', 5, 2); // 0-100%
            $table->date('predicted_failure_date')->nullable();
            $table->integer('days_until_failure')->nullable();
            $table->string('severity')->default('medium'); // low, medium, high, critical
            $table->string('status')->default('active'); // active, acknowledged, resolved, false_positive
            $table->text('recommended_action')->nullable();
            $table->json('contributing_factors')->nullable(); // factors that led to this prediction
            $table->foreignId('work_order_id')->nullable()->constrained()->nullOnDelete(); // linked preventive WO
            $table->foreignId('acknowledged_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('acknowledged_at')->nullable();
            $table->timestamps();

            $table->index('company_id');
            $table->index('machine_id');
            $table->index('predictive_model_id');
            $table->index('status');
            $table->index('severity');
            $table->index('predicted_failure_date');
            $table->index(['company_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('failure_predictions');
    }
};
