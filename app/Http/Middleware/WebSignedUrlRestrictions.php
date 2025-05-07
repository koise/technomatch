<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;

class WebSignedUrlRestrictions
{
    /**
     * Areas of the application that should never be accessed via signed URLs
     */
    protected $restrictedAreas = [
        '/admin*',          // Admin panel
        '/profile/settings*', // Personal settings pages
        '/account*',        // Account management
        '/payment*',        // Payment processing
        '/checkout*',       // Checkout flows
        '/dashboard*',      // User dashboard
        '/billing*'         // Billing information
    ];

    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Only intercept signed URLs
        if ($request->hasValidSignature()) {
            $currentPath = $request->path();
            foreach ($this->restrictedAreas as $pattern) {
                if (fnmatch($pattern, '/' . $currentPath)) {
                    // Log the attempt
                    \Log::warning('Attempted access to restricted area via signed URL', [
                        'path' => $currentPath,
                        'ip' => $request->ip(),
                        'user_id' => Auth::id(),
                        'user_agent' => $request->userAgent()
                    ]);
                    
                    // Flash warning message
                    Session::flash('warning', 'For security reasons, signed URLs cannot be used to access this area of the site.');
                    
                    // Redirect to appropriate location
                    if (Auth::check()) {
                        return redirect()->route('dashboard');
                    } else {
                        return redirect()->route('login');
                    }
                }
            }
        }

        return $next($request);
    }
} 