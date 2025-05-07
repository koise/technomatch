<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Friend;

class FriendsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear existing records to avoid duplicates
        DB::table('friends')->truncate();

        // Get all users
        $users = User::all();
        
        // Only proceed if we have enough users
        if ($users->count() < 2) {
            $this->command->info('Not enough users to create friendships.');
            return;
        }

        // Create some friendship relationships
        // Each user will be friends with 1-3 random other users
        foreach ($users as $user) {
            // Get 1-3 random users to be friends with (excluding the current user)
            $friendCount = rand(1, min(3, $users->count() - 1));
            
            $potentialFriends = $users->where('id', '!=', $user->id)->random($friendCount);
            
            foreach ($potentialFriends as $friend) {
                // Check if friendship already exists in either direction
                $existingFriendship = Friend::where(function ($query) use ($user, $friend) {
                    $query->where('user_id', $user->id)
                          ->where('friend_id', $friend->id);
                })->orWhere(function ($query) use ($user, $friend) {
                    $query->where('user_id', $friend->id)
                          ->where('friend_id', $user->id);
                })->first();
                
                // Only create if no existing friendship
                if (!$existingFriendship) {
                    Friend::create([
                        'user_id' => $user->id,
                        'friend_id' => $friend->id,
                    ]);
                    
                    $this->command->info("Created friendship between User #{$user->id} and User #{$friend->id}");
                }
            }
        }
        
        $this->command->info('Friends table seeded successfully.');
    }
} 