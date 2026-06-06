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
            'name_am' => fake()->randomElement([
                'ስፓ እና ማሳጅ',
                'የአካል ብቃት ስቱዲዮ',
                'ዮጋ እና ንቃተ ህሊና',
                'የምግብ ምክር',
                'የአእምሮ ጤና',
                'የእረፍት ማዕከል',
            ]),
            'slug' => Str::slug($name).'-'.fake()->unique()->numberBetween(100, 999),
            'icon' => fake()->randomElement(['sparkles', 'dumbbell', 'leaf', 'heart-pulse']),
            'color' => fake()->randomElement(['emerald', 'sky', 'rose', 'amber']),
            'description' => fake()->sentence(),
            'description_am' => fake()->randomElement([
                'ለዕለታዊ የጤና እና ደህንነት ድጋፍ የሚሆኑ አቅራቢዎች።',
                'በአካባቢዎ የሚገኙ ተግባራዊ የዌልነስ አገልግሎቶች።',
            ]),
            'sort_order' => fake()->numberBetween(1, 10),
        ];
    }
}
