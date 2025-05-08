<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Disable foreign key checks
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        
        // Path to your SQL file
        $sqlFile = base_path('database/sql/schema.sql');
        
        if (file_exists($sqlFile)) {
            // Split SQL file into statements
            $sql = file_get_contents($sqlFile);
            $statements = array_filter(array_map('trim', explode(';', $sql)));
            
            foreach ($statements as $statement) {
                if (!empty($statement)) {
                    try {
                        DB::unprepared($statement . ';');
                    } catch (\Exception $e) {
                        // Log error but continue with other statements
                        echo "Error executing statement: " . $e->getMessage() . PHP_EOL;
                    }
                }
            }
            
            echo "SQL import completed" . PHP_EOL;
        } else {
            echo "SQL file not found at: " . $sqlFile . PHP_EOL;
        }
        
        // Re-enable foreign key checks
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop tables created by SQL file
        Schema::dropIfExists('friend_requests');
        Schema::dropIfExists('friends');
        Schema::dropIfExists('user_progressive_stats');
        Schema::dropIfExists('user_ranked_stats');
        Schema::dropIfExists('user_profiles');
        Schema::dropIfExists('users');
    }
}; 