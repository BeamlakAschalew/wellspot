<?php

use App\Models\Category;
use App\Models\Provider;
use App\Models\Review;
use App\Models\Service;
use Inertia\Testing\AssertableInertia as Assert;

test('home page includes live categories providers and top rated providers', function () {
    $massage = Category::factory()->create([
        'name' => 'Spa & Massage',
        'slug' => 'spa-massage',
        'sort_order' => 1,
    ]);
    $fitness = Category::factory()->create([
        'name' => 'Fitness Studio',
        'slug' => 'fitness-studio',
        'sort_order' => 2,
    ]);
    $topRatedProvider = Provider::factory()
        ->for($massage)
        ->create([
            'name' => 'Bole Balance Spa',
            'logo_path' => 'provider-logos/bole-balance.png',
            'headline' => 'Recovery massage near Bole.',
            'neighborhood' => 'Bole',
            'is_featured' => true,
        ]);
    $lowerRatedProvider = Provider::factory()
        ->for($fitness)
        ->create([
            'name' => 'Saris Strength Lab',
            'neighborhood' => 'Saris',
        ]);

    Service::factory()->for($topRatedProvider)->for($massage)->create([
        'name' => 'Deep Tissue Massage',
        'price_amount' => 1200,
        'currency' => 'ETB',
        'sort_order' => 1,
    ]);
    Service::factory()->for($lowerRatedProvider)->for($fitness)->create([
        'name' => 'Personal Training Session',
        'price_amount' => 900,
        'currency' => 'ETB',
    ]);
    Review::factory()->for($topRatedProvider)->create(['booking_id' => null, 'rating' => 5]);
    Review::factory()->for($topRatedProvider)->create(['booking_id' => null, 'rating' => 4]);
    Review::factory()->for($lowerRatedProvider)->create(['booking_id' => null, 'rating' => 3]);

    $response = $this->get(route('home'));

    $response
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('welcome')
            ->where('filters.search', '')
            ->where('filters.location', '')
            ->where('filters.category', '')
            ->where('categories.0.name', 'Spa & Massage')
            ->where('categories.0.providers_count', 1)
            ->where('providers.0.name', 'Bole Balance Spa')
            ->where('providers.0.logo_url', $topRatedProvider->logo_url)
            ->where('providers.0.starting_price', 1200)
            ->where('providers.0.rating', 4.5)
            ->where('providers.0.reviews_count', 2)
            ->where('providers.0.services.0.name', 'Deep Tissue Massage')
            ->where('topRatedProviders.0.name', 'Bole Balance Spa')
            ->where('topRatedProviders.0.logo_url', $topRatedProvider->logo_url)
        );
});

test('home page filters providers by search location and category', function () {
    $massage = Category::factory()->create(['slug' => 'spa-massage']);
    $fitness = Category::factory()->create(['slug' => 'fitness-studio']);
    $matchingProvider = Provider::factory()
        ->for($massage)
        ->create([
            'name' => 'Kazanchis Recovery Studio',
            'neighborhood' => 'Kazanchis',
            'address' => 'Kazanchis, Addis Ababa',
        ]);
    $otherProvider = Provider::factory()
        ->for($fitness)
        ->create([
            'name' => 'Bole Fitness Studio',
            'neighborhood' => 'Bole',
        ]);

    Service::factory()->for($matchingProvider)->for($massage)->create([
        'name' => 'Aromatherapy Massage',
    ]);
    Service::factory()->for($otherProvider)->for($fitness)->create([
        'name' => 'Strength Training',
    ]);

    $response = $this->get(route('home', [
        'search' => 'massage',
        'location' => 'kazanchis',
        'category' => 'spa-massage',
    ]));

    $response
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('filters.search', 'massage')
            ->where('filters.location', 'kazanchis')
            ->where('filters.category', 'spa-massage')
            ->has('providers', 1)
            ->where('providers.0.name', 'Kazanchis Recovery Studio')
        );
});

test('home page only shows published providers with active services', function () {
    $category = Category::factory()->create();
    $publishedProvider = Provider::factory()
        ->for($category)
        ->create(['name' => 'Published Wellness']);
    $draftProvider = Provider::factory()
        ->for($category)
        ->draft()
        ->create(['name' => 'Draft Wellness']);
    $inactiveOnlyProvider = Provider::factory()
        ->for($category)
        ->create(['name' => 'Inactive Service Wellness']);

    Service::factory()->for($publishedProvider)->for($category)->create();
    Service::factory()->for($draftProvider)->for($category)->create();
    Service::factory()->for($inactiveOnlyProvider)->for($category)->inactive()->create();

    $response = $this->get(route('home'));

    $response
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('providers', 1)
            ->where('providers.0.name', 'Published Wellness')
        );
});
