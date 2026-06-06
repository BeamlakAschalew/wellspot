<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        collect([
            ['name' => 'Spa & Massage', 'slug' => 'spa-massage', 'icon' => 'sparkles', 'color' => 'emerald', 'description' => 'Massage, spa, and recovery providers.', 'sort_order' => 1],
            ['name' => 'Fitness Studio', 'slug' => 'fitness-studio', 'icon' => 'dumbbell', 'color' => 'sky', 'description' => 'Gyms, personal trainers, and strength studios.', 'sort_order' => 2],
            ['name' => 'Yoga & Mindfulness', 'slug' => 'yoga-mindfulness', 'icon' => 'leaf', 'color' => 'lime', 'description' => 'Yoga, meditation, and breathwork spaces.', 'sort_order' => 3],
            ['name' => 'Nutrition Counseling', 'slug' => 'nutrition-counseling', 'icon' => 'apple', 'color' => 'amber', 'description' => 'Nutritionists and meal planning support.', 'sort_order' => 4],
            ['name' => 'Mental Health', 'slug' => 'mental-health', 'icon' => 'heart-pulse', 'color' => 'rose', 'description' => 'Counselors and practical mental wellness support.', 'sort_order' => 5],
            ['name' => 'Retreat Center', 'slug' => 'retreat-center', 'icon' => 'mountain', 'color' => 'violet', 'description' => 'Day retreats and reset experiences.', 'sort_order' => 6],
        ])->each(fn (array $category) => Category::query()->updateOrCreate(
            ['slug' => $category['slug']],
            $category,
        ));
    }
}
