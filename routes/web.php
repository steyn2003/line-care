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
    Route::post('machines', [\App\Http\Controllers\MachineController::class, 'store'])->name('machines.store');
    Route::get('machines/{machine}', [\App\Http\Controllers\MachineController::class, 'show'])->name('machines.show');

    // Work Order routes
    Route::get('work-orders', [\App\Http\Controllers\WorkOrderController::class, 'index'])->name('work-orders.index');
    Route::get('work-orders/report-breakdown', [\App\Http\Controllers\WorkOrderController::class, 'reportBreakdown'])->name('work-orders.report-breakdown');
    Route::post('work-orders', [\App\Http\Controllers\WorkOrderController::class, 'store'])->name('work-orders.store');
    Route::get('work-orders/{workOrder}', [\App\Http\Controllers\WorkOrderController::class, 'show'])->name('work-orders.show');
});

require __DIR__.'/settings.php';
