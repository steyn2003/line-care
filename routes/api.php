<?php

use App\Http\Controllers\Api\AnalyticsController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CauseCategoryController;
use App\Http\Controllers\Api\CostController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\CustomDashboardController;
use App\Http\Controllers\Api\DowntimeCategoryController;
use App\Http\Controllers\Api\DowntimeController;
use App\Http\Controllers\Api\ExternalServiceController;
use App\Http\Controllers\Api\GlobalSearchController;
use App\Http\Controllers\Api\InventoryController;
use App\Http\Controllers\Api\LaborRateController;
use App\Http\Controllers\Api\LocationController;
use App\Http\Controllers\Api\MachineController;
use App\Http\Controllers\Api\MachineImportController;
use App\Http\Controllers\Api\MaintenanceBudgetController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\OEEController;
use App\Http\Controllers\Api\PartCategoryController;
use App\Http\Controllers\Api\PreventiveTaskController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ProductionRunController;
use App\Http\Controllers\Api\PurchaseOrderController;
use App\Http\Controllers\Api\SavedFilterController;
use App\Http\Controllers\Api\ShiftController;
use App\Http\Controllers\Api\SparePartController;
use App\Http\Controllers\Api\SupplierController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\WidgetController;
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

    // ========== OEE & Production Tracking (Phase 6) ==========

    // Product routes
    Route::apiResource('products', ProductController::class)->names([
        'index' => 'api.products.index',
        'store' => 'api.products.store',
        'show' => 'api.products.show',
        'update' => 'api.products.update',
        'destroy' => 'api.products.destroy',
    ]);

    // Shift routes
    Route::apiResource('shifts', ShiftController::class)->names([
        'index' => 'api.shifts.index',
        'store' => 'api.shifts.store',
        'show' => 'api.shifts.show',
        'update' => 'api.shifts.update',
        'destroy' => 'api.shifts.destroy',
    ]);

    // Production Run routes
    Route::apiResource('production-runs', ProductionRunController::class)->names([
        'index' => 'api.production-runs.index',
        'store' => 'api.production-runs.store',
        'show' => 'api.production-runs.show',
        'update' => 'api.production-runs.update',
        'destroy' => 'api.production-runs.destroy',
    ]);
    Route::put('production-runs/{productionRun}/end', [ProductionRunController::class, 'end'])->name('api.production-runs.end');

    // Downtime routes
    Route::apiResource('downtime', DowntimeController::class)->names([
        'index' => 'api.downtime.index',
        'store' => 'api.downtime.store',
        'show' => 'api.downtime.show',
        'update' => 'api.downtime.update',
        'destroy' => 'api.downtime.destroy',
    ]);
    Route::put('downtime/{downtime}/end', [DowntimeController::class, 'end'])->name('api.downtime.end');
    Route::get('downtime-categories', [DowntimeController::class, 'categories'])->name('api.downtime.categories');

    // Downtime Category routes
    Route::apiResource('downtime-categories', DowntimeCategoryController::class)->names([
        'index' => 'api.downtime-categories.index',
        'store' => 'api.downtime-categories.store',
        'show' => 'api.downtime-categories.show',
        'update' => 'api.downtime-categories.update',
        'destroy' => 'api.downtime-categories.destroy',
    ]);

    // OEE Analytics routes
    Route::prefix('oee')->name('api.oee.')->group(function () {
        Route::get('metrics', [OEEController::class, 'metrics'])->name('metrics');
        Route::get('trends', [OEEController::class, 'trends'])->name('trends');
        Route::get('comparison', [OEEController::class, 'comparison'])->name('comparison');
        Route::get('current', [OEEController::class, 'current'])->name('current');
        Route::get('loss-analysis', [OEEController::class, 'lossAnalysis'])->name('loss-analysis');
    });

    // ========== Cost Management (Phase 7) ==========

    // Labor Rate routes
    Route::apiResource('labor-rates', LaborRateController::class)->names([
        'index' => 'api.labor-rates.index',
        'store' => 'api.labor-rates.store',
        'show' => 'api.labor-rates.show',
        'update' => 'api.labor-rates.update',
        'destroy' => 'api.labor-rates.destroy',
    ]);
    Route::get('labor-rates/current/rate', [LaborRateController::class, 'getCurrent'])->name('api.labor-rates.current');

    // Work Order Time Logging
    Route::post('work-orders/{workOrder}/log-time', [WorkOrderController::class, 'logTime'])->name('api.work-orders.log-time');

    // External Service routes
    Route::apiResource('external-services', ExternalServiceController::class)->names([
        'index' => 'api.external-services.index',
        'store' => 'api.external-services.store',
        'show' => 'api.external-services.show',
        'update' => 'api.external-services.update',
        'destroy' => 'api.external-services.destroy',
    ]);

    // Maintenance Budget routes
    Route::apiResource('maintenance-budgets', MaintenanceBudgetController::class)->names([
        'index' => 'api.maintenance-budgets.index',
        'store' => 'api.maintenance-budgets.store',
        'show' => 'api.maintenance-budgets.show',
        'update' => 'api.maintenance-budgets.update',
        'destroy' => 'api.maintenance-budgets.destroy',
    ]);
    Route::get('maintenance-budgets/comparison/current', [MaintenanceBudgetController::class, 'comparison'])->name('api.maintenance-budgets.comparison');
    Route::post('maintenance-budgets/update/actuals', [MaintenanceBudgetController::class, 'updateActuals'])->name('api.maintenance-budgets.update-actuals');

    // Cost Analytics routes
    Route::prefix('costs')->name('api.costs.')->group(function () {
        Route::get('summary', [CostController::class, 'summary'])->name('summary');
        Route::get('by-machine', [CostController::class, 'byMachine'])->name('by-machine');
        Route::get('by-category', [CostController::class, 'byCategory'])->name('by-category');
        Route::get('trends', [CostController::class, 'trends'])->name('trends');
        Route::get('downtime', [CostController::class, 'downtime'])->name('downtime');
    });

    // ========== Integrations & Automation (Phase 8) ==========

    // Integration routes
    Route::apiResource('integrations', \App\Http\Controllers\Api\IntegrationController::class)->names([
        'index' => 'api.integrations.index',
        'store' => 'api.integrations.store',
        'show' => 'api.integrations.show',
        'update' => 'api.integrations.update',
        'destroy' => 'api.integrations.destroy',
    ]);
    Route::post('integrations/{integration}/test', [\App\Http\Controllers\Api\IntegrationController::class, 'testConnection'])->name('api.integrations.test');
    Route::post('integrations/{integration}/sync', [\App\Http\Controllers\Api\IntegrationController::class, 'sync'])->name('api.integrations.sync');
    Route::get('integrations/{integration}/logs', [\App\Http\Controllers\Api\IntegrationController::class, 'logs'])->name('api.integrations.logs');

    // Sensor routes
    Route::apiResource('sensors', \App\Http\Controllers\Api\SensorController::class)->names([
        'index' => 'api.sensors.index',
        'store' => 'api.sensors.store',
        'show' => 'api.sensors.show',
        'update' => 'api.sensors.update',
        'destroy' => 'api.sensors.destroy',
    ]);
    Route::get('sensors/{sensor}/readings', [\App\Http\Controllers\Api\SensorController::class, 'readings'])->name('api.sensors.readings');
    Route::get('sensors/{sensor}/statistics', [\App\Http\Controllers\Api\SensorController::class, 'statistics'])->name('api.sensors.statistics');
    Route::get('sensors/{sensor}/alerts', [\App\Http\Controllers\Api\SensorController::class, 'alerts'])->name('api.sensors.alerts');

    // Sensor Alert routes
    Route::get('sensor-alerts', [\App\Http\Controllers\Api\SensorAlertController::class, 'index'])->name('api.sensor-alerts.index');
    Route::get('sensor-alerts/{alert}', [\App\Http\Controllers\Api\SensorAlertController::class, 'show'])->name('api.sensor-alerts.show');
    Route::put('sensor-alerts/{alert}/acknowledge', [\App\Http\Controllers\Api\SensorAlertController::class, 'acknowledge'])->name('api.sensor-alerts.acknowledge');

    // Notification Preferences routes
    Route::get('notifications/preferences', [NotificationController::class, 'getPreferences'])->name('api.notifications.preferences');
    Route::put('notifications/preferences', [NotificationController::class, 'updatePreferences'])->name('api.notifications.update-preferences');

    // ========== Advanced Analytics & Custom Dashboards (Phase 9) ==========

    // Advanced Analytics routes
    Route::prefix('analytics')->name('api.analytics.')->group(function () {
        Route::get('mtbf', [AnalyticsController::class, 'mtbf'])->name('mtbf');
        Route::get('mttr', [AnalyticsController::class, 'mttr'])->name('mttr');
        Route::get('pareto', [AnalyticsController::class, 'pareto'])->name('pareto');
        Route::get('predictions', [AnalyticsController::class, 'predictions'])->name('predictions');
        Route::get('failure-modes', [AnalyticsController::class, 'failureModes'])->name('failure-modes');
        Route::get('root-cause-trends', [AnalyticsController::class, 'rootCauseTrends'])->name('root-cause-trends');
        Route::get('effectiveness', [AnalyticsController::class, 'effectiveness'])->name('effectiveness');
        Route::get('dashboard', [AnalyticsController::class, 'dashboard'])->name('dashboard');
    });

    // Custom Dashboard routes
    Route::apiResource('custom-dashboards', CustomDashboardController::class)->names([
        'index' => 'api.custom-dashboards.index',
        'store' => 'api.custom-dashboards.store',
        'show' => 'api.custom-dashboards.show',
        'update' => 'api.custom-dashboards.update',
        'destroy' => 'api.custom-dashboards.destroy',
    ]);
    Route::post('custom-dashboards/{dashboard}/duplicate', [CustomDashboardController::class, 'duplicate'])->name('api.custom-dashboards.duplicate');
    Route::put('custom-dashboards/{dashboard}/layout', [CustomDashboardController::class, 'updateLayout'])->name('api.custom-dashboards.layout');

    // Widget routes
    Route::get('widgets/options', [WidgetController::class, 'options'])->name('api.widgets.options');
    Route::post('custom-dashboards/{dashboard}/widgets', [WidgetController::class, 'store'])->name('api.widgets.store');
    Route::put('widgets/{widget}', [WidgetController::class, 'update'])->name('api.widgets.update');
    Route::delete('widgets/{widget}', [WidgetController::class, 'destroy'])->name('api.widgets.destroy');
    Route::get('widgets/{widget}/data', [WidgetController::class, 'data'])->name('api.widgets.data');

    // Saved Filters routes
    Route::apiResource('saved-filters', SavedFilterController::class)->names([
        'index' => 'api.saved-filters.index',
        'store' => 'api.saved-filters.store',
        'show' => 'api.saved-filters.show',
        'update' => 'api.saved-filters.update',
        'destroy' => 'api.saved-filters.destroy',
    ]);
    Route::post('saved-filters/{savedFilter}/set-default', [SavedFilterController::class, 'setDefault'])->name('api.saved-filters.set-default');

    // Global Search routes
    Route::get('search', [GlobalSearchController::class, 'search'])->name('api.search');
    Route::get('search/suggestions', [GlobalSearchController::class, 'suggestions'])->name('api.search.suggestions');
});

// ========== Vendor Portal (Phase 8) - API Key Authentication ==========
Route::prefix('vendor')->middleware(\App\Http\Middleware\AuthenticateVendorApiKey::class)->name('api.vendor.')->group(function () {
    Route::get('purchase-orders', [\App\Http\Controllers\Api\VendorPortalController::class, 'index'])->name('purchase-orders.index');
    Route::get('purchase-orders/{purchaseOrder}', [\App\Http\Controllers\Api\VendorPortalController::class, 'show'])->name('purchase-orders.show');
    Route::put('purchase-orders/{purchaseOrder}/acknowledge', [\App\Http\Controllers\Api\VendorPortalController::class, 'acknowledge'])->name('purchase-orders.acknowledge');
    Route::put('purchase-orders/{purchaseOrder}/shipped', [\App\Http\Controllers\Api\VendorPortalController::class, 'markShipped'])->name('purchase-orders.shipped');
    Route::post('purchase-orders/{purchaseOrder}/tracking', [\App\Http\Controllers\Api\VendorPortalController::class, 'addTracking'])->name('purchase-orders.tracking');
    Route::post('purchase-orders/{purchaseOrder}/documents', [\App\Http\Controllers\Api\VendorPortalController::class, 'uploadDocument'])->name('purchase-orders.documents');
});

// ========== Public Webhooks (Phase 8) - No Authentication ==========
Route::prefix('webhooks')->name('webhooks.')->group(function () {
    Route::post('sensors/reading', [\App\Http\Controllers\Api\WebhookController::class, 'sensorReading'])->name('sensors.reading');
    Route::post('sensors/readings/batch', [\App\Http\Controllers\Api\WebhookController::class, 'sensorReadingBatch'])->name('sensors.readings.batch');
    Route::post('erp/purchase-order-update', [\App\Http\Controllers\Api\WebhookController::class, 'erpPurchaseOrderUpdate'])->name('erp.purchase-order-update');
});
