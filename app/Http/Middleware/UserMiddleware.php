<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        // Check if the user is logged in and has the 'student' role
        if (Auth::check() && Auth::user()->role !== 'student') {
            return redirect('/');  // Redirect to home if not a student
        }

        return $next($request);
    }
}
