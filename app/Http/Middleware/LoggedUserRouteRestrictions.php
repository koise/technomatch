<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class LoggedUserRouteRestrictions
{
    /**
     * Routes that logged-in users should not access
     */
    protected $restrictedRoutes = [
        'login',
        'register',
        'signup',
        'password.request',
        'password.reset',
        'verification.notice',
        'home'
    ];

    /**
     * URL patterns that logged-in users should not access
     */
    protected $restrictedPatterns = [
        '/',             // Root path
        '/login',        // Login page
        '/register',     // Registration page
        '/signup',       // Signup page
        '/auth/*',       // Auth routes
        '/password/*',   // Password reset routes
        '/verify-email/*', // Email verification routes
        '/reset-password*', // Password reset
        '/forgot-password*' // Forgot password
    ];

    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Only apply to authenticated users
        if (Auth::check()) {
            $currentRoute = $request->route()->getName();
            $currentPath = $request->path();
            
            // Check if the current route name is restricted
            if ($currentRoute && in_array($currentRoute, $this->restrictedRoutes)) {
                return redirect()->route('dashboard')
                    ->with('message', 'You are already logged in.');
            }
            
            // Check if the current path matches any restricted pattern
            foreach ($this->restrictedPatterns as $pattern) {
                if (fnmatch($pattern, '/' . $currentPath)) {
                    return redirect()->route('dashboard')
                        ->with('message', 'You are already logged in.');
                }
            }
        }

        return $next($request);
    }
} 