<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CauseCategoryController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\LocationController;
use App\Http\Controllers\Api\MachineController;
use App\Http\Controllers\Api\MachineImportController;
use App\Http\Controllers\Api\PreventiveTaskController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\WorkOrderController;
use Illuminate\Support\Facades\Route;

// Public auth routes
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::prefix('auth')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });

    // Machine routes
    Route::apiResource('machines', MachineController::class)->names([
        'index' => 'api.machines.index',
        'store' => 'api.machines.store',
        'show' => 'api.machines.show',
        'update' => 'api.machines.update',
        'destroy' => 'api.machines.destroy',
    ]);
    Route::get('machines/{machine}/analytics', [MachineController::class, 'analytics'])->name('api.machines.analytics');

    // Machine import routes
    Route::post('machines/import/upload', [MachineImportController::class, 'upload'])->name('api.machines.import.upload');
    Route::post('machines/import/validate', [MachineImportController::class, 'validate'])->name('api.machines.import.validate');
    Route::post('machines/import/confirm', [MachineImportController::class, 'import'])->name('api.machines.import.confirm');

    // Work Order routes
    Route::apiResource('work-orders', WorkOrderController::class)->names([
        'index' => 'api.work-orders.index',
        'store' => 'api.work-orders.store',
        'show' => 'api.work-orders.show',
        'update' => 'api.work-orders.update',
        'destroy' => 'api.work-orders.destroy',
    ]);
    Route::post('work-orders/{workOrder}/complete', [WorkOrderController::class, 'complete'])->name('api.work-orders.complete');
    Route::post('work-orders/{workOrder}/assign', [WorkOrderController::class, 'assign'])->name('api.work-orders.assign');
    Route::patch('work-orders/{workOrder}/status', [WorkOrderController::class, 'updateStatus'])->name('api.work-orders.update-status');

    // Preventive Task routes
    Route::apiResource('preventive-tasks', PreventiveTaskController::class)->names([
        'index' => 'api.preventive-tasks.index',
        'store' => 'api.preventive-tasks.store',
        'show' => 'api.preventive-tasks.show',
        'update' => 'api.preventive-tasks.update',
        'destroy' => 'api.preventive-tasks.destroy',
    ]);
    Route::get('preventive-tasks-upcoming', [PreventiveTaskController::class, 'upcoming'])->name('api.preventive-tasks.upcoming');
    Route::get('preventive-tasks-overdue', [PreventiveTaskController::class, 'overdue'])->name('api.preventive-tasks.overdue');

    // Location routes
    Route::apiResource('locations', LocationController::class)->names([
        'index' => 'api.locations.index',
        'store' => 'api.locations.store',
        'show' => 'api.locations.show',
        'update' => 'api.locations.update',
        'destroy' => 'api.locations.destroy',
    ]);

    // Cause Category routes
    Route::apiResource('cause-categories', CauseCategoryController::class)->names([
        'index' => 'api.cause-categories.index',
        'store' => 'api.cause-categories.store',
        'show' => 'api.cause-categories.show',
        'update' => 'api.cause-categories.update',
        'destroy' => 'api.cause-categories.destroy',
    ]);

    // Dashboard & Analytics routes
    Route::get('dashboard/metrics', [DashboardController::class, 'metrics'])->name('api.dashboard.metrics');
    Route::get('reports/downtime-by-machine', [DashboardController::class, 'downtimeByMachine'])->name('api.reports.downtime-by-machine');
    Route::get('reports/completion-time-metrics', [DashboardController::class, 'completionTimeMetrics'])->name('api.reports.completion-time-metrics');

    // User management routes
    Route::apiResource('users', UserController::class)->names([
        'index' => 'api.users.index',
        'store' => 'api.users.store',
        'show' => 'api.users.show',
        'update' => 'api.users.update',
        'destroy' => 'api.users.destroy',
    ]);
});
