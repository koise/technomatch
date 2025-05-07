<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class AuthRedirectPaths
{
    /**
     * Custom redirect paths based on user role/type
     */
    protected $customRedirects = [
        'admin' => '/admin/dashboard',
        'moderator' => '/moderator/dashboard',
        'developer' => '/dashboard',
        'contributor' => '/dashboard',
        'default' => '/dashboard'
    ];

    /**
     * Login redirect paths based on the URL being accessed
     */
    protected $loginRedirectPaths = [
        '/admin*' => '/login?redirect=admin',
        '/moderator*' => '/login?redirect=moderator',
        '/profile*' => '/login?redirect=profile',
        '/settings*' => '/login?redirect=settings',
        '/default' => '/login'
    ];

    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Store the intended URL if it's not already set and not a signed URL
        if (!session()->has('url.intended') && !$request->hasValidSignature()) {
            $currentUrl = $request->fullUrl();
            
            // Don't store login, register, or other auth pages as intended URL
            $authPages = ['login', 'register', 'signup', 'password/reset', 'password/email'];
            $isAuthPage = false;
            
            foreach ($authPages as $page) {
                if (str_contains($currentUrl, $page)) {
                    $isAuthPage = true;
                    break;
                }
            }
            
            if (!$isAuthPage) {
                session(['url.intended' => $currentUrl]);
            }
        }
        
        return $next($request);
    }
    
    /**
     * Get the appropriate redirect path for an authenticated user
     */
    public function getRedirectPathForUser($user = null)
    {
        if (!$user) {
            $user = Auth::user();
        }
        
        if (!$user) {
            return $this->customRedirects['default'];
        }
        
        // If session has intended URL, use that
        if (session()->has('url.intended')) {
            $intended = session('url.intended');
            session()->forget('url.intended');
            return $intended;
        }
        
        // Check if user has a role and return the appropriate redirect path
        if (method_exists($user, 'getRoleNames') && $user->getRoleNames()->isNotEmpty()) {
            $role = $user->getRoleNames()[0];
            return $this->customRedirects[$role] ?? $this->customRedirects['default'];
        }
        
        // If user has a role property, use that
        if (isset($user->role) && $user->role) {
            return $this->customRedirects[$user->role] ?? $this->customRedirects['default'];
        }
        
        // Default redirect
        return $this->customRedirects['default'];
    }
    
    /**
     * Get the appropriate login path for the requested URL
     */
    public function getLoginPathForUrl($url)
    {
        foreach ($this->loginRedirectPaths as $pattern => $loginPath) {
            if (fnmatch($pattern, $url)) {
                return $loginPath;
            }
        }
        
        return $this->loginRedirectPaths['default'];
    }
} 