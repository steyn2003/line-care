<?php

namespace App\Services;

use App\Models\AuditLog;
use App\Models\Company;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class AuditService
{
    /**
     * Log an action on a model.
     */
    public function log(
        string $action,
        Model $model,
        ?array $oldValues = null,
        ?array $newValues = null,
        ?User $user = null
    ): AuditLog {
        $user = $user ?? Auth::user();

        return AuditLog::create([
            'company_id' => $this->resolveCompanyId($model, $user),
            'user_id' => $user?->id,
            'action' => $action,
            'model_type' => get_class($model),
            'model_id' => $model->id,
            'old_values' => $oldValues,
            'new_values' => $newValues,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }

    /**
     * Log a model creation.
     */
    public function logCreated(Model $model, ?array $attributes = null): AuditLog
    {
        $action = $this->getActionName($model, 'created');

        return $this->log(
            $action,
            $model,
            null,
            $attributes ?? $this->getAuditableAttributes($model)
        );
    }

    /**
     * Log a model update.
     */
    public function logUpdated(Model $model, array $oldValues, ?array $newValues = null): AuditLog
    {
        $action = $this->getActionName($model, 'updated');

        // Filter to only changed values
        $changes = $newValues ?? $model->getChanges();
        $filteredOld = array_intersect_key($oldValues, $changes);

        return $this->log(
            $action,
            $model,
            $filteredOld,
            $changes
        );
    }

    /**
     * Log a model deletion.
     */
    public function logDeleted(Model $model): AuditLog
    {
        $action = $this->getActionName($model, 'deleted');

        return $this->log(
            $action,
            $model,
            $this->getAuditableAttributes($model),
            null
        );
    }

    /**
     * Log a status change.
     */
    public function logStatusChange(Model $model, string $oldStatus, string $newStatus): AuditLog
    {
        $action = $this->getActionName($model, 'status_changed');

        return $this->log(
            $action,
            $model,
            ['status' => $oldStatus],
            ['status' => $newStatus]
        );
    }

    /**
     * Log an assignment change.
     */
    public function logAssigned(Model $model, ?int $oldUserId, ?int $newUserId): AuditLog
    {
        $action = $this->getActionName($model, 'assigned');

        $oldUser = $oldUserId ? User::find($oldUserId)?->name : null;
        $newUser = $newUserId ? User::find($newUserId)?->name : null;

        return $this->log(
            $action,
            $model,
            ['assigned_to' => $oldUser, 'assigned_to_id' => $oldUserId],
            ['assigned_to' => $newUser, 'assigned_to_id' => $newUserId]
        );
    }

    /**
     * Log a role change for a user.
     */
    public function logRoleChange(User $user, string $oldRole, string $newRole): AuditLog
    {
        return $this->log(
            'user.role_changed',
            $user,
            ['role' => $oldRole],
            ['role' => $newRole]
        );
    }

    /**
     * Log a plan change for a company.
     */
    public function logPlanChange(Company $company, string $oldPlan, string $newPlan): AuditLog
    {
        return $this->log(
            'company.plan_changed',
            $company,
            ['plan' => $oldPlan],
            ['plan' => $newPlan]
        );
    }

    /**
     * Log feature flag changes for a company.
     */
    public function logFeaturesUpdated(Company $company, ?array $oldFeatures, ?array $newFeatures): AuditLog
    {
        return $this->log(
            'company.features_updated',
            $company,
            ['feature_flags' => $oldFeatures],
            ['feature_flags' => $newFeatures]
        );
    }

    /**
     * Log a stock adjustment.
     */
    public function logStockAdjusted(
        Model $sparePart,
        int $oldQuantity,
        int $newQuantity,
        ?string $reason = null
    ): AuditLog {
        return $this->log(
            'spare_part.stock_adjusted',
            $sparePart,
            ['quantity' => $oldQuantity],
            ['quantity' => $newQuantity, 'reason' => $reason]
        );
    }

    /**
     * Log stock consumption (parts used on work order).
     */
    public function logStockConsumed(
        Model $sparePart,
        int $quantity,
        ?Model $workOrder = null
    ): AuditLog {
        return $this->log(
            'spare_part.stock_consumed',
            $sparePart,
            null,
            [
                'quantity_consumed' => $quantity,
                'work_order_id' => $workOrder?->id,
            ]
        );
    }

    /**
     * Log stock received from purchase order.
     */
    public function logStockReceived(
        Model $sparePart,
        int $quantity,
        ?Model $purchaseOrder = null
    ): AuditLog {
        return $this->log(
            'spare_part.stock_received',
            $sparePart,
            null,
            [
                'quantity_received' => $quantity,
                'purchase_order_id' => $purchaseOrder?->id,
            ]
        );
    }

    /**
     * Log a custom action.
     */
    public function logCustom(
        string $action,
        Model $model,
        ?array $data = null
    ): AuditLog {
        return $this->log($action, $model, null, $data);
    }

    /**
     * Resolve the company ID from the model or user.
     */
    protected function resolveCompanyId(Model $model, ?User $user): ?int
    {
        // If the model is a Company, use its ID
        if ($model instanceof Company) {
            return $model->id;
        }

        // If the model has a company_id attribute
        if (isset($model->company_id)) {
            return $model->company_id;
        }

        // If the model belongs to a company
        if (method_exists($model, 'company') && $model->company) {
            return $model->company->id;
        }

        // Fall back to the user's company
        return $user?->company_id;
    }

    /**
     * Get the action name for a model.
     */
    protected function getActionName(Model $model, string $action): string
    {
        $modelName = strtolower(class_basename($model));
        $modelName = preg_replace('/([a-z])([A-Z])/', '$1_$2', $modelName);

        return "{$modelName}.{$action}";
    }

    /**
     * Get the auditable attributes from a model.
     */
    protected function getAuditableAttributes(Model $model): array
    {
        // If the model defines auditable attributes, use those
        if (method_exists($model, 'getAuditableAttributes')) {
            return $model->getAuditableAttributes();
        }

        // Otherwise, use all attributes except hidden ones
        $attributes = $model->attributesToArray();

        // Remove sensitive/technical fields
        $exclude = ['password', 'remember_token', 'two_factor_secret', 'two_factor_recovery_codes'];

        return array_diff_key($attributes, array_flip($exclude));
    }
}
