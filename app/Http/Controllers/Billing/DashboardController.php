<?php

namespace App\Http\Controllers\Billing;

use App\Http\Controllers\Controller;
use App\Models\PatientSoa;
use Illuminate\Http\Request;
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

        return Inertia::render('billing/dashboard', [
            'stats' => [
                'total_invoices' => $patientBills->count(),
                'pending_invoices' => 0,
                'paid_invoices' => 0,
                'total_amount_due' => $totalAmount,
            ],
            'patientBills' => $patientBills,
        ]);
    }
}
