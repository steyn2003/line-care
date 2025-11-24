<?php

namespace App\Http\Controllers;

use App\Models\PurchaseOrder;
use App\Models\Supplier;
use App\Models\SparePart;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PurchaseOrderController extends Controller
{
    /**
     * Display a listing of purchase orders.
     */
    public function index(Request $request)
    {
        $query = PurchaseOrder::query()
            ->with(['supplier', 'spareParts', 'creator'])
            ->where('company_id', $request->user()->company_id);

        // Apply filters
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('supplier_id')) {
            $query->where('supplier_id', $request->supplier_id);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('po_number', 'like', "%{$search}%")
                    ->orWhereHas('supplier', function ($sq) use ($search) {
                        $sq->where('name', 'like', "%{$search}%");
                    });
            });
        }

        $purchaseOrders = $query->orderBy('created_at', 'desc')->paginate(15);

        // Add computed fields
        $purchaseOrders->getCollection()->transform(function ($po) {
            $po->total_items = $po->spareParts->count();
            $po->total_quantity = $po->spareParts->sum('pivot.quantity');
            return $po;
        });

        $suppliers = Supplier::where('company_id', $request->user()->company_id)
            ->orderBy('name')
            ->get();

        return Inertia::render('purchase-orders/index', [
            'purchase_orders' => $purchaseOrders,
            'suppliers' => $suppliers,
            'filters' => $request->only(['status', 'supplier_id', 'search']),
        ]);
    }

    /**
     * Show the form for creating a new purchase order.
     */
    public function create(Request $request)
    {
        $suppliers = Supplier::where('company_id', $request->user()->company_id)
            ->orderBy('name')
            ->get();

        $spareParts = SparePart::query()
            ->with(['category', 'supplier'])
            ->where('company_id', $request->user()->company_id)
            ->where('status', 'active')
            ->orderBy('name')
            ->get();

        // Pre-filled data from low stock alerts
        $prefilledData = null;
        if ($request->has('supplier_id') && $request->has('parts')) {
            $prefilledData = [
                'supplier_id' => $request->supplier_id,
                'parts' => $request->parts,
            ];
        }

        return Inertia::render('purchase-orders/create', [
            'suppliers' => $suppliers,
            'spare_parts' => $spareParts,
            'prefilled_data' => $prefilledData,
        ]);
    }

    /**
     * Store a newly created purchase order.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'supplier_id' => ['required', 'exists:suppliers,id'],
            'expected_delivery_date' => ['nullable', 'date'],
            'notes' => ['nullable', 'string'],
            'line_items' => ['required', 'array', 'min:1'],
            'line_items.*.spare_part_id' => ['required', 'exists:spare_parts,id'],
            'line_items.*.quantity' => ['required', 'integer', 'min:1'],
            'line_items.*.unit_cost' => ['required', 'numeric', 'min:0'],
        ]);

        // Calculate total amount
        $totalAmount = collect($validated['line_items'])->sum(function ($item) {
            return $item['quantity'] * $item['unit_cost'];
        });

        // Create purchase order
        $purchaseOrder = PurchaseOrder::create([
            'company_id' => $request->user()->company_id,
            'supplier_id' => $validated['supplier_id'],
            'status' => 'draft',
            'total_cost' => $totalAmount,
            'order_date' => now(),
            'expected_delivery_date' => $validated['expected_delivery_date'] ?? null,
            'notes' => $validated['notes'] ?? null,
            'created_by' => $request->user()->id,
        ]);

        // Attach spare parts with pivot data
        foreach ($validated['line_items'] as $item) {
            $purchaseOrder->spareParts()->attach($item['spare_part_id'], [
                'quantity' => $item['quantity'],
                'unit_cost' => $item['unit_cost'],
                'quantity_received' => 0,
            ]);
        }

        return redirect()->route('purchase-orders.show', $purchaseOrder)
            ->with('success', 'Purchase order created successfully.');
    }

    /**
     * Display the specified purchase order.
     */
    public function show(Request $request, PurchaseOrder $purchaseOrder)
    {
        if ($purchaseOrder->company_id !== $request->user()->company_id) {
            abort(403);
        }

        $purchaseOrder->load([
            'supplier',
            'spareParts.category',
            'spareParts.stocks.location',
            'creator',
        ]);

        return Inertia::render('purchase-orders/show', [
            'purchase_order' => $purchaseOrder,
        ]);
    }

    /**
     * Remove the specified purchase order.
     */
    public function destroy(Request $request, PurchaseOrder $purchaseOrder)
    {
        if ($purchaseOrder->company_id !== $request->user()->company_id) {
            abort(403);
        }

        // Only allow deletion of draft or cancelled orders
        if (!in_array($purchaseOrder->status, ['draft', 'cancelled'])) {
            return back()->with('error', 'Only draft or cancelled purchase orders can be deleted.');
        }

        // Check if any parts have been received
        if ($purchaseOrder->status === 'received') {
            return back()->with('error', 'Cannot delete a received purchase order.');
        }

        $purchaseOrder->delete();

        return redirect()->route('purchase-orders.index')
            ->with('success', 'Purchase order deleted successfully.');
    }
}
