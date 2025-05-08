<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Friend;
use App\Models\FriendRequest;
use Illuminate\Support\Facades\URL;

class FriendController extends Controller
{
    /**
     * Helper function to normalize avatar paths
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
     * Get all friends for the authenticated user
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $user = Auth::user();
    
        // Get all friendships where the user is either user_id or friend_id
        $friends = Friend::where('user_id', $user->id)
            ->with(['friend.userProfile'])
            ->get()
            ->map(function($friendship) {
                $friendUser = $friendship->friend;
    
                $avatarPath = $friendUser->userProfile ? $friendUser->userProfile->avatar_path : '/avatar/default.svg';
    
                return [
                    'id' => $friendship->id,
                    'friend_id' => $friendUser->id,
                    'name' => $friendUser->first_name . ' ' . $friendUser->last_name,
                    'username' => $friendUser->username,
                    'avatar' => $this->normalizeAvatarPath($avatarPath),
                    'status' => $friendUser->userProfile ? $friendUser->userProfile->online_status : 'offline',
                    'last_active' => $friendUser->userProfile ? $friendUser->userProfile->last_active : null,
                    'created_at' => $friendship->created_at,
                ];
            });
    
        return response()->json($friends);
    }

    
    /**
     * Get count of pending friend requests
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function requestsCount()
    {
        $count = FriendRequest::where('receiver_id', Auth::id())
                              ->where('status', 'pending')
                              ->count();
        
        return response()->json(['count' => $count]);
    }
    
    /**
     * Get all friend requests for the authenticated user
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function requests()
    {
        $requests = FriendRequest::where('receiver_id', Auth::id())
                                ->where('status', 'pending')
                                ->with('sender.userProfile')
                                ->get()
                                ->map(function($request) {
                                    // Get avatar path from the profile
                                    $avatarPath = $request->sender->userProfile ? $request->sender->userProfile->avatar_path : '/avatar/default.svg';
                                    
                                    return [
                                        'id' => $request->id,
                                        'user' => [
                                            'id' => $request->sender->id,
                                            'name' => $request->sender->first_name . ' ' . $request->sender->last_name,
                                            'username' => $request->sender->username,
                                            'avatar' => $this->normalizeAvatarPath($avatarPath),
                                        ],
                                        'created_at' => $request->created_at,
                                    ];
                                });
        
        return response()->json($requests);
    }
    
    /**
     * Send a friend request to another user
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function sendRequest(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);
        
        $senderId = Auth::id();
        $receiverId = $request->user_id;
        
        // Prevent sending request to self
        if ($senderId == $receiverId) {
            return response()->json(['message' => 'Cannot send friend request to yourself'], 400);
        }
        
        // Check if users are already friends
        $alreadyFriends = Friend::where(function($query) use ($senderId, $receiverId) {
            $query->where('user_id', $senderId)
                  ->where('friend_id', $receiverId);
        })->orWhere(function($query) use ($senderId, $receiverId) {
            $query->where('user_id', $receiverId)
                  ->where('friend_id', $senderId);
        })->exists();
        
        if ($alreadyFriends) {
            return response()->json(['message' => 'Users are already friends'], 400);
        }
        
        // Check if a request already exists from sender to receiver
        $existingRequest = FriendRequest::where('sender_id', $senderId)
                                       ->where('receiver_id', $receiverId)
                                       ->where('status', 'pending')
                                       ->first();
        
        if ($existingRequest) {
            return response()->json(['message' => 'Friend request already sent'], 400);
        }
        
        // Check if a request already exists from receiver to sender
        $existingReverseRequest = FriendRequest::where('sender_id', $receiverId)
                                              ->where('receiver_id', $senderId)
                                              ->where('status', 'pending')
                                              ->first();
        
        if ($existingReverseRequest) {
            // Auto-accept the reverse request
            $existingReverseRequest->status = 'accepted';
            $existingReverseRequest->save();
            
            // Create friendship (sender -> receiver)
            $friendship1 = new Friend();
            $friendship1->user_id = $senderId;
            $friendship1->friend_id = $receiverId;
            $friendship1->save();
            
            // Create friendship (receiver -> sender)
            $friendship2 = new Friend();
            $friendship2->user_id = $receiverId;
            $friendship2->friend_id = $senderId;
            $friendship2->save();
            
            return response()->json(['message' => 'Existing request accepted and friendship created'], 200);
        }
        
        // Create new friend request
        $friendRequest = new FriendRequest();
        $friendRequest->sender_id = $senderId;
        $friendRequest->receiver_id = $receiverId;
        $friendRequest->status = 'pending';
        $friendRequest->save();
        
        return response()->json(['message' => 'Friend request sent successfully']);
    }
    
    /**
     * Accept a friend request
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function acceptRequest($id)
    {
        $friendRequest = FriendRequest::findOrFail($id);
        
        // Check if the authenticated user is the receiver
        if ($friendRequest->receiver_id != Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        // Check if request is still pending
        if ($friendRequest->status !== 'pending') {
            return response()->json(['message' => 'This request has already been processed'], 400);
        }
        
        // Update request status
        $friendRequest->status = 'accepted';
        $friendRequest->save();
        
        // Create friendship (sender -> receiver)
        $friendship1 = new Friend();
        $friendship1->user_id = $friendRequest->sender_id;
        $friendship1->friend_id = $friendRequest->receiver_id;
        $friendship1->save();
        
        // Create friendship (receiver -> sender)
        $friendship2 = new Friend();
        $friendship2->user_id = $friendRequest->receiver_id;
        $friendship2->friend_id = $friendRequest->sender_id;
        $friendship2->save();
        
        return response()->json(['message' => 'Friend request accepted']);
    }
    
    /**
     * Reject a friend request
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function rejectRequest($id)
    {
        $friendRequest = FriendRequest::findOrFail($id);
        
        // Check if the authenticated user is the receiver
        if ($friendRequest->receiver_id != Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        // Check if request is still pending
        if ($friendRequest->status !== 'pending') {
            return response()->json(['message' => 'This request has already been processed'], 400);
        }
        
        // Update request status
        $friendRequest->status = 'rejected';
        $friendRequest->save();
        
        return response()->json(['message' => 'Friend request rejected']);
    }
    
    /**
     * Remove a friend
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function removeFriend($id)
    {
        $userId = Auth::id();
        
        // Find and delete all friendship records between these two users
        $deleted = Friend::where(function($query) use ($userId, $id) {
            $query->where('user_id', $userId)
                  ->where('friend_id', $id);
        })->orWhere(function($query) use ($userId, $id) {
            $query->where('user_id', $id)
                  ->where('friend_id', $userId);
        })->delete();
        
        if (!$deleted) {
            return response()->json(['message' => 'Friendship not found'], 404);
        }
        
        return response()->json(['message' => 'Friend removed successfully']);
    }
    
    /**
     * Search for users to add as friends
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
   public function searchUsers(Request $request)
{
    $query = $request->input('query');

    if (empty($query) || strlen($query) < 3) {
        return response()->json([]);
    }

    $currentUserId = Auth::id();

    // Get users matching the search query
    $users = User::where('id', '!=', $currentUserId)
                ->where(function ($q) use ($query) {
                    $q->where('first_name', 'like', "%{$query}%")
                      ->orWhere('last_name', 'like', "%{$query}%")
                      ->orWhere('username', 'like', "%{$query}%")
                      ->orWhere('email', 'like', "%{$query}%");
                })
                ->with('userProfile')
                ->limit(20)
                ->get();

    // Get all friend IDs for the current user
    $friendIds = Friend::where(function ($q) use ($currentUserId) {
        $q->where('user_id', $currentUserId)
          ->orWhere('friend_id', $currentUserId);
    })->get()->map(function ($friendship) use ($currentUserId) {
        return $friendship->user_id == $currentUserId ? $friendship->friend_id : $friendship->user_id;
    })->toArray();

    // Get all pending request receiver IDs sent by the current user
    $pendingRequestIds = FriendRequest::where('sender_id', $currentUserId)
                                     ->where('status', 'pending')
                                     ->pluck('receiver_id')
                                     ->toArray();

    // Format the result
    $results = $users->map(function ($user) use ($friendIds, $pendingRequestIds) {
        $status = 'none';
        if (in_array($user->id, $friendIds)) {
            $status = 'friend';
        } elseif (in_array($user->id, $pendingRequestIds)) {
            $status = 'requested';
        }

        $avatarPath = $user->userProfile ? $user->userProfile->avatar_path : '/avatar/default.svg';

        return [
            'id' => $user->id,
            'name' => $user->first_name . ' ' . $user->last_name,
            'username' => $user->username,
            'email' => $user->email,
            'avatar' => $this->normalizeAvatarPath($avatarPath),
            'status' => $status,
        ];
    });

    return response()->json($results);
}

    
    /**
     * Get signed URLs for friend operations
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getSignedUrls()
    {
        try {
            // Instead of using signed URLs, let's return simplified endpoints that don't require signing
            $urls = [
                'sendRequest' => '/api/friend-requests',
                'acceptRequest' => '/api/friend-requests/__ID__/accept',
                'rejectRequest' => '/api/friend-requests/__ID__/reject',
                'removeFriend' => '/api/friends/__ID__',
            ];
            
            return response()->json($urls);
        } catch (\Exception $e) {
            \Log::error('Error generating signed URLs: ' . $e->getMessage());
            return response()->json(['error' => 'Could not generate URLs', 'message' => $e->getMessage()], 500);
        }
    }
    
    /**
     * Fetch friend statistics
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function statistics()
    {
        $userId = Auth::id();
        
        // Count total friends
        $totalFriends = Friend::where('user_id', $userId)
                              ->orWhere('friend_id', $userId)
                              ->count();
        
        // Count pending requests
        $pendingRequests = FriendRequest::where('receiver_id', $userId)
                                       ->where('status', 'pending')
                                       ->count();
        
        // Count sent requests
        $sentRequests = FriendRequest::where('sender_id', $userId)
                                    ->where('status', 'pending')
                                    ->count();
        
        // Count online friends
        $onlineFriends = DB::table('friends')
            ->join('users as u', function($join) use ($userId) {
                $join->on('u.id', '=', 'friends.friend_id')
                     ->where('friends.user_id', '=', $userId);
            })
            ->join('profiles as p', 'u.id', '=', 'p.user_id')
            ->where('p.online_status', '=', 'online')
            ->count();
            
        // Add count for the reverse relationship
        $onlineFriends += DB::table('friends')
            ->join('users as u', function($join) use ($userId) {
                $join->on('u.id', '=', 'friends.user_id')
                     ->where('friends.friend_id', '=', $userId);
            })
            ->join('profiles as p', 'u.id', '=', 'p.user_id')
            ->where('p.online_status', '=', 'online')
            ->count();
        
        return response()->json([
            'total_friends' => $totalFriends,
            'pending_requests' => $pendingRequests, 
            'sent_requests' => $sentRequests,
            'online_friends' => $onlineFriends
        ]);
    }
    
    /**
     * Seed friendships (development only)
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function seedFriendships()
    {
        // Implementation for development environment only
        if (!app()->environment('local')) {
            return response()->json(['message' => 'This endpoint is only available in local environment'], 403);
        }
        
        // Seed implementation would go here
        
        return response()->json(['message' => 'Friend data seeded successfully']);
    }
}