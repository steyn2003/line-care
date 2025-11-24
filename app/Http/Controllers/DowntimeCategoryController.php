<?php

namespace App\Http\Controllers;

use App\Models\DowntimeCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DowntimeCategoryController extends Controller
{
    public function index(Request $request): Response
    {
        $categories = DowntimeCategory::query()
            ->forCompany($request->user()->company_id)
            ->orderBy('category_type')
            ->orderBy('name')
            ->get();

        return Inertia::render('downtime-categories/index', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category_type' => 'required|in:planned,unplanned',
            'is_included_in_oee' => 'boolean',
        ]);

        $validated['company_id'] = $request->user()->company_id;
        $validated['is_included_in_oee'] = $validated['is_included_in_oee'] ?? true;

        DowntimeCategory::create($validated);

        return redirect()->route('downtime-categories.index');
    }

    public function update(Request $request, DowntimeCategory $downtimeCategory)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category_type' => 'required|in:planned,unplanned',
            'is_included_in_oee' => 'boolean',
        ]);

        $downtimeCategory->update($validated);

        return redirect()->route('downtime-categories.index');
    }

    public function destroy(DowntimeCategory $downtimeCategory)
    {
        $downtimeCategory->delete();

        return redirect()->route('downtime-categories.index');
    }
}
