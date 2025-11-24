<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\User;
use App\Models\Machine;
use App\Models\WorkOrder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $stats = [
            'total_companies' => Company::count(),
            'total_users' => User::count(),
            'total_machines' => Machine::count(),
            'total_work_orders' => WorkOrder::count(),
        ];

        $recentCompanies = Company::withCount(['users', 'machines'])
            ->latest()
            ->limit(5)
            ->get();

        return Inertia::render('admin/dashboard', [
            'stats' => $stats,
            'recentCompanies' => $recentCompanies,
        ]);
    }
}
