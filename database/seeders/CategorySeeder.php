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
            ['name' => 'Spa & Massage', 'name_am' => 'ስፓ እና ማሳጅ', 'slug' => 'spa-massage', 'icon' => 'sparkles', 'color' => 'emerald', 'description' => 'Massage, spa, and recovery providers.', 'description_am' => 'የማሳጅ፣ ስፓ እና የማገገሚያ አቅራቢዎች።', 'sort_order' => 1],
            ['name' => 'Fitness Studio', 'name_am' => 'የአካል ብቃት ስቱዲዮ', 'slug' => 'fitness-studio', 'icon' => 'dumbbell', 'color' => 'sky', 'description' => 'Gyms, personal trainers, and strength studios.', 'description_am' => 'ጂሞች፣ የግል አሰልጣኞች እና የጥንካሬ ስቱዲዮዎች።', 'sort_order' => 2],
            ['name' => 'Yoga & Mindfulness', 'name_am' => 'ዮጋ እና ንቃተ ህሊና', 'slug' => 'yoga-mindfulness', 'icon' => 'leaf', 'color' => 'lime', 'description' => 'Yoga, meditation, and breathwork spaces.', 'description_am' => 'የዮጋ፣ ሜዲቴሽን እና የመተንፈስ ልምምድ ቦታዎች።', 'sort_order' => 3],
            ['name' => 'Nutrition Counseling', 'name_am' => 'የምግብ ምክር', 'slug' => 'nutrition-counseling', 'icon' => 'apple', 'color' => 'amber', 'description' => 'Nutritionists and meal planning support.', 'description_am' => 'የምግብ ባለሙያዎች እና የምግብ እቅድ ድጋፍ።', 'sort_order' => 4],
            ['name' => 'Mental Health', 'name_am' => 'የአእምሮ ጤና', 'slug' => 'mental-health', 'icon' => 'heart-pulse', 'color' => 'rose', 'description' => 'Counselors and practical mental wellness support.', 'description_am' => 'አማካሪዎች እና ተግባራዊ የአእምሮ ደህንነት ድጋፍ።', 'sort_order' => 5],
            ['name' => 'Retreat Center', 'name_am' => 'የእረፍት ማዕከል', 'slug' => 'retreat-center', 'icon' => 'mountain', 'color' => 'violet', 'description' => 'Day retreats and reset experiences.', 'description_am' => 'የቀን እረፍት እና የማደስ ተሞክሮዎች።', 'sort_order' => 6],
        ])->each(fn (array $category) => Category::query()->updateOrCreate(
            ['slug' => $category['slug']],
            $category,
        ));
    }
}
