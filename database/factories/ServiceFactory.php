<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Provider;
use App\Models\Service;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Service>
 */
class ServiceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->randomElement([
            'Deep Tissue Massage',
            'Guided Breathwork',
            'Personal Training Session',
            'Nutrition Reset Consultation',
            'Stress Recovery Session',
        ]);

        return [
            'provider_id' => Provider::factory(),
            'category_id' => Category::factory(),
            'name' => $name,
            'name_am' => fake()->randomElement([
                'ዲፕ ቲሹ ማሳጅ',
                'የመተንፈስ ልምምድ',
                'የግል የአካል ብቃት ክፍለ ጊዜ',
                'የምግብ ምክር ክፍለ ጊዜ',
                'የጭንቀት ማገገሚያ ክፍለ ጊዜ',
            ]),
            'slug' => Str::slug($name).'-'.fake()->unique()->numberBetween(100, 999),
            'description' => fake()->sentence(),
            'description_am' => fake()->randomElement([
                'ለሰውነት ማገገም እና ለመዝናናት የተዘጋጀ ክፍለ ጊዜ።',
                'በቀላሉ ለመጀመር የሚያግዝ ተግባራዊ አገልግሎት።',
            ]),
            'duration_minutes' => fake()->randomElement([30, 45, 60, 90]),
            'price_amount' => fake()->randomElement([700, 950, 1200, 1500, 2200]),
            'currency' => 'ETB',
            'status' => 'active',
            'sort_order' => fake()->numberBetween(1, 10),
        ];
    }

    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'inactive',
        ]);
    }
}
