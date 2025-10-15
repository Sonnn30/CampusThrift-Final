<?php

namespace Database\Seeders;

use App\Models\Appointment;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;

class AppointmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get existing users and products
        $users = User::where('role', 'Buyer')->get();
        $products = Product::all();

        if ($users->isEmpty() || $products->isEmpty()) {
            $this->command->info('No users or products found. Please seed users and products first.');
            return;
        }

        // Create sample appointments
        $appointments = [
            [
                'product_id' => $products->random()->id,
                'users_id' => $users->random()->id,
                'status' => 'pending',
                'date' => now()->addDays(2)->format('Y-m-d'),
                'time' => '10:00',
                'locations' => 'Campus Main Gate',
            ],
            [
                'product_id' => $products->random()->id,
                'users_id' => $users->random()->id,
                'status' => 'confirmed',
                'date' => now()->addDays(3)->format('Y-m-d'),
                'time' => '14:00',
                'locations' => 'Library Entrance',
            ],
            [
                'product_id' => $products->random()->id,
                'users_id' => $users->random()->id,
                'status' => 'completed',
                'date' => now()->subDays(1)->format('Y-m-d'),
                'time' => '11:00',
                'locations' => 'Student Center',
            ],
        ];

        foreach ($appointments as $appointmentData) {
            Appointment::create($appointmentData);
        }

        $this->command->info('Appointment seeder completed successfully!');
    }
}
