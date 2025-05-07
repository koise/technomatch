<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Friend;
use App\Models\FriendRequest;

class FriendshipAuth
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $userId = Auth::id();
        
        // For friend request accept/reject operations
        if ($request->route('id') && $request->is('api/friend-requests/*')) {
            $requestId = $request->route('id');
            $friendRequest = FriendRequest::find($requestId);
            
            if (!$friendRequest) {
                return response()->json(['message' => 'Friend request not found'], 404);
            }
            
            // Only the receiver of a request can accept/reject it
            if ($friendRequest->receiver_id !== $userId) {
                return response()->json(['message' => 'Unauthorized to manage this friend request'], 403);
            }
        }
        
        // For friend removal operations
        if ($request->route('id') && $request->is('api/friends/*')) {
            $friendId = $request->route('id');
            
            // Check if a friendship exists where the user is either user_id or friend_id
            $friendship = Friend::where(function($query) use ($userId, $friendId) {
                $query->where('user_id', $userId)
                      ->where('friend_id', $friendId);
            })->orWhere(function($query) use ($userId, $friendId) {
                $query->where('user_id', $friendId)
                      ->where('friend_id', $userId);
            })->first();
            
            if (!$friendship) {
                return response()->json(['message' => 'Friendship not found'], 404);
            }
        }
        
        return $next($request);
    }
} 