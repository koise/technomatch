<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class RestrictedAreaMiddleware
{
    /**
     * Restricted routes that can't be accessed via signed URLs
     */
    protected $restrictedRoutes = [
        'home',
        'login',
        'register',
        'signup',
        'reset-password',
        'forgot-password',
        'logout',
        'dashboard'
    ];

    /**
     * Restricted URL patterns
     */
    protected $restrictedPatterns = [
        '/home',
        '/login',
        '/register',
        '/signup',
        '/auth/*',
        '/reset-password*',
        '/forgot-password*',
        '/logout',
        '/dashboard',
    ];

    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if the request has a signature (is a signed URL)
        if ($request->hasValidSignature()) {
            $currentRoute = $request->route()->getName();
            $currentPath = $request->path();

            // Check if the current route name is restricted
            if ($currentRoute && in_array($currentRoute, $this->restrictedRoutes)) {
                // If user is authenticated, redirect to dashboard or home
                if (Auth::check()) {
                    return redirect()->route('dashboard')
                        ->with('error', 'Signed URLs cannot be used to access this area');
                }
                
                // If not authenticated, redirect to login
                return redirect()->route('login')
                    ->with('error', 'Signed URLs cannot be used to access this area');
            }

            // Check if the current path matches any restricted pattern
            foreach ($this->restrictedPatterns as $pattern) {
                if (fnmatch($pattern, '/' . $currentPath)) {
                    // If user is authenticated, redirect to dashboard or home
                    if (Auth::check()) {
                        return redirect()->route('dashboard')
                            ->with('error', 'Signed URLs cannot be used to access this area');
                    }
                    
                    // If not authenticated, redirect to login
                    return redirect()->route('login')
                        ->with('error', 'Signed URLs cannot be used to access this area');
                }
            }
        }

        return $next($request);
    }
} 