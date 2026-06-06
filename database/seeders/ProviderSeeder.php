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
            ['Spa & Massage', 'Bole Recovery Spa', 'ቦሌ ሪከቨሪ ስፓ', 'Recovery massage near Bole Medhanialem.', 'በቦሌ መድሃኒዓለም አቅራቢያ የማገገሚያ ማሳጅ።', 'Bole Road, Addis Ababa', 'Bole', 9.0108, 38.7613],
            ['Yoga & Mindfulness', 'Kazanchis Mindful Studio', 'ካዛንቺስ ማይንድፉል ስቱዲዮ', 'Breathwork and calm movement for office schedules.', 'ለቢሮ ጊዜ የሚስማሙ የመተንፈስ እና ረጋ ያለ እንቅስቃሴ ክፍለ ጊዜዎች።', 'Kazanchis, Addis Ababa', 'Kazanchis', 9.0181, 38.7675],
            ['Fitness Studio', 'Saris Strength Lab', 'ሳሪስ ስትሬንግዝ ላብ', 'Personal training and strength resets.', 'የግል ስልጠና እና የጥንካሬ ማደሻ ክፍለ ጊዜዎች።', 'Saris, Addis Ababa', 'Saris', 8.9561, 38.7467],
            ['Nutrition Counseling', 'CMC Nutrition Room', 'ሲኤምሲ ኒውትሪሽን ሩም', 'Practical meal planning for busy families.', 'ለተጨናነቁ ቤተሰቦች ተግባራዊ የምግብ እቅድ።', 'CMC Road, Addis Ababa', 'CMC', 9.0370, 38.8298],
            ['Mental Health', 'Piassa Counseling Corner', 'ፒያሳ ካውንስሊንግ ኮርነር', 'Private counseling sessions in central Addis.', 'በአዲስ አበባ መሃል የግል የምክር ክፍለ ጊዜዎች።', 'Piassa, Addis Ababa', 'Piassa', 9.0346, 38.7504],
            ['Retreat Center', 'Entoto Reset House', 'እንጦጦ ሪሴት ሀውስ', 'Quiet day retreats above the city.', 'ከከተማው በላይ የሚገኙ ጸጥ ያሉ የቀን እረፍቶች።', 'Entoto, Addis Ababa', 'Entoto', 9.0844, 38.7648],
            ['Spa & Massage', 'Megenagna Bodyworks', 'መገናኛ ቦዲወርክስ', 'Deep tissue and sports recovery care.', 'ዲፕ ቲሹ እና የስፖርት ማገገሚያ እንክብካቤ።', 'Megenagna, Addis Ababa', 'Megenagna', 9.0240, 38.8002],
            ['Fitness Studio', 'Summit Mobility Club', 'ሰሚት ሞቢሊቲ ክለብ', 'Mobility and conditioning near Summit.', 'በሰሚት አቅራቢያ የመንቀሳቀስ እና የአካል ዝግጅት ክፍለ ጊዜዎች።', 'Summit, Addis Ababa', 'Summit', 9.0314, 38.8598],
        ])->each(function (array $row) use ($owner): void {
            [$categoryName, $name, $nameAm, $headline, $headlineAm, $address, $neighborhood, $latitude, $longitude] = $row;
            $category = Category::query()->where('name', $categoryName)->firstOrFail();

            Provider::query()->updateOrCreate(
                ['slug' => Str::slug($name)],
                [
                    'user_id' => $owner->id,
                    'category_id' => $category->id,
                    'name' => $name,
                    'name_am' => $nameAm,
                    'headline' => $headline,
                    'headline_am' => $headlineAm,
                    'description' => $headline.' Book a simple, local wellness session through WellSpot.',
                    'description_am' => $headlineAm.' በWellSpot ቀላል እና አካባቢያዊ የዌልነስ ክፍለ ጊዜ ያስይዙ።',
                    'phone' => '+251911223344',
                    'email' => Str::slug($name).'@wellspot.test',
                    'address' => $address,
                    'neighborhood' => $neighborhood,
                    'latitude' => $latitude,
                    'longitude' => $longitude,
                    'amenities' => ['Parking', 'Amharic support'],
                    'amenities_am' => ['መኪና ማቆሚያ', 'የአማርኛ ድጋፍ'],
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
