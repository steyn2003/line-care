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
        Schema::create('widgets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('dashboard_id')->constrained()->cascadeOnDelete();
            $table->string('widget_type'); // metric_card, line_chart, bar_chart, pie_chart, gauge, table, list
            $table->string('title');
            $table->string('data_source'); // work_orders, machines, spare_parts, oee, costs, etc.
            $table->json('config')->nullable(); // widget-specific configuration (filters, aggregation, etc.)
            $table->integer('position_x')->default(0);
            $table->integer('position_y')->default(0);
            $table->integer('size_width')->default(4); // grid columns (1-12)
            $table->integer('size_height')->default(2); // grid rows
            $table->integer('sort_order')->default(0);
            $table->timestamps();

            $table->index('dashboard_id');
            $table->index('widget_type');
            $table->index('data_source');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('widgets');
    }
};
