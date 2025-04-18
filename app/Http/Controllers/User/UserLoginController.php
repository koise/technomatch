<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Models\User;

class UserLoginController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'login' => 'required|string', // username or email
            'password' => 'required|string',
            'remember_me' => 'nullable|boolean',  // Add remember_me validation
        ]);

        $login = $request->login;

        $fieldType = filter_var($login, FILTER_VALIDATE_EMAIL) ? 'email' : 'username';

        $user = User::where($fieldType, $login)->first();

        if (!$user) {
            Log::error("Login failed: $fieldType '$login' not found.");
            return response()->json(['message' => ucfirst($fieldType) . ' not found.'], 404);
        }
        if (!Hash::check($request->password, $user->password)) {
            Log::error("Login failed: Incorrect password for $fieldType '$login'.");

            return response()->json(['message' => 'Incorrect password.'], 401);
        }
        if (!$user->email_verified) {
            Log::error("Login failed: Email not verified for $fieldType '$login'.");

            return response()->json(['message' => 'Email not verified.'], 403);
        }
        $token = null;
        if ($request->remember_me) {
            $token = $user->createToken('remember_token')->plainTextToken;
        }
        $user->forceFill([
            'remember_token' => $token,
        ])->save();
        Log::info("User '$login' logged in successfully.");

        return response()->json([
            'message' => 'Login successful.',
            'token' => $token
        ]);
    }
}