<?php

use App\Models\Company;
use App\Models\Location;
use App\Models\Machine;
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
});

// ========================================
// OPERATOR PERMISSIONS
// ========================================

test('operators can access dashboard', function () {
    $this->actingAs($this->operator);
    $this->get(route('dashboard'))->assertOk();
});

test('operators can create work orders', function () {
    $this->actingAs($this->operator);
    $this->get(route('work-orders.report-breakdown'))->assertOk();
});

test('operators can view work orders list', function () {
    $this->actingAs($this->operator);
    $this->get(route('work-orders.index'))->assertOk();
});

test('operators cannot create machines', function () {
    $this->actingAs($this->operator);
    $this->get(route('machines.create'))->assertForbidden();
});

test('operators cannot create preventive tasks', function () {
    $this->actingAs($this->operator);
    $this->get(route('preventive-tasks.create'))->assertForbidden();
});

test('operators cannot manage users', function () {
    $this->actingAs($this->operator);
    $this->get(route('users.index'))->assertForbidden();
});

test('operators cannot manage locations', function () {
    $this->actingAs($this->operator);
    $this->post(route('locations.store'), [
        'name' => 'Test Location',
    ])->assertForbidden();
});

test('operators cannot manage cause categories', function () {
    $this->actingAs($this->operator);
    $this->post(route('cause-categories.store'), [
        'name' => 'Test Category',
    ])->assertForbidden();
});

// ========================================
// TECHNICIAN PERMISSIONS
// ========================================

test('technicians can access dashboard', function () {
    $this->actingAs($this->technician);
    $this->get(route('dashboard'))->assertOk();
});

test('technicians can view machines', function () {
    $this->actingAs($this->technician);
    $this->get(route('machines.index'))->assertOk();
});

test('technicians can create machines', function () {
    $this->actingAs($this->technician);
    $this->get(route('machines.create'))->assertOk();
});

test('technicians can view work orders', function () {
    $this->actingAs($this->technician);
    $this->get(route('work-orders.index'))->assertOk();
});

test('technicians can create work orders', function () {
    $this->actingAs($this->technician);
    $this->get(route('work-orders.report-breakdown'))->assertOk();
});

test('technicians can update work orders', function () {
    $this->actingAs($this->technician);

    $location = Location::factory()->create(['company_id' => $this->company->id]);
    $machine = Machine::factory()->create([
        'company_id' => $this->company->id,
        'location_id' => $location->id,
    ]);
    $workOrder = WorkOrder::factory()->create([
        'company_id' => $this->company->id,
        'machine_id' => $machine->id,
        'status' => 'open',
    ]);

    $response = $this->post(route('work-orders.update-status', $workOrder), [
        'status' => 'in_progress',
    ]);

    $response->assertRedirect();
});

test('technicians can complete work orders', function () {
    $this->actingAs($this->technician);

    $location = Location::factory()->create(['company_id' => $this->company->id]);
    $machine = Machine::factory()->create([
        'company_id' => $this->company->id,
        'location_id' => $location->id,
    ]);
    $workOrder = WorkOrder::factory()->create([
        'company_id' => $this->company->id,
        'machine_id' => $machine->id,
        'status' => 'in_progress',
        'started_at' => now()->subHour(),
    ]);

    $response = $this->post(route('work-orders.complete', $workOrder), [
        'completed_at' => now()->toDateTimeString(),
        'work_done' => 'Fixed',
    ]);

    $response->assertRedirect();
});

test('technicians can view preventive tasks', function () {
    $this->actingAs($this->technician);
    $this->get(route('preventive-tasks.index'))->assertOk();
});

test('technicians cannot create preventive tasks', function () {
    $this->actingAs($this->technician);
    $this->get(route('preventive-tasks.create'))->assertForbidden();
});

test('technicians cannot manage users', function () {
    $this->actingAs($this->technician);
    $this->get(route('users.index'))->assertForbidden();
});

// ========================================
// MANAGER PERMISSIONS
// ========================================

test('managers can access all sections', function () {
    $this->actingAs($this->manager);

    $this->get(route('dashboard'))->assertOk();
    $this->get(route('machines.index'))->assertOk();
    $this->get(route('work-orders.index'))->assertOk();
    $this->get(route('preventive-tasks.index'))->assertOk();
    $this->get(route('locations.index'))->assertOk();
    $this->get(route('cause-categories.index'))->assertOk();
    $this->get(route('users.index'))->assertOk();
});

test('managers can create machines', function () {
    $this->actingAs($this->manager);
    $this->get(route('machines.create'))->assertOk();
});

test('managers can create preventive tasks', function () {
    $this->actingAs($this->manager);
    $this->get(route('preventive-tasks.create'))->assertOk();
});

test('managers can manage users', function () {
    $this->actingAs($this->manager);
    $this->get(route('users.index'))->assertOk();
});

test('managers can create locations', function () {
    $this->actingAs($this->manager);

    $response = $this->post(route('locations.store'), [
        'name' => 'New Location',
    ]);

    $response->assertRedirect();
});

test('managers can create cause categories', function () {
    $this->actingAs($this->manager);

    $response = $this->post(route('cause-categories.store'), [
        'name' => 'New Category',
    ]);

    $response->assertRedirect();
});

test('managers can import machines', function () {
    $this->actingAs($this->manager);
    $this->get(route('machines.import'))->assertOk();
});

test('managers can access reports', function () {
    $this->actingAs($this->manager);
    $this->get(route('reports.downtime'))->assertOk();
});

// ========================================
// GUEST (UNAUTHENTICATED) RESTRICTIONS
// ========================================

test('guests are redirected to login from dashboard', function () {
    $this->get(route('dashboard'))->assertRedirect(route('login'));
});

test('guests are redirected to login from machines', function () {
    $this->get(route('machines.index'))->assertRedirect(route('login'));
});

test('guests are redirected to login from work orders', function () {
    $this->get(route('work-orders.index'))->assertRedirect(route('login'));
});

test('guests can access login page', function () {
    $this->get(route('login'))->assertOk();
});

test('guests can access register page', function () {
    $this->get(route('register'))->assertOk();
});

// ========================================
// ROLE-BASED MIDDLEWARE TESTS
// ========================================

test('manager middleware blocks non-managers', function () {
    $this->actingAs($this->technician);
    $this->get(route('users.index'))->assertForbidden();

    $this->actingAs($this->operator);
    $this->get(route('users.index'))->assertForbidden();
});

test('technician or manager middleware allows technicians and managers', function () {
    $location = Location::factory()->create(['company_id' => $this->company->id]);
    $machine = Machine::factory()->create([
        'company_id' => $this->company->id,
        'location_id' => $location->id,
    ]);
    $workOrder = WorkOrder::factory()->create([
        'company_id' => $this->company->id,
        'machine_id' => $machine->id,
        'status' => 'in_progress',
        'started_at' => now()->subHour(),
    ]);

    // Manager should be able to complete
    $this->actingAs($this->manager);
    $response = $this->post(route('work-orders.complete', $workOrder), [
        'completed_at' => now()->toDateTimeString(),
        'work_done' => 'Fixed by manager',
    ]);
    $response->assertRedirect();

    // Create another work order for technician test
    $workOrder2 = WorkOrder::factory()->create([
        'company_id' => $this->company->id,
        'machine_id' => $machine->id,
        'status' => 'in_progress',
        'started_at' => now()->subHour(),
    ]);

    // Technician should be able to complete
    $this->actingAs($this->technician);
    $response = $this->post(route('work-orders.complete', $workOrder2), [
        'completed_at' => now()->toDateTimeString(),
        'work_done' => 'Fixed by technician',
    ]);
    $response->assertRedirect();
});

test('technician or manager middleware blocks operators', function () {
    $this->actingAs($this->operator);

    $location = Location::factory()->create(['company_id' => $this->company->id]);
    $machine = Machine::factory()->create([
        'company_id' => $this->company->id,
        'location_id' => $location->id,
    ]);
    $workOrder = WorkOrder::factory()->create([
        'company_id' => $this->company->id,
        'machine_id' => $machine->id,
        'status' => 'in_progress',
        'started_at' => now()->subHour(),
    ]);

    $response = $this->post(route('work-orders.complete', $workOrder), [
        'completed_at' => now()->toDateTimeString(),
        'work_done' => 'Attempted by operator',
    ]);

    $response->assertForbidden();
});
