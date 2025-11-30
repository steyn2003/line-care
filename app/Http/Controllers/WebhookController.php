<?php

namespace App\Http\Controllers;

use App\Models\WebhookDelivery;
use App\Models\WebhookEndpoint;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class WebhookController extends Controller
{
    public function index(): Response
    {
        $user = Auth::user();

        $this->authorize('viewAny', WebhookEndpoint::class);

        $webhooks = WebhookEndpoint::query()
            ->where('company_id', $user->company_id)
            ->withCount('deliveries')
            ->latest()
            ->get();

        return Inertia::render('settings/webhooks/index', [
            'webhooks' => $webhooks,
            'availableEvents' => WebhookEndpoint::EVENTS,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->authorize('create', WebhookEndpoint::class);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'url' => ['required', 'url', 'max:2048'],
            'events' => ['required', 'array', 'min:1'],
            'events.*' => ['string', 'in:' . implode(',', array_keys(WebhookEndpoint::EVENTS))],
            'secret' => ['nullable', 'string', 'max:255'],
        ]);

        $user = Auth::user();

        WebhookEndpoint::create([
            'company_id' => $user->company_id,
            'name' => $validated['name'],
            'url' => $validated['url'],
            'events' => $validated['events'],
            'secret' => $validated['secret'] ?? Str::random(32),
            'is_active' => true,
        ]);

        return redirect()->route('webhooks.index')
            ->with('success', __('Webhook created successfully.'));
    }

    public function show(WebhookEndpoint $webhook): Response
    {
        $this->authorize('view', $webhook);

        $deliveries = WebhookDelivery::query()
            ->where('webhook_endpoint_id', $webhook->id)
            ->latest()
            ->limit(50)
            ->get();

        return Inertia::render('settings/webhooks/show', [
            'webhook' => $webhook,
            'deliveries' => $deliveries,
            'availableEvents' => WebhookEndpoint::EVENTS,
        ]);
    }

    public function update(Request $request, WebhookEndpoint $webhook): RedirectResponse
    {
        $this->authorize('update', $webhook);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'url' => ['required', 'url', 'max:2048'],
            'events' => ['required', 'array', 'min:1'],
            'events.*' => ['string', 'in:' . implode(',', array_keys(WebhookEndpoint::EVENTS))],
            'is_active' => ['boolean'],
        ]);

        $webhook->update($validated);

        return redirect()->route('webhooks.index')
            ->with('success', __('Webhook updated successfully.'));
    }

    public function destroy(WebhookEndpoint $webhook): RedirectResponse
    {
        $this->authorize('delete', $webhook);

        $webhook->delete();

        return redirect()->route('webhooks.index')
            ->with('success', __('Webhook deleted successfully.'));
    }

    public function regenerateSecret(WebhookEndpoint $webhook): RedirectResponse
    {
        $this->authorize('update', $webhook);

        $webhook->update([
            'secret' => Str::random(32),
        ]);

        return redirect()->route('webhooks.show', $webhook)
            ->with('success', __('Webhook secret regenerated successfully.'));
    }

    public function toggle(WebhookEndpoint $webhook): RedirectResponse
    {
        $this->authorize('update', $webhook);

        $webhook->update([
            'is_active' => !$webhook->is_active,
            'failure_count' => $webhook->is_active ? $webhook->failure_count : 0,
        ]);

        $status = $webhook->is_active ? 'activated' : 'deactivated';

        return redirect()->route('webhooks.index')
            ->with('success', __("Webhook {$status} successfully."));
    }

    public function test(WebhookEndpoint $webhook): RedirectResponse
    {
        $this->authorize('update', $webhook);

        // Dispatch a test webhook
        $payload = [
            'event' => 'test',
            'timestamp' => now()->toIso8601String(),
            'data' => [
                'message' => 'This is a test webhook from LineCare',
                'webhook_id' => $webhook->id,
                'webhook_name' => $webhook->name,
            ],
        ];

        \App\Jobs\DispatchWebhookJob::dispatch($webhook, 'test', $payload);

        return redirect()->route('webhooks.show', $webhook)
            ->with('success', __('Test webhook dispatched. Check delivery history.'));
    }
}
