<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Friend;
use App\Models\FriendRequest;
use Illuminate\Support\Facades\URL;
use App\Http\Middleware\SignedUrlExpiration;

class FriendController extends Controller
{
    /**
     * Get all friends for the authenticated user
     */
    public function index()
    {
        $user = Auth::user();
        
        // Get friends where the user is either the sender or receiver
        $friends = Friend::where(function($query) use ($user) {
            $query->where('user_id', $user->id)
                  ->orWhere('friend_id', $user->id);
        })
        ->with(['user', 'friend'])
        ->get()
        ->map(function($friendship) use ($user) {
            // Determine which user in the friendship is the friend (not the current user)
            $friendUser = $friendship->user_id == $user->id ? $friendship->friend : $friendship->user;
            
            return [
                'id' => $friendship->id,
                'name' => $friendUser->name,
                'username' => $friendUser->username,
                'avatar' => $friendUser->profile ? $friendUser->profile->avatar_path : '/avatar/default.svg',
                'status' => $friendUser->profile ? $friendUser->profile->online_status : 'offline',
                'last_active' => $friendUser->profile ? $friendUser->profile->last_active : null,
            ];
        });
        
        return response()->json($friends);
    }
    
    /**
     * Get count of pending friend requests
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
     */
    public function requests()
    {
        $requests = FriendRequest::where('receiver_id', Auth::id())
                                ->where('status', 'pending')
                                ->with('sender')
                                ->get()
                                ->map(function($request) {
                                    return [
                                        'id' => $request->id,
                                        'user' => [
                                            'id' => $request->sender->id,
                                            'name' => $request->sender->name,
                                            'username' => $request->sender->username,
                                            'avatar' => $request->sender->profile ? $request->sender->profile->avatar_path : '/avatar/default.svg',
                                        ],
                                        'created_at' => $request->created_at,
                                    ];
                                });
        
        return response()->json($requests);
    }
    
    /**
     * Send a friend request to another user
     */
    public function sendRequest(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);
        
        $senderId = Auth::id();
        $receiverId = $request->user_id;
        
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
        
        // Check if a request already exists
        $existingRequest = FriendRequest::where('sender_id', $senderId)
                                       ->where('receiver_id', $receiverId)
                                       ->where('status', 'pending')
                                       ->first();
        
        if ($existingRequest) {
            return response()->json(['message' => 'Friend request already sent'], 400);
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
     */
    public function acceptRequest($id)
    {
        $friendRequest = FriendRequest::findOrFail($id);
        
        // Check if the authenticated user is the receiver
        if ($friendRequest->receiver_id != Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        // Update request status
        $friendRequest->status = 'accepted';
        $friendRequest->save();
        
        // Create friendship
        $friendship = new Friend();
        $friendship->user_id = $friendRequest->sender_id;
        $friendship->friend_id = $friendRequest->receiver_id;
        $friendship->save();
        
        return response()->json(['message' => 'Friend request accepted']);
    }
    
    /**
     * Reject a friend request
     */
    public function rejectRequest($id)
    {
        $friendRequest = FriendRequest::findOrFail($id);
        
        // Check if the authenticated user is the receiver
        if ($friendRequest->receiver_id != Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        // Update request status
        $friendRequest->status = 'rejected';
        $friendRequest->save();
        
        return response()->json(['message' => 'Friend request rejected']);
    }
    
    /**
     * Remove a friend
     */
    public function removeFriend($id)
    {
        $userId = Auth::id();
        
        // Find and delete the friendship
        $friendship = Friend::where(function($query) use ($userId, $id) {
            $query->where('user_id', $userId)
                  ->where('friend_id', $id);
        })->orWhere(function($query) use ($userId, $id) {
            $query->where('user_id', $id)
                  ->where('friend_id', $userId);
        })->first();
        
        if (!$friendship) {
            return response()->json(['message' => 'Friendship not found'], 404);
        }
        
        $friendship->delete();
        
        return response()->json(['message' => 'Friend removed successfully']);
    }

    /**
     * Get signed URLs for friend operations
     */
    public function getSignedUrls()
    {
        // Get expiration times from middleware
        $expirationMiddleware = app(SignedUrlExpiration::class);
        
        // Current timestamp
        $now = time();
        
        $urls = [
            'sendRequest' => URL::signedRoute('friends.sendRequest', ['expires' => $now + $expirationMiddleware->getExpirationForRoute('friends.sendRequest')]),
            'acceptRequest' => URL::signedRoute('friends.acceptRequest', [
                'id' => '__ID__', 
                'expires' => $now + $expirationMiddleware->getExpirationForRoute('friends.acceptRequest')
            ]),
            'rejectRequest' => URL::signedRoute('friends.rejectRequest', [
                'id' => '__ID__', 
                'expires' => $now + $expirationMiddleware->getExpirationForRoute('friends.rejectRequest')
            ]),
            'removeFriend' => URL::signedRoute('friends.removeFriend', [
                'id' => '__ID__', 
                'expires' => $now + $expirationMiddleware->getExpirationForRoute('friends.removeFriend')
            ]),
        ];
        
        return response()->json($urls);
    }
} 