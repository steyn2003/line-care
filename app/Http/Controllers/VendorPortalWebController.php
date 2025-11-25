<?php

namespace App\Http\Controllers;

use App\Models\PurchaseOrder;
use App\Models\Supplier;
use App\Models\VendorApiKey;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Inertia\Response;

class VendorPortalWebController extends Controller
{
    /**
     * Show the vendor portal login page.
     */
    public function login(): Response
    {
        // Check if already authenticated
        if (Session::has('vendor_api_key_id')) {
            return Inertia::render('vendor-portal/dashboard');
        }

        return Inertia::render('vendor-portal/login');
    }

    /**
     * Authenticate vendor with API key.
     */
    public function authenticate(Request $request): RedirectResponse
    {
        $request->validate([
            'api_key' => ['required', 'string'],
        ]);

        $apiKey = VendorApiKey::where('key', $request->api_key)->first();

        if (!$apiKey || !$apiKey->isValid()) {
            return redirect()->route('vendor-portal.login')
                ->withErrors(['api_key' => 'Invalid or expired API key']);
        }

        // Mark the key as used
        $apiKey->markAsUsed();

        // Store in session
        Session::put('vendor_api_key_id', $apiKey->id);
        Session::put('vendor_supplier_id', $apiKey->supplier_id);

        return redirect()->route('vendor-portal.dashboard');
    }

    /**
     * Logout from vendor portal.
     */
    public function logout(): RedirectResponse
    {
        Session::forget(['vendor_api_key_id', 'vendor_supplier_id']);

        return redirect()->route('vendor-portal.login');
    }

    /**
     * Show the vendor dashboard.
     */
    public function dashboard(): Response
    {
        $supplier = $this->getSupplier();

        $purchaseOrders = PurchaseOrder::where('supplier_id', $supplier->id)
            ->with(['spareParts'])
            ->orderBy('created_at', 'desc')
            ->get();

        $stats = [
            'total_orders' => $purchaseOrders->count(),
            'pending' => $purchaseOrders->whereIn('status', ['draft', 'sent'])->count(),
            'acknowledged' => $purchaseOrders->where('status', 'acknowledged')->count(),
            'shipped' => $purchaseOrders->where('status', 'shipped')->count(),
            'received' => $purchaseOrders->where('status', 'received')->count(),
        ];

        return Inertia::render('vendor-portal/dashboard', [
            'supplier' => [
                'id' => $supplier->id,
                'name' => $supplier->name,
                'email' => $supplier->email,
            ],
            'purchaseOrders' => $purchaseOrders->map(function ($po) {
                return [
                    'id' => $po->id,
                    'po_number' => $po->po_number,
                    'status' => $po->status,
                    'total_amount' => $po->total_amount,
                    'expected_delivery_date' => $po->expected_delivery_date?->toDateString(),
                    'created_at' => $po->created_at->toDateString(),
                    'items_count' => $po->spareParts->count(),
                ];
            }),
            'stats' => $stats,
        ]);
    }

    /**
     * Show a specific purchase order.
     */
    public function showOrder(PurchaseOrder $purchaseOrder): Response
    {
        $supplier = $this->getSupplier();

        if ($purchaseOrder->supplier_id !== $supplier->id) {
            abort(403);
        }

        $purchaseOrder->load(['spareParts', 'company']);

        return Inertia::render('vendor-portal/order-detail', [
            'supplier' => [
                'id' => $supplier->id,
                'name' => $supplier->name,
            ],
            'purchaseOrder' => [
                'id' => $purchaseOrder->id,
                'po_number' => $purchaseOrder->po_number,
                'status' => $purchaseOrder->status,
                'total_amount' => $purchaseOrder->total_amount,
                'expected_delivery_date' => $purchaseOrder->expected_delivery_date?->toDateString(),
                'shipping_address' => $purchaseOrder->shipping_address,
                'notes' => $purchaseOrder->notes,
                'tracking_number' => $purchaseOrder->tracking_number,
                'tracking_carrier' => $purchaseOrder->tracking_carrier,
                'tracking_url' => $purchaseOrder->tracking_url,
                'vendor_notes' => $purchaseOrder->vendor_notes,
                'vendor_documents' => $purchaseOrder->vendor_documents ?? [],
                'acknowledged_at' => $purchaseOrder->acknowledged_at?->toDateTimeString(),
                'shipping_date' => $purchaseOrder->shipping_date?->toDateString(),
                'created_at' => $purchaseOrder->created_at->toDateTimeString(),
                'company_name' => $purchaseOrder->company->name ?? 'Unknown',
                'items' => $purchaseOrder->spareParts->map(function ($part) {
                    return [
                        'id' => $part->id,
                        'part_number' => $part->part_number,
                        'name' => $part->name,
                        'quantity' => $part->pivot->quantity,
                        'unit_price' => $part->pivot->unit_price,
                        'total_price' => $part->pivot->quantity * $part->pivot->unit_price,
                    ];
                }),
            ],
        ]);
    }

    /**
     * Acknowledge a purchase order.
     */
    public function acknowledgeOrder(PurchaseOrder $purchaseOrder): RedirectResponse
    {
        $supplier = $this->getSupplier();

        if ($purchaseOrder->supplier_id !== $supplier->id) {
            abort(403);
        }

        if ($purchaseOrder->status !== 'sent') {
            return redirect()->route('vendor-portal.order', $purchaseOrder)
                ->with('error', 'This order cannot be acknowledged in its current status.');
        }

        $purchaseOrder->update([
            'status' => 'acknowledged',
            'acknowledged_at' => now(),
        ]);

        return redirect()->route('vendor-portal.order', $purchaseOrder)
            ->with('success', 'Purchase order acknowledged successfully.');
    }

    /**
     * Mark order as shipped.
     */
    public function shipOrder(Request $request, PurchaseOrder $purchaseOrder): RedirectResponse
    {
        $supplier = $this->getSupplier();

        if ($purchaseOrder->supplier_id !== $supplier->id) {
            abort(403);
        }

        $validated = $request->validate([
            'tracking_number' => ['nullable', 'string', 'max:255'],
            'tracking_carrier' => ['nullable', 'string', 'max:255'],
            'tracking_url' => ['nullable', 'url', 'max:500'],
            'vendor_notes' => ['nullable', 'string', 'max:1000'],
        ]);

        $purchaseOrder->update([
            'status' => 'shipped',
            'shipping_date' => now(),
            'tracking_number' => $validated['tracking_number'] ?? null,
            'tracking_carrier' => $validated['tracking_carrier'] ?? null,
            'tracking_url' => $validated['tracking_url'] ?? null,
            'vendor_notes' => $validated['vendor_notes'] ?? null,
        ]);

        return redirect()->route('vendor-portal.order', $purchaseOrder)
            ->with('success', 'Order marked as shipped.');
    }

    /**
     * Update tracking information.
     */
    public function updateTracking(Request $request, PurchaseOrder $purchaseOrder): RedirectResponse
    {
        $supplier = $this->getSupplier();

        if ($purchaseOrder->supplier_id !== $supplier->id) {
            abort(403);
        }

        $validated = $request->validate([
            'tracking_number' => ['required', 'string', 'max:255'],
            'tracking_carrier' => ['nullable', 'string', 'max:255'],
            'tracking_url' => ['nullable', 'url', 'max:500'],
        ]);

        $purchaseOrder->update($validated);

        return redirect()->route('vendor-portal.order', $purchaseOrder)
            ->with('success', 'Tracking information updated.');
    }

    /**
     * Upload a document.
     */
    public function uploadDocument(Request $request, PurchaseOrder $purchaseOrder): RedirectResponse
    {
        $supplier = $this->getSupplier();

        if ($purchaseOrder->supplier_id !== $supplier->id) {
            abort(403);
        }

        $validated = $request->validate([
            'document' => ['required', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:10240'],
            'document_type' => ['required', 'in:invoice,packing_slip,certificate,other'],
        ]);

        $path = $request->file('document')->store('vendor-documents', 'public');

        $documents = $purchaseOrder->vendor_documents ?? [];
        $documents[] = [
            'type' => $validated['document_type'],
            'path' => $path,
            'filename' => $request->file('document')->getClientOriginalName(),
            'uploaded_at' => now()->toIso8601String(),
        ];

        $purchaseOrder->update([
            'vendor_documents' => $documents,
        ]);

        return redirect()->route('vendor-portal.order', $purchaseOrder)
            ->with('success', 'Document uploaded successfully.');
    }

    /**
     * Get the authenticated supplier.
     */
    protected function getSupplier(): Supplier
    {
        $supplierId = Session::get('vendor_supplier_id');

        if (!$supplierId) {
            abort(403);
        }

        return Supplier::findOrFail($supplierId);
    }
}
