<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SparePart;
use App\Models\Stock;
use App\Models\InventoryTransaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InventoryController extends Controller
{
    /**
     * Get parts below reorder point (low stock alert).
     */
    public function lowStock(Request $request): JsonResponse
    {
        $query = SparePart::query()
            ->with(['category', 'supplier', 'stocks.location'])
            ->forCompany($request->user()->company_id)
            ->active();

        // Get parts where total available quantity is below reorder point
        $spareParts = $query->get()->filter(function ($part) {
            $totalAvailable = $part->stocks->sum(function ($stock) {
                return max(0, $stock->quantity_on_hand - $stock->quantity_reserved);
            });
            return $totalAvailable < $part->reorder_point;
        })->values();

        // Add computed fields
        $spareParts->transform(function ($part) {
            $part->total_quantity_on_hand = $part->stocks->sum('quantity_on_hand');
            $part->total_quantity_available = $part->stocks->sum(function ($stock) {
                return max(0, $stock->quantity_on_hand - $stock->quantity_reserved);
            });
            $part->shortage = $part->reorder_point - $part->total_quantity_available;
            $part->recommended_order_quantity = max($part->reorder_quantity, $part->shortage);
            return $part;
        });

        // Sort by criticality and shortage
        $spareParts = $spareParts->sortByDesc(function ($part) {
            $criticalityWeight = $part->is_critical ? 1000 : 0;
            return $criticalityWeight + $part->shortage;
        })->values();

        return response()->json([
            'low_stock_parts' => $spareParts,
            'count' => $spareParts->count(),
        ]);
    }

    /**
     * Get current stock levels across all locations.
     */
    public function stockLevels(Request $request): JsonResponse
    {
        $query = Stock::query()
            ->with(['sparePart', 'location'])
            ->forCompany($request->user()->company_id);

        // Filter by location
        if ($request->has('location_id')) {
            $query->where('location_id', $request->location_id);
        }

        // Filter by spare part
        if ($request->has('spare_part_id')) {
            $query->where('spare_part_id', $request->spare_part_id);
        }

        $stocks = $query->get();

        // Add computed field
        $stocks->transform(function ($stock) {
            $stock->quantity_available = max(0, $stock->quantity_on_hand - $stock->quantity_reserved);
            return $stock;
        });

        // Group by location if requested
        if ($request->boolean('group_by_location')) {
            $grouped = $stocks->groupBy('location_id')->map(function ($locationStocks, $locationId) {
                return [
                    'location' => $locationStocks->first()->location,
                    'total_parts' => $locationStocks->count(),
                    'total_value' => $locationStocks->sum(function ($stock) {
                        return $stock->quantity_on_hand * ($stock->sparePart->unit_cost ?? 0);
                    }),
                    'stocks' => $locationStocks,
                ];
            })->values();

            return response()->json([
                'stock_by_location' => $grouped,
            ]);
        }

        return response()->json([
            'stocks' => $stocks,
        ]);
    }

    /**
     * Perform a physical stock count and update records.
     */
    public function stockCount(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'counts' => ['required', 'array'],
            'counts.*.spare_part_id' => ['required', 'exists:spare_parts,id'],
            'counts.*.location_id' => ['required', 'exists:locations,id'],
            'counts.*.counted_quantity' => ['required', 'integer', 'min:0'],
        ]);

        DB::beginTransaction();
        try {
            $results = [];

            foreach ($validated['counts'] as $count) {
                // Get or create stock record
                $stock = Stock::firstOrCreate(
                    [
                        'spare_part_id' => $count['spare_part_id'],
                        'location_id' => $count['location_id'],
                    ],
                    [
                        'company_id' => $request->user()->company_id,
                        'quantity_on_hand' => 0,
                        'quantity_reserved' => 0,
                    ]
                );

                $oldQuantity = $stock->quantity_on_hand;
                $newQuantity = $count['counted_quantity'];
                $difference = $newQuantity - $oldQuantity;

                if ($difference != 0) {
                    // Update stock
                    $stock->update([
                        'quantity_on_hand' => $newQuantity,
                        'last_counted_at' => now(),
                    ]);

                    // Create adjustment transaction
                    InventoryTransaction::create([
                        'company_id' => $request->user()->company_id,
                        'spare_part_id' => $count['spare_part_id'],
                        'transaction_type' => 'adjustment',
                        'quantity' => $difference,
                        'unit_cost' => $stock->sparePart->unit_cost,
                        'reference_type' => 'stock_count',
                        'reference_id' => null,
                        'user_id' => $request->user()->id,
                        'notes' => "Physical stock count: adjusted from {$oldQuantity} to {$newQuantity}",
                        'transaction_date' => now(),
                    ]);

                    $results[] = [
                        'spare_part_id' => $count['spare_part_id'],
                        'location_id' => $count['location_id'],
                        'old_quantity' => $oldQuantity,
                        'new_quantity' => $newQuantity,
                        'difference' => $difference,
                    ];
                }
            }

            DB::commit();

            return response()->json([
                'message' => 'Stock count completed successfully',
                'adjustments' => $results,
                'adjusted_count' => count($results),
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Get inventory valuation (total value of all stock).
     */
    public function valuation(Request $request): JsonResponse
    {
        $stocks = Stock::query()
            ->with(['sparePart'])
            ->forCompany($request->user()->company_id)
            ->get();

        $totalValue = $stocks->sum(function ($stock) {
            return $stock->quantity_on_hand * ($stock->sparePart->unit_cost ?? 0);
        });

        $totalParts = $stocks->sum('quantity_on_hand');

        // Value by category
        $valueByCategory = SparePart::query()
            ->with(['category', 'stocks'])
            ->forCompany($request->user()->company_id)
            ->active()
            ->get()
            ->groupBy('category_id')
            ->map(function ($parts, $categoryId) {
                $categoryValue = $parts->sum(function ($part) {
                    return $part->stocks->sum('quantity_on_hand') * $part->unit_cost;
                });

                return [
                    'category' => $parts->first()->category->name ?? 'Uncategorized',
                    'total_value' => $categoryValue,
                    'part_count' => $parts->count(),
                ];
            })
            ->sortByDesc('total_value')
            ->values();

        // Value by location
        $valueByLocation = $stocks->groupBy('location_id')->map(function ($locationStocks) {
            $locationValue = $locationStocks->sum(function ($stock) {
                return $stock->quantity_on_hand * ($stock->sparePart->unit_cost ?? 0);
            });

            return [
                'location' => $locationStocks->first()->location->name ?? 'Unknown',
                'total_value' => $locationValue,
                'part_count' => $locationStocks->count(),
            ];
        })->sortByDesc('total_value')->values();

        return response()->json([
            'total_inventory_value' => round($totalValue, 2),
            'total_parts_quantity' => $totalParts,
            'unique_parts_count' => $stocks->pluck('spare_part_id')->unique()->count(),
            'value_by_category' => $valueByCategory,
            'value_by_location' => $valueByLocation,
        ]);
    }

    /**
     * Get inventory movement report (transactions over time).
     */
    public function movements(Request $request): JsonResponse
    {
        $dateFrom = $request->input('date_from', now()->subDays(30));
        $dateTo = $request->input('date_to', now());

        $query = InventoryTransaction::query()
            ->with(['sparePart', 'user:id,name'])
            ->forCompany($request->user()->company_id)
            ->whereBetween('transaction_date', [$dateFrom, $dateTo]);

        // Filter by transaction type
        if ($request->has('transaction_type')) {
            $query->where('transaction_type', $request->transaction_type);
        }

        // Filter by spare part
        if ($request->has('spare_part_id')) {
            $query->where('spare_part_id', $request->spare_part_id);
        }

        $transactions = $query
            ->orderBy('transaction_date', 'desc')
            ->paginate($request->input('per_page', 20));

        // Summary statistics
        $summary = [
            'total_transactions' => InventoryTransaction::forCompany($request->user()->company_id)
                ->whereBetween('transaction_date', [$dateFrom, $dateTo])
                ->count(),
            'total_in' => InventoryTransaction::forCompany($request->user()->company_id)
                ->whereBetween('transaction_date', [$dateFrom, $dateTo])
                ->where('transaction_type', 'in')
                ->count(),
            'total_out' => InventoryTransaction::forCompany($request->user()->company_id)
                ->whereBetween('transaction_date', [$dateFrom, $dateTo])
                ->where('transaction_type', 'out')
                ->count(),
            'total_adjustments' => InventoryTransaction::forCompany($request->user()->company_id)
                ->whereBetween('transaction_date', [$dateFrom, $dateTo])
                ->where('transaction_type', 'adjustment')
                ->count(),
        ];

        return response()->json([
            'transactions' => $transactions,
            'summary' => $summary,
        ]);
    }

    /**
     * Get stock usage report (parts consumed by work orders).
     */
    public function usageReport(Request $request): JsonResponse
    {
        $dateFrom = $request->input('date_from', now()->subDays(30));
        $dateTo = $request->input('date_to', now());

        $transactions = InventoryTransaction::query()
            ->with(['sparePart.category', 'sparePart.supplier'])
            ->forCompany($request->user()->company_id)
            ->where('transaction_type', 'out')
            ->where('reference_type', 'work_order')
            ->whereBetween('transaction_date', [$dateFrom, $dateTo])
            ->get();

        // Group by spare part
        $usageByPart = $transactions->groupBy('spare_part_id')->map(function ($partTransactions) {
            $part = $partTransactions->first()->sparePart;
            $totalQuantity = $partTransactions->sum('quantity');
            $totalValue = $partTransactions->sum(function ($t) {
                return abs($t->quantity) * ($t->unit_cost ?? 0);
            });

            return [
                'spare_part' => [
                    'id' => $part->id,
                    'part_number' => $part->part_number,
                    'name' => $part->name,
                    'category' => $part->category->name ?? 'Uncategorized',
                ],
                'quantity_used' => abs($totalQuantity),
                'total_cost' => $totalValue,
                'transaction_count' => $partTransactions->count(),
            ];
        })->sortByDesc('total_cost')->values();

        $totalCost = $usageByPart->sum('total_cost');
        $totalQuantity = $usageByPart->sum('quantity_used');

        return response()->json([
            'usage_by_part' => $usageByPart,
            'total_parts_used' => $totalQuantity,
            'total_cost' => round($totalCost, 2),
            'period' => [
                'from' => $dateFrom,
                'to' => $dateTo,
            ],
        ]);
    }
}
