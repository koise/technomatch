<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RedirectIfAuthenticated
{
    public function handle(Request $request, Closure $next)
    {
        // If the user is authenticated, redirect them to the home page or dashboard
        if (Auth::check()) {
            return redirect('/');  // Change this to wherever you want the authenticated users to go
        }

        return $next($request);
    }
}
