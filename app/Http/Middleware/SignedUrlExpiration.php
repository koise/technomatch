<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SignedUrlExpiration
{
    /**
     * Default expiration time for signed URLs in seconds (2 hours)
     */
    protected $defaultExpiration = 7200;
    
    /**
     * Custom expiration times for specific routes in seconds
     */
    protected $routeExpirations = [
        'friends.acceptRequest' => 86400,  // 24 hours
        'friends.rejectRequest' => 86400,  // 24 hours
        'friends.removeFriend' => 3600,    // 1 hour
    ];

    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Only process if this is a signed URL
        if ($request->hasValidSignature()) {
            // Get the expiration time from the URL
            $expires = $request->query('expires');
            
            // If no expiration time in URL, assume it doesn't expire
            if (!$expires) {
                return $next($request);
            }
            
            // Check if the URL has expired
            if ($expires < time()) {
                if ($request->expectsJson()) {
                    return response()->json([
                        'message' => 'This signed URL has expired',
                        'status' => 'error'
                    ], 403);
                }
                
                return redirect()->route('login')
                    ->with('error', 'The link you clicked has expired. Please request a new one.');
            }
        }

        return $next($request);
    }
    
    /**
     * Get the expiration time for a specific route
     */
    public function getExpirationForRoute(string $routeName): int
    {
        return $this->routeExpirations[$routeName] ?? $this->defaultExpiration;
    }
} 