<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\ActivityLog;
use App\Mail\NewPasswordMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of users.
     */
    public function index(Request $request)
    {
        $query = User::query();

        // Exclude admin users from the list
        $query->where('role', '!=', 'admin');

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Filter by role
        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }

        $users = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('admin/users/index', [
            'users' => $users,
            'filters' => $request->only(['search', 'role']),
        ]);
    }

    /**
     * Show the form for creating a new user.
     */
    public function create()
    {
        return Inertia::render('admin/users/create');
    }

    /**
     * Store a newly created user in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => ['required', Rule::in(['admin', 'billing', 'admitting'])],
        ]);

        $validated['password'] = Hash::make($validated['password']);
        $validated['email_verified_at'] = now(); // Auto-verify admin-created users

        $user = User::create($validated);

        ActivityLog::log(
            'created',
            'User',
            $user->id,
            "Created new user: {$user->name} ({$user->role})",
            ['user' => ['name' => $user->name, 'email' => $user->email, 'role' => $user->role]]
        );

        return redirect()->route('admin.users.index')
            ->with('success', 'User created successfully.');
    }

    /**
     * Display the specified user.
     */
    public function show(User $user)
    {
        return Inertia::render('admin/users/show', [
            'user' => $user,
        ]);
    }

    /**
     * Show the form for editing the specified user.
     */
    public function edit(User $user)
    {
        return Inertia::render('admin/users/edit', [
            'user' => $user,
        ]);
    }

    /**
     * Update the specified user in storage.
     */
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'role' => ['required', Rule::in(['admin', 'billing', 'admitting'])],
        ]);

        $oldData = $user->only(['name', 'email', 'role']);
        $user->update($validated);

        ActivityLog::log(
            'updated',
            'User',
            $user->id,
            "Updated user: {$user->name}",
            ['old' => $oldData, 'new' => $user->only(['name', 'email', 'role'])]
        );

        return redirect()->route('admin.users.index')
            ->with('success', 'User updated successfully.');
    }

    /**
     * Remove the specified user from storage.
     */
    public function destroy(User $user)
    {
        // Prevent deleting own account
        if ($user->id === auth()->id()) {
            return redirect()->route('admin.users.index')
                ->with('error', 'You cannot delete your own account.');
        }

        // Prevent deleting admin users
        if ($user->role === 'admin') {
            return redirect()->route('admin.users.index')
                ->with('error', 'Admin users cannot be deleted.');
        }

        $userName = $user->name;
        $userId = $user->id;
        $userRole = $user->role;
        
        $user->delete();

        ActivityLog::log(
            'deleted',
            'User',
            $userId,
            "Deleted user: {$userName} ({$userRole})"
        );

        return redirect()->route('admin.users.index')
            ->with('success', 'User deleted successfully.');
    }

    /**
     * Send a new randomized password to the user's email.
     */
    public function resetPassword(User $user)
    {
        // Generate a random password
        $newPassword = Str::random(12);

        // Update the user's password
        $user->update([
            'password' => Hash::make($newPassword),
        ]);

        // Send the new password via email
        Mail::to($user->email)->send(new NewPasswordMail($user->name, $newPassword));

        ActivityLog::log(
            'password_reset',
            'User',
            $user->id,
            "Password reset and sent to: {$user->name} ({$user->email})"
        );

        return back()->with('success', 'New password has been sent to the user\'s email.');
    }
}
