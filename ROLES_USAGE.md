# Role-Based Access Control Implementation

## Overview
Your application now has admin and client roles implemented. Here's what was added:

## Features Added

### 1. Database Migration
- Added `role` column to users table (enum: 'admin', 'client')
- Default role is 'client'

### 2. User Model Methods
- `isAdmin()` - Check if user is an admin
- `isClient()` - Check if user is a client  
- `hasRole($role)` - Check if user has a specific role

### 3. Role Middleware
- Middleware: `EnsureUserHasRole`
- Alias: `role`

### 4. Test Users Created
- **Admin**: admin@example.com / password
- **Client**: client@example.com / password
- **Test**: test@example.com / password (client role)

## Usage Examples

### Protect Routes with Role Middleware

```php
// In routes/web.php or routes/settings.php

// Only admins can access
Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/admin/dashboard', [AdminController::class, 'dashboard']);
    Route::get('/admin/users', [AdminController::class, 'users']);
});

// Only clients can access
Route::middleware(['auth', 'role:client'])->group(function () {
    Route::get('/client/dashboard', [ClientController::class, 'dashboard']);
});

// Both admins and clients can access
Route::middleware(['auth', 'role:admin,client'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index']);
});
```

### Check Roles in Controllers

```php
// Check if current user is admin
if (auth()->user()->isAdmin()) {
    // Admin-only logic
}

// Check if current user is client
if (auth()->user()->isClient()) {
    // Client-only logic
}

// Check for specific role
if (auth()->user()->hasRole('admin')) {
    // Role-specific logic
}
```

### Check Roles in Blade Views

```php
@if(auth()->user()->isAdmin())
    <p>Admin content</p>
@endif

@if(auth()->user()->isClient())
    <p>Client content</p>
@endif
```

### Check Roles in React/Inertia Components

```tsx
import { usePage } from '@inertiajs/react';

const { auth } = usePage().props;

// In your component
{auth.user.role === 'admin' && (
    <div>Admin-only content</div>
)}

{auth.user.role === 'client' && (
    <div>Client-only content</div>
)}
```

### Create Users with Specific Roles

```php
// Using factory
User::factory()->admin()->create();
User::factory()->client()->create();

// Direct creation
User::create([
    'name' => 'John Admin',
    'email' => 'john@example.com',
    'password' => bcrypt('password'),
    'role' => 'admin',
]);
```

## Files Modified/Created

1. **Migration**: `database/migrations/2025_11_15_204709_add_role_to_users_table.php`
2. **User Model**: `app/Models/User.php` - Added role methods
3. **Middleware**: `app/Http/Middleware/EnsureUserHasRole.php`
4. **Bootstrap**: `bootstrap/app.php` - Registered middleware alias
5. **Factory**: `database/factories/UserFactory.php` - Added role states
6. **Seeder**: `database/seeders/DatabaseSeeder.php` - Added example users

## Next Steps

You can now:
- Add role-based navigation in your UI
- Create admin-only pages/features
- Restrict API endpoints by role
- Add more granular permissions if needed
