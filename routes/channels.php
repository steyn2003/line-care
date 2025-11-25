<?php

use App\Models\Machine;
use App\Models\Sensor;
use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

/**
 * Company-wide sensor readings channel.
 * Users can only subscribe to their own company's sensor data.
 */
Broadcast::channel('company.{companyId}.sensors', function ($user, $companyId) {
    return (int) $user->company_id === (int) $companyId;
});

/**
 * Company-wide alerts channel.
 * Users can only subscribe to their own company's alerts.
 */
Broadcast::channel('company.{companyId}.alerts', function ($user, $companyId) {
    return (int) $user->company_id === (int) $companyId;
});

/**
 * Individual sensor channel.
 * Users can only subscribe to sensors belonging to their company.
 */
Broadcast::channel('sensor.{sensorId}', function ($user, $sensorId) {
    $sensor = Sensor::find($sensorId);
    return $sensor && (int) $user->company_id === (int) $sensor->company_id;
});

/**
 * Machine-specific alerts channel.
 * Users can only subscribe to machines belonging to their company.
 */
Broadcast::channel('machine.{machineId}.alerts', function ($user, $machineId) {
    $machine = Machine::find($machineId);
    return $machine && (int) $user->company_id === (int) $machine->company_id;
});
