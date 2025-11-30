<?php

namespace App\Http\Controllers;

use App\Models\Machine;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;

class QrScanController extends Controller
{
    /**
     * Handle QR code scan and redirect to breakdown report form.
     */
    public function scan(string $qrToken): RedirectResponse
    {
        $machine = Machine::where('qr_token', $qrToken)->firstOrFail();

        $targetUrl = route('work-orders.report-breakdown', [
            'machine_id' => $machine->id,
        ]);

        // If not logged in, store intended URL and redirect to login
        if (! Auth::check()) {
            session(['url.intended' => $targetUrl]);

            return redirect()->route('login')
                ->with('info', __('Log in om een storing te melden voor :machine', ['machine' => $machine->name]));
        }

        // Verify user belongs to same company (multi-tenant check)
        if (Auth::user()->company_id !== $machine->company_id) {
            abort(403, __('Je hebt geen toegang tot deze machine.'));
        }

        return redirect($targetUrl);
    }
}
