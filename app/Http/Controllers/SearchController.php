<?php

namespace App\Http\Controllers;

use App\Models\Machine;
use App\Models\PreventiveTask;
use App\Models\PurchaseOrder;
use App\Models\SparePart;
use App\Models\Supplier;
use App\Models\User;
use App\Models\WorkOrder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    /**
     * All available pages/screens for navigation.
     */
    private array $pages = [
        // Overview
        ['title' => 'Dashboard', 'subtitle' => 'Main dashboard', 'url' => '/dashboard', 'keywords' => ['dashboard', 'home', 'overview', 'main']],
        ['title' => 'Notifications', 'subtitle' => 'View all notifications', 'url' => '/notifications', 'keywords' => ['notifications', 'alerts', 'messages']],

        // Maintenance
        ['title' => 'Machines', 'subtitle' => 'Manage machines', 'url' => '/machines', 'keywords' => ['machines', 'equipment', 'assets']],
        ['title' => 'Add Machine', 'subtitle' => 'Create new machine', 'url' => '/machines/create', 'keywords' => ['add machine', 'new machine', 'create machine']],
        ['title' => 'Work Orders', 'subtitle' => 'View all work orders', 'url' => '/work-orders', 'keywords' => ['work orders', 'wo', 'maintenance', 'repairs']],
        ['title' => 'Report Breakdown', 'subtitle' => 'Quick breakdown report', 'url' => '/work-orders/report-breakdown', 'keywords' => ['breakdown', 'report', 'emergency', 'urgent']],
        ['title' => 'Preventive Tasks', 'subtitle' => 'Preventive maintenance tasks', 'url' => '/preventive-tasks', 'keywords' => ['preventive', 'pm', 'scheduled', 'maintenance', 'tasks']],
        ['title' => 'Add Preventive Task', 'subtitle' => 'Create new PM task', 'url' => '/preventive-tasks/create', 'keywords' => ['add preventive', 'new pm', 'create task']],

        // Production & OEE
        ['title' => 'OEE Dashboard', 'subtitle' => 'Overall equipment effectiveness', 'url' => '/oee/dashboard', 'keywords' => ['oee', 'effectiveness', 'production', 'performance']],
        ['title' => 'Production Runs', 'subtitle' => 'View production runs', 'url' => '/production/runs', 'keywords' => ['production', 'runs', 'manufacturing']],
        ['title' => 'OEE Trends', 'subtitle' => 'OEE trends over time', 'url' => '/oee/trends', 'keywords' => ['oee trends', 'performance trends']],
        ['title' => 'Products', 'subtitle' => 'Manage products', 'url' => '/products', 'keywords' => ['products', 'items', 'goods']],
        ['title' => 'Shifts', 'subtitle' => 'Manage work shifts', 'url' => '/shifts', 'keywords' => ['shifts', 'schedule', 'time']],

        // Inventory
        ['title' => 'Spare Parts', 'subtitle' => 'Inventory management', 'url' => '/spare-parts', 'keywords' => ['spare parts', 'inventory', 'stock', 'parts']],
        ['title' => 'Add Spare Part', 'subtitle' => 'Create new spare part', 'url' => '/spare-parts/create', 'keywords' => ['add part', 'new part', 'create part']],
        ['title' => 'Low Stock Alerts', 'subtitle' => 'Parts needing reorder', 'url' => '/inventory/low-stock', 'keywords' => ['low stock', 'reorder', 'alerts', 'out of stock']],
        ['title' => 'Purchase Orders', 'subtitle' => 'Manage purchase orders', 'url' => '/purchase-orders', 'keywords' => ['purchase orders', 'po', 'orders', 'buying']],
        ['title' => 'Create Purchase Order', 'subtitle' => 'New purchase order', 'url' => '/purchase-orders/create', 'keywords' => ['create po', 'new order', 'buy']],
        ['title' => 'Suppliers', 'subtitle' => 'Manage suppliers', 'url' => '/suppliers', 'keywords' => ['suppliers', 'vendors', 'providers']],

        // Cost Management
        ['title' => 'Cost Dashboard', 'subtitle' => 'Maintenance costs overview', 'url' => '/costs/dashboard', 'keywords' => ['costs', 'expenses', 'budget', 'money']],
        ['title' => 'Cost Report', 'subtitle' => 'Detailed cost report', 'url' => '/costs/report', 'keywords' => ['cost report', 'expenses report']],
        ['title' => 'Budget Management', 'subtitle' => 'Manage budgets', 'url' => '/costs/budget', 'keywords' => ['budget', 'budgets', 'planning']],
        ['title' => 'Labor Rates', 'subtitle' => 'Manage labor rates', 'url' => '/costs/labor-rates', 'keywords' => ['labor', 'rates', 'hourly', 'wages']],

        // Analytics
        ['title' => 'Analytics Dashboard', 'subtitle' => 'Advanced analytics', 'url' => '/analytics', 'keywords' => ['analytics', 'insights', 'data', 'reports']],
        ['title' => 'Reliability (MTBF/MTTR)', 'subtitle' => 'Reliability metrics', 'url' => '/analytics/reliability', 'keywords' => ['mtbf', 'mttr', 'reliability', 'mean time']],
        ['title' => 'Pareto Analysis', 'subtitle' => '80/20 analysis', 'url' => '/analytics/pareto', 'keywords' => ['pareto', '80/20', 'analysis']],
        ['title' => 'Failure Predictions', 'subtitle' => 'Predictive maintenance', 'url' => '/analytics/predictions', 'keywords' => ['predictions', 'predictive', 'forecast']],
        ['title' => 'Failure Modes', 'subtitle' => 'Failure mode analysis', 'url' => '/analytics/failure-modes', 'keywords' => ['failure modes', 'fmea', 'failures']],

        // Dashboards & Reports
        ['title' => 'Custom Dashboards', 'subtitle' => 'My dashboards', 'url' => '/dashboards', 'keywords' => ['dashboards', 'custom', 'my dashboards']],
        ['title' => 'Create Dashboard', 'subtitle' => 'New custom dashboard', 'url' => '/dashboards/create', 'keywords' => ['create dashboard', 'new dashboard']],
        ['title' => 'Downtime Report', 'subtitle' => 'Downtime analysis', 'url' => '/reports/downtime', 'keywords' => ['downtime', 'report', 'stoppages']],

        // IoT & Sensors
        ['title' => 'IoT Dashboard', 'subtitle' => 'Sensor monitoring', 'url' => '/iot/dashboard', 'keywords' => ['iot', 'sensors', 'monitoring', 'real-time']],
        ['title' => 'Sensors', 'subtitle' => 'Manage sensors', 'url' => '/iot/sensors', 'keywords' => ['sensors', 'devices', 'iot']],
        ['title' => 'Sensor Alerts', 'subtitle' => 'View sensor alerts', 'url' => '/iot/alerts', 'keywords' => ['sensor alerts', 'iot alerts']],

        // Settings
        ['title' => 'Locations', 'subtitle' => 'Manage locations', 'url' => '/locations', 'keywords' => ['locations', 'sites', 'places']],
        ['title' => 'Cause Categories', 'subtitle' => 'Breakdown causes', 'url' => '/cause-categories', 'keywords' => ['causes', 'categories', 'reasons']],
        ['title' => 'Users', 'subtitle' => 'Manage users', 'url' => '/users', 'keywords' => ['users', 'team', 'people', 'staff']],
        ['title' => 'Integrations', 'subtitle' => 'ERP & system integrations', 'url' => '/settings/integrations', 'keywords' => ['integrations', 'erp', 'connect', 'sync']],
        ['title' => 'Vendor API Keys', 'subtitle' => 'Manage vendor access', 'url' => '/settings/vendor-api-keys', 'keywords' => ['vendor', 'api', 'keys', 'access']],
    ];

    /**
     * Global search across all entities.
     * Returns JSON for the command palette component.
     */
    public function search(Request $request): JsonResponse
    {
        $request->validate([
            'q' => 'required|string|min:2|max:100',
        ]);

        $query = $request->q;
        $companyId = $request->user()->company_id;
        $limit = 5;

        $results = [
            'pages' => $this->searchPages($query),
            'machines' => $this->searchMachines($query, $companyId, $limit),
            'work_orders' => $this->searchWorkOrders($query, $companyId, $limit),
            'preventive_tasks' => $this->searchPreventiveTasks($query, $companyId, $limit),
            'spare_parts' => $this->searchSpareParts($query, $companyId, $limit),
            'purchase_orders' => $this->searchPurchaseOrders($query, $companyId, $limit),
            'suppliers' => $this->searchSuppliers($query, $companyId, $limit),
            'users' => $this->searchUsers($query, $companyId, $limit),
        ];

        $total = array_sum(array_map(fn($r) => count($r), $results));

        return response()->json([
            'query' => $query,
            'total' => $total,
            'results' => $results,
        ]);
    }

    private function searchPages(string $query): array
    {
        $query = strtolower($query);
        $matches = [];

        foreach ($this->pages as $page) {
            $score = 0;

            // Check title
            if (stripos($page['title'], $query) !== false) {
                $score += 10;
            }

            // Check subtitle
            if (stripos($page['subtitle'], $query) !== false) {
                $score += 5;
            }

            // Check keywords
            foreach ($page['keywords'] as $keyword) {
                if (stripos($keyword, $query) !== false) {
                    $score += 3;
                }
                if ($keyword === $query) {
                    $score += 10;
                }
            }

            if ($score > 0) {
                $matches[] = [
                    'id' => md5($page['url']),
                    'type' => 'page',
                    'title' => $page['title'],
                    'subtitle' => $page['subtitle'],
                    'url' => $page['url'],
                    'score' => $score,
                ];
            }
        }

        // Sort by score and limit
        usort($matches, fn($a, $b) => $b['score'] - $a['score']);

        return array_slice($matches, 0, 5);
    }

    private function searchMachines(string $query, int $companyId, int $limit): array
    {
        return Machine::where('company_id', $companyId)
            ->where(function ($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                    ->orWhere('code', 'like', "%{$query}%")
                    ->orWhere('serial_number', 'like', "%{$query}%");
            })
            ->limit($limit)
            ->get()
            ->map(fn($m) => [
                'id' => $m->id,
                'type' => 'machine',
                'title' => $m->name,
                'subtitle' => $m->code,
                'url' => "/machines/{$m->id}",
            ])
            ->toArray();
    }

    private function searchWorkOrders(string $query, int $companyId, int $limit): array
    {
        return WorkOrder::where('company_id', $companyId)
            ->where(function ($q) use ($query) {
                $q->where('title', 'like', "%{$query}%")
                    ->orWhere('description', 'like', "%{$query}%")
                    ->orWhere('id', $query);
            })
            ->with('machine:id,name')
            ->limit($limit)
            ->get()
            ->map(fn($wo) => [
                'id' => $wo->id,
                'type' => 'work_order',
                'title' => $wo->title,
                'subtitle' => $wo->machine?->name ?? 'WO #' . $wo->id,
                'url' => "/work-orders/{$wo->id}",
            ])
            ->toArray();
    }

    private function searchPreventiveTasks(string $query, int $companyId, int $limit): array
    {
        return PreventiveTask::where('company_id', $companyId)
            ->where(function ($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                    ->orWhere('description', 'like', "%{$query}%");
            })
            ->with('machine:id,name')
            ->limit($limit)
            ->get()
            ->map(fn($pt) => [
                'id' => $pt->id,
                'type' => 'preventive_task',
                'title' => $pt->name,
                'subtitle' => $pt->machine?->name ?? 'PM Task',
                'url' => "/preventive-tasks/{$pt->id}",
            ])
            ->toArray();
    }

    private function searchSpareParts(string $query, int $companyId, int $limit): array
    {
        return SparePart::where('company_id', $companyId)
            ->where(function ($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                    ->orWhere('part_number', 'like', "%{$query}%")
                    ->orWhere('description', 'like', "%{$query}%");
            })
            ->limit($limit)
            ->get()
            ->map(fn($sp) => [
                'id' => $sp->id,
                'type' => 'spare_part',
                'title' => $sp->name,
                'subtitle' => $sp->part_number,
                'url' => "/spare-parts/{$sp->id}",
            ])
            ->toArray();
    }

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
                'type' => 'purchase_order',
                'title' => $po->po_number,
                'subtitle' => $po->supplier?->name,
                'url' => "/purchase-orders/{$po->id}",
            ])
            ->toArray();
    }

    private function searchSuppliers(string $query, int $companyId, int $limit): array
    {
        return Supplier::where('company_id', $companyId)
            ->where(function ($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                    ->orWhere('email', 'like', "%{$query}%")
                    ->orWhere('contact_person', 'like', "%{$query}%");
            })
            ->limit($limit)
            ->get()
            ->map(fn($s) => [
                'id' => $s->id,
                'type' => 'supplier',
                'title' => $s->name,
                'subtitle' => $s->contact_person,
                'url' => "/suppliers",
            ])
            ->toArray();
    }

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
                'type' => 'user',
                'title' => $u->name,
                'subtitle' => $u->email,
                'url' => "/users",
            ])
            ->toArray();
    }
}
