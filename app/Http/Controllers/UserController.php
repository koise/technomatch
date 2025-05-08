<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Log;
use App\Models\User;
use App\Models\Friend;
use App\Models\FriendRequest;

class UserController extends Controller
{
    /**
     * Normalize avatar path for consistency
     *
     * @param string $path
     * @return string
     */
    private function normalizeAvatarPath($path)
    {
        if (!$path) {
            return '/avatar/default.svg';
        }
        
        // Ensure the path starts with a slash for consistency
        return $path[0] === '/' ? $path : '/' . $path;
    }

    /**
     * Search for users by name, username, or email
     * Returns users that are not the current user and not already friends
     */
    public function search(Request $request)
    {
        try {
            $query = $request->input('query');
            $criteria = $request->input('criteria', 'all');
            
            if (!$query || strlen($query) < 2) {
                return response()->json([]);
            }
            
            $currentUser = Auth::user();
            
            // Debug the schema first
            $userColumns = Schema::getColumnListing('users');
            Log::info('User table columns: ' . json_encode($userColumns));
            
            // Get all friend IDs for the current user first so we can exclude them
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
            
            // Add the current user's ID to the exclusion list    
            $excludeIds = array_merge([$currentUser->id], $friendIds);
            
            // Query for users excluding already friends
            $usersQuery = User::whereNotIn('id', $excludeIds);
            
            // Apply search criteria with correct column names
            if ($criteria === 'all') {
                $usersQuery->where(function($q) use ($query) {
                    // Adjusted to use the correct column names
                    $q->where('first_name', 'like', "%{$query}%")
                      ->orWhere('last_name', 'like', "%{$query}%")
                      ->orWhere('username', 'like', "%{$query}%")
                      ->orWhere('email', 'like', "%{$query}%");
                });
            } elseif ($criteria === 'name') {
                $usersQuery->where(function($q) use ($query) {
                    $q->where('first_name', 'like', "%{$query}%")
                      ->orWhere('last_name', 'like', "%{$query}%");
                });
            } elseif ($criteria === 'username') {
                $usersQuery->where('username', 'like', "%{$query}%");
            } elseif ($criteria === 'email') {
                $usersQuery->where('email', 'like', "%{$query}%");
            }
            
            // Eager load userProfile (correct relationship name)
            $users = $usersQuery->with('userProfile')
                ->take(10)
                ->get();
                
            // Filter to only include users with profiles
            $usersWithProfiles = $users->filter(function($user) {
                return $user->userProfile !== null;
            });
            
            if ($usersWithProfiles->isEmpty()) {
                return response()->json([]);
            }
            
            // Get IDs of users who have pending friend requests from the current user
            $pendingRequestIds = FriendRequest::where('sender_id', $currentUser->id)
                ->where('status', 'pending')
                ->pluck('receiver_id')
                ->toArray();
            
            // Format user data with friendship status
            $result = $usersWithProfiles->map(function($user) use ($pendingRequestIds) {
                $fullName = trim($user->first_name . ' ' . $user->last_name);
                $avatarPath = $user->userProfile ? $user->userProfile->avatar_path : '/avatar/default.svg';
                
                return [
                    'id' => $user->id,
                    'name' => $fullName,
                    'username' => $user->username,
                    'email' => $user->email,
                    'avatar' => $this->normalizeAvatarPath($avatarPath),
                    'isFriend' => false, // Already filtered out friends
                    'requestSent' => in_array($user->id, $pendingRequestIds),
                    'notificationVisible' => false
                ];
            });
            
            // Ensure results are unique by user ID
            $uniqueResult = collect($result)->keyBy('id')->values()->all();
            
            return response()->json($uniqueResult);
        } catch (\Exception $e) {
            \Log::error('Error in user search: ' . $e->getMessage());
            \Log::error($e->getTraceAsString());
            return response()->json(
                ['error' => 'An error occurred while searching for users', 'message' => $e->getMessage()], 
                500
            );
        }
    }
} 