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
        $clients = User::where('role', 'client')
            ->select('id', 'name', 'email', 'created_at', 'email_verified_at')
            ->latest()
            ->take(10)
            ->get();

        $stats = [
            'total_clients' => User::where('role', 'client')->count(),
            'total_admins' => User::where('role', 'admin')->count(),
            'verified_clients' => User::where('role', 'client')
                ->whereNotNull('email_verified_at')
                ->count(),
            'recent_signups' => User::where('role', 'client')
                ->where('created_at', '>=', now()->subDays(30))
                ->count(),
        ];

        return Inertia::render('admin/dashboard', [
            'stats' => $stats,
            'recentClients' => $clients,
        ]);
    }
}
