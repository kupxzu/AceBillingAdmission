<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ClientController extends Controller
{
    /**
     * Display a listing of all clients.
     */
    public function index(Request $request): Response
    {
        $query = User::where('role', 'client');

        // Search functionality
        if ($request->has('search') && $request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%');
            });
        }

        $clients = $query->select('id', 'name', 'email', 'created_at', 'email_verified_at')
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/clients/index', [
            'clients' => $clients,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Display the specified client.
     */
    public function show(User $client): Response
    {
        // Ensure the user is actually a client
        abort_if($client->role !== 'client', 404);

        return Inertia::render('admin/clients/show', [
            'client' => $client,
        ]);
    }
}
