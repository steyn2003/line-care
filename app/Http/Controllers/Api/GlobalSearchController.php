<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Machine;
use App\Models\WorkOrder;
use App\Models\SparePart;
use App\Models\User;
use App\Models\ProductionRun;
use App\Models\PurchaseOrder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GlobalSearchController extends Controller
{
    /**
     * Global search across all entities.
     *
     * GET /api/search
     */
    public function search(Request $request): JsonResponse
    {
        $request->validate([
            'q' => 'required|string|min:2|max:100',
            'types' => 'nullable|array',
            'types.*' => 'in:machines,work_orders,spare_parts,users,production_runs,purchase_orders',
            'limit' => 'nullable|integer|min:1|max:50',
        ]);

        $query = $request->q;
        $companyId = $request->user()->company_id;
        $types = $request->types ?? ['machines', 'work_orders', 'spare_parts', 'users', 'production_runs', 'purchase_orders'];
        $limit = $request->limit ?? 5;

        $results = [];

        if (in_array('machines', $types)) {
            $results['machines'] = $this->searchMachines($query, $companyId, $limit);
        }

        if (in_array('work_orders', $types)) {
            $results['work_orders'] = $this->searchWorkOrders($query, $companyId, $limit);
        }

        if (in_array('spare_parts', $types)) {
            $results['spare_parts'] = $this->searchSpareParts($query, $companyId, $limit);
        }

        if (in_array('users', $types)) {
            $results['users'] = $this->searchUsers($query, $companyId, $limit);
        }

        if (in_array('production_runs', $types)) {
            $results['production_runs'] = $this->searchProductionRuns($query, $companyId, $limit);
        }

        if (in_array('purchase_orders', $types)) {
            $results['purchase_orders'] = $this->searchPurchaseOrders($query, $companyId, $limit);
        }

        // Calculate total results
        $totalResults = array_sum(array_map(fn($r) => count($r), $results));

        return response()->json([
            'query' => $query,
            'total_results' => $totalResults,
            'results' => $results,
        ]);
    }

    /**
     * Search machines.
     */
    private function searchMachines(string $query, int $companyId, int $limit): array
    {
        return Machine::where('company_id', $companyId)
            ->where(function ($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                    ->orWhere('asset_tag', 'like', "%{$query}%")
                    ->orWhere('serial_number', 'like', "%{$query}%")
                    ->orWhere('manufacturer', 'like', "%{$query}%")
                    ->orWhere('model', 'like', "%{$query}%");
            })
            ->limit($limit)
            ->get()
            ->map(fn($m) => [
                'id' => $m->id,
                'name' => $m->name,
                'asset_tag' => $m->asset_tag,
                'status' => $m->status,
                'type' => 'machine',
                'url' => "/machines/{$m->id}",
            ])
            ->toArray();
    }

    /**
     * Search work orders.
     */
    private function searchWorkOrders(string $query, int $companyId, int $limit): array
    {
        return WorkOrder::where('company_id', $companyId)
            ->where(function ($q) use ($query) {
                $q->where('title', 'like', "%{$query}%")
                    ->orWhere('description', 'like', "%{$query}%")
                    ->orWhere('id', 'like', "%{$query}%");
            })
            ->with('machine:id,name')
            ->limit($limit)
            ->get()
            ->map(fn($wo) => [
                'id' => $wo->id,
                'title' => $wo->title,
                'machine' => $wo->machine?->name,
                'status' => $wo->status,
                'type' => 'work_order',
                'url' => "/work-orders/{$wo->id}",
            ])
            ->toArray();
    }

    /**
     * Search spare parts.
     */
    private function searchSpareParts(string $query, int $companyId, int $limit): array
    {
        return SparePart::where('company_id', $companyId)
            ->where(function ($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                    ->orWhere('part_number', 'like', "%{$query}%")
                    ->orWhere('description', 'like', "%{$query}%")
                    ->orWhere('manufacturer', 'like', "%{$query}%");
            })
            ->limit($limit)
            ->get()
            ->map(fn($sp) => [
                'id' => $sp->id,
                'name' => $sp->name,
                'part_number' => $sp->part_number,
                'status' => $sp->status,
                'type' => 'spare_part',
                'url' => "/spare-parts/{$sp->id}",
            ])
            ->toArray();
    }

    /**
     * Search users.
     */
    private function searchUsers(string $query, int $companyId, int $limit): array
    {
        return User::where('company_id', $companyId)
            ->where(function ($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                    ->orWhere('email', 'like', "%{$query}%");
            })
            ->limit($limit)
            ->get()
            ->map(fn($u) => [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'role' => $u->role,
                'type' => 'user',
                'url' => "/users/{$u->id}",
            ])
            ->toArray();
    }

    /**
     * Search production runs.
     */
    private function searchProductionRuns(string $query, int $companyId, int $limit): array
    {
        return ProductionRun::where('company_id', $companyId)
            ->where(function ($q) use ($query) {
                $q->whereHas('machine', fn($mq) => $mq->where('name', 'like', "%{$query}%"))
                    ->orWhereHas('product', fn($pq) => $pq->where('name', 'like', "%{$query}%"));
            })
            ->with(['machine:id,name', 'product:id,name'])
            ->limit($limit)
            ->get()
            ->map(fn($pr) => [
                'id' => $pr->id,
                'machine' => $pr->machine?->name,
                'product' => $pr->product?->name,
                'oee' => $pr->oee_pct ? round($pr->oee_pct, 1) . '%' : null,
                'type' => 'production_run',
                'url' => "/production/runs/{$pr->id}",
            ])
            ->toArray();
    }

    /**
     * Search purchase orders.
     */
    private function searchPurchaseOrders(string $query, int $companyId, int $limit): array
    {
        return PurchaseOrder::where('company_id', $companyId)
            ->where(function ($q) use ($query) {
                $q->where('po_number', 'like', "%{$query}%")
                    ->orWhereHas('supplier', fn($sq) => $sq->where('name', 'like', "%{$query}%"));
            })
            ->with('supplier:id,name')
            ->limit($limit)
            ->get()
            ->map(fn($po) => [
                'id' => $po->id,
                'po_number' => $po->po_number,
                'supplier' => $po->supplier?->name,
                'status' => $po->status,
                'type' => 'purchase_order',
                'url' => "/purchase-orders/{$po->id}",
            ])
            ->toArray();
    }

    /**
     * Get search suggestions (autocomplete).
     *
     * GET /api/search/suggestions
     */
    public function suggestions(Request $request): JsonResponse
    {
        $request->validate([
            'q' => 'required|string|min:1|max:50',
        ]);

        $query = $request->q;
        $companyId = $request->user()->company_id;

        $suggestions = collect();

        // Get machine names
        $machines = Machine::where('company_id', $companyId)
            ->where('name', 'like', "%{$query}%")
            ->limit(3)
            ->pluck('name');
        $suggestions = $suggestions->merge($machines->map(fn($n) => ['text' => $n, 'type' => 'machine']));

        // Get part numbers
        $parts = SparePart::where('company_id', $companyId)
            ->where(function ($q) use ($query) {
                $q->where('part_number', 'like', "%{$query}%")
                    ->orWhere('name', 'like', "%{$query}%");
            })
            ->limit(3)
            ->get(['part_number', 'name']);
        $suggestions = $suggestions->merge($parts->map(fn($p) => ['text' => $p->part_number . ' - ' . $p->name, 'type' => 'part']));

        // Get user names
        $users = User::where('company_id', $companyId)
            ->where('name', 'like', "%{$query}%")
            ->limit(2)
            ->pluck('name');
        $suggestions = $suggestions->merge($users->map(fn($n) => ['text' => $n, 'type' => 'user']));

        return response()->json([
            'suggestions' => $suggestions->take(10)->values(),
        ]);
    }
}
