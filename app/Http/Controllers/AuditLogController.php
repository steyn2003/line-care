<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AuditLogController extends Controller
{
    /**
     * Display the audit log index page.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $isSuperAdmin = $user->isSuperAdmin();

        // Only managers and superadmins can view audit logs
        if (!$isSuperAdmin && !$user->isManager()) {
            abort(403, 'Unauthorized');
        }

        $query = AuditLog::with('user:id,name,email')
            ->when(!$isSuperAdmin, fn ($q) => $q->where('company_id', $user->company_id))
            ->when($request->model_type, fn ($q, $type) => $q->forModelType($type))
            ->when($request->model_id, fn ($q, $id) => $q->where('model_id', $id))
            ->when($request->user_id, fn ($q, $id) => $q->where('user_id', $id))
            ->when($request->action, fn ($q, $action) => $q->forAction($action))
            ->when($request->date_from, fn ($q, $date) => $q->whereDate('created_at', '>=', $date))
            ->when($request->date_to, fn ($q, $date) => $q->whereDate('created_at', '<=', $date))
            ->latest('created_at')
            ->paginate(50)
            ->through(fn ($log) => [
                'id' => $log->id,
                'action' => $log->action,
                'action_label' => $log->action_label,
                'model_type' => $log->model_type,
                'model_name' => $log->model_name,
                'model_id' => $log->model_id,
                'old_values' => $log->old_values,
                'new_values' => $log->new_values,
                'changes_summary' => $log->changes_summary,
                'user' => $log->user ? [
                    'id' => $log->user->id,
                    'name' => $log->user->name,
                ] : null,
                'ip_address' => $log->ip_address,
                'created_at' => $log->created_at->toIso8601String(),
            ]);

        // Get available model types for filter
        $modelTypes = AuditLog::query()
            ->when(!$isSuperAdmin, fn ($q) => $q->where('company_id', $user->company_id))
            ->distinct()
            ->pluck('model_type')
            ->map(fn ($type) => [
                'value' => $type,
                'label' => class_basename($type),
            ]);

        // Get available actions for filter
        $actions = AuditLog::query()
            ->when(!$isSuperAdmin, fn ($q) => $q->where('company_id', $user->company_id))
            ->distinct()
            ->pluck('action')
            ->map(fn ($action) => [
                'value' => $action,
                'label' => ucwords(str_replace(['.', '_'], ' ', $action)),
            ]);

        // Get users for filter
        $users = $user->company
            ? $user->company->users()->select('id', 'name')->orderBy('name')->get()
            : collect();

        return Inertia::render('audit/index', [
            'logs' => $query,
            'filters' => [
                'model_type' => $request->model_type,
                'model_id' => $request->model_id,
                'user_id' => $request->user_id,
                'action' => $request->action,
                'date_from' => $request->date_from,
                'date_to' => $request->date_to,
            ],
            'modelTypes' => $modelTypes,
            'actions' => $actions,
            'users' => $users,
        ]);
    }

    /**
     * Get audit logs for a specific model (API endpoint).
     */
    public function forModel(Request $request, string $modelType, int $modelId)
    {
        $user = $request->user();
        $isSuperAdmin = $user->isSuperAdmin();

        // Map short model names to full class names
        $fullModelType = $this->resolveModelType($modelType);

        $logs = AuditLog::with('user:id,name')
            ->where('model_type', $fullModelType)
            ->where('model_id', $modelId)
            ->when(!$isSuperAdmin, fn ($q) => $q->where('company_id', $user->company_id))
            ->latest('created_at')
            ->get()
            ->map(fn ($log) => [
                'id' => $log->id,
                'action' => $log->action,
                'action_label' => $log->action_label,
                'old_values' => $log->old_values,
                'new_values' => $log->new_values,
                'changes_summary' => $log->changes_summary,
                'user' => $log->user ? [
                    'id' => $log->user->id,
                    'name' => $log->user->name,
                ] : null,
                'ip_address' => $log->ip_address,
                'created_at' => $log->created_at->toIso8601String(),
            ]);

        return response()->json($logs);
    }

    /**
     * Resolve a short model type name to a full class name.
     */
    protected function resolveModelType(string $modelType): string
    {
        // If already a full class name, return as-is
        if (str_contains($modelType, '\\')) {
            return $modelType;
        }

        // Map of short names to model classes
        $modelMap = [
            'work-order' => \App\Models\WorkOrder::class,
            'work_order' => \App\Models\WorkOrder::class,
            'workorder' => \App\Models\WorkOrder::class,
            'machine' => \App\Models\Machine::class,
            'user' => \App\Models\User::class,
            'company' => \App\Models\Company::class,
            'spare-part' => \App\Models\SparePart::class,
            'spare_part' => \App\Models\SparePart::class,
            'sparepart' => \App\Models\SparePart::class,
            'purchase-order' => \App\Models\PurchaseOrder::class,
            'purchase_order' => \App\Models\PurchaseOrder::class,
            'purchaseorder' => \App\Models\PurchaseOrder::class,
            'preventive-task' => \App\Models\PreventiveTask::class,
            'preventive_task' => \App\Models\PreventiveTask::class,
            'preventivetask' => \App\Models\PreventiveTask::class,
            'location' => \App\Models\Location::class,
            'supplier' => \App\Models\Supplier::class,
        ];

        $key = strtolower($modelType);

        return $modelMap[$key] ?? "App\\Models\\{$modelType}";
    }
}
