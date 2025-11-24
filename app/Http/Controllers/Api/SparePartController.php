<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SparePart;
use App\Models\Stock;
use App\Models\InventoryTransaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SparePartController extends Controller
{
    /**
     * Display a listing of spare parts.
     */
    public function index(Request $request): JsonResponse
    {
        $query = SparePart::query()
            ->with(['category', 'supplier', 'stocks.location'])
            ->forCompany($request->user()->company_id);

        // Filter by category
        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        // Filter by supplier
        if ($request->has('supplier_id')) {
            $query->where('supplier_id', $request->supplier_id);
        }

        // Filter by critical parts only
        if ($request->boolean('critical_only')) {
            $query->critical();
        }

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        } else {
            $query->active();
        }

        // Filter by low stock
        if ($request->boolean('low_stock')) {
            $query->whereHas('stocks', function ($q) {
                $q->whereRaw('(quantity_on_hand - quantity_reserved) < spare_parts.reorder_point');
            });
        }

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('part_number', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $spareParts = $query->orderBy('name')->paginate($request->input('per_page', 15));

        // Add computed fields
        $spareParts->getCollection()->transform(function ($part) {
            $part->total_quantity_on_hand = $part->stocks->sum('quantity_on_hand');
            $part->total_quantity_available = $part->stocks->sum(function ($stock) {
                return max(0, $stock->quantity_on_hand - $stock->quantity_reserved);
            });
            $part->is_low_stock = $part->total_quantity_available < $part->reorder_point;
            return $part;
        });

        return response()->json($spareParts);
    }

    /**
     * Store a newly created spare part.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'part_number' => ['required', 'string', 'max:255', 'unique:spare_parts,part_number'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'category_id' => ['nullable', 'exists:part_categories,id'],
            'supplier_id' => ['nullable', 'exists:suppliers,id'],
            'manufacturer' => ['nullable', 'string', 'max:255'],
            'unit_of_measure' => ['required', 'string', 'max:50'],
            'unit_cost' => ['required', 'numeric', 'min:0'],
            'reorder_point' => ['required', 'integer', 'min:0'],
            'reorder_quantity' => ['required', 'integer', 'min:0'],
            'lead_time_days' => ['required', 'integer', 'min:0'],
            'location' => ['nullable', 'string', 'max:255'],
            'image_url' => ['nullable', 'string', 'max:500'],
            'is_critical' => ['boolean'],
        ]);

        DB::beginTransaction();
        try {
            $sparePart = SparePart::create([
                ...$validated,
                'company_id' => $request->user()->company_id,
            ]);

            // Create initial stock record (0 quantity) for the default location if provided
            if ($request->has('initial_location_id')) {
                Stock::create([
                    'company_id' => $request->user()->company_id,
                    'spare_part_id' => $sparePart->id,
                    'location_id' => $request->initial_location_id,
                    'quantity_on_hand' => 0,
                    'quantity_reserved' => 0,
                ]);
            }

            DB::commit();

            return response()->json([
                'spare_part' => $sparePart->load(['category', 'supplier', 'stocks.location']),
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Display the specified spare part.
     */
    public function show(Request $request, SparePart $sparePart): JsonResponse
    {
        if ($sparePart->company_id !== $request->user()->company_id) {
            abort(403);
        }

        $sparePart->load([
            'category',
            'supplier',
            'stocks.location',
        ]);

        // Add computed fields
        $sparePart->total_quantity_on_hand = $sparePart->stocks->sum('quantity_on_hand');
        $sparePart->total_quantity_available = $sparePart->stocks->sum(function ($stock) {
            return max(0, $stock->quantity_on_hand - $stock->quantity_reserved);
        });
        $sparePart->is_low_stock = $sparePart->total_quantity_available < $sparePart->reorder_point;

        return response()->json([
            'spare_part' => $sparePart,
        ]);
    }

    /**
     * Update the specified spare part.
     */
    public function update(Request $request, SparePart $sparePart): JsonResponse
    {
        if ($sparePart->company_id !== $request->user()->company_id) {
            abort(403);
        }

        $validated = $request->validate([
            'part_number' => ['sometimes', 'string', 'max:255', 'unique:spare_parts,part_number,' . $sparePart->id],
            'name' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'category_id' => ['nullable', 'exists:part_categories,id'],
            'supplier_id' => ['nullable', 'exists:suppliers,id'],
            'manufacturer' => ['nullable', 'string', 'max:255'],
            'unit_of_measure' => ['sometimes', 'string', 'max:50'],
            'unit_cost' => ['sometimes', 'numeric', 'min:0'],
            'reorder_point' => ['sometimes', 'integer', 'min:0'],
            'reorder_quantity' => ['sometimes', 'integer', 'min:0'],
            'lead_time_days' => ['sometimes', 'integer', 'min:0'],
            'location' => ['nullable', 'string', 'max:255'],
            'image_url' => ['nullable', 'string', 'max:500'],
            'is_critical' => ['boolean'],
            'status' => ['sometimes', 'in:active,discontinued'],
        ]);

        $sparePart->update($validated);

        return response()->json([
            'spare_part' => $sparePart->load(['category', 'supplier', 'stocks.location']),
        ]);
    }

    /**
     * Remove the specified spare part (discontinue it).
     */
    public function destroy(Request $request, SparePart $sparePart): JsonResponse
    {
        if ($sparePart->company_id !== $request->user()->company_id) {
            abort(403);
        }

        // Discontinue instead of delete
        $sparePart->update(['status' => 'discontinued']);

        return response()->json([
            'message' => 'Spare part discontinued successfully',
        ]);
    }

    /**
     * Get transaction history for the specified spare part.
     */
    public function transactions(Request $request, SparePart $sparePart): JsonResponse
    {
        if ($sparePart->company_id !== $request->user()->company_id) {
            abort(403);
        }

        $query = $sparePart->inventoryTransactions()
            ->with(['user:id,name']);

        // Filter by transaction type
        if ($request->has('transaction_type')) {
            $query->where('transaction_type', $request->transaction_type);
        }

        // Filter by date range
        if ($request->has('date_from')) {
            $query->where('transaction_date', '>=', $request->date_from);
        }
        if ($request->has('date_to')) {
            $query->where('transaction_date', '<=', $request->date_to);
        }

        $transactions = $query
            ->orderBy('transaction_date', 'desc')
            ->paginate($request->input('per_page', 20));

        return response()->json($transactions);
    }

    /**
     * Adjust stock for the specified spare part.
     */
    public function adjustStock(Request $request, SparePart $sparePart): JsonResponse
    {
        if ($sparePart->company_id !== $request->user()->company_id) {
            abort(403);
        }

        $validated = $request->validate([
            'location_id' => ['required', 'exists:locations,id'],
            'quantity' => ['required', 'integer'],
            'reason' => ['required', 'string', 'max:255'],
            'notes' => ['nullable', 'string'],
        ]);

        DB::beginTransaction();
        try {
            // Get or create stock record for this location
            $stock = Stock::firstOrCreate(
                [
                    'spare_part_id' => $sparePart->id,
                    'location_id' => $validated['location_id'],
                ],
                [
                    'company_id' => $request->user()->company_id,
                    'quantity_on_hand' => 0,
                    'quantity_reserved' => 0,
                ]
            );

            $oldQuantity = $stock->quantity_on_hand;
            $newQuantity = $oldQuantity + $validated['quantity'];

            if ($newQuantity < 0) {
                return response()->json([
                    'message' => 'Adjustment would result in negative stock',
                ], 422);
            }

            // Update stock
            $stock->update(['quantity_on_hand' => $newQuantity]);

            // Create inventory transaction
            InventoryTransaction::create([
                'company_id' => $request->user()->company_id,
                'spare_part_id' => $sparePart->id,
                'transaction_type' => 'adjustment',
                'quantity' => $validated['quantity'],
                'unit_cost' => $sparePart->unit_cost,
                'reference_type' => 'adjustment',
                'reference_id' => null,
                'user_id' => $request->user()->id,
                'notes' => $validated['reason'] . ($validated['notes'] ? ': ' . $validated['notes'] : ''),
                'transaction_date' => now(),
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Stock adjusted successfully',
                'stock' => $stock->fresh(),
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
