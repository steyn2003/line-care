<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

// Marketing pages (public)
Route::get('/oplossing', function () {
    return Inertia::render('marketing/oplossing', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('marketing.oplossing');

Route::get('/functionaliteiten', function () {
    return Inertia::render('marketing/functionaliteiten', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('marketing.functionaliteiten');

Route::get('/prijzen', function () {
    return Inertia::render('marketing/prijzen', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('marketing.prijzen');

Route::get('/voor-wie', function () {
    return Inertia::render('marketing/voor-wie', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('marketing.voor-wie');

Route::get('/over-ons', function () {
    return Inertia::render('marketing/over-ons', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('marketing.over-ons');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');

    // Machine routes
    Route::get('machines', [\App\Http\Controllers\MachineController::class, 'index'])->name('machines.index');
    Route::get('machines/create', [\App\Http\Controllers\MachineController::class, 'create'])->name('machines.create');
    Route::get('machines/import', [\App\Http\Controllers\MachineController::class, 'import'])->name('machines.import');
    Route::get('machines/import/template', [\App\Http\Controllers\MachineController::class, 'downloadTemplate'])->name('machines.import.template');
    Route::post('machines/import/validate', [\App\Http\Controllers\MachineController::class, 'validateImport'])->name('machines.import.validate');
    Route::post('machines/import/confirm', [\App\Http\Controllers\MachineController::class, 'confirmImport'])->name('machines.import.confirm');
    Route::post('machines', [\App\Http\Controllers\MachineController::class, 'store'])->name('machines.store');
    Route::get('machines/{machine}', [\App\Http\Controllers\MachineController::class, 'show'])->name('machines.show');
    Route::get('machines/{machine}/edit', [\App\Http\Controllers\MachineController::class, 'edit'])->name('machines.edit');
    Route::put('machines/{machine}', [\App\Http\Controllers\MachineController::class, 'update'])->name('machines.update');
    Route::delete('machines/{machine}', [\App\Http\Controllers\MachineController::class, 'destroy'])->name('machines.destroy');

    // Work Order routes
    Route::get('work-orders', [\App\Http\Controllers\WorkOrderController::class, 'index'])->name('work-orders.index');
    Route::get('work-orders/report-breakdown', [\App\Http\Controllers\WorkOrderController::class, 'reportBreakdown'])->name('work-orders.report-breakdown');
    Route::post('work-orders', [\App\Http\Controllers\WorkOrderController::class, 'store'])->name('work-orders.store');
    Route::get('work-orders/{workOrder}', [\App\Http\Controllers\WorkOrderController::class, 'show'])->name('work-orders.show');
    Route::post('work-orders/{workOrder}/status', [\App\Http\Controllers\WorkOrderController::class, 'updateStatus'])->name('work-orders.update-status');
    Route::post('work-orders/{workOrder}/assign', [\App\Http\Controllers\WorkOrderController::class, 'assign'])->name('work-orders.assign');
    Route::post('work-orders/{workOrder}/complete', [\App\Http\Controllers\WorkOrderController::class, 'complete'])->name('work-orders.complete');

    // Preventive Task routes
    Route::get('preventive-tasks', [\App\Http\Controllers\PreventiveTaskController::class, 'index'])->name('preventive-tasks.index');
    Route::get('preventive-tasks/create', [\App\Http\Controllers\PreventiveTaskController::class, 'create'])->name('preventive-tasks.create');
    Route::post('preventive-tasks', [\App\Http\Controllers\PreventiveTaskController::class, 'store'])->name('preventive-tasks.store');
    Route::get('preventive-tasks/{preventiveTask}', [\App\Http\Controllers\PreventiveTaskController::class, 'show'])->name('preventive-tasks.show');
    Route::get('preventive-tasks/{preventiveTask}/edit', [\App\Http\Controllers\PreventiveTaskController::class, 'edit'])->name('preventive-tasks.edit');
    Route::put('preventive-tasks/{preventiveTask}', [\App\Http\Controllers\PreventiveTaskController::class, 'update'])->name('preventive-tasks.update');
    Route::delete('preventive-tasks/{preventiveTask}', [\App\Http\Controllers\PreventiveTaskController::class, 'destroy'])->name('preventive-tasks.destroy');

    // Location routes (Manager only)
    Route::get('locations', [\App\Http\Controllers\LocationController::class, 'index'])->name('locations.index');
    Route::post('locations', [\App\Http\Controllers\LocationController::class, 'store'])->name('locations.store');
    Route::put('locations/{location}', [\App\Http\Controllers\LocationController::class, 'update'])->name('locations.update');
    Route::delete('locations/{location}', [\App\Http\Controllers\LocationController::class, 'destroy'])->name('locations.destroy');

    // Cause Category routes (Manager only)
    Route::get('cause-categories', [\App\Http\Controllers\CauseCategoryController::class, 'index'])->name('cause-categories.index');
    Route::post('cause-categories', [\App\Http\Controllers\CauseCategoryController::class, 'store'])->name('cause-categories.store');
    Route::put('cause-categories/{causeCategory}', [\App\Http\Controllers\CauseCategoryController::class, 'update'])->name('cause-categories.update');
    Route::delete('cause-categories/{causeCategory}', [\App\Http\Controllers\CauseCategoryController::class, 'destroy'])->name('cause-categories.destroy');

    // User routes (Manager only)
    Route::get('users', [\App\Http\Controllers\UserController::class, 'index'])->name('users.index');
    Route::post('users', [\App\Http\Controllers\UserController::class, 'store'])->name('users.store');
    Route::put('users/{user}', [\App\Http\Controllers\UserController::class, 'update'])->name('users.update');
    Route::delete('users/{user}', [\App\Http\Controllers\UserController::class, 'destroy'])->name('users.destroy');

    // Reports routes
    Route::get('reports/downtime', [\App\Http\Controllers\ReportsController::class, 'downtime'])->name('reports.downtime');

    // Spare Parts routes
    Route::get('spare-parts', [\App\Http\Controllers\SparePartController::class, 'index'])->name('spare-parts.index');
    Route::get('spare-parts/create', [\App\Http\Controllers\SparePartController::class, 'create'])->name('spare-parts.create');
    Route::get('spare-parts/{sparePart}', [\App\Http\Controllers\SparePartController::class, 'show'])->name('spare-parts.show');
    Route::get('spare-parts/{sparePart}/edit', [\App\Http\Controllers\SparePartController::class, 'edit'])->name('spare-parts.edit');

    // Inventory routes
    Route::get('inventory/low-stock', [\App\Http\Controllers\InventoryController::class, 'lowStock'])->name('inventory.low-stock');

    // Purchase Orders routes
    Route::get('purchase-orders', [\App\Http\Controllers\PurchaseOrderController::class, 'index'])->name('purchase-orders.index');
    Route::get('purchase-orders/create', [\App\Http\Controllers\PurchaseOrderController::class, 'create'])->name('purchase-orders.create');
    Route::post('purchase-orders', [\App\Http\Controllers\PurchaseOrderController::class, 'store'])->name('purchase-orders.store');
    Route::get('purchase-orders/{purchaseOrder}', [\App\Http\Controllers\PurchaseOrderController::class, 'show'])->name('purchase-orders.show');
    Route::delete('purchase-orders/{purchaseOrder}', [\App\Http\Controllers\PurchaseOrderController::class, 'destroy'])->name('purchase-orders.destroy');

    // Suppliers routes
    Route::get('suppliers', [\App\Http\Controllers\SupplierController::class, 'index'])->name('suppliers.index');
    Route::post('suppliers', [\App\Http\Controllers\SupplierController::class, 'store'])->name('suppliers.store');
    Route::put('suppliers/{supplier}', [\App\Http\Controllers\SupplierController::class, 'update'])->name('suppliers.update');
    Route::delete('suppliers/{supplier}', [\App\Http\Controllers\SupplierController::class, 'destroy'])->name('suppliers.destroy');

    // Spare Parts routes (store, update, destroy)
    Route::post('spare-parts', [\App\Http\Controllers\SparePartController::class, 'store'])->name('spare-parts.store');
    Route::put('spare-parts/{sparePart}', [\App\Http\Controllers\SparePartController::class, 'update'])->name('spare-parts.update');
    Route::delete('spare-parts/{sparePart}', [\App\Http\Controllers\SparePartController::class, 'destroy'])->name('spare-parts.destroy');

    // ========== OEE & Production Tracking (Phase 6) ==========

    // Products routes
    Route::get('products', [\App\Http\Controllers\ProductController::class, 'index'])->name('products.index');
    Route::post('products', [\App\Http\Controllers\ProductController::class, 'store'])->name('products.store');
    Route::put('products/{product}', [\App\Http\Controllers\ProductController::class, 'update'])->name('products.update');
    Route::delete('products/{product}', [\App\Http\Controllers\ProductController::class, 'destroy'])->name('products.destroy');

    // Shifts routes
    Route::get('shifts', [\App\Http\Controllers\ShiftController::class, 'index'])->name('shifts.index');
    Route::post('shifts', [\App\Http\Controllers\ShiftController::class, 'store'])->name('shifts.store');
    Route::put('shifts/{shift}', [\App\Http\Controllers\ShiftController::class, 'update'])->name('shifts.update');
    Route::delete('shifts/{shift}', [\App\Http\Controllers\ShiftController::class, 'destroy'])->name('shifts.destroy');

    // Downtime Categories routes
    Route::get('downtime-categories', [\App\Http\Controllers\DowntimeCategoryController::class, 'index'])->name('downtime-categories.index');
    Route::post('downtime-categories', [\App\Http\Controllers\DowntimeCategoryController::class, 'store'])->name('downtime-categories.store');
    Route::put('downtime-categories/{downtimeCategory}', [\App\Http\Controllers\DowntimeCategoryController::class, 'update'])->name('downtime-categories.update');
    Route::delete('downtime-categories/{downtimeCategory}', [\App\Http\Controllers\DowntimeCategoryController::class, 'destroy'])->name('downtime-categories.destroy');

    // Production Runs routes
    Route::get('production/runs', [\App\Http\Controllers\ProductionRunController::class, 'index'])->name('production-runs.index');
    Route::post('production-runs', [\App\Http\Controllers\ProductionRunController::class, 'store'])->name('production-runs.store');
    Route::get('production/runs/{productionRun}', [\App\Http\Controllers\ProductionRunController::class, 'show'])->name('production.runs.show');
    Route::put('production-runs/{productionRun}/end', [\App\Http\Controllers\ProductionRunController::class, 'end'])->name('production-runs.end');

    // Downtime routes
    Route::post('downtime', [\App\Http\Controllers\DowntimeController::class, 'store'])->name('downtime.store');
    Route::put('downtime/{downtime}/end', [\App\Http\Controllers\DowntimeController::class, 'end'])->name('downtime.end');

    // OEE Dashboard routes
    Route::get('oee/dashboard', [\App\Http\Controllers\OEEController::class, 'dashboard'])->name('oee.dashboard');
    Route::get('oee/trends', [\App\Http\Controllers\OEEController::class, 'trends'])->name('oee.trends');
});

require __DIR__.'/settings.php';
