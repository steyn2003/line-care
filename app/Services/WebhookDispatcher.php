<?php

namespace App\Services;

use App\Jobs\DispatchWebhookJob;
use App\Models\Company;
use App\Models\WebhookEndpoint;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;

class WebhookDispatcher
{
    /**
     * Dispatch webhooks for a given event
     */
    public function dispatch(string $event, Model $model, ?Company $company = null): void
    {
        // Get company from model if not provided
        if (!$company) {
            $company = $this->getCompanyFromModel($model);
        }

        if (!$company) {
            Log::warning("WebhookDispatcher: Could not determine company for event {$event}");
            return;
        }

        // Find all active webhooks for this company that subscribe to this event
        $webhooks = WebhookEndpoint::query()
            ->where('company_id', $company->id)
            ->where('is_active', true)
            ->get()
            ->filter(fn (WebhookEndpoint $webhook) => $webhook->subscribesToEvent($event));

        if ($webhooks->isEmpty()) {
            return;
        }

        // Build payload
        $payload = $this->buildPayload($event, $model);

        // Dispatch job for each webhook
        foreach ($webhooks as $webhook) {
            DispatchWebhookJob::dispatch($webhook, $event, $payload);
        }
    }

    /**
     * Dispatch webhooks for work order events
     */
    public function dispatchWorkOrderEvent(string $action, Model $workOrder): void
    {
        $this->dispatch("work_order.{$action}", $workOrder);
    }

    /**
     * Dispatch webhooks for machine events
     */
    public function dispatchMachineEvent(string $action, Model $machine): void
    {
        $this->dispatch("machine.{$action}", $machine);
    }

    /**
     * Dispatch webhooks for spare part events
     */
    public function dispatchSparePartEvent(string $action, Model $sparePart): void
    {
        $this->dispatch("spare_part.{$action}", $sparePart);
    }

    /**
     * Dispatch webhooks for preventive task events
     */
    public function dispatchPreventiveTaskEvent(string $action, Model $preventiveTask): void
    {
        $this->dispatch("preventive_task.{$action}", $preventiveTask);
    }

    /**
     * Dispatch webhooks for purchase order events
     */
    public function dispatchPurchaseOrderEvent(string $action, Model $purchaseOrder): void
    {
        $this->dispatch("purchase_order.{$action}", $purchaseOrder);
    }

    protected function getCompanyFromModel(Model $model): ?Company
    {
        if (method_exists($model, 'company')) {
            return $model->company;
        }

        if (isset($model->company_id)) {
            return Company::find($model->company_id);
        }

        return null;
    }

    protected function buildPayload(string $event, Model $model): array
    {
        $payload = [
            'event' => $event,
            'timestamp' => now()->toIso8601String(),
            'data' => $this->serializeModel($model),
        ];

        return $payload;
    }

    protected function serializeModel(Model $model): array
    {
        $data = $model->toArray();

        // Remove sensitive fields
        $sensitiveFields = ['password', 'secret', 'token', 'api_key'];
        foreach ($sensitiveFields as $field) {
            unset($data[$field]);
        }

        // Add model type
        $data['_type'] = class_basename($model);
        $data['_id'] = $model->getKey();

        return $data;
    }
}
