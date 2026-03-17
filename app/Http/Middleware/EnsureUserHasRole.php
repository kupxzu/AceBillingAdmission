<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  ...$roles
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        if (!$request->user()) {
            return redirect()->route('login');
        }

        if (!in_array($request->user()->role, $roles)) {
            // Redirect to user's appropriate dashboard based on their role
            $role = $request->user()->role;
            
            return match($role) {
                'admin' => redirect()->route('admin.dashboard')->with('error', 'You do not have permission to access that resource.'),
                'billing' => redirect()->route('billing.dashboard')->with('error', 'You do not have permission to access that resource.'),
                'admitting' => redirect()->route('admitting.dashboard')->with('error', 'You do not have permission to access that resource.'),
                default => redirect()->route('dashboard')->with('error', 'You do not have permission to access that resource.'),
            };
        }

        return $next($request);
    }
}
