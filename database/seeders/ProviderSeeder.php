<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Provider;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProviderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $owner = User::query()->firstOrCreate(
            ['email' => 'provider@example.com'],
            ['name' => 'WellSpot Provider', 'password' => bcrypt('password')],
        );

        collect([
            ['Spa & Massage', 'Bole Recovery Spa', 'Recovery massage near Bole Medhanialem.', 'Bole Road, Addis Ababa', 'Bole', 9.0108, 38.7613],
            ['Yoga & Mindfulness', 'Kazanchis Mindful Studio', 'Breathwork and calm movement for office schedules.', 'Kazanchis, Addis Ababa', 'Kazanchis', 9.0181, 38.7675],
            ['Fitness Studio', 'Saris Strength Lab', 'Personal training and strength resets.', 'Saris, Addis Ababa', 'Saris', 8.9561, 38.7467],
            ['Nutrition Counseling', 'CMC Nutrition Room', 'Practical meal planning for busy families.', 'CMC Road, Addis Ababa', 'CMC', 9.0370, 38.8298],
            ['Mental Health', 'Piassa Counseling Corner', 'Private counseling sessions in central Addis.', 'Piassa, Addis Ababa', 'Piassa', 9.0346, 38.7504],
            ['Retreat Center', 'Entoto Reset House', 'Quiet day retreats above the city.', 'Entoto, Addis Ababa', 'Entoto', 9.0844, 38.7648],
            ['Spa & Massage', 'Megenagna Bodyworks', 'Deep tissue and sports recovery care.', 'Megenagna, Addis Ababa', 'Megenagna', 9.0240, 38.8002],
            ['Fitness Studio', 'Summit Mobility Club', 'Mobility and conditioning near Summit.', 'Summit, Addis Ababa', 'Summit', 9.0314, 38.8598],
        ])->each(function (array $row) use ($owner): void {
            [$categoryName, $name, $headline, $address, $neighborhood, $latitude, $longitude] = $row;
            $category = Category::query()->where('name', $categoryName)->firstOrFail();

            Provider::query()->updateOrCreate(
                ['slug' => Str::slug($name)],
                [
                    'user_id' => $owner->id,
                    'category_id' => $category->id,
                    'name' => $name,
                    'headline' => $headline,
                    'description' => $headline.' Book a simple, local wellness session through WellSpot.',
                    'phone' => '+251911223344',
                    'email' => Str::slug($name).'@wellspot.test',
                    'address' => $address,
                    'neighborhood' => $neighborhood,
                    'latitude' => $latitude,
                    'longitude' => $longitude,
                    'amenities' => ['Parking', 'Amharic support'],
                    'opening_hours' => [
                        'weekdays' => '08:00-20:00',
                        'weekends' => '09:00-18:00',
                    ],
                    'status' => 'published',
                    'is_featured' => in_array($name, ['Bole Recovery Spa', 'Kazanchis Mindful Studio'], true),
                    'published_at' => now(),
                ],
            );
        });
    }
}
