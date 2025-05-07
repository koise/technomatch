<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SignedApiAccessMiddleware
{
    /**
     * API routes that require signatures and their associated operations
     */
    protected $signedApiRoutes = [
        'friends.acceptRequest' => ['POST'],
        'friends.rejectRequest' => ['POST'],
        'friends.removeFriend' => ['DELETE'],
    ];

    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $currentRoute = $request->route()->getName();
        $method = $request->method();
        
        // If this is one of our signed API routes
        if (array_key_exists($currentRoute, $this->signedApiRoutes)) {
            if (!$request->hasValidSignature()) {
                return response()->json([
                    'message' => 'Invalid signature or URL tampering detected',
                    'status' => 'error'
                ], 403);
            }
            
            // Check if the HTTP method is allowed for this route
            if (!in_array($method, $this->signedApiRoutes[$currentRoute])) {
                return response()->json([
                    'message' => 'Invalid HTTP method for this signed URL',
                    'status' => 'error'
                ], 405);
            }
            
            // Additionally verify the URL hasn't expired (if we were using URL expiration)
            if ($request->query('expires') && $request->query('expires') < time()) {
                return response()->json([
                    'message' => 'This signed URL has expired',
                    'status' => 'error'
                ], 403);
            }
        }

        return $next($request);
    }
} 