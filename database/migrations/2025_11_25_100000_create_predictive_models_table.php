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
        Schema::create('predictive_models', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->foreignId('machine_id')->constrained()->cascadeOnDelete();
            $table->string('model_type'); // failure_prediction, degradation, anomaly_detection
            $table->string('status')->default('training'); // training, active, inactive, failed
            $table->decimal('accuracy_score', 5, 2)->nullable(); // 0-100%
            $table->decimal('confidence_threshold', 5, 2)->default(70.00); // minimum confidence for predictions
            $table->json('features')->nullable(); // input features used (sensor_data, work_orders, etc.)
            $table->json('hyperparameters')->nullable(); // model configuration
            $table->timestamp('last_trained_at')->nullable();
            $table->timestamp('last_prediction_at')->nullable();
            $table->integer('training_samples')->default(0);
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index('company_id');
            $table->index('machine_id');
            $table->index('model_type');
            $table->index('status');
            $table->index(['company_id', 'machine_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('predictive_models');
    }
};
