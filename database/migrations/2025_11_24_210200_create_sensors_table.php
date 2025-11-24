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
        Schema::create('sensors', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->foreignId('machine_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('sensor_type'); // vibration, temperature, pressure, current, speed, etc.
            $table->string('sensor_id')->unique(); // external sensor identifier
            $table->string('protocol')->nullable(); // mqtt, opcua, rest, modbus
            $table->string('unit')->nullable(); // mm/s, °C, bar, A, rpm
            $table->decimal('warning_threshold', 10, 2)->nullable();
            $table->decimal('critical_threshold', 10, 2)->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamp('last_reading_at')->nullable();
            $table->decimal('last_reading_value', 10, 2)->nullable();
            $table->json('config')->nullable(); // additional sensor configuration
            $table->timestamps();

            $table->index('company_id');
            $table->index('machine_id');
            $table->index('sensor_type');
            $table->index('is_active');
            $table->index(['company_id', 'machine_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sensors');
    }
};
