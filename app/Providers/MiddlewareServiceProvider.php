<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Routing\Router;
use App\Http\Middleware\ValidateSignature;
use App\Http\Middleware\FriendshipAuth;
use App\Http\Middleware\RestrictedAreaMiddleware;
use App\Http\Middleware\SignedApiAccessMiddleware;
use App\Http\Middleware\SignedUrlExpiration;
use App\Http\Middleware\WebSignedUrlRestrictions;
use App\Http\Middleware\UserRoleSignedUrlRestrictions;
use App\Http\Middleware\LoggedUserRouteRestrictions;
use App\Http\Middleware\AuthRedirectPaths;
use App\Http\Middleware\EnsureEmailIsVerified;

class MiddlewareServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        $router = $this->app->make(Router::class);
        
        // Register middlewares
        $router->aliasMiddleware('signed', ValidateSignature::class);
        $router->aliasMiddleware('friendship.auth', FriendshipAuth::class);
        $router->aliasMiddleware('restricted.area', RestrictedAreaMiddleware::class);
        $router->aliasMiddleware('signed.api', SignedApiAccessMiddleware::class);
        $router->aliasMiddleware('signed.expires', SignedUrlExpiration::class);
        $router->aliasMiddleware('web.signed.restrictions', WebSignedUrlRestrictions::class);
        $router->aliasMiddleware('role.signed.restrictions', UserRoleSignedUrlRestrictions::class);
        $router->aliasMiddleware('auth.route.restrictions', LoggedUserRouteRestrictions::class);
        $router->aliasMiddleware('auth.redirects', AuthRedirectPaths::class);
        $router->aliasMiddleware('verified', EnsureEmailIsVerified::class);
        
        // Define middleware groups
        $router->middlewareGroup('secured.routes', [
            'signed',
            'signed.expires',
            'restricted.area'
        ]);
        
        $router->middlewareGroup('secured.api', [
            'auth:sanctum',
            'signed',
            'signed.api',
            'signed.expires',
            'role.signed.restrictions'
        ]);
        
        $router->middlewareGroup('secured.web', [
            'web',
            'web.signed.restrictions',
            'role.signed.restrictions'
        ]);
        
        // Public routes that redirect logged-in users
        $router->middlewareGroup('public.only', [
            'web',
            'auth.route.restrictions',
            'auth.redirects'
        ]);
        
        // Routes that require verification
        $router->middlewareGroup('requires.verification', [
            'auth:sanctum',
            'verified'
        ]);
    }
} 