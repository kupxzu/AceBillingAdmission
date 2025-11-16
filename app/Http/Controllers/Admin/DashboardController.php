<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the admin dashboard.
     */
    public function index(Request $request): Response
    {
        $recentUsers = User::whereIn('role', ['billing', 'admitting'])
            ->select('id', 'name', 'email', 'role', 'created_at', 'email_verified_at')
            ->latest()
            ->take(10)
            ->get();

        $stats = [
            'total_billing' => User::where('role', 'billing')->count(),
            'total_admitting' => User::where('role', 'admitting')->count(),
            'total_admins' => User::where('role', 'admin')->count(),
            'verified_users' => User::whereIn('role', ['billing', 'admitting'])
                ->whereNotNull('email_verified_at')
                ->count(),
            'recent_signups' => User::whereIn('role', ['billing', 'admitting'])
                ->where('created_at', '>=', now()->subDays(30))
                ->count(),
        ];

        return Inertia::render('admin/dashboard', [
            'stats' => $stats,
            'recentUsers' => $recentUsers,
        ]);
    }
}
