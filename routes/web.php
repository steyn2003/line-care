<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

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
});

require __DIR__.'/settings.php';
