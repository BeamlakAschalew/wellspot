<?php

namespace Database\Seeders;

use App\Models\Provider;
use App\Models\Service;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Provider::query()->with('category')->get()->each(function (Provider $provider): void {
            collect([
                ['Intro Session', 'መግቢያ ክፍለ ጊዜ', 45, 700],
                ['Signature Care Session', 'ሲግኔቸር እንክብካቤ ክፍለ ጊዜ', 60, 1200],
                ['Extended Reset', 'የተራዘመ ማደሻ', 90, 1800],
            ])->each(function (array $service, int $index) use ($provider): void {
                [$name, $nameAm, $duration, $price] = $service;
                $serviceName = $provider->category->name.' '.$name;
                $serviceNameAm = trim(($provider->category->name_am ?? $provider->category->name).' '.$nameAm);

                Service::query()->updateOrCreate(
                    [
                        'provider_id' => $provider->id,
                        'slug' => Str::slug($serviceName),
                    ],
                    [
                        'category_id' => $provider->category_id,
                        'name' => $serviceName,
                        'name_am' => $serviceNameAm,
                        'description' => 'A focused '.$duration.' minute session at '.$provider->name.'.',
                        'description_am' => 'በ'.($provider->name_am ?? $provider->name).' የሚሰጥ '.$duration.' ደቂቃ የተተኮረ ክፍለ ጊዜ።',
                        'duration_minutes' => $duration,
                        'price_amount' => $price,
                        'currency' => 'ETB',
                        'status' => 'active',
                        'sort_order' => $index + 1,
                    ],
                );
            });
        });
    }
}
