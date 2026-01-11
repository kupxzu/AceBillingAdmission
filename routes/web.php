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

// Public SOA View Route (no authentication required)
Route::get('/soa/view/{token}', [\App\Http\Controllers\Billing\PatientSOAController::class, 'publicView'])->name('soa.public');

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
    
    // User Management
    Route::resource('users', \App\Http\Controllers\Admin\UserController::class);
    Route::post('users/{user}/reset-password', [\App\Http\Controllers\Admin\UserController::class, 'resetPassword'])->name('users.reset-password');
    
    // Activity Logs
    Route::get('activity-logs', [\App\Http\Controllers\Admin\ActivityLogController::class, 'index'])->name('activity-logs.index');
});

// Billing Dashboard Routes
Route::middleware(['auth', 'verified', 'role:billing'])->prefix('billing')->name('billing.')->group(function () {
    Route::get('dashboard', [\App\Http\Controllers\Billing\DashboardController::class, 'index'])->name('dashboard');
    Route::resource('patient-soa', \App\Http\Controllers\Billing\PatientSOAController::class);
});

// Admitting Dashboard Routes
Route::middleware(['auth', 'verified', 'role:admitting'])->prefix('admitting')->name('admitting.')->group(function () {
    Route::get('dashboard', [\App\Http\Controllers\Admitting\DashboardController::class, 'index'])->name('dashboard');
    Route::resource('patients', \App\Http\Controllers\Admitting\PatientController::class);
    Route::get('patients/{patient}/assign-doctors', [\App\Http\Controllers\Admitting\PatientController::class, 'assignDoctors'])->name('patients.assign-doctors');
    Route::post('patients/{patient}/assign-doctors', [\App\Http\Controllers\Admitting\PatientController::class, 'storeAssignDoctors'])->name('patients.store-assign-doctors');
    Route::resource('attending-doctors', \App\Http\Controllers\Admitting\AttendingDoctorController::class);
    Route::resource('admitting-doctors', \App\Http\Controllers\Admitting\AdmittingDoctorController::class);
    Route::resource('rooms', \App\Http\Controllers\Admitting\RoomController::class);
});

require __DIR__.'/settings.php';
