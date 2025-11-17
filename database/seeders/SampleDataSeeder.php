<?php

namespace Database\Seeders;

use App\Models\Patient;
use App\Models\DocAttending;
use App\Models\DocAdmitting;
use App\Models\PtRoom;
use Illuminate\Database\Seeder;

class SampleDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create sample attending doctors
        $attendingDoctors = [
            'Dr. Maria Santos',
            'Dr. Juan Dela Cruz',
            'Dr. Ana Reyes',
            'Dr. Carlos Garcia',
            'Dr. Sofia Mendoza',
        ];

        foreach ($attendingDoctors as $name) {
            DocAttending::firstOrCreate(['fullname' => $name]);
        }

        // Create sample admitting doctors
        $admittingDoctors = [
            'Dr. Roberto Cruz',
            'Dr. Elena Ramos',
            'Dr. Miguel Torres',
            'Dr. Isabel Flores',
            'Dr. Pedro Gonzales',
        ];

        foreach ($admittingDoctors as $name) {
            DocAdmitting::firstOrCreate(['fullname' => $name]);
        }

        // Create sample patients
        $patients = [
            ['first_name' => 'Juan', 'last_name' => 'Dela Cruz', 'middle_name' => 'Santos', 'phone_number' => '+63 912 345 6789', 'address' => '123 Main St, Manila'],
            ['first_name' => 'Maria', 'last_name' => 'Garcia', 'middle_name' => 'Lopez', 'phone_number' => '+63 923 456 7890', 'address' => '456 Rizal Ave, Quezon City'],
            ['first_name' => 'Pedro', 'last_name' => 'Reyes', 'middle_name' => 'Ramos', 'phone_number' => '+63 934 567 8901', 'address' => '789 Bonifacio St, Makati'],
            ['first_name' => 'Ana', 'last_name' => 'Mendoza', 'middle_name' => 'Cruz', 'phone_number' => '+63 945 678 9012', 'address' => '321 Luna St, Pasig'],
            ['first_name' => 'Carlos', 'last_name' => 'Torres', 'middle_name' => 'Flores', 'phone_number' => '+63 956 789 0123', 'address' => '654 Mabini St, Taguig'],
        ];

        foreach ($patients as $patient) {
            Patient::firstOrCreate(
                ['first_name' => $patient['first_name'], 'last_name' => $patient['last_name']],
                $patient
            );
        }

        // Create sample rooms
        $rooms = ['101', '102', '103', '201', '202', '203', 'ICU-1', 'ICU-2', 'ER-1', 'ER-2'];

        foreach ($rooms as $roomNumber) {
            PtRoom::firstOrCreate(['room_number' => $roomNumber]);
        }
    }
}
