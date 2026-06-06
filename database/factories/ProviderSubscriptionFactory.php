<?php

namespace Database\Factories;

use App\Models\Provider;
use App\Models\ProviderSubscription;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ProviderSubscription>
 */
class ProviderSubscriptionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'provider_id' => Provider::factory(),
            'plan' => fake()->randomElement(['starter', 'growth']),
            'status' => fake()->randomElement(['trialing', 'active']),
            'amount' => fake()->randomElement([1500, 2500, 4000]),
            'currency' => 'ETB',
            'payment_provider' => 'chapa',
            'payment_reference' => 'wellspot_'.fake()->unique()->bothify('????####'),
            'trial_ends_at' => now()->addDays(7),
            'renews_at' => now()->addMonth(),
            'ends_at' => null,
        ];
    }

    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'active',
            'trial_ends_at' => null,
            'renews_at' => now()->addMonth(),
        ]);
    }
}
