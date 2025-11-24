<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CauseCategoryController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\InventoryController;
use App\Http\Controllers\Api\LocationController;
use App\Http\Controllers\Api\MachineController;
use App\Http\Controllers\Api\MachineImportController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\PartCategoryController;
use App\Http\Controllers\Api\PreventiveTaskController;
use App\Http\Controllers\Api\PurchaseOrderController;
use App\Http\Controllers\Api\SparePartController;
use App\Http\Controllers\Api\SupplierController;
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
    Route::post('work-orders/{workOrder}/add-parts', [WorkOrderController::class, 'addParts'])->name('api.work-orders.add-parts');
    Route::post('work-orders/{workOrder}/remove-parts', [WorkOrderController::class, 'removeParts'])->name('api.work-orders.remove-parts');
    Route::post('work-orders/{workOrder}/complete-with-parts', [WorkOrderController::class, 'completeWithParts'])->name('api.work-orders.complete-with-parts');

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

    // Spare Parts routes
    Route::apiResource('spare-parts', SparePartController::class)->names([
        'index' => 'api.spare-parts.index',
        'store' => 'api.spare-parts.store',
        'show' => 'api.spare-parts.show',
        'update' => 'api.spare-parts.update',
        'destroy' => 'api.spare-parts.destroy',
    ]);
    Route::get('spare-parts/{sparePart}/transactions', [SparePartController::class, 'transactions'])->name('api.spare-parts.transactions');
    Route::post('spare-parts/{sparePart}/adjust-stock', [SparePartController::class, 'adjustStock'])->name('api.spare-parts.adjust-stock');

    // Inventory Management routes
    Route::get('inventory/low-stock', [InventoryController::class, 'lowStock'])->name('api.inventory.low-stock');
    Route::get('inventory/stock-levels', [InventoryController::class, 'stockLevels'])->name('api.inventory.stock-levels');
    Route::post('inventory/stock-count', [InventoryController::class, 'stockCount'])->name('api.inventory.stock-count');
    Route::get('inventory/valuation', [InventoryController::class, 'valuation'])->name('api.inventory.valuation');
    Route::get('inventory/movements', [InventoryController::class, 'movements'])->name('api.inventory.movements');
    Route::get('inventory/usage-report', [InventoryController::class, 'usageReport'])->name('api.inventory.usage-report');

    // Purchase Order routes
    Route::apiResource('purchase-orders', PurchaseOrderController::class)->names([
        'index' => 'api.purchase-orders.index',
        'store' => 'api.purchase-orders.store',
        'show' => 'api.purchase-orders.show',
        'update' => 'api.purchase-orders.update',
    ]);
    Route::post('purchase-orders/{purchaseOrder}/send', [PurchaseOrderController::class, 'send'])->name('api.purchase-orders.send');
    Route::post('purchase-orders/{purchaseOrder}/receive', [PurchaseOrderController::class, 'receive'])->name('api.purchase-orders.receive');
    Route::post('purchase-orders/{purchaseOrder}/cancel', [PurchaseOrderController::class, 'cancel'])->name('api.purchase-orders.cancel');

    // Supplier routes
    Route::apiResource('suppliers', SupplierController::class)->names([
        'index' => 'api.suppliers.index',
        'store' => 'api.suppliers.store',
        'show' => 'api.suppliers.show',
        'update' => 'api.suppliers.update',
        'destroy' => 'api.suppliers.destroy',
    ]);

    // Part Category routes
    Route::apiResource('part-categories', PartCategoryController::class)->names([
        'index' => 'api.part-categories.index',
        'store' => 'api.part-categories.store',
        'show' => 'api.part-categories.show',
        'update' => 'api.part-categories.update',
        'destroy' => 'api.part-categories.destroy',
    ]);

    // Notification routes
    Route::get('notifications', [NotificationController::class, 'index'])->name('api.notifications.index');
    Route::get('notifications/unread-count', [NotificationController::class, 'unreadCount'])->name('api.notifications.unread-count');
    Route::post('notifications/mark-all-read', [NotificationController::class, 'markAllAsRead'])->name('api.notifications.mark-all-read');
    Route::post('notifications/{notification}/mark-read', [NotificationController::class, 'markAsRead'])->name('api.notifications.mark-read');
    Route::delete('notifications/{notification}', [NotificationController::class, 'destroy'])->name('api.notifications.destroy');
});
