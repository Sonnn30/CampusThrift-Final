<?php

namespace Database\Factories;

use App\Models\Appointment;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Appointment>
 */
class AppointmentFactory extends Factory
{
    protected $model = Appointment::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $statuses = ['pending', 'confirmed', 'cancelled', 'completed'];
        $locations = [
            'Campus Main Gate',
            'Library Entrance',
            'Student Center',
            'Cafeteria',
            'Sports Complex',
            'Parking Lot A',
            'Parking Lot B'
        ];
        $times = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

        return [
            'product_id' => Product::factory(),
            'users_id' => User::factory(),
            'status' => $this->faker->randomElement($statuses),
            'date' => $this->faker->dateTimeBetween('+1 day', '+30 days')->format('Y-m-d'),
            'time' => $this->faker->randomElement($times),
            'locations' => $this->faker->randomElement($locations),
        ];
    }

    /**
     * Indicate that the appointment is pending.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
        ]);
    }

    /**
     * Indicate that the appointment is confirmed.
     */
    public function confirmed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'confirmed',
        ]);
    }

    /**
     * Indicate that the appointment is cancelled.
     */
    public function cancelled(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'cancelled',
        ]);
    }

    /**
     * Indicate that the appointment is completed.
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'completed',
        ]);
    }
}
