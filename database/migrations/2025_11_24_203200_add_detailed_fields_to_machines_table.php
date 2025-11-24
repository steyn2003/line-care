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
        Schema::table('machines', function (Blueprint $table) {
            $table->string('model')->nullable()->after('name');
            $table->string('serial_number')->nullable()->after('model');
            $table->string('manufacturer')->nullable()->after('serial_number');
            $table->date('installation_date')->nullable()->after('manufacturer');
            $table->text('notes')->nullable()->after('criticality');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('machines', function (Blueprint $table) {
            $table->dropColumn(['model', 'serial_number', 'manufacturer', 'installation_date', 'notes']);
        });
    }
};
