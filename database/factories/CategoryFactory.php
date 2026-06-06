<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Category>
 */
class CategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->randomElement([
            'Spa & Massage',
            'Fitness Studio',
            'Yoga & Mindfulness',
            'Nutrition Counseling',
            'Mental Health',
            'Retreat Center',
        ]);

        return [
            'name' => $name,
            'slug' => Str::slug($name).'-'.fake()->unique()->numberBetween(100, 999),
            'icon' => fake()->randomElement(['sparkles', 'dumbbell', 'leaf', 'heart-pulse']),
            'color' => fake()->randomElement(['emerald', 'sky', 'rose', 'amber']),
            'description' => fake()->sentence(),
            'sort_order' => fake()->numberBetween(1, 10),
        ];
    }
}
