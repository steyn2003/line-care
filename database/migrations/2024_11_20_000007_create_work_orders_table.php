<?php

use App\Enums\WorkOrderStatus;
use App\Enums\WorkOrderType;
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
        Schema::create('work_orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->foreignId('machine_id')->constrained()->cascadeOnDelete();
            $table->foreignId('created_by')->constrained('users')->cascadeOnDelete();
            $table->foreignId('assigned_to')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('cause_category_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('preventive_task_id')->nullable()->constrained()->nullOnDelete();

            $table->string('type')->default(WorkOrderType::BREAKDOWN->value);
            $table->string('status')->default(WorkOrderStatus::OPEN->value);
            $table->string('title');
            $table->text('description')->nullable();

            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->index('company_id');
            $table->index('machine_id');
            $table->index('created_by');
            $table->index('assigned_to');
            $table->index('type');
            $table->index('status');
            $table->index(['company_id', 'status']);
            $table->index(['company_id', 'type']);
            $table->index(['machine_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('work_orders');
    }
};
