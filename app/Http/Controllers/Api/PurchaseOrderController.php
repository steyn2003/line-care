<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Jobs\SendVendorPurchaseOrderNotificationJob;
use App\Models\PurchaseOrder;
use App\Models\Stock;
use App\Models\InventoryTransaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PurchaseOrderController extends Controller
{
    /**
     * Display a listing of purchase orders.
     */
    public function index(Request $request): JsonResponse
    {
        $query = PurchaseOrder::query()
            ->with(['supplier', 'creator:id,name'])
            ->forCompany($request->user()->company_id);

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by supplier
        if ($request->has('supplier_id')) {
            $query->where('supplier_id', $request->supplier_id);
        }

        // Filter by date range
        if ($request->has('date_from')) {
            $query->where('order_date', '>=', $request->date_from);
        }
        if ($request->has('date_to')) {
            $query->where('order_date', '<=', $request->date_to);
        }

        $purchaseOrders = $query
            ->orderBy('order_date', 'desc')
            ->paginate($request->input('per_page', 15));

        return response()->json($purchaseOrders);
    }

    /**
     * Store a newly created purchase order.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'supplier_id' => ['required', 'exists:suppliers,id'],
            'order_date' => ['required', 'date'],
            'expected_delivery_date' => ['nullable', 'date', 'after_or_equal:order_date'],
            'notes' => ['nullable', 'string'],
            'parts' => ['required', 'array', 'min:1'],
            'parts.*.spare_part_id' => ['required', 'exists:spare_parts,id'],
            'parts.*.quantity' => ['required', 'integer', 'min:1'],
            'parts.*.unit_cost' => ['required', 'numeric', 'min:0'],
        ]);

        DB::beginTransaction();
        try {
            // Create purchase order
            $purchaseOrder = PurchaseOrder::create([
                'company_id' => $request->user()->company_id,
                'supplier_id' => $validated['supplier_id'],
                'order_date' => $validated['order_date'],
                'expected_delivery_date' => $validated['expected_delivery_date'] ?? null,
                'notes' => $validated['notes'] ?? null,
                'status' => 'draft',
                'created_by' => $request->user()->id,
            ]);

            // Attach spare parts
            foreach ($validated['parts'] as $part) {
                $purchaseOrder->spareParts()->attach($part['spare_part_id'], [
                    'quantity' => $part['quantity'],
                    'unit_cost' => $part['unit_cost'],
                    'quantity_received' => 0,
                ]);
            }

            // Calculate total cost
            $purchaseOrder->calculateTotalCost();

            DB::commit();

            return response()->json([
                'purchase_order' => $purchaseOrder->load(['supplier', 'spareParts', 'creator']),
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Display the specified purchase order.
     */
    public function show(Request $request, PurchaseOrder $purchaseOrder): JsonResponse
    {
        if ($purchaseOrder->company_id !== $request->user()->company_id) {
            abort(403);
        }

        $purchaseOrder->load([
            'supplier',
            'creator:id,name',
            'spareParts.category',
            'spareParts.stocks',
        ]);

        return response()->json([
            'purchase_order' => $purchaseOrder,
        ]);
    }

    /**
     * Update the specified purchase order (draft only).
     */
    public function update(Request $request, PurchaseOrder $purchaseOrder): JsonResponse
    {
        if ($purchaseOrder->company_id !== $request->user()->company_id) {
            abort(403);
        }

        if (!$purchaseOrder->canBeEdited()) {
            return response()->json([
                'message' => 'Purchase order can only be edited while in draft status',
            ], 422);
        }

        $validated = $request->validate([
            'supplier_id' => ['sometimes', 'exists:suppliers,id'],
            'order_date' => ['sometimes', 'date'],
            'expected_delivery_date' => ['nullable', 'date'],
            'notes' => ['nullable', 'string'],
            'parts' => ['sometimes', 'array', 'min:1'],
            'parts.*.spare_part_id' => ['required', 'exists:spare_parts,id'],
            'parts.*.quantity' => ['required', 'integer', 'min:1'],
            'parts.*.unit_cost' => ['required', 'numeric', 'min:0'],
        ]);

        DB::beginTransaction();
        try {
            // Update basic fields
            $purchaseOrder->update([
                'supplier_id' => $validated['supplier_id'] ?? $purchaseOrder->supplier_id,
                'order_date' => $validated['order_date'] ?? $purchaseOrder->order_date,
                'expected_delivery_date' => $validated['expected_delivery_date'] ?? $purchaseOrder->expected_delivery_date,
                'notes' => $validated['notes'] ?? $purchaseOrder->notes,
            ]);

            // Update parts if provided
            if (isset($validated['parts'])) {
                $purchaseOrder->spareParts()->detach();

                foreach ($validated['parts'] as $part) {
                    $purchaseOrder->spareParts()->attach($part['spare_part_id'], [
                        'quantity' => $part['quantity'],
                        'unit_cost' => $part['unit_cost'],
                        'quantity_received' => 0,
                    ]);
                }

                $purchaseOrder->calculateTotalCost();
            }

            DB::commit();

            return response()->json([
                'purchase_order' => $purchaseOrder->load(['supplier', 'spareParts', 'creator']),
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Cancel the purchase order.
     */
    public function cancel(Request $request, PurchaseOrder $purchaseOrder): JsonResponse
    {
        if ($purchaseOrder->company_id !== $request->user()->company_id) {
            abort(403);
        }

        try {
            $purchaseOrder->cancel();

            return response()->json([
                'message' => 'Purchase order cancelled successfully',
                'purchase_order' => $purchaseOrder,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Send the purchase order to supplier.
     */
    public function send(Request $request, PurchaseOrder $purchaseOrder): JsonResponse
    {
        if ($purchaseOrder->company_id !== $request->user()->company_id) {
            abort(403);
        }

        try {
            $purchaseOrder->markAsSent();

            // Dispatch job to send email notification to vendor
            SendVendorPurchaseOrderNotificationJob::dispatch($purchaseOrder, 'new');

            return response()->json([
                'message' => 'Purchase order sent successfully',
                'purchase_order' => $purchaseOrder->load(['supplier', 'spareParts']),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Receive the purchase order (add items to inventory).
     */
    public function receive(Request $request, PurchaseOrder $purchaseOrder): JsonResponse
    {
        if ($purchaseOrder->company_id !== $request->user()->company_id) {
            abort(403);
        }

        if (!$purchaseOrder->canBeReceived()) {
            return response()->json([
                'message' => 'Purchase order cannot be received. Must be in sent status.',
            ], 422);
        }

        $validated = $request->validate([
            'received_date' => ['required', 'date'],
            'received_parts' => ['required', 'array', 'min:1'],
            'received_parts.*.spare_part_id' => ['required', 'exists:spare_parts,id'],
            'received_parts.*.quantity_received' => ['required', 'integer', 'min:0'],
            'received_parts.*.location_id' => ['required', 'exists:locations,id'],
        ]);

        DB::beginTransaction();
        try {
            foreach ($validated['received_parts'] as $receivedPart) {
                $sparePartId = $receivedPart['spare_part_id'];
                $quantityReceived = $receivedPart['quantity_received'];
                $locationId = $receivedPart['location_id'];

                if ($quantityReceived <= 0) {
                    continue;
                }

                // Update pivot table
                $purchaseOrder->spareParts()->updateExistingPivot($sparePartId, [
                    'quantity_received' => $quantityReceived,
                ]);

                // Get or create stock record
                $stock = Stock::firstOrCreate(
                    [
                        'spare_part_id' => $sparePartId,
                        'location_id' => $locationId,
                    ],
                    [
                        'company_id' => $request->user()->company_id,
                        'quantity_on_hand' => 0,
                        'quantity_reserved' => 0,
                    ]
                );

                // Add stock
                $stock->addStock($quantityReceived);

                // Create inventory transaction
                $pivotData = $purchaseOrder->spareParts()
                    ->where('spare_part_id', $sparePartId)
                    ->first()
                    ->pivot;

                InventoryTransaction::create([
                    'company_id' => $request->user()->company_id,
                    'spare_part_id' => $sparePartId,
                    'transaction_type' => 'in',
                    'quantity' => $quantityReceived,
                    'unit_cost' => $pivotData->unit_cost,
                    'reference_type' => 'purchase_order',
                    'reference_id' => $purchaseOrder->id,
                    'user_id' => $request->user()->id,
                    'notes' => "Received from PO {$purchaseOrder->po_number}",
                    'transaction_date' => $validated['received_date'],
                ]);
            }

            // Mark as received
            $purchaseOrder->markAsReceived();

            DB::commit();

            return response()->json([
                'message' => 'Purchase order received successfully',
                'purchase_order' => $purchaseOrder->load(['supplier', 'spareParts']),
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
