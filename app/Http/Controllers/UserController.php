<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Friend;
use App\Models\FriendRequest;

class UserController extends Controller
{
    /**
     * Search for users by name, username, or email
     * Returns users that are not the current user and not already friends
     */
    public function search(Request $request)
    {
        $query = $request->input('query');
        
        if (!$query || strlen($query) < 2) {
            return response()->json([]);
        }
        
        $currentUser = Auth::user();
        
        // Get all users matching the search query excluding the current user
        $users = User::where('id', '!=', $currentUser->id)
            ->where(function($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                  ->orWhere('username', 'like', "%{$query}%")
                  ->orWhere('email', 'like', "%{$query}%");
            })
            ->take(10) // Limit results to 10 users
            ->get(['id', 'name', 'username', 'email']);
        
        if ($users->isEmpty()) {
            return response()->json([]);
        }
        
        // Get IDs of users who are already friends with the current user
        $friendIds = Friend::where(function($q) use ($currentUser) {
                $q->where('user_id', $currentUser->id)
                  ->orWhere('friend_id', $currentUser->id);
            })
            ->get()
            ->map(function($friendship) use ($currentUser) {
                return $friendship->user_id === $currentUser->id 
                    ? $friendship->friend_id 
                    : $friendship->user_id;
            })
            ->toArray();
        
        // Get IDs of users who have pending friend requests from the current user
        $pendingRequestIds = FriendRequest::where('sender_id', $currentUser->id)
            ->where('status', 'pending')
            ->pluck('receiver_id')
            ->toArray();
        
        // Format user data with friendship status
        $result = $users->map(function($user) use ($friendIds, $pendingRequestIds) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'username' => $user->username,
                'email' => $user->email,
                'avatar' => $user->profile ? $user->profile->avatar_path : '/avatar/default.svg',
                'isFriend' => in_array($user->id, $friendIds),
                'requestSent' => in_array($user->id, $pendingRequestIds),
                'notificationVisible' => false
            ];
        });
        
        return response()->json($result);
    }
} 