<?php

namespace App\Http\Controllers;

use App\Models\Integration;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class IntegrationController extends Controller
{
    /**
     * Display a listing of integrations
     */
    public function index(Request $request): Response
    {
        $integrations = Integration::where('company_id', $request->user()->company_id)
            ->orderBy('integration_type')
            ->orderBy('provider')
            ->get();

        return Inertia::render('settings/integrations/index', [
            'integrations' => $integrations,
        ]);
    }

    /**
     * Show the form for creating a new integration
     */
    public function create(Request $request): Response
    {
        return Inertia::render('settings/integrations/create', [
            'integrationTypes' => $this->getIntegrationTypes(),
            'providers' => $this->getProviders(),
        ]);
    }

    /**
     * Store a newly created integration
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'integration_type' => 'required|in:erp,iot,email,sms',
            'provider' => 'required|string|max:255',
            'config' => 'required|array',
            'is_enabled' => 'boolean',
            'sync_frequency' => 'nullable|in:real_time,hourly,daily,weekly,manual',
        ]);

        $integration = Integration::create([
            'company_id' => $request->user()->company_id,
            'integration_type' => $validated['integration_type'],
            'provider' => $validated['provider'],
            'config' => $validated['config'],
            'is_enabled' => $validated['is_enabled'] ?? false,
            'sync_frequency' => $validated['sync_frequency'] ?? 'manual',
        ]);

        return redirect()->route('integrations.index')
            ->with('success', 'Integration created successfully');
    }

    /**
     * Show the form for editing the specified integration
     */
    public function edit(Request $request, Integration $integration): Response
    {
        // Ensure user can only edit their company's integrations
        if ($integration->company_id !== $request->user()->company_id) {
            abort(403);
        }

        return Inertia::render('settings/integrations/edit', [
            'integration' => $integration,
            'integrationTypes' => $this->getIntegrationTypes(),
            'providers' => $this->getProviders(),
        ]);
    }

    /**
     * Update the specified integration
     */
    public function update(Request $request, Integration $integration)
    {
        // Ensure user can only update their company's integrations
        if ($integration->company_id !== $request->user()->company_id) {
            abort(403);
        }

        $validated = $request->validate([
            'provider' => 'sometimes|string|max:255',
            'config' => 'sometimes|array',
            'is_enabled' => 'sometimes|boolean',
            'sync_frequency' => 'nullable|in:real_time,hourly,daily,weekly,manual',
        ]);

        $integration->update($validated);

        return back()->with('success', 'Integration updated successfully');
    }

    /**
     * Remove the specified integration
     */
    public function destroy(Request $request, Integration $integration)
    {
        // Ensure user can only delete their company's integrations
        if ($integration->company_id !== $request->user()->company_id) {
            abort(403);
        }

        $integration->delete();

        return redirect()->route('integrations.index')
            ->with('success', 'Integration deleted successfully');
    }

    /**
     * Get available integration types
     */
    protected function getIntegrationTypes(): array
    {
        return [
            ['value' => 'erp', 'label' => 'ERP System', 'description' => 'Connect to SAP, Oracle, NetSuite, Odoo, or custom ERP'],
            ['value' => 'iot', 'label' => 'IoT Sensors', 'description' => 'Receive sensor data via MQTT, REST, OPC UA, or Modbus'],
            ['value' => 'email', 'label' => 'Email Notifications', 'description' => 'Configure SMTP for email notifications'],
            ['value' => 'sms', 'label' => 'SMS Notifications', 'description' => 'Send SMS via Twilio, AWS SNS, or other providers'],
        ];
    }

    /**
     * Get available providers per integration type
     */
    protected function getProviders(): array
    {
        return [
            'erp' => ['SAP', 'Oracle NetSuite', 'Microsoft Dynamics', 'Odoo', 'Custom REST API'],
            'iot' => ['MQTT', 'REST Webhook', 'OPC UA', 'Modbus TCP'],
            'email' => ['SMTP', 'SendGrid', 'Mailgun', 'Amazon SES'],
            'sms' => ['Twilio', 'AWS SNS', 'Nexmo/Vonage', 'MessageBird'],
        ];
    }
}
