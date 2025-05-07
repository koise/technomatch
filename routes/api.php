<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FriendController;
use App\Http\Controllers\UserController;

// Add a test endpoint to check if API routes are working
Route::get('/test', function() {
    return response()->json(['message' => 'API routes are working']);
});

// Regular authenticated routes
Route::middleware('auth:sanctum')->group(function () {
    // User info
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Friend list and search endpoints
    Route::get('/friends', [FriendController::class, 'index']);
    Route::get('/friend-requests/count', [FriendController::class, 'requestsCount']);
    Route::get('/friend-requests', [FriendController::class, 'requests']);
    Route::get('/users/search', [UserController::class, 'search']);
    
    // Get signed URLs for friend operations
    Route::get('/friends/signed-urls', [FriendController::class, 'getSignedUrls']);
    
    // Send friend request - only requires auth
    Route::post('/friend-requests', [FriendController::class, 'sendRequest'])->name('friends.sendRequest');

    // Friend request management endpoints that require ownership verification
    Route::post('/friend-requests/{id}/accept', [FriendController::class, 'acceptRequest'])->name('friends.acceptRequest');
    Route::post('/friend-requests/{id}/reject', [FriendController::class, 'rejectRequest'])->name('friends.rejectRequest');
    Route::delete('/friends/{id}', [FriendController::class, 'removeFriend'])->name('friends.removeFriend');
});

// Move secured.api and friendship.auth middleware to specific routes only if needed
// Route::middleware(['secured.api', 'friendship.auth'])->group(function () {
//     // Friend request management endpoints that require ownership verification
//     Route::post('/friend-requests/{id}/accept', [FriendController::class, 'acceptRequest'])->name('friends.acceptRequest');
//     Route::post('/friend-requests/{id}/reject', [FriendController::class, 'rejectRequest'])->name('friends.rejectRequest');
//     Route::delete('/friends/{id}', [FriendController::class, 'removeFriend'])->name('friends.removeFriend');
// });
