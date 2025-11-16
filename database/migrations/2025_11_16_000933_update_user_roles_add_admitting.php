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
        // For SQLite, we need to recreate the table with new enum values
        if (DB::getDriverName() === 'sqlite') {
            // Create temporary table with new enum
            DB::statement("
                CREATE TABLE users_temp (
                    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                    name VARCHAR NOT NULL,
                    email VARCHAR NOT NULL,
                    email_verified_at DATETIME,
                    password VARCHAR NOT NULL,
                    role VARCHAR CHECK(role IN ('admin', 'billing', 'admitting')) NOT NULL DEFAULT 'billing',
                    remember_token VARCHAR,
                    created_at DATETIME,
                    updated_at DATETIME,
                    two_factor_secret TEXT,
                    two_factor_recovery_codes TEXT,
                    two_factor_confirmed_at DATETIME
                )
            ");
            
            // Copy data, converting 'client' to 'billing'
            DB::statement("
                INSERT INTO users_temp 
                SELECT id, name, email, email_verified_at, password, 
                    CASE WHEN role = 'client' THEN 'billing' ELSE role END,
                    remember_token, created_at, updated_at, 
                    two_factor_secret, two_factor_recovery_codes, two_factor_confirmed_at
                FROM users
            ");
            
            // Drop old table and rename temp
            DB::statement("DROP TABLE users");
            DB::statement("ALTER TABLE users_temp RENAME TO users");
            
            // Recreate indexes
            DB::statement("CREATE UNIQUE INDEX users_email_unique ON users(email)");
        } else {
            // For MySQL/MariaDB
            DB::statement("UPDATE users SET role = 'billing' WHERE role = 'client'");
            DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'billing', 'admitting') NOT NULL DEFAULT 'billing'");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (DB::getDriverName() === 'sqlite') {
            // Create temporary table with old enum
            DB::statement("
                CREATE TABLE users_temp (
                    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                    name VARCHAR NOT NULL,
                    email VARCHAR NOT NULL,
                    email_verified_at DATETIME,
                    password VARCHAR NOT NULL,
                    role VARCHAR CHECK(role IN ('admin', 'client')) NOT NULL DEFAULT 'client',
                    remember_token VARCHAR,
                    created_at DATETIME,
                    updated_at DATETIME,
                    two_factor_secret TEXT,
                    two_factor_recovery_codes TEXT,
                    two_factor_confirmed_at DATETIME
                )
            ");
            
            // Copy data, converting 'billing' to 'client' and removing 'admitting'
            DB::statement("
                INSERT INTO users_temp 
                SELECT id, name, email, email_verified_at, password, 
                    CASE 
                        WHEN role = 'billing' THEN 'client'
                        WHEN role = 'admitting' THEN 'client'
                        ELSE role 
                    END,
                    remember_token, created_at, updated_at, 
                    two_factor_secret, two_factor_recovery_codes, two_factor_confirmed_at
                FROM users
            ");
            
            // Drop old table and rename temp
            DB::statement("DROP TABLE users");
            DB::statement("ALTER TABLE users_temp RENAME TO users");
            
            // Recreate indexes
            DB::statement("CREATE UNIQUE INDEX users_email_unique ON users(email)");
        } else {
            // For MySQL/MariaDB
            DB::statement("UPDATE users SET role = 'client' WHERE role = 'billing'");
            DB::statement("UPDATE users SET role = 'client' WHERE role = 'admitting'");
            DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'client') NOT NULL DEFAULT 'client'");
        }
    }
};
