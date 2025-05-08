<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create some test users
        User::factory(10)->create();

        User::factory()->create([
            'first_name' => 'Test',
            'last_name' => 'User',
            'email' => 'test@example.com',
        ]);
        
        // Seed all tables
        $this->call([
            UserProfileSeeder::class,
            UserRankStatSeeder::class,
            UserProgressiveStatSeeder::class,
            FriendsTableSeeder::class,
            FriendRequestsTableSeeder::class,
        ]);
    }
}
