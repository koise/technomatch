<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Symfony\Component\HttpFoundation\Response;

class EnsureEmailIsVerified
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // If user is not authenticated, let the auth middleware handle it
        if (!Auth::check()) {
            return $next($request);
        }

        $user = Auth::user();
        
        // If the user is verified, proceed with the request
        if ($user->hasVerifiedEmail()) {
            return $next($request);
        }

        // For API requests, return a JSON response
        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'Your email address is not verified.',
                'verified' => false
            ], 403);
        }

        // Otherwise, redirect to the verification page
        return Redirect::to('/verify')
            ->with('warning', 'You need to verify your email address before accessing this page.');
    }
} 