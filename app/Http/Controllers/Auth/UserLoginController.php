<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserLoginController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'username_or_email' => 'required|string',
            'password' => 'required|string',
            'remember_me' => 'nullable|boolean',
        ]);
    
        $usernameOrEmail = $request->input('username_or_email');
        $user = null;
    
        if (filter_var($usernameOrEmail, FILTER_VALIDATE_EMAIL)) {
            $user = User::where('email', $usernameOrEmail)->first();
        } else {
            $user = User::where('username', $usernameOrEmail)->first();
        }
    
        if ($user && Hash::check($request->input('password'), $user->password)) {
            // Store user ID in session
            session(['user_id' => $user->id]);
    
            return response()->json([
                'message' => 'Login successful',
                'user' => $user,
                'session_user_id' => session('user_id'),
            ]);
        }
    
        return response()->json([
            'message' => 'Invalid credentials',
        ], 401);
    }

    public function checkUsernameExist(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
        ]);

        $username = $request->input('username');
        $user = User::where('username', $username)->first();

        if ($user) {
            return response()->json([
                'message' => 'Username exists.',
                'exists' => true,
            ]);
        }

        return response()->json([
            'message' => 'Username does not exist.',
            'exists' => false,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:100',
            'last_name'  => 'required|string|max:100',
            'role'       => 'nullable|string|max:50',
            'username'   => 'required|string|max:50|unique:users,username',
            'password'   => 'required|string|min:8',
        ]);

        $user = User::create([
            'first_name' => $validated['first_name'],
            'last_name'  => $validated['last_name'],
            'role'       => $validated['role'] ?? 'Student',
            'username'   => $validated['username'],
            'password'   => Hash::make($validated['password']),
        ]);

        return response()->json([
            'message' => 'User registered successfully.',
            'user' => $user
        ]);
    }
}
