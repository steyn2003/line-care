<?php

namespace App\Http\Controllers;

use App\Models\SparePart;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InventoryController extends Controller
{
    /**
     * Display low stock alerts page.
     */
    public function lowStock(Request $request)
    {
        $query = SparePart::query()
            ->with(['category', 'supplier', 'stocks.location'])
            ->where('company_id', $request->user()->company_id)
            ->where('status', 'active');

        // Get all parts and filter for low stock
        $allParts = $query->get();

        $lowStockParts = $allParts->filter(function ($part) {
            $totalAvailable = $part->stocks->sum(function ($stock) {
                return max(0, $stock->quantity_on_hand - $stock->quantity_reserved);
            });
            return $totalAvailable < $part->reorder_point;
        })->map(function ($part) {
            $totalOnHand = $part->stocks->sum('quantity_on_hand');
            $totalReserved = $part->stocks->sum('quantity_reserved');
            $totalAvailable = $totalOnHand - $totalReserved;

            $part->total_quantity_on_hand = $totalOnHand;
            $part->total_quantity_reserved = $totalReserved;
            $part->total_quantity_available = $totalAvailable;
            $part->shortage = max(0, $part->reorder_point - $totalAvailable);
            $part->recommended_order = max($part->reorder_quantity, $part->shortage);

            return $part;
        })->sortByDesc('is_critical')
          ->sortBy('total_quantity_available')
          ->values();

        $suppliers = Supplier::where('company_id', $request->user()->company_id)
            ->orderBy('name')
            ->get();

        return Inertia::render('inventory/low-stock', [
            'low_stock_parts' => $lowStockParts,
            'suppliers' => $suppliers,
        ]);
    }
}
