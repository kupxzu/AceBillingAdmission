<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the client dashboard.
     */
    public function index(Request $request): Response
    {
        return Inertia::render('client/dashboard', [
            'stats' => [
                'total_invoices' => 0,
                'pending_invoices' => 0,
                'paid_invoices' => 0,
                'total_amount_due' => 0,
            ],
        ]);
    }
}
