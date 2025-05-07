<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // First, make sure email_verified_at exists
        if (!Schema::hasColumn('users', 'email_verified_at')) {
            Schema::table('users', function (Blueprint $table) {
                $table->timestamp('email_verified_at')->nullable()->after('email');
            });
        }
        
        // Copy data from verify_at to email_verified_at if it exists
        if (Schema::hasColumn('users', 'verify_at')) {
            DB::statement('UPDATE users SET email_verified_at = verify_at WHERE verify_at IS NOT NULL');
            
            // Drop the old column in a separate operation
            Schema::table('users', function (Blueprint $table) {
                $table->dropColumn('verify_at');
            });
        }
        
        // Update email_verified based on email_verified_at if the column exists
        if (Schema::hasColumn('users', 'email_verified')) {
            DB::statement('UPDATE users SET email_verified = 1 WHERE email_verified_at IS NOT NULL');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Add back verify_at column if it doesn't exist
        if (!Schema::hasColumn('users', 'verify_at')) {
            Schema::table('users', function (Blueprint $table) {
                if (Schema::hasColumn('users', 'email_verified')) {
                    // Add after email_verified if it exists
                    $table->timestamp('verify_at')->nullable()->after('email_verified');
                } else {
                    // Otherwise add after email
                    $table->timestamp('verify_at')->nullable()->after('email');
                }
            });
            
            // Copy data back
            DB::statement('UPDATE users SET verify_at = email_verified_at WHERE email_verified_at IS NOT NULL');
        }
    }
}; 