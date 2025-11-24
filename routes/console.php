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
