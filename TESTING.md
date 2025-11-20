# CMMS MVP - Testing Guide

## Overview

This document describes the testing approach for the CMMS MVP and provides instructions for running the test suite.

---

## Test Framework

The project uses **Pest PHP** for testing, which provides an elegant and expressive testing API built on top of PHPUnit.

- **Test Location**: `tests/Feature/`
- **Framework**: Pest PHP
- **Database**: Uses `RefreshDatabase` trait to reset database between tests

---

## Running Tests

### Run All Tests

```bash
php artisan test
```

Or with Pest directly:
```bash
./vendor/bin/pest
```

### Run Specific Test File

```bash
php artisan test --filter=MachineTest
php artisan test --filter=WorkOrderTest
php artisan test --filter=PreventiveTaskTest
php artisan test --filter=MultiTenancyTest
php artisan test --filter=AuthorizationTest
```

### Run Tests with Coverage (if XDebug enabled)

```bash
php artisan test --coverage
```

---

## Test Files

### 1. MachineTest.php
Tests machine management functionality and multi-tenancy.

**Test Coverage**:
- ✅ Managers can view machines list
- ✅ Managers can create a machine
- ✅ Machines are scoped to company (multi-tenancy)
- ✅ Users cannot access other company machines directly
- ✅ Machine code must be unique per company
- ✅ Managers can update a machine
- ✅ Managers can delete a machine
- ✅ Operators cannot create machines

**Key Assertions**:
- Multi-tenancy scoping works correctly
- Only authorized users can perform CRUD operations
- Validation rules are enforced

---

### 2. WorkOrderTest.php
Tests work order creation, assignment, and completion.

**Test Coverage**:
- ✅ Operators can create breakdown work orders
- ✅ Technicians can view all work orders
- ✅ Work orders are scoped to company (multi-tenancy)
- ✅ Technicians can start a work order
- ✅ Technicians can complete a work order
- ✅ Operators cannot complete work orders
- ✅ Work order requires machine_id
- ✅ Work order filters by status
- ✅ Work order completion calculates downtime correctly

**Key Assertions**:
- Work order workflow (open → in progress → completed)
- Maintenance logs are created on completion
- Downtime is calculated correctly
- Multi-tenancy isolation

---

### 3. PreventiveTaskTest.php
Tests preventive maintenance task management and automation.

**Test Coverage**:
- ✅ Managers can create preventive tasks
- ✅ Preventive tasks are scoped to company (multi-tenancy)
- ✅ Operators cannot create preventive tasks
- ✅ Managers can update preventive tasks
- ✅ Managers can deactivate preventive tasks
- ✅ Preventive task command generates work orders for due tasks
- ✅ Preventive task command does not create duplicate work orders
- ✅ Preventive task command skips inactive tasks
- ✅ Completing preventive work order updates next due date

**Key Assertions**:
- Scheduled command generates work orders correctly
- Due date calculation works
- Active/inactive status is respected
- No duplicate work orders are created

---

### 4. MultiTenancyTest.php
Comprehensive multi-tenancy security tests.

**Test Coverage**:
- ✅ Users can only see their own company machines
- ✅ Users cannot view other company machines
- ✅ Users cannot update other company machines
- ✅ Users cannot delete other company machines
- ✅ Users can only see their own company work orders
- ✅ Users cannot complete other company work orders
- ✅ Users can only see their own company locations
- ✅ Users can only see their own company preventive tasks
- ✅ Users can only see their own company cause categories
- ✅ Work orders created by operators are automatically scoped to their company
- ✅ Preventive task command only generates work orders for each company correctly
- ✅ Dashboard metrics are scoped to user company

**Key Assertions**:
- Complete isolation between companies
- All data is automatically scoped to company_id
- Cross-company access is blocked (404 responses)

---

### 5. AuthorizationTest.php
Tests role-based access control (RBAC).

**Test Coverage**:

#### Operator Permissions
- ✅ Can access dashboard
- ✅ Can create work orders
- ✅ Can view work orders list
- ❌ Cannot create machines
- ❌ Cannot create preventive tasks
- ❌ Cannot manage users
- ❌ Cannot manage locations
- ❌ Cannot manage cause categories

#### Technician Permissions
- ✅ Can access dashboard
- ✅ Can view machines
- ✅ Can create machines
- ✅ Can view work orders
- ✅ Can create work orders
- ✅ Can update work orders
- ✅ Can complete work orders
- ✅ Can view preventive tasks
- ❌ Cannot create preventive tasks
- ❌ Cannot manage users

#### Manager Permissions
- ✅ Can access all sections
- ✅ Can create machines
- ✅ Can create preventive tasks
- ✅ Can create users
- ✅ Can create locations
- ✅ Can create cause categories
- ✅ Can import machines
- ✅ Can access reports

#### Guest Restrictions
- ✅ Redirected to login from dashboard
- ✅ Redirected to login from machines
- ✅ Redirected to login from work orders
- ✅ Can access login page
- ✅ Can access register page

#### Middleware Tests
- ✅ Manager middleware blocks non-managers
- ✅ Technician or manager middleware allows technicians and managers
- ✅ Technician or manager middleware blocks operators

---

## Database Factories

All models have factories for easy test data generation:

### CompanyFactory
Creates test companies with realistic names.

### UserFactory
Creates test users with roles (operator, technician, manager).

### LocationFactory
Creates test locations with common factory area names.

### MachineFactory
Creates test machines with realistic:
- Names (CNC Mill, Hydraulic Press, etc.)
- Codes (CNC-001, PRESS-002, etc.)
- Manufacturers (Haas, Schuler, etc.)
- Criticality levels

### WorkOrderFactory
Creates test work orders with:
- Random types (breakdown, corrective, preventive)
- Random statuses (open, in_progress, completed)
- Realistic timestamps and downtime calculations
- Associated maintenance logs for completed orders

### PreventiveTaskFactory
Creates test preventive tasks with:
- Common task titles (Quarterly Lubrication, etc.)
- Realistic frequency (7, 30, 90 days)
- Due dates
- Active/inactive status

### CauseCategoryFactory
Creates test cause categories with common breakdown causes.

---

## Testing Best Practices

### 1. Database Refresh
All tests use `RefreshDatabase` trait, which:
- Migrates the database before each test
- Rolls back after each test
- Ensures clean state for every test

### 2. Arrange-Act-Assert Pattern
Tests follow the AAA pattern:

```php
test('managers can create a machine', function () {
    // Arrange: Set up test data
    $this->actingAs($manager);
    $machineData = ['name' => 'Test Machine', ...];
    
    // Act: Perform the action
    $response = $this->post(route('machines.store'), $machineData);
    
    // Assert: Verify the outcome
    $response->assertRedirect();
    $this->assertDatabaseHas('machines', ['name' => 'Test Machine']);
});
```

### 3. Factory Usage
Use factories instead of manual model creation:

```php
// Good
$machine = Machine::factory()->create(['company_id' => $company->id]);

// Avoid
$machine = new Machine();
$machine->name = 'Test';
$machine->company_id = $company->id;
$machine->save();
```

### 4. Testing Multi-Tenancy
Always test that:
- Users can access their own company's data
- Users cannot access other companies' data
- All create operations automatically scope to user's company

---

## Common Test Patterns

### Acting as Authenticated User
```php
$user = User::factory()->create(['role' => 'manager']);
$this->actingAs($user);
```

### Testing Authorization
```php
$response = $this->post(route('machines.store'), $data);
$response->assertForbidden(); // 403
```

### Testing Multi-Tenancy
```php
$otherCompanyMachine = Machine::factory()->create(['company_id' => $otherCompany->id]);
$response = $this->get(route('machines.show', $otherCompanyMachine));
$response->assertNotFound(); // 404
```

### Testing Database State
```php
$this->assertDatabaseHas('machines', ['name' => 'Test Machine']);
$this->assertDatabaseMissing('machines', ['id' => $deletedId]);
```

### Testing Commands
```php
$this->artisan('preventive:generate-work-orders')
    ->assertSuccessful();
```

---

## Writing New Tests

### Step 1: Create Test File
```bash
php artisan make:test MyFeatureTest
```

### Step 2: Write Test
```php
<?php

use App\Models\User;

test('users can do something', function () {
    $user = User::factory()->create();
    $this->actingAs($user);
    
    $response = $this->get(route('some.route'));
    
    $response->assertOk();
});
```

### Step 3: Run Test
```bash
php artisan test --filter=MyFeatureTest
```

---

## Continuous Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: 8.2
          extensions: sqlite3
          
      - name: Install Dependencies
        run: composer install
        
      - name: Copy Environment
        run: cp .env.example .env
        
      - name: Generate Key
        run: php artisan key:generate
        
      - name: Create Database
        run: touch database/database.sqlite
        
      - name: Run Migrations
        run: php artisan migrate
        
      - name: Run Tests
        run: php artisan test
```

---

## Test Coverage Summary

### Current Coverage
- **Machine Management**: 100% (8/8 tests)
- **Work Order Workflow**: 100% (9/9 tests)
- **Preventive Tasks**: 100% (9/9 tests)
- **Multi-Tenancy**: 100% (12/12 tests)
- **Authorization**: 100% (29/29 tests)

**Total**: 67 feature tests covering all critical paths

### What's Tested
- ✅ Multi-tenancy isolation
- ✅ Role-based access control
- ✅ Work order workflow (creation → assignment → completion)
- ✅ Preventive maintenance automation
- ✅ Machine management CRUD
- ✅ Downtime calculation
- ✅ Validation rules
- ✅ Authorization middleware

### What's NOT Tested (Future)
- ⏳ CSV import validation edge cases
- ⏳ File uploads (when implemented)
- ⏳ Email notifications (when implemented)
- ⏳ Complex dashboard queries performance
- ⏳ Browser/E2E tests with Dusk

---

## Troubleshooting

### Tests Failing with Database Errors
```bash
# Clear config cache
php artisan config:clear

# Recreate test database
rm database/database.sqlite
touch database/database.sqlite
php artisan migrate --env=testing
```

### Factory Errors
```bash
# Ensure all factories are created
# Check that models have HasFactory trait
# Verify factory namespace matches model
```

### Permission Errors
```bash
# Ensure storage is writable
chmod -R 775 storage
chmod -R 775 bootstrap/cache
```

---

## Resources

- [Pest PHP Documentation](https://pestphp.com/)
- [Laravel Testing Documentation](https://laravel.com/docs/11.x/testing)
- [Laravel Database Testing](https://laravel.com/docs/11.x/database-testing)
- [Laravel Factories](https://laravel.com/docs/11.x/eloquent-factories)

---

**Version**: 1.0  
**Last Updated**: 2025-01-20  
**Tests Written**: 67 feature tests  
**Coverage**: All critical paths
