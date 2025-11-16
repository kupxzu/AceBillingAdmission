<?php

namespace App\Http\Controllers\Admitting;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\User;

class DashboardController extends Controller
{
    /**
     * Display the admitting dashboard.
     */
    public function index(Request $request): Response
    {
        $stats = [
            'total_patients' => 0,
            'pending_admissions' => 0,
            'completed_today' => 0,
            'active_admissions' => 0,
        ];

        // Get recent admissions (placeholder for now)
        $recentAdmissions = [];

        return Inertia::render('admitting/dashboard', [
            'stats' => $stats,
            'recentAdmissions' => $recentAdmissions,
        ]);
    }
}
