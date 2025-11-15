<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        // Redirect clients to their specific dashboard
        $user = Auth::user();
        if ($user && $user->role === 'client') {
            return redirect()->route('client.dashboard');
        }
        
        // Redirect admins to admin dashboard
        if ($user && $user->role === 'admin') {
            return redirect()->route('admin.dashboard');
        }
        
        return Inertia::render('dashboard');
    })->name('dashboard');
});

// Admin Dashboard Routes
Route::middleware(['auth', 'verified', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('dashboard', [\App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('dashboard');
    Route::get('clients', [\App\Http\Controllers\Admin\ClientController::class, 'index'])->name('clients.index');
    Route::get('clients/{client}', [\App\Http\Controllers\Admin\ClientController::class, 'show'])->name('clients.show');
});

// Client Dashboard Routes
Route::middleware(['auth', 'verified', 'role:client'])->prefix('client')->name('client.')->group(function () {
    Route::get('dashboard', [\App\Http\Controllers\Client\DashboardController::class, 'index'])->name('dashboard');
});

require __DIR__.'/settings.php';
