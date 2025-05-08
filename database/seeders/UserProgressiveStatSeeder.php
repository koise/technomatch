<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\UserProgressiveStat;

class UserProgressiveStatSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();
        
        foreach ($users as $user) {
            // Check if user already has progressive stats
            if (!$user->userProgressiveStat) {
                // Generate random stats
                $level = rand(1, 15);
                $completed_challenges = $level * rand(2, 5);
                
                // Calculate XP based on level
                $xp = ($level - 1) * 1000 + rand(0, 999);
                $next_level_xp = $level * 1000;
                
                UserProgressiveStat::create([
                    'user_id' => $user->id,
                    'level' => $level,
                    'xp' => $xp,
                    'next_level_xp' => $next_level_xp,
                    'completed_challenges' => $completed_challenges,
                ]);
                
                $this->command->info("Created progressive stats for User #{$user->id}");
            }
        }
        
        $this->command->info('User progressive stats seeded successfully.');
    }
} 