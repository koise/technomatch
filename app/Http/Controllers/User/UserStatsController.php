<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\UserProfile;
use App\Models\UserProgressiveStat;
use App\Models\UserRankStat;
use Illuminate\Support\Facades\Log;

class UserStatsController extends Controller
{   

    public function fetchUser(Request $request)
    {
        $userId = $request->query('user_id', session('user_id'));
        $user = User::with([
            'userProfile',
            'userRankStat',
            'userProgressiveStat'
        ])->find($userId);
    
        if (!$user) {
            return response()->json([
                'message' => 'User not found.',
            ], 404);
        }

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->first_name . ' ' . $user->last_name,
                'email' => $user->email,
                'username' => $user->username,
                'profile' => $user->userProfile,
                'progressive' => [
                    'level' => $user->userProgressiveStat->level,
                    'xp' => $user->userProgressiveStat->xp,
                    'nextLevel' => $user->userProgressiveStat->next_level_xp,
                    'completed' => $user->userProgressiveStat->completed_challenges
                ],
                'ranked' => [
                    'tier' => $user->userRankStat->tier,
                    'points' => $user->userRankStat->points,
                    'position' => $user->userRankStat->position,
                    'streak'  => $user->userRankStat->win_streak,
                    'winRate' => $this->calculateWinRate($user->userRankStat)
                ]
            ]
        ]);
    }

    private function calculateWinRate($rankStat)
    {
        $totalGames = $rankStat->wins + $rankStat->losses;
        if ($totalGames === 0) {
            return 'No game';
        }
        
        $winRate = ($rankStat->wins / $totalGames) * 100;
        return round($winRate) . '%';
    }
    
    public function updateUserStatus(Request $request)
    {
        $request->validate([
            'status' => 'required|string|in:online,offline,queuing,playing,post-match',
        ]);

        $userId = session('user_id');
        $profile = UserProfile::where('user_id', $userId)->first();

        if (!$profile) {
            return response()->json([
                'message' => 'User profile not found.',
            ], 404);
        }

        $profile->online_status = $request->status;
        $profile->last_active = now();
        $profile->save();

        return response()->json([
            'message' => 'User status updated successfully.',
            'status' => $profile->online_status
        ]);
    }

    public function updateUserPreference(Request $request)
    {
        $request->validate([
            'preference' => 'required|string|in:dark_mode,preferred_font',
            'value' => 'required',
        ]);

        $userId = session('user_id');
        $profile = UserProfile::where('user_id', $userId)->first();

        if (!$profile) {
            return response()->json([
                'message' => 'User profile not found.',
            ], 404);
        }

        switch ($request->preference) {
            case 'dark_mode':
                $profile->dark_mode = (bool) $request->value;
                break;
            case 'preferred_font':
                $profile->preferred_font = $request->value;
                break;
        }

        $profile->save();

        return response()->json([
            'message' => 'User preference updated successfully.',
            'preference' => $request->preference,
            'value' => $request->value
        ]);
    }

}