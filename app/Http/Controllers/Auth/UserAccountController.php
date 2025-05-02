<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\UserProfile;
use App\Models\UserProgressiveStat;
use App\Models\UserRankStat;
use Illuminate\Support\Facades\Log;

class UserAccountController extends Controller
{   
    public function creatingProfiles(Request $request)
    {
        try {
            $validated = $request->validate([
                'email'             => 'required|email', 
                'language'          => 'nullable|string|max:255',
                'school'            => 'nullable|string|max:255',
                'bio'               => 'nullable|string',
                'avatar'            => 'nullable|string',
            ]);
    
            // Find or create the user
            $user = User::firstOrNew(['email' => $validated['email']]);
            
            // If it's a new user, set the email
            if (!$user->exists) {
                $user->email = $validated['email'];
            }
            
            $user->programming_language = $validated['language'] ?? null;
            $user->school = $validated['school'] ?? null;
            $user->bio = $validated['bio'] ?? null;
            $user->save();
            $user->status = 'active';
    
            $userProfile = UserProfile::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'avatar_path'   => isset($validated['avatar']) ? '/avatar/' . $validated['avatar'] : '/avatar/default-7.svg',
                    'rank_title'    => 'Newbie',
                    'online_status' => 'offline',
                    'last_active'   => now(),
                    'preferred_font'=> 'System UI',
                    'dark_mode'     => 0,
                    'school'        => $validated['school'] ?? null,
                    'bio'           => $validated['bio'] ?? null,
                ]
            );
    
            $progressiveStat = UserProgressiveStat::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'level'               => 0,
                    'xp'                  => 0,
                    'next_level_xp'       => 0,
                    'completed_challenges'=> 0,
                ]
            );
    
            $rankedStat = UserRankStat::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'tier'       => 'Calibrating',
                    'points'     => 0,
                    'mmr'        => 1000,
                    'position'   => 0,
                    'wins'       => 0,
                    'losses'     => 0,
                    'draws'      => 0,
                    'win_streak' => 0,
                ]
            );
    
            return response()->json([
                'message' => 'User and profile created/updated successfully!',
                'user' => $user,
                'userProfile' => $userProfile,
                'rankedStat' => $rankedStat,
                'progressiveStat' => $progressiveStat,
            ], 201);
    
        } catch (\Exception $e) {
            Log::error('Error creating/updating user and profile', [
                'error' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile(),
                'trace' => $e->getTraceAsString(),
            ]);
    
            return response()->json([
                'message' => 'An error occurred while creating/updating user and profile.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    
    public function logout(Request $request)
    {
        $request->session()->flush();
        Auth::logout();
        return redirect('/login');
    }


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

    public function checkEmail(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);
    
        $email = $request->input('email');
        $user = User::where('email', $email)->first();
    
        if ($user) {
            return response()->json([
                'message' => 'Email exists.',
                'exists' => true,
            ]);
        }
    
        return response()->json([
            'message' => 'Email does not exist.',
            'exists' => false,
        ]);
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
            'gender'     => 'required|string|max:50',
            'email'      => 'required|string|max:50|unique:users,email',
            'username'   => 'required|string|max:50|unique:users,username',
            'password'   => 'required|string|min:8',
        ]);

        $user = User::create([
            'first_name' => $validated['first_name'],
            'last_name'  => $validated['last_name'],
            'role'       => $validated['role'] ?? 'Student',
            'gender'       => $validated['gender'] ?? 'Others',
            'email'      => $validated['email'],
            'username'   => $validated['username'],
            'password'   => Hash::make($validated['password']),
        ]);

        return response()->json([
            'message' => 'User registered successfully.',
            'user' => $user
        ]);
    }
}
