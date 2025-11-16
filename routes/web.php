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
        $user = Auth::user();
        
        // Redirect based on user role
        if ($user && $user->role === 'billing') {
            return redirect()->route('billing.dashboard');
        }
        
        if ($user && $user->role === 'admin') {
            return redirect()->route('admin.dashboard');
        }
        
        if ($user && $user->role === 'admitting') {
            return redirect()->route('admitting.dashboard');
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

// Billing Dashboard Routes
Route::middleware(['auth', 'verified', 'role:billing'])->prefix('billing')->name('billing.')->group(function () {
    Route::get('dashboard', [\App\Http\Controllers\Billing\DashboardController::class, 'index'])->name('dashboard');
});

// Admitting Dashboard Routes
Route::middleware(['auth', 'verified', 'role:admitting'])->prefix('admitting')->name('admitting.')->group(function () {
    Route::get('dashboard', [\App\Http\Controllers\Admitting\DashboardController::class, 'index'])->name('dashboard');
});

require __DIR__.'/settings.php';
