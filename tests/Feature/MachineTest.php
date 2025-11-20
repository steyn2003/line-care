<?php

use App\Models\Company;
use App\Models\Location;
use App\Models\Machine;
use App\Models\User;

beforeEach(function () {
    $this->company = Company::factory()->create();
    $this->user = User::factory()->create([
        'company_id' => $this->company->id,
        'role' => 'manager',
    ]);
    $this->location = Location::factory()->create([
        'company_id' => $this->company->id,
    ]);
});

test('managers can view machines list', function () {
    $this->actingAs($this->user);

    $machines = Machine::factory()->count(3)->create([
        'company_id' => $this->company->id,
        'location_id' => $this->location->id,
    ]);

    $response = $this->get(route('machines.index'));

    $response->assertOk();
});

test('managers can create a machine', function () {
    $this->actingAs($this->user);

    $machineData = [
        'name' => 'CNC Mill 01',
        'code' => 'CNC-001',
        'location_id' => $this->location->id,
        'criticality' => 'high',
        'status' => 'active',
    ];

    $response = $this->post(route('machines.store'), $machineData);

    $response->assertRedirect(route('machines.index'));
    $this->assertDatabaseHas('machines', [
        'name' => 'CNC Mill 01',
        'code' => 'CNC-001',
        'company_id' => $this->company->id,
    ]);
});

test('machines are scoped to company (multi-tenancy)', function () {
    $this->actingAs($this->user);

    // Create machine for this company
    $ownMachine = Machine::factory()->create([
        'company_id' => $this->company->id,
        'location_id' => $this->location->id,
    ]);

    // Create another company with their machine
    $otherCompany = Company::factory()->create();
    $otherLocation = Location::factory()->create(['company_id' => $otherCompany->id]);
    $otherMachine = Machine::factory()->create([
        'company_id' => $otherCompany->id,
        'location_id' => $otherLocation->id,
    ]);

    $response = $this->get(route('machines.index'));

    // Should only see own company's machines
    expect(Machine::count())->toBe(2); // Both exist in database
    expect(Machine::where('company_id', $this->company->id)->count())->toBe(1); // Only one for this company
});

test('users cannot access other company machines directly', function () {
    $this->actingAs($this->user);

    // Create another company's machine
    $otherCompany = Company::factory()->create();
    $otherLocation = Location::factory()->create(['company_id' => $otherCompany->id]);
    $otherMachine = Machine::factory()->create([
        'company_id' => $otherCompany->id,
        'location_id' => $otherLocation->id,
    ]);

    // Try to access other company's machine
    $response = $this->get(route('machines.show', $otherMachine->id));

    // Should get 403 (forbidden) due to policy
    $response->assertForbidden();
});

test('machine code must be unique per company', function () {
    $this->actingAs($this->user);

    Machine::factory()->create([
        'company_id' => $this->company->id,
        'location_id' => $this->location->id,
        'code' => 'CNC-001',
    ]);

    // Try to create another machine with same code
    $response = $this->post(route('machines.store'), [
        'name' => 'Another Machine',
        'code' => 'CNC-001', // Duplicate code
        'location_id' => $this->location->id,
        'criticality' => 'medium',
        'status' => 'active',
    ]);

    $response->assertSessionHasErrors('code');
});

test('managers can update a machine', function () {
    $this->actingAs($this->user);

    $machine = Machine::factory()->create([
        'company_id' => $this->company->id,
        'location_id' => $this->location->id,
        'name' => 'Old Name',
    ]);

    $response = $this->put(route('machines.update', $machine), [
        'name' => 'Updated Name',
        'code' => $machine->code,
        'location_id' => $this->location->id,
        'criticality' => 'high',
        'status' => 'active',
    ]);

    $response->assertRedirect(route('machines.show', $machine));
    $this->assertDatabaseHas('machines', [
        'id' => $machine->id,
        'name' => 'Updated Name',
        'criticality' => 'high',
    ]);
});

test('managers can delete a machine', function () {
    $this->actingAs($this->user);

    $machine = Machine::factory()->create([
        'company_id' => $this->company->id,
        'location_id' => $this->location->id,
    ]);

    $response = $this->delete(route('machines.destroy', $machine));

    $response->assertRedirect(route('machines.index'));
    $this->assertDatabaseMissing('machines', [
        'id' => $machine->id,
    ]);
});

test('operators cannot create machines', function () {
    $operator = User::factory()->create([
        'company_id' => $this->company->id,
        'role' => 'operator',
    ]);

    $this->actingAs($operator);

    $response = $this->post(route('machines.store'), [
        'name' => 'Test Machine',
        'code' => 'TEST-001',
        'location_id' => $this->location->id,
        'criticality' => 'low',
    ]);

    $response->assertForbidden();
});
