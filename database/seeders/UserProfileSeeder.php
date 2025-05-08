<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\UserProfile;

class UserProfileSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();
        
        foreach ($users as $user) {
            // Check if user already has a profile
            if (!$user->userProfile) {
                $avatar_number = rand(1, 10);
                
                UserProfile::create([
                    'user_id' => $user->id,
                    'avatar_path' => "/avatar/default-{$avatar_number}.svg",
                    'rank_title' => 'Novice',
                    'online_status' => rand(0, 1) ? 'online' : 'offline',
                    'last_active' => now()->subMinutes(rand(1, 60 * 24)),
                    'preferred_font' => fake()->randomElement(['System UI', 'Consolas', 'JetBrains Mono', 'Fira Code']),
                    'dark_mode' => rand(0, 1),
                ]);
                
                $this->command->info("Created profile for User #{$user->id}");
            }
        }
        
        $this->command->info('User profiles seeded successfully.');
    }
} 