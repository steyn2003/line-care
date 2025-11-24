<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PurchaseOrder;
use App\Models\VendorApiKey;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class VendorPortalController extends Controller
{
    /**
     * Get all purchase orders for the vendor.
     */
    public function index(Request $request): JsonResponse
    {
        // Vendor supplier is attached to request by middleware
        $supplier = $request->vendor_supplier;

        $query = PurchaseOrder::where('supplier_id', $supplier->id)
            ->with(['spareParts', 'createdBy']);

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $purchaseOrders = $query->orderBy('created_at', 'desc')
            ->paginate($request->input('per_page', 20));

        return response()->json($purchaseOrders);
    }

    /**
     * Show a specific purchase order.
     */
    public function show(Request $request, PurchaseOrder $purchaseOrder): JsonResponse
    {
        $supplier = $request->vendor_supplier;

        if ($purchaseOrder->supplier_id !== $supplier->id) {
            abort(403, 'You do not have access to this purchase order');
        }

        $purchaseOrder->load(['spareParts', 'createdBy', 'company']);

        return response()->json($purchaseOrder);
    }

    /**
     * Acknowledge receipt of a purchase order.
     */
    public function acknowledge(Request $request, PurchaseOrder $purchaseOrder): JsonResponse
    {
        $supplier = $request->vendor_supplier;

        if ($purchaseOrder->supplier_id !== $supplier->id) {
            abort(403, 'You do not have access to this purchase order');
        }

        if ($purchaseOrder->status !== 'sent') {
            return response()->json([
                'message' => 'Purchase order cannot be acknowledged in current status',
            ], 400);
        }

        $purchaseOrder->update([
            'status' => 'acknowledged',
            'acknowledged_at' => now(),
        ]);

        return response()->json([
            'message' => 'Purchase order acknowledged successfully',
            'purchase_order' => $purchaseOrder,
        ]);
    }

    /**
     * Mark purchase order as shipped.
     */
    public function markShipped(Request $request, PurchaseOrder $purchaseOrder): JsonResponse
    {
        $supplier = $request->vendor_supplier;

        if ($purchaseOrder->supplier_id !== $supplier->id) {
            abort(403, 'You do not have access to this purchase order');
        }

        $validator = Validator::make($request->all(), [
            'tracking_number' => 'nullable|string|max:255',
            'shipping_date' => 'nullable|date',
            'estimated_delivery' => 'nullable|date|after_or_equal:shipping_date',
            'notes' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $purchaseOrder->update([
            'status' => 'shipped',
            'tracking_number' => $request->tracking_number,
            'shipping_date' => $request->shipping_date ?? now(),
            'estimated_delivery' => $request->estimated_delivery,
            'vendor_notes' => $request->notes,
        ]);

        return response()->json([
            'message' => 'Purchase order marked as shipped successfully',
            'purchase_order' => $purchaseOrder,
        ]);
    }

    /**
     * Add tracking information to purchase order.
     */
    public function addTracking(Request $request, PurchaseOrder $purchaseOrder): JsonResponse
    {
        $supplier = $request->vendor_supplier;

        if ($purchaseOrder->supplier_id !== $supplier->id) {
            abort(403, 'You do not have access to this purchase order');
        }

        $validator = Validator::make($request->all(), [
            'tracking_number' => 'required|string|max:255',
            'carrier' => 'nullable|string|max:255',
            'tracking_url' => 'nullable|url',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $purchaseOrder->update([
            'tracking_number' => $request->tracking_number,
            'tracking_carrier' => $request->carrier,
            'tracking_url' => $request->tracking_url,
        ]);

        return response()->json([
            'message' => 'Tracking information added successfully',
            'purchase_order' => $purchaseOrder,
        ]);
    }

    /**
     * Upload documents (invoice, packing slip, etc.).
     */
    public function uploadDocument(Request $request, PurchaseOrder $purchaseOrder): JsonResponse
    {
        $supplier = $request->vendor_supplier;

        if ($purchaseOrder->supplier_id !== $supplier->id) {
            abort(403, 'You do not have access to this purchase order');
        }

        $validator = Validator::make($request->all(), [
            'document' => 'required|file|mimes:pdf,jpg,jpeg,png|max:10240',
            'document_type' => 'required|in:invoice,packing_slip,certificate,other',
            'notes' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        // Store the file
        $path = $request->file('document')->store('vendor-documents', 'public');

        // Store document metadata (you may want a separate documents table)
        $documents = $purchaseOrder->vendor_documents ?? [];
        $documents[] = [
            'type' => $request->document_type,
            'path' => $path,
            'filename' => $request->file('document')->getClientOriginalName(),
            'notes' => $request->notes,
            'uploaded_at' => now()->toIso8601String(),
        ];

        $purchaseOrder->update([
            'vendor_documents' => $documents,
        ]);

        return response()->json([
            'message' => 'Document uploaded successfully',
            'document' => end($documents),
        ]);
    }
}
