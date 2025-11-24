<?php

namespace App\Http\Controllers;

use App\Models\PartCategory;
use App\Models\SparePart;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SparePartController extends Controller
{
    /**
     * Display a listing of spare parts.
     */
    public function index(Request $request)
    {
        $query = SparePart::query()
            ->with(['category', 'supplier', 'stocks.location'])
            ->where('company_id', $request->user()->company_id);

        // Apply filters
        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->has('supplier_id')) {
            $query->where('supplier_id', $request->supplier_id);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        } else {
            $query->where('status', 'active');
        }

        if ($request->boolean('low_stock')) {
            $query->whereHas('stocks', function ($q) {
                $q->whereRaw('(quantity_on_hand - quantity_reserved) < spare_parts.reorder_point');
            });
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('part_number', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $spareParts = $query->orderBy('name')->paginate(15);

        // Add computed fields
        $spareParts->getCollection()->transform(function ($part) {
            $part->total_quantity_on_hand = $part->stocks->sum('quantity_on_hand');
            $part->total_quantity_available = $part->stocks->sum(function ($stock) {
                return max(0, $stock->quantity_on_hand - $stock->quantity_reserved);
            });
            $part->is_low_stock = $part->total_quantity_available < $part->reorder_point;
            return $part;
        });

        $categories = PartCategory::where('company_id', $request->user()->company_id)
            ->orderBy('name')
            ->get();

        $suppliers = Supplier::where('company_id', $request->user()->company_id)
            ->orderBy('name')
            ->get();

        return Inertia::render('spare-parts/index', [
            'spare_parts' => $spareParts,
            'categories' => $categories,
            'suppliers' => $suppliers,
            'filters' => $request->only(['category_id', 'supplier_id', 'status', 'low_stock', 'search']),
        ]);
    }

    /**
     * Show the form for creating a new spare part.
     */
    public function create(Request $request)
    {
        $categories = PartCategory::where('company_id', $request->user()->company_id)
            ->orderBy('name')
            ->get();

        $suppliers = Supplier::where('company_id', $request->user()->company_id)
            ->orderBy('name')
            ->get();

        return Inertia::render('spare-parts/create', [
            'categories' => $categories,
            'suppliers' => $suppliers,
        ]);
    }

    /**
     * Display the specified spare part.
     */
    public function show(Request $request, SparePart $sparePart)
    {
        if ($sparePart->company_id !== $request->user()->company_id) {
            abort(403);
        }

        $sparePart->load([
            'category',
            'supplier',
            'stocks.location',
        ]);

        return Inertia::render('spare-parts/show', [
            'spare_part' => $sparePart,
        ]);
    }

    /**
     * Store a newly created spare part.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'part_number' => ['required', 'string', 'max:100', 'unique:spare_parts,part_number'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'category_id' => ['nullable', 'exists:part_categories,id'],
            'supplier_id' => ['nullable', 'exists:suppliers,id'],
            'unit_cost' => ['required', 'numeric', 'min:0'],
            'reorder_point' => ['required', 'integer', 'min:0'],
            'reorder_quantity' => ['required', 'integer', 'min:1'],
            'is_critical' => ['boolean'],
            'status' => ['required', 'in:active,discontinued'],
        ]);

        $validated['company_id'] = $request->user()->company_id;

        $sparePart = SparePart::create($validated);

        return redirect()->route('spare-parts.show', $sparePart)
            ->with('success', 'Spare part created successfully.');
    }

    /**
     * Show the form for editing the specified spare part.
     */
    public function edit(Request $request, SparePart $sparePart)
    {
        if ($sparePart->company_id !== $request->user()->company_id) {
            abort(403);
        }

        $categories = PartCategory::where('company_id', $request->user()->company_id)
            ->orderBy('name')
            ->get();

        $suppliers = Supplier::where('company_id', $request->user()->company_id)
            ->orderBy('name')
            ->get();

        return Inertia::render('spare-parts/edit', [
            'spare_part' => $sparePart,
            'categories' => $categories,
            'suppliers' => $suppliers,
        ]);
    }

    /**
     * Update the specified spare part.
     */
    public function update(Request $request, SparePart $sparePart)
    {
        if ($sparePart->company_id !== $request->user()->company_id) {
            abort(403);
        }

        $validated = $request->validate([
            'part_number' => ['required', 'string', 'max:100', 'unique:spare_parts,part_number,' . $sparePart->id],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'category_id' => ['nullable', 'exists:part_categories,id'],
            'supplier_id' => ['nullable', 'exists:suppliers,id'],
            'unit_cost' => ['required', 'numeric', 'min:0'],
            'reorder_point' => ['required', 'integer', 'min:0'],
            'reorder_quantity' => ['required', 'integer', 'min:1'],
            'is_critical' => ['boolean'],
            'status' => ['required', 'in:active,discontinued'],
        ]);

        $sparePart->update($validated);

        return redirect()->route('spare-parts.show', $sparePart)
            ->with('success', 'Spare part updated successfully.');
    }

    /**
     * Remove the specified spare part.
     */
    public function destroy(Request $request, SparePart $sparePart)
    {
        if ($sparePart->company_id !== $request->user()->company_id) {
            abort(403);
        }

        // Check if part has been used in any work orders
        if ($sparePart->workOrders()->exists()) {
            return redirect()->route('spare-parts.show', $sparePart)
                ->with('error', 'Cannot delete spare part that has been used in work orders.');
        }

        $sparePart->delete();

        return redirect()->route('spare-parts.index')
            ->with('success', 'Spare part deleted successfully.');
    }
}
