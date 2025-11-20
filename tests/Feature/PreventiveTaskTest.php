<?php

use App\Enums\WorkOrderStatus;
use App\Enums\WorkOrderType;
use App\Models\Company;
use App\Models\Location;
use App\Models\Machine;
use App\Models\PreventiveTask;
use App\Models\User;
use App\Models\WorkOrder;

beforeEach(function () {
    $this->company = Company::factory()->create();
    $this->manager = User::factory()->create([
        'company_id' => $this->company->id,
        'role' => 'manager',
    ]);
    $this->technician = User::factory()->create([
        'company_id' => $this->company->id,
        'role' => 'technician',
    ]);
    $this->operator = User::factory()->create([
        'company_id' => $this->company->id,
        'role' => 'operator',
    ]);
    $this->location = Location::factory()->create([
        'company_id' => $this->company->id,
    ]);
    $this->machine = Machine::factory()->create([
        'company_id' => $this->company->id,
        'location_id' => $this->location->id,
    ]);
});

test('managers can create preventive tasks', function () {
    $this->actingAs($this->manager);

    $response = $this->post(route('preventive-tasks.store'), [
        'machine_id' => $this->machine->id,
        'title' => 'Quarterly Lubrication',
        'description' => 'Lubricate all moving parts',
        'schedule_interval_value' => 90,
        'schedule_interval_unit' => 'days',
        'next_due_date' => now()->addDays(90)->toDateString(),
        'is_active' => true,
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('preventive_tasks', [
        'machine_id' => $this->machine->id,
        'company_id' => $this->company->id,
        'title' => 'Quarterly Lubrication',
        'is_active' => true,
    ]);
});

test('preventive tasks are scoped to company (multi-tenancy)', function () {
    $this->actingAs($this->manager);

    // Create preventive task for this company
    $ownTask = PreventiveTask::factory()->create([
        'company_id' => $this->company->id,
        'machine_id' => $this->machine->id,
    ]);

    // Create another company's preventive task
    $otherCompany = Company::factory()->create();
    $otherLocation = Location::factory()->create(['company_id' => $otherCompany->id]);
    $otherMachine = Machine::factory()->create([
        'company_id' => $otherCompany->id,
        'location_id' => $otherLocation->id,
    ]);
    $otherTask = PreventiveTask::factory()->create([
        'company_id' => $otherCompany->id,
        'machine_id' => $otherMachine->id,
    ]);

    // Try to access other company's task
    $response = $this->get(route('preventive-tasks.show', $otherTask->id));

    // Should get 403 (forbidden) due to policy
    $response->assertForbidden();
});

test('operators cannot create preventive tasks', function () {
    $this->actingAs($this->operator);

    $response = $this->post(route('preventive-tasks.store'), [
        'machine_id' => $this->machine->id,
        'title' => 'Test Task',
        'description' => 'Test',
        'schedule_interval_value' => 30,
        'schedule_interval_unit' => 'days',
        'next_due_date' => now()->addDays(30)->toDateString(),
    ]);

    $response->assertForbidden();
});

test('managers can update preventive tasks', function () {
    $this->actingAs($this->manager);

    $task = PreventiveTask::factory()->create([
        'company_id' => $this->company->id,
        'machine_id' => $this->machine->id,
        'title' => 'Old Title',
    ]);

    $response = $this->put(route('preventive-tasks.update', $task), [
        'machine_id' => $this->machine->id,
        'title' => 'Updated Title',
        'description' => $task->description,
        'schedule_interval_value' => 60,
        'schedule_interval_unit' => 'days',
        'next_due_date' => now()->addDays(60)->toDateString(),
        'is_active' => true,
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('preventive_tasks', [
        'id' => $task->id,
        'title' => 'Updated Title',
        'schedule_interval_value' => 60,
    ]);
});

test('managers can deactivate preventive tasks', function () {
    $this->actingAs($this->manager);

    $task = PreventiveTask::factory()->create([
        'company_id' => $this->company->id,
        'machine_id' => $this->machine->id,
        'is_active' => true,
    ]);

    $response = $this->put(route('preventive-tasks.update', $task), [
        'machine_id' => $this->machine->id,
        'title' => $task->title,
        'description' => $task->description,
        'schedule_interval_value' => $task->schedule_interval_value,
        'schedule_interval_unit' => $task->schedule_interval_unit,
        'next_due_date' => $task->next_due_date->toDateString(),
        'is_active' => false, // Deactivate
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('preventive_tasks', [
        'id' => $task->id,
        'is_active' => false,
    ]);
});

test('preventive task command generates work orders for due tasks', function () {
    // Create a preventive task that is due
    $dueTask = PreventiveTask::factory()->create([
        'company_id' => $this->company->id,
        'machine_id' => $this->machine->id,
        'is_active' => true,
        'next_due_date' => now()->addDays(2), // Due in 2 days (within 3-day threshold)
    ]);

    // Create a task not yet due
    $notDueTask = PreventiveTask::factory()->create([
        'company_id' => $this->company->id,
        'machine_id' => $this->machine->id,
        'is_active' => true,
        'next_due_date' => now()->addDays(10), // Not due yet
    ]);

    // Run the command
    $this->artisan('preventive:generate-work-orders')
        ->assertSuccessful();

    // Check that work order was created for due task
    $this->assertDatabaseHas('work_orders', [
        'preventive_task_id' => $dueTask->id,
        'machine_id' => $this->machine->id,
        'company_id' => $this->company->id,
        'type' => WorkOrderType::PREVENTIVE->value,
        'status' => WorkOrderStatus::OPEN->value,
    ]);

    // Check that no work order was created for not-due task
    $this->assertDatabaseMissing('work_orders', [
        'preventive_task_id' => $notDueTask->id,
    ]);
});

test('preventive task command does not create duplicate work orders', function () {
    $dueTask = PreventiveTask::factory()->create([
        'company_id' => $this->company->id,
        'machine_id' => $this->machine->id,
        'is_active' => true,
        'next_due_date' => now()->addDays(1),
    ]);

    // Run the command twice
    $this->artisan('preventive:generate-work-orders')->assertSuccessful();
    $this->artisan('preventive:generate-work-orders')->assertSuccessful();

    // Should only have one work order
    $workOrderCount = WorkOrder::where('preventive_task_id', $dueTask->id)->count();
    expect($workOrderCount)->toBe(1);
});

test('preventive task command skips inactive tasks', function () {
    $inactiveTask = PreventiveTask::factory()->create([
        'company_id' => $this->company->id,
        'machine_id' => $this->machine->id,
        'is_active' => false, // Inactive
        'next_due_date' => now()->addDays(1), // Due soon
    ]);

    $this->artisan('preventive:generate-work-orders')->assertSuccessful();

    // No work order should be created for inactive task
    $this->assertDatabaseMissing('work_orders', [
        'preventive_task_id' => $inactiveTask->id,
    ]);
});

test('completing preventive work order updates next due date', function () {
    $this->actingAs($this->technician);

    $task = PreventiveTask::factory()->create([
        'company_id' => $this->company->id,
        'machine_id' => $this->machine->id,
        'schedule_interval_value' => 30,
        'schedule_interval_unit' => 'days',
        'next_due_date' => now()->subDays(1), // Overdue
    ]);

    $workOrder = WorkOrder::factory()->create([
        'company_id' => $this->company->id,
        'machine_id' => $this->machine->id,
        'preventive_task_id' => $task->id,
        'type' => WorkOrderType::PREVENTIVE,
        'status' => WorkOrderStatus::IN_PROGRESS,
        'started_at' => now()->subHour(),
    ]);

    $response = $this->post(route('work-orders.complete', $workOrder), [
        'completed_at' => now()->toDateTimeString(),
        'work_done' => 'Completed preventive maintenance',
    ]);

    $response->assertRedirect();

    // Check that next_due_date was updated
    $task->refresh();
    expect($task->next_due_date)->toBeGreaterThan(now());
});
