<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Friend;
use App\Models\User;
use App\Models\FriendRequest;

class RetrieveFriendsData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:retrieve-friends {user_id?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Retrieve friends data using models';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting to retrieve friends data...');

        // Get the user ID from the command argument or use a random user
        $userId = $this->argument('user_id');
        
        if (!$userId) {
            $user = User::inRandomOrder()->first();
            if (!$user) {
                $this->error('No users found in the database!');
                return 1;
            }
            $userId = $user->id;
            $this->info("No user ID provided, using random user ID: {$userId}");
        } else {
            $user = User::find($userId);
            if (!$user) {
                $this->error("User with ID {$userId} not found!");
                return 1;
            }
        }

        // Get friends count for this user
        $friendsCount = Friend::where(function($query) use ($userId) {
            $query->where('user_id', $userId)
                  ->orWhere('friend_id', $userId);
        })->count();

        $this->info("User {$userId} has {$friendsCount} friends.");

        // Get all friends
        $friends = Friend::where(function($query) use ($userId) {
            $query->where('user_id', $userId)
                  ->orWhere('friend_id', $userId);
        })
        ->with(['user', 'friend'])
        ->get();

        // Display friends
        $this->info("Friends list:");
        $table = [];
        
        foreach ($friends as $friendship) {
            // Determine which user in the friendship is the friend (not the current user)
            $friendUser = $friendship->user_id == $userId ? $friendship->friend : $friendship->user;
            
            $table[] = [
                'id' => $friendship->id,
                'friend_id' => $friendUser->id,
                'friend_name' => $friendUser->first_name . ' ' . $friendUser->last_name,
                'username' => $friendUser->username,
                'created_at' => $friendship->created_at,
            ];
        }
        
        $this->table(
            ['ID', 'Friend ID', 'Friend Name', 'Username', 'Created At'],
            $table
        );

        // Get pending friend requests
        $pendingRequests = FriendRequest::where('receiver_id', $userId)
                                      ->where('status', 'pending')
                                      ->with('sender')
                                      ->get();
        
        $this->info("User has " . $pendingRequests->count() . " pending friend requests.");
        
        if ($pendingRequests->count() > 0) {
            $requestsTable = [];
            foreach ($pendingRequests as $request) {
                $requestsTable[] = [
                    'id' => $request->id,
                    'from_user' => $request->sender->id,
                    'name' => $request->sender->first_name . ' ' . $request->sender->last_name,
                    'created_at' => $request->created_at
                ];
            }
            
            $this->table(
                ['Request ID', 'From User ID', 'Name', 'Created At'],
                $requestsTable
            );
        }

        return 0;
    }
}
