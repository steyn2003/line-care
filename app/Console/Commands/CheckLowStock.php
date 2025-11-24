<?php

namespace App\Console\Commands;

use App\Models\Company;
use App\Models\Notification;
use App\Models\PurchaseOrder;
use App\Models\SparePart;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class CheckLowStock extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'inventory:check-low-stock {--company= : Specific company ID to check}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check for low stock items and automatically create draft purchase orders grouped by supplier';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Checking for low stock items...');

        $companyId = $this->option('company');

        $query = Company::query();
        if ($companyId) {
            $query->where('id', $companyId);
        }

        $companies = $query->get();

        if ($companies->isEmpty()) {
            $this->warn('No companies found.');
            return 0;
        }

        $totalPosCreated = 0;

        foreach ($companies as $company) {
            $this->info("Processing company: {$company->name} (ID: {$company->id})");

            // Get low stock parts for this company
            $lowStockParts = $this->getLowStockParts($company->id);

            if ($lowStockParts->isEmpty()) {
                $this->info("  No low stock items found.");
                continue;
            }

            $this->info("  Found {$lowStockParts->count()} low stock items.");

            // Group parts by supplier
            $partsBySupplier = $lowStockParts->groupBy('supplier_id');

            // Get a manager/admin user to create POs (first manager found)
            $creator = User::where('company_id', $company->id)
                ->where('role', 'manager')
                ->first();

            if (!$creator) {
                // Fallback to any user in the company
                $creator = User::where('company_id', $company->id)->first();
            }

            if (!$creator) {
                $this->warn("  No users found for company {$company->name}. Skipping.");
                continue;
            }

            foreach ($partsBySupplier as $supplierId => $parts) {
                if (!$supplierId) {
                    $this->warn("  Skipping {$parts->count()} parts without supplier.");
                    continue;
                }

                try {
                    $po = $this->createPurchaseOrder($company->id, $supplierId, $parts, $creator->id);
                    $this->info("  Created PO {$po->po_number} for supplier ID {$supplierId} with {$parts->count()} parts.");

                    // Notify managers about the new PO
                    $this->notifyManagers($company->id, $po);

                    $totalPosCreated++;
                } catch (\Exception $e) {
                    $this->error("  Failed to create PO for supplier ID {$supplierId}: {$e->getMessage()}");
                }
            }
        }

        $this->info("\nCompleted! Total purchase orders created: {$totalPosCreated}");

        return 0;
    }

    /**
     * Get spare parts below reorder point.
     */
    protected function getLowStockParts(int $companyId)
    {
        return SparePart::with(['stocks', 'supplier'])
            ->where('company_id', $companyId)
            ->where('status', 'active')
            ->whereNotNull('supplier_id') // Only parts with suppliers
            ->where('reorder_point', '>', 0) // Only parts with reorder point set
            ->where('reorder_quantity', '>', 0) // Only parts with reorder quantity set
            ->get()
            ->filter(function ($part) {
                $totalAvailable = $part->stocks->sum(function ($stock) {
                    return max(0, $stock->quantity_on_hand - $stock->quantity_reserved);
                });
                return $totalAvailable < $part->reorder_point;
            })
            ->filter(function ($part) {
                // Check if there's already a pending PO for this part
                $hasPendingPO = PurchaseOrder::where('company_id', $part->company_id)
                    ->whereIn('status', ['draft', 'sent'])
                    ->whereHas('spareParts', function ($query) use ($part) {
                        $query->where('spare_part_id', $part->id);
                    })
                    ->exists();

                return !$hasPendingPO;
            });
    }

    /**
     * Create a purchase order for low stock parts.
     */
    protected function createPurchaseOrder(int $companyId, int $supplierId, $parts, int $creatorId): PurchaseOrder
    {
        DB::beginTransaction();
        try {
            $purchaseOrder = PurchaseOrder::create([
                'company_id' => $companyId,
                'supplier_id' => $supplierId,
                'order_date' => now(),
                'expected_delivery_date' => now()->addDays($parts->first()->lead_time_days ?? 7),
                'status' => 'draft',
                'notes' => 'Auto-generated purchase order for low stock items',
                'created_by' => $creatorId,
            ]);

            foreach ($parts as $part) {
                // Calculate shortage
                $totalAvailable = $part->stocks->sum(function ($stock) {
                    return max(0, $stock->quantity_on_hand - $stock->quantity_reserved);
                });
                $shortage = $part->reorder_point - $totalAvailable;

                // Order the greater of: reorder quantity or shortage
                $quantityToOrder = max($part->reorder_quantity, $shortage);

                $purchaseOrder->spareParts()->attach($part->id, [
                    'quantity' => $quantityToOrder,
                    'unit_cost' => $part->unit_cost,
                    'quantity_received' => 0,
                ]);
            }

            // Calculate total cost
            $purchaseOrder->calculateTotalCost();

            DB::commit();

            return $purchaseOrder;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Notify managers about the created purchase order.
     */
    protected function notifyManagers(int $companyId, PurchaseOrder $po): void
    {
        $managers = User::where('company_id', $companyId)
            ->where('role', 'manager')
            ->get();

        foreach ($managers as $manager) {
            Notification::create([
                'user_id' => $manager->id,
                'type' => 'purchase_order_created',
                'title' => 'Auto-Generated Purchase Order',
                'message' => "Purchase Order {$po->po_number} was automatically created for low stock items from {$po->supplier->name}. Total: \${$po->total_cost}",
                'link' => "/purchase-orders/{$po->id}",
                'is_read' => false,
            ]);
        }
    }
}
