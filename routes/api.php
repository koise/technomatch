<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

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
    
    // Other API-only routes can go here
});
