<?php

namespace App\Http\Controllers;

use App\Models\CauseCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CauseCategoryController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', CauseCategory::class);

        $categories = CauseCategory::where('company_id', $request->user()->company_id)
            ->withCount('workOrders')
            ->orderBy('name')
            ->get();

        return Inertia::render('cause-categories/index', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $this->authorize('create', CauseCategory::class);

        $user = $request->user();

        if (!$user->company_id) {
            return back()->withErrors([
                'company' => 'You must be assigned to a company to create cause categories.'
            ]);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $validated['company_id'] = $user->company_id;

        CauseCategory::create($validated);

        return redirect()->route('cause-categories.index')
            ->with('success', 'Cause category created successfully');
    }

    public function update(Request $request, CauseCategory $causeCategory)
    {
        $this->authorize('update', $causeCategory);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $causeCategory->update($validated);

        return redirect()->route('cause-categories.index')
            ->with('success', 'Cause category updated successfully');
    }

    public function destroy(CauseCategory $causeCategory)
    {
        $this->authorize('delete', $causeCategory);

        $causeCategory->delete();

        return redirect()->route('cause-categories.index')
            ->with('success', 'Cause category deleted successfully');
    }
}
