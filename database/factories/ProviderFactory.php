<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Provider;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Provider>
 */
class ProviderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->randomElement([
            'Bole Balance Spa',
            'Kazanchis Wellness Studio',
            'Saris Strength Lab',
            'Piassa Mindful Care',
            'Summit Recovery Lounge',
        ]).' '.fake()->unique()->numberBetween(10, 99);

        return [
            'user_id' => User::factory(),
            'category_id' => Category::factory(),
            'name' => $name,
            'name_am' => fake()->randomElement([
                'ቦሌ ባላንስ ስፓ',
                'ካዛንቺስ ዌልነስ ስቱዲዮ',
                'ሳሪስ ስትሬንግዝ ላብ',
                'ፒያሳ ማይንድፉል ኬር',
            ]),
            'slug' => Str::slug($name),
            'headline' => fake()->randomElement([
                'Calm recovery sessions for busy Addis schedules.',
                'Personalized wellness plans near your neighborhood.',
                'Book practical care without the WhatsApp back-and-forth.',
            ]),
            'headline_am' => fake()->randomElement([
                'ለተጨናነቀ የአዲስ አበባ ቀን የሚስማሙ የማገገሚያ ክፍለ ጊዜዎች።',
                'በአካባቢዎ በቀላሉ የሚያገኙት የዌልነስ እቅድ።',
            ]),
            'description' => fake()->paragraph(),
            'description_am' => fake()->randomElement([
                'ቀላል፣ አካባቢያዊ እና ለመጀመሪያ ጊዜ ደንበኞች ግልጽ የሆነ የዌልነስ አገልግሎት።',
                'ማረፍ፣ መንቀሳቀስ እና ሰውነትዎን ማደስ የሚያግዝ ተግባራዊ እንክብካቤ።',
            ]),
            'phone' => '+2519'.fake()->numerify('########'),
            'email' => fake()->safeEmail(),
            'address' => fake()->randomElement([
                'Bole Road, Addis Ababa',
                'Kazanchis, Addis Ababa',
                'Megenagna, Addis Ababa',
                'Saris, Addis Ababa',
                'CMC, Addis Ababa',
            ]),
            'neighborhood' => fake()->randomElement(['Bole', 'Kazanchis', 'Megenagna', 'Saris', 'CMC']),
            'latitude' => fake()->randomFloat(7, 8.9, 9.08),
            'longitude' => fake()->randomFloat(7, 38.68, 38.86),
            'amenities' => fake()->randomElements(['Parking', 'Shower', 'Private rooms', 'Amharic support'], 2),
            'amenities_am' => fake()->randomElements(['መኪና ማቆሚያ', 'ሻወር', 'የግል ክፍሎች', 'የአማርኛ ድጋፍ'], 2),
            'opening_hours' => [
                'weekdays' => '08:00-20:00',
                'weekends' => '09:00-18:00',
            ],
            'status' => 'published',
            'is_featured' => false,
            'published_at' => now(),
        ];
    }

    public function draft(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'draft',
            'published_at' => null,
        ]);
    }
}
