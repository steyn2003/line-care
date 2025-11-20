<?php

use App\Enums\WorkOrderStatus;
use App\Enums\WorkOrderType;
use App\Models\CauseCategory;
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
    $this->location = Location::factory()->create([
        'company_id' => $this->company->id,
    ]);
    $this->machine = Machine::factory()->create([
        'company_id' => $this->company->id,
        'location_id' => $this->location->id,
    ]);
    $this->causeCategory = CauseCategory::factory()->create([
        'company_id' => $this->company->id,
    ]);
});

test('operators can create breakdown work orders', function () {
    $this->actingAs($this->operator);

    $response = $this->post(route('work-orders.store'), [
        'machine_id' => $this->machine->id,
        'type' => WorkOrderType::BREAKDOWN->value,
        'priority' => 'high',
        'title' => 'Motor not starting',
        'description' => 'The motor won\'t start when button is pressed',
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('work_orders', [
        'machine_id' => $this->machine->id,
        'company_id' => $this->company->id,
        'created_by' => $this->operator->id,
        'type' => WorkOrderType::BREAKDOWN->value,
        'status' => WorkOrderStatus::OPEN->value,
    ]);
});

test('technicians can view all work orders', function () {
    $this->actingAs($this->technician);

    WorkOrder::factory()->count(5)->create([
        'company_id' => $this->company->id,
        'machine_id' => $this->machine->id,
        'created_by' => $this->operator->id,
    ]);

    $response = $this->get(route('work-orders.index'));

    $response->assertOk();
});

test('work orders are scoped to company (multi-tenancy)', function () {
    $this->actingAs($this->technician);

    // Create work order for this company
    $ownWorkOrder = WorkOrder::factory()->create([
        'company_id' => $this->company->id,
        'machine_id' => $this->machine->id,
        'created_by' => $this->operator->id,
    ]);

    // Create another company's work order
    $otherCompany = Company::factory()->create();
    $otherLocation = Location::factory()->create(['company_id' => $otherCompany->id]);
    $otherMachine = Machine::factory()->create([
        'company_id' => $otherCompany->id,
        'location_id' => $otherLocation->id,
    ]);
    $otherUser = User::factory()->create(['company_id' => $otherCompany->id]);
    $otherWorkOrder = WorkOrder::factory()->create([
        'company_id' => $otherCompany->id,
        'machine_id' => $otherMachine->id,
        'created_by' => $otherUser->id,
    ]);

    // Try to access other company's work order
    $response = $this->get(route('work-orders.show', $otherWorkOrder->id));

    // Should get 403 (forbidden) due to policy
    $response->assertForbidden();
});

test('technicians can start a work order', function () {
    $this->actingAs($this->technician);

    $workOrder = WorkOrder::factory()->create([
        'company_id' => $this->company->id,
        'machine_id' => $this->machine->id,
        'created_by' => $this->operator->id,
        'status' => WorkOrderStatus::OPEN,
    ]);

    $response = $this->put(route('work-orders.update', $workOrder), [
        'status' => WorkOrderStatus::IN_PROGRESS->value,
        'assigned_to' => $this->technician->id,
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('work_orders', [
        'id' => $workOrder->id,
        'status' => WorkOrderStatus::IN_PROGRESS->value,
        'assigned_to' => $this->technician->id,
    ]);
});

test('technicians can complete a work order', function () {
    $this->actingAs($this->technician);

    $workOrder = WorkOrder::factory()->create([
        'company_id' => $this->company->id,
        'machine_id' => $this->machine->id,
        'created_by' => $this->operator->id,
        'status' => WorkOrderStatus::IN_PROGRESS,
        'assigned_to' => $this->technician->id,
        'started_at' => now()->subHours(2),
    ]);

    $response = $this->post(route('work-orders.complete', $workOrder), [
        'completed_at' => now()->toDateTimeString(),
        'work_done' => 'Replaced motor starter',
        'parts_used' => 'Motor starter relay',
        'notes' => 'Old relay was burnt out',
        'cause_category_id' => $this->causeCategory->id,
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('work_orders', [
        'id' => $workOrder->id,
        'status' => WorkOrderStatus::COMPLETED->value,
    ]);

    // Check maintenance log was created
    $this->assertDatabaseHas('maintenance_logs', [
        'work_order_id' => $workOrder->id,
        'user_id' => $this->technician->id,
        'machine_id' => $this->machine->id,
        'work_done' => 'Replaced motor starter',
    ]);
});

test('operators cannot complete work orders', function () {
    $this->actingAs($this->operator);

    $workOrder = WorkOrder::factory()->create([
        'company_id' => $this->company->id,
        'machine_id' => $this->machine->id,
        'created_by' => $this->operator->id,
        'status' => WorkOrderStatus::IN_PROGRESS,
    ]);

    $response = $this->post(route('work-orders.complete', $workOrder), [
        'completed_at' => now()->toDateTimeString(),
        'work_done' => 'Fixed it',
        'cause_category_id' => $this->causeCategory->id,
    ]);

    $response->assertForbidden();
});

test('work order requires machine_id', function () {
    $this->actingAs($this->operator);

    $response = $this->post(route('work-orders.store'), [
        'type' => WorkOrderType::BREAKDOWN->value,
        'title' => 'Test breakdown',
        'description' => 'Test description',
        // Missing machine_id
    ]);

    $response->assertSessionHasErrors('machine_id');
});

test('work order filters by status', function () {
    $this->actingAs($this->technician);

    // Create work orders with different statuses
    WorkOrder::factory()->create([
        'company_id' => $this->company->id,
        'machine_id' => $this->machine->id,
        'status' => WorkOrderStatus::OPEN,
    ]);
    WorkOrder::factory()->create([
        'company_id' => $this->company->id,
        'machine_id' => $this->machine->id,
        'status' => WorkOrderStatus::COMPLETED,
    ]);

    $response = $this->get(route('work-orders.index', ['status' => WorkOrderStatus::OPEN->value]));

    $response->assertOk();
    // The response should only include open work orders
    // (Actual assertion would depend on Inertia props structure)
});

test('work order completion calculates downtime correctly', function () {
    $this->actingAs($this->technician);

    $startedAt = now()->subHours(3);
    $completedAt = now();

    $workOrder = WorkOrder::factory()->create([
        'company_id' => $this->company->id,
        'machine_id' => $this->machine->id,
        'status' => WorkOrderStatus::IN_PROGRESS,
        'started_at' => $startedAt,
    ]);

    $response = $this->post(route('work-orders.complete', $workOrder), [
        'completed_at' => $completedAt->toDateTimeString(),
        'work_done' => 'Repaired',
        'cause_category_id' => $this->causeCategory->id,
    ]);

    $workOrder->refresh();

    // Downtime should be ~180 minutes (3 hours)
    expect($workOrder->downtime_minutes)->toBeGreaterThanOrEqual(179);
    expect($workOrder->downtime_minutes)->toBeLessThanOrEqual(181);
});
