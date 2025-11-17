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
        // Create an admin user
        User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin User',
                'password' => 'password',
                'role' => 'admin',
                'email_verified_at' => now(),
            ]
        );

        // Create a billing user
        User::firstOrCreate(
            ['email' => 'billing@example.com'],
            [
                'name' => 'Billing User',
                'password' => 'password',
                'role' => 'billing',
                'email_verified_at' => now(),
            ]
        );

        // Create an admitting user
        User::firstOrCreate(
            ['email' => 'admitting@example.com'],
            [
                'name' => 'Admitting User',
                'password' => 'password',
                'role' => 'admitting',
                'email_verified_at' => now(),
            ]
        );

        // Keep the existing test user as billing
        User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => 'password',
                'role' => 'billing',
                'email_verified_at' => now(),
            ]
        );

        // Create additional test users for each role
        User::factory()->billing()->count(5)->create();
        User::factory()->admitting()->count(5)->create();

        // Seed sample data for patients, doctors, and rooms
        $this->call(SampleDataSeeder::class);
    }
}
