<?php

namespace App\Http\Controllers;

use App\Models\SensorAlert;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SensorAlertManagementController extends Controller
{
    /**
     * Display a listing of sensor alerts
     */
    public function index(Request $request): Response
    {
        $query = SensorAlert::where('company_id', $request->user()->company_id)
            ->with(['sensor', 'machine', 'workOrder']);

        // Filter by status
        if ($request->has('status')) {
            if ($request->status === 'unacknowledged') {
                $query->whereNull('acknowledged_at');
            } elseif ($request->status === 'acknowledged') {
                $query->whereNotNull('acknowledged_at');
            }
        }

        // Filter by alert type
        if ($request->has('alert_type')) {
            $query->where('alert_type', $request->alert_type);
        }

        // Filter by machine
        if ($request->has('machine_id')) {
            $query->where('machine_id', $request->machine_id);
        }

        $alerts = $query->orderBy('triggered_at', 'desc')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('IoT/Alerts/index', [
            'alerts' => $alerts,
            'filters' => $request->only(['status', 'alert_type', 'machine_id']),
        ]);
    }

    /**
     * Acknowledge a sensor alert
     */
    public function acknowledge(Request $request, SensorAlert $sensorAlert)
    {
        // Ensure user can only acknowledge their company's alerts
        if ($sensorAlert->company_id !== $request->user()->company_id) {
            abort(403);
        }

        if ($sensorAlert->isAcknowledged()) {
            return back()->with('info', 'Alert was already acknowledged');
        }

        $sensorAlert->acknowledge($request->user()->id);

        return back()->with('success', 'Alert acknowledged successfully');
    }
}
