<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\UserRankStat;

class UserRankStatSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();
        $position = 1;
        
        foreach ($users as $user) {
            // Check if user already has rank stats
            if (!$user->userRankStat) {
                // Generate random stats
                $wins = rand(0, 20);
                $losses = rand(0, 10);
                $draws = rand(0, 5);
                $win_streak = rand(0, 5);
                $points = $wins * 15 - $losses * 10 + $draws * 5;
                $points = max(0, $points); // Ensure points don't go negative
                
                // Calculate tier based on points
                $tier = 'Bronze';
                if ($points >= 300) {
                    $tier = 'Diamond';
                } elseif ($points >= 200) {
                    $tier = 'Platinum';
                } elseif ($points >= 100) {
                    $tier = 'Gold';
                } elseif ($points >= 50) {
                    $tier = 'Silver';
                }
                
                // Calculate MMR based on wins and losses
                $mmr = 1000 + ($wins * 25) - ($losses * 20);
                
                UserRankStat::create([
                    'user_id' => $user->id,
                    'tier' => $tier,
                    'points' => $points,
                    'mmr' => $mmr,
                    'position' => $position++,
                    'wins' => $wins,
                    'losses' => $losses,
                    'draws' => $draws,
                    'win_streak' => $win_streak,
                ]);
                
                $this->command->info("Created rank stats for User #{$user->id}");
            }
        }
        
        $this->command->info('User rank stats seeded successfully.');
    }
} 