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
    Route::apiResource('machines', MachineController::class);
    Route::get('machines/{machine}/analytics', [MachineController::class, 'analytics']);

    // Machine import routes
    Route::post('machines/import/upload', [MachineImportController::class, 'upload']);
    Route::post('machines/import/validate', [MachineImportController::class, 'validate']);
    Route::post('machines/import/confirm', [MachineImportController::class, 'import']);

    // Work Order routes
    Route::apiResource('work-orders', WorkOrderController::class);
    Route::post('work-orders/{workOrder}/complete', [WorkOrderController::class, 'complete']);
    Route::post('work-orders/{workOrder}/assign', [WorkOrderController::class, 'assign']);
    Route::patch('work-orders/{workOrder}/status', [WorkOrderController::class, 'updateStatus']);

    // Preventive Task routes
    Route::apiResource('preventive-tasks', PreventiveTaskController::class);
    Route::get('preventive-tasks-upcoming', [PreventiveTaskController::class, 'upcoming']);
    Route::get('preventive-tasks-overdue', [PreventiveTaskController::class, 'overdue']);

    // Location routes
    Route::apiResource('locations', LocationController::class);

    // Cause Category routes
    Route::apiResource('cause-categories', CauseCategoryController::class);

    // Dashboard & Analytics routes
    Route::get('dashboard/metrics', [DashboardController::class, 'metrics']);
    Route::get('reports/downtime-by-machine', [DashboardController::class, 'downtimeByMachine']);
    Route::get('reports/completion-time-metrics', [DashboardController::class, 'completionTimeMetrics']);

    // User management routes
    Route::apiResource('users', UserController::class);
});
