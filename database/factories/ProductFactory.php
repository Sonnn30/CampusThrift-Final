<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    protected $model = Product::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->words(3, true),
            'description' => $this->faker->paragraph(),
            'price' => $this->faker->numberBetween(10000, 1000000),
            'category' => $this->faker->randomElement(['Electronics', 'Clothing', 'Books', 'Sports', 'Home', 'Other']),
            'condition' => $this->faker->randomElement(['New', 'Like New', 'Good', 'Fair', 'Poor']),
            'seller_id' => User::factory(),
            'status' => $this->faker->randomElement(['available', 'sold', 'pending']),
            'image' => $this->faker->imageUrl(400, 300, 'products'),
        ];
    }

    /**
     * Indicate that the product is available.
     */
    public function available(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'available',
        ]);
    }

    /**
     * Indicate that the product is sold.
     */
    public function sold(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'sold',
        ]);
    }

    /**
     * Indicate that the product is pending.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
        ]);
    }
}
