<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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

        // Monthly registration data for the last 6 months
        $monthlyRegistrations = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $monthlyRegistrations[] = [
                'month' => $date->format('M'),
                'billing' => User::where('role', 'billing')
                    ->whereYear('created_at', $date->year)
                    ->whereMonth('created_at', $date->month)
                    ->count(),
                'admitting' => User::where('role', 'admitting')
                    ->whereYear('created_at', $date->year)
                    ->whereMonth('created_at', $date->month)
                    ->count(),
            ];
        }

        // Role distribution for pie chart
        $roleDistribution = [
            ['name' => 'Billing', 'value' => $stats['total_billing'], 'fill' => 'var(--color-billing)'],
            ['name' => 'Admitting', 'value' => $stats['total_admitting'], 'fill' => 'var(--color-admitting)'],
        ];

        // Verification status for pie chart
        $unverifiedCount = User::whereIn('role', ['billing', 'admitting'])
            ->whereNull('email_verified_at')
            ->count();
        $verificationStatus = [
            ['name' => 'Verified', 'value' => $stats['verified_users'], 'fill' => 'var(--color-verified)'],
            ['name' => 'Unverified', 'value' => $unverifiedCount, 'fill' => 'var(--color-unverified)'],
        ];

        return Inertia::render('admin/dashboard', [
            'stats' => $stats,
            'recentUsers' => $recentUsers,
            'monthlyRegistrations' => $monthlyRegistrations,
            'roleDistribution' => $roleDistribution,
            'verificationStatus' => $verificationStatus,
        ]);
    }
}
