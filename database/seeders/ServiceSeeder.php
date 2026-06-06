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
                ['Intro Session', 45, 700],
                ['Signature Care Session', 60, 1200],
                ['Extended Reset', 90, 1800],
            ])->each(function (array $service, int $index) use ($provider): void {
                [$name, $duration, $price] = $service;
                $serviceName = $provider->category->name.' '.$name;

                Service::query()->updateOrCreate(
                    [
                        'provider_id' => $provider->id,
                        'slug' => Str::slug($serviceName),
                    ],
                    [
                        'category_id' => $provider->category_id,
                        'name' => $serviceName,
                        'description' => 'A focused '.$duration.' minute session at '.$provider->name.'.',
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
