<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Patient;
use App\Models\PatientSoa;
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
        // Get all patients with relationships
        $patients = Patient::with([
            'soas',
            'attendingDoctors.doctor',
            'admittingDoctors.doctor'
        ])->get()->map(function ($patient) {
            return [
                'id' => $patient->id,
                'full_name' => $patient->full_name,
                'first_name' => $patient->first_name,
                'last_name' => $patient->last_name,
                'middle_name' => $patient->middle_name,
                'extension_name' => $patient->extension_name,
                'address' => $patient->address,
                'phone_number' => $patient->phone_number,
                'created_at' => $patient->created_at,
                'total_bills' => $patient->soas->sum('amount'),
                'soa_count' => $patient->soas->count(),
                'attending_doctors' => $patient->attendingDoctors->map(fn($ad) => $ad->doctor?->name)->filter()->values(),
                'admitting_doctors' => $patient->admittingDoctors->map(fn($ad) => $ad->doctor?->name)->filter()->values(),
            ];
        });

        $recentUsers = User::whereIn('role', ['billing', 'admitting'])
            ->select('id', 'name', 'email', 'role', 'created_at', 'email_verified_at')
            ->latest()
            ->take(10)
            ->get();

        // User stats
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

        // Billing stats
        $billingStats = [
            'total_soas' => PatientSoa::count(),
            'total_amount' => PatientSoa::sum('amount') ?? 0,
            'soas_today' => PatientSoa::whereDate('created_at', today())->count(),
            'soas_this_month' => PatientSoa::whereYear('created_at', now()->year)
                ->whereMonth('created_at', now()->month)
                ->count(),
        ];

        // Admitting stats
        $admittingStats = [
            'total_patients' => Patient::count(),
            'patients_today' => Patient::whereDate('created_at', today())->count(),
            'patients_this_month' => Patient::whereYear('created_at', now()->year)
                ->whereMonth('created_at', now()->month)
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
            'billingStats' => $billingStats,
            'admittingStats' => $admittingStats,
            'patients' => $patients,
            'recentUsers' => $recentUsers,
            'monthlyRegistrations' => $monthlyRegistrations,
            'roleDistribution' => $roleDistribution,
            'verificationStatus' => $verificationStatus,
        ]);
    }
}
