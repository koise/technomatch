<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RedirectController extends Controller
{
    /**
     * Redirect users based on authentication status
     */
    public function redirectBasedOnAuth(Request $request)
    {
        // If user is authenticated, redirect to dashboard
        if (Auth::check()) {
            return redirect()->route('dashboard');
        }
        
        // If not authenticated, redirect to login page
        return redirect()->route('login');
    }
    
    /**
     * Handle the home page redirection
     */
    public function home(Request $request)
    {
        // If user is authenticated, redirect to dashboard
        if (Auth::check()) {
            return redirect()->route('dashboard');
        }
        
        // For non-authenticated users, show the welcome/landing page
        return view('welcome');
    }
    
    /**
     * Handle unauthorized access attempts
     */
    public function unauthorized(Request $request)
    {
        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'You do not have permission to access this resource',
                'status' => 'error'
            ], 403);
        }
        
        return view('errors.403', [
            'message' => 'You do not have permission to access this page'
        ]);
    }
} 