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
        Schema::create('integrations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('integration_type'); // erp, iot, email, sms
            $table->string('provider')->nullable(); // sap, oracle, netsuite, odoo, mqtt, opcua, etc.
            $table->json('config')->nullable(); // credentials, endpoints, settings
            $table->boolean('is_enabled')->default(false);
            $table->string('sync_frequency')->nullable(); // hourly, daily, real-time
            $table->timestamp('last_sync_at')->nullable();
            $table->string('last_sync_status')->nullable(); // success, error
            $table->text('last_sync_message')->nullable();
            $table->timestamps();

            $table->index('company_id');
            $table->index('integration_type');
            $table->index('is_enabled');
            $table->index(['company_id', 'integration_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('integrations');
    }
};
