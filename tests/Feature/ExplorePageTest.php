<?php

use App\Models\Category;
use App\Models\Provider;
use App\Models\Review;
use App\Models\Service;
use Inertia\Testing\AssertableInertia as Assert;

test('explore page renders searchable provider results', function () {
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
    $matchingProvider = Provider::factory()
        ->for($massage)
        ->create([
            'name' => 'Kazanchis Recovery Studio',
            'headline' => 'Therapeutic massage downtown.',
            'neighborhood' => 'Kazanchis',
            'address' => 'Kazanchis, Addis Ababa',
        ]);
    $otherProvider = Provider::factory()
        ->for($fitness)
        ->create([
            'name' => 'Bole Strength Lab',
            'neighborhood' => 'Bole',
        ]);

    Service::factory()->for($matchingProvider)->for($massage)->create([
        'name' => 'Deep Tissue Massage',
        'price_amount' => 1200,
        'currency' => 'ETB',
    ]);
    Service::factory()->for($otherProvider)->for($fitness)->create([
        'name' => 'Strength Training',
    ]);
    Review::factory()->for($matchingProvider)->create(['booking_id' => null, 'rating' => 5]);

    $response = $this->get(route('explore', [
        'search' => 'massage',
        'location' => 'kazanchis',
        'category' => 'spa-massage',
    ]));

    $response
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('searchResult')
            ->where('filters.search', 'massage')
            ->where('filters.location', 'kazanchis')
            ->where('filters.category', 'spa-massage')
            ->where('categories.0.name', 'Spa & Massage')
            ->where('categories.0.providers_count', 1)
            ->has('providers', 1)
            ->where('providers.0.id', $matchingProvider->id)
            ->where('providers.0.name', 'Kazanchis Recovery Studio')
            ->where('providers.0.services.0.name', 'Deep Tissue Massage')
            ->where('providers.0.starting_price', 1200)
            ->where('providers.0.rating', 5)
        );
});

test('explore page only shows public providers with active services', function () {
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

    $this->get(route('explore'))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('searchResult')
            ->has('providers', 1)
            ->where('providers.0.name', 'Published Wellness')
        );
});
