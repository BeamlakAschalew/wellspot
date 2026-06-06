<?php

namespace Database\Factories;

use App\Models\Booking;
use App\Models\Provider;
use App\Models\Service;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Booking>
 */
class BookingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'provider_id' => Provider::factory(),
            'service_id' => Service::factory(),
            'starts_at' => fake()->dateTimeBetween('now', '+14 days'),
            'status' => fake()->randomElement(['pending', 'confirmed', 'completed']),
            'customer_name' => fake()->name(),
            'customer_phone' => '+2519'.fake()->numerify('########'),
            'notes' => fake()->optional()->sentence(),
            'total_amount' => fake()->randomElement([700, 950, 1200, 1500, 2200]),
            'currency' => 'ETB',
        ];
    }

    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
        ]);
    }

    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'completed',
            'starts_at' => now()->subDay(),
        ]);
    }

    public function guest(): static
    {
        return $this->state(fn (array $attributes) => [
            'user_id' => null,
        ]);
    }
}
