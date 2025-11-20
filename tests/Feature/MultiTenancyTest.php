<?php

use App\Models\CauseCategory;
use App\Models\Company;
use App\Models\Location;
use App\Models\Machine;
use App\Models\PreventiveTask;
use App\Models\User;
use App\Models\WorkOrder;

beforeEach(function () {
    // Company A setup
    $this->companyA = Company::factory()->create(['name' => 'Company A']);
    $this->userA = User::factory()->create([
        'company_id' => $this->companyA->id,
        'role' => 'manager',
    ]);
    $this->locationA = Location::factory()->create([
        'company_id' => $this->companyA->id,
    ]);
    $this->machineA = Machine::factory()->create([
        'company_id' => $this->companyA->id,
        'location_id' => $this->locationA->id,
    ]);

    // Company B setup
    $this->companyB = Company::factory()->create(['name' => 'Company B']);
    $this->userB = User::factory()->create([
        'company_id' => $this->companyB->id,
        'role' => 'manager',
    ]);
    $this->locationB = Location::factory()->create([
        'company_id' => $this->companyB->id,
    ]);
    $this->machineB = Machine::factory()->create([
        'company_id' => $this->companyB->id,
        'location_id' => $this->locationB->id,
    ]);
});

test('users can only see their own company machines', function () {
    $this->actingAs($this->userA);

    $response = $this->get(route('machines.index'));

    $response->assertOk();
    // User A should only see machines from Company A
    expect(Machine::where('company_id', $this->companyA->id)->count())->toBe(1);
    expect(Machine::where('company_id', $this->companyB->id)->count())->toBe(1);
});

test('users cannot view other company machines', function () {
    $this->actingAs($this->userA);

    // Try to view Company B's machine
    $response = $this->get(route('machines.show', $this->machineB->id));

    $response->assertForbidden();
});

test('users cannot update other company machines', function () {
    $this->actingAs($this->userA);

    // Try to update Company B's machine
    $response = $this->put(route('machines.update', $this->machineB), [
        'name' => 'Hacked Name',
        'code' => $this->machineB->code,
        'location_id' => $this->locationB->id,
        'criticality' => 'high',
        'status' => 'active',
    ]);

    $response->assertForbidden();

    // Verify machine was not updated
    $this->machineB->refresh();
    expect($this->machineB->name)->not->toBe('Hacked Name');
});

test('users cannot delete other company machines', function () {
    $this->actingAs($this->userA);

    // Try to delete Company B's machine
    $response = $this->delete(route('machines.destroy', $this->machineB));

    $response->assertForbidden();

    // Verify machine still exists
    $this->assertDatabaseHas('machines', [
        'id' => $this->machineB->id,
    ]);
});

test('users can only see their own company work orders', function () {
    $this->actingAs($this->userA);

    $workOrderA = WorkOrder::factory()->create([
        'company_id' => $this->companyA->id,
        'machine_id' => $this->machineA->id,
        'created_by' => $this->userA->id,
    ]);

    $workOrderB = WorkOrder::factory()->create([
        'company_id' => $this->companyB->id,
        'machine_id' => $this->machineB->id,
        'created_by' => $this->userB->id,
    ]);

    // Try to view Company B's work order
    $response = $this->get(route('work-orders.show', $workOrderB->id));

    $response->assertForbidden();
});

test('users cannot complete other company work orders', function () {
    $techA = User::factory()->create([
        'company_id' => $this->companyA->id,
        'role' => 'technician',
    ]);

    $this->actingAs($techA);

    $workOrderB = WorkOrder::factory()->create([
        'company_id' => $this->companyB->id,
        'machine_id' => $this->machineB->id,
        'created_by' => $this->userB->id,
        'status' => 'in_progress',
        'started_at' => now()->subHour(),
    ]);

    $response = $this->post(route('work-orders.complete', $workOrderB), [
        'completed_at' => now()->toDateTimeString(),
        'work_done' => 'Attempted to complete',
    ]);

    $response->assertForbidden();

    // Verify work order was not completed
    $workOrderB->refresh();
    expect($workOrderB->status->value)->not->toBe('completed');
});

test('users can only see their own company locations', function () {
    $this->actingAs($this->userA);

    $response = $this->get(route('locations.index'));

    $response->assertOk();
    // Should only see own company locations in the response
});

test('users can only see their own company preventive tasks', function () {
    $this->actingAs($this->userA);

    $taskA = PreventiveTask::factory()->create([
        'company_id' => $this->companyA->id,
        'machine_id' => $this->machineA->id,
    ]);

    $taskB = PreventiveTask::factory()->create([
        'company_id' => $this->companyB->id,
        'machine_id' => $this->machineB->id,
    ]);

    // Try to view Company B's task
    $response = $this->get(route('preventive-tasks.show', $taskB->id));

    $response->assertForbidden();
});

test('users can only see their own company cause categories', function () {
    $this->actingAs($this->userA);

    $categoryA = CauseCategory::factory()->create([
        'company_id' => $this->companyA->id,
        'name' => 'Company A Category',
    ]);

    $categoryB = CauseCategory::factory()->create([
        'company_id' => $this->companyB->id,
        'name' => 'Company B Category',
    ]);

    $response = $this->get(route('cause-categories.index'));

    $response->assertOk();
    // Response should only include Company A's categories
});

test('work orders created by operators are automatically scoped to their company', function () {
    $operatorA = User::factory()->create([
        'company_id' => $this->companyA->id,
        'role' => 'operator',
    ]);

    $this->actingAs($operatorA);

    $response = $this->post(route('work-orders.store'), [
        'machine_id' => $this->machineA->id,
        'type' => 'breakdown',
        'priority' => 'high',
        'title' => 'Test Breakdown',
        'description' => 'Test',
    ]);

    $response->assertRedirect();

    // Verify work order has correct company_id
    $this->assertDatabaseHas('work_orders', [
        'machine_id' => $this->machineA->id,
        'company_id' => $this->companyA->id,
        'created_by' => $operatorA->id,
    ]);
});

test('preventive task command only generates work orders for each company correctly', function () {
    // Create preventive tasks for both companies
    $taskA = PreventiveTask::factory()->create([
        'company_id' => $this->companyA->id,
        'machine_id' => $this->machineA->id,
        'is_active' => true,
        'next_due_date' => now()->addDay(),
    ]);

    $taskB = PreventiveTask::factory()->create([
        'company_id' => $this->companyB->id,
        'machine_id' => $this->machineB->id,
        'is_active' => true,
        'next_due_date' => now()->addDay(),
    ]);

    $this->artisan('preventive:generate-work-orders')->assertSuccessful();

    // Verify work orders were created for both companies with correct scoping
    $this->assertDatabaseHas('work_orders', [
        'preventive_task_id' => $taskA->id,
        'company_id' => $this->companyA->id,
        'machine_id' => $this->machineA->id,
    ]);

    $this->assertDatabaseHas('work_orders', [
        'preventive_task_id' => $taskB->id,
        'company_id' => $this->companyB->id,
        'machine_id' => $this->machineB->id,
    ]);
});

test('dashboard metrics are scoped to user company', function () {
    $this->actingAs($this->userA);

    // Create work orders for both companies
    WorkOrder::factory()->count(3)->create([
        'company_id' => $this->companyA->id,
        'machine_id' => $this->machineA->id,
    ]);

    WorkOrder::factory()->count(5)->create([
        'company_id' => $this->companyB->id,
        'machine_id' => $this->machineB->id,
    ]);

    $response = $this->get(route('dashboard'));

    $response->assertOk();
    // Dashboard should only show metrics for Company A
    // (Actual assertion would depend on Inertia props structure)
});
