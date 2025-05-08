<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\FriendRequest;

class FriendRequestsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear existing records to avoid duplicates
        DB::table('friend_requests')->truncate();

        // Get all users
        $users = User::all();
        
        // Only proceed if we have enough users
        if ($users->count() < 2) {
            $this->command->info('Not enough users to create friend requests.');
            return;
        }

        // Create some pending friend requests
        // Each user will send 0-2 friend requests to random users
        foreach ($users as $sender) {
            // Get 0-2 random users to send requests to (excluding the current user)
            $requestCount = rand(0, 2);
            
            if ($requestCount > 0) {
                // Filter out users who are already friends with this user
                $potentialReceivers = $users->where('id', '!=', $sender->id)
                    ->filter(function($user) use ($sender) {
                        // Check if there's already a friendship between these users
                        return !DB::table('friends')
                            ->where(function ($query) use ($sender, $user) {
                                $query->where('user_id', $sender->id)
                                    ->where('friend_id', $user->id);
                            })
                            ->orWhere(function ($query) use ($sender, $user) {
                                $query->where('user_id', $user->id)
                                    ->where('friend_id', $sender->id);
                            })
                            ->exists();
                    });
                
                if ($potentialReceivers->count() > 0) {
                    $receivers = $potentialReceivers->random(min($requestCount, $potentialReceivers->count()));
                    
                    foreach ($receivers as $receiver) {
                        // Check if a request already exists
                        $existingRequest = FriendRequest::where(function ($query) use ($sender, $receiver) {
                            $query->where('sender_id', $sender->id)
                                ->where('receiver_id', $receiver->id);
                        })->orWhere(function ($query) use ($sender, $receiver) {
                            $query->where('sender_id', $receiver->id)
                                ->where('receiver_id', $sender->id);
                        })->first();
                        
                        // Only create if no existing request
                        if (!$existingRequest) {
                            $status = ['pending', 'accepted', 'rejected'][rand(0, 2)];
                            
                            FriendRequest::create([
                                'sender_id' => $sender->id,
                                'receiver_id' => $receiver->id,
                                'status' => $status
                            ]);
                            
                            $this->command->info("Created {$status} friend request from User #{$sender->id} to User #{$receiver->id}");
                        }
                    }
                }
            }
        }
        
        $this->command->info('Friend requests table seeded successfully.');
    }
} 