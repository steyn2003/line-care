<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Schedule preventive work order generation
Schedule::command('preventive:generate-work-orders')->daily()->at('06:00');

// Schedule low stock check and automatic reordering
Schedule::command('inventory:check-low-stock')->daily()->at('07:00');

// Phase 8: Integrations & Automation scheduled jobs

// Check for overdue work orders and send notifications (every 2 hours during work hours)
Schedule::command('linecare:check-overdue-work-orders')
    ->cron('0 */2 * * *') // Every 2 hours
    ->withoutOverlapping()
    ->runInBackground();

// Check for low stock parts and notify managers (daily at 8 AM)
Schedule::command('linecare:check-low-stock-parts')
    ->dailyAt('08:00')
    ->withoutOverlapping();

// Sync ERP integrations based on their configured frequency
// Hourly sync for integrations set to 'hourly'
Schedule::command('linecare:sync-erp-integrations --action=all')
    ->hourly()
    ->withoutOverlapping()
    ->runInBackground();

// Daily sync as backup for all integrations
Schedule::command('linecare:sync-erp-integrations --action=all')
    ->dailyAt('03:00') // 3 AM when system is less busy
    ->withoutOverlapping()
    ->runInBackground();
