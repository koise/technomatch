<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class UserRoleSignedUrlRestrictions
{
    /**
     * Restricted roles that can't use signed URLs for certain operations
     */
    protected $restrictedRoles = [
        'admin' => [
            'friends.acceptRequest',
            'friends.rejectRequest',
            'friends.removeFriend'
        ],
        'moderator' => [
            'friends.removeFriend'
        ]
    ];

    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Only check signed URLs
        if ($request->hasValidSignature() && Auth::check()) {
            $user = Auth::user();
            $routeName = $request->route()->getName();
            
            // Check if the user has a role that is restricted from this action
            foreach ($this->restrictedRoles as $role => $restrictedRoutes) {
                // Note: Adjust the condition below based on how roles are stored in your app
                if ($user->hasRole($role) || $user->role === $role) {
                    if (in_array($routeName, $restrictedRoutes)) {
                        if ($request->expectsJson()) {
                            return response()->json([
                                'message' => 'Your user role cannot perform this action via a signed URL',
                                'status' => 'error'
                            ], 403);
                        }
                        
                        return redirect()->back()
                            ->with('error', 'Your user role cannot perform this action via a signed URL');
                    }
                }
            }
        }

        return $next($request);
    }
} 