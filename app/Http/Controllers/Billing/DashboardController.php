<?php

namespace App\Http\Controllers\Billing;

use App\Http\Controllers\Controller;
use App\Models\PatientSoa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the billing dashboard.
     */
    public function index(Request $request): Response
    {
        $patientBills = PatientSoa::with(['patient:id,first_name,middle_name,last_name'])
            ->latest()
            ->get()
            ->map(function (PatientSoa $bill) {
                $patient = $bill->patient;

                return [
                    'id' => $bill->id,
                    'patient_name' => $patient
                        ? trim(sprintf('%s %s %s', $patient->first_name, $patient->middle_name, $patient->last_name))
                        : 'Unknown Patient',
                    'amount' => (float) ($bill->amount ?? 0),
                    'created_at' => optional($bill->created_at)->toDateTimeString(),
                ];
            });

        $totalAmount = $patientBills->sum('amount');

        // Monthly SOA data for the last 6 months
        $monthlyBilling = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $monthlyData = PatientSoa::whereYear('created_at', $date->year)
                ->whereMonth('created_at', $date->month)
                ->selectRaw('COUNT(*) as count, COALESCE(SUM(amount), 0) as total')
                ->first();
            
            $monthlyBilling[] = [
                'month' => $date->format('M'),
                'invoices' => (int) ($monthlyData->count ?? 0),
                'amount' => (float) ($monthlyData->total ?? 0),
            ];
        }

        // Recent SOAs for the table (last 5)
        $recentSoas = PatientSoa::with(['patient:id,first_name,middle_name,last_name'])
            ->latest()
            ->take(5)
            ->get()
            ->map(function (PatientSoa $soa) {
                $patient = $soa->patient;
                return [
                    'id' => $soa->id,
                    'patient_name' => $patient
                        ? trim(sprintf('%s %s %s', $patient->first_name, $patient->middle_name, $patient->last_name))
                        : 'Unknown Patient',
                    'amount' => (float) ($soa->amount ?? 0),
                    'created_at' => optional($soa->created_at)->toDateTimeString(),
                ];
            });

        // Amount distribution for pie chart (by range)
        $amountRanges = [
            ['name' => '< ₱10,000', 'min' => 0, 'max' => 10000],
            ['name' => '₱10,000 - ₱50,000', 'min' => 10000, 'max' => 50000],
            ['name' => '₱50,000 - ₱100,000', 'min' => 50000, 'max' => 100000],
            ['name' => '> ₱100,000', 'min' => 100000, 'max' => PHP_INT_MAX],
        ];

        $amountDistribution = [];
        foreach ($amountRanges as $range) {
            $count = PatientSoa::where('amount', '>=', $range['min'])
                ->where('amount', '<', $range['max'])
                ->count();
            if ($count > 0) {
                $amountDistribution[] = [
                    'name' => $range['name'],
                    'value' => $count,
                ];
            }
        }

        return Inertia::render('billing/dashboard', [
            'stats' => [
                'total_invoices' => $patientBills->count(),
                'pending_invoices' => 0,
                'paid_invoices' => 0,
                'total_amount_due' => $totalAmount,
            ],
            'patientBills' => $patientBills,
            'monthlyBilling' => $monthlyBilling,
            'recentSoas' => $recentSoas,
            'amountDistribution' => $amountDistribution,
        ]);
    }
}
