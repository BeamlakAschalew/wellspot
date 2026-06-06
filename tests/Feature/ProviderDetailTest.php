<?php

use App\Models\Booking;
use App\Models\Provider;
use App\Models\Review;
use App\Models\Service;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('published provider detail page shows profile and active services', function () {
    $provider = Provider::factory()->create([
        'name' => 'Bole Recovery Studio',
        'amenities' => ['Parking', 'Private rooms'],
        'opening_hours' => ['weekdays' => '08:00-20:00'],
    ]);

    $activeService = Service::factory()->for($provider)->create([
        'name' => 'Deep Tissue Massage',
        'status' => 'active',
        'price_amount' => 1200,
    ]);
    Service::factory()->inactive()->for($provider)->create([
        'name' => 'Hidden Service',
    ]);

    $booking = Booking::factory()->guest()->for($provider)->for($activeService)->create([
        'customer_name' => 'Mimi Client',
    ]);
    Review::factory()->guest()->for($provider)->for($booking)->create([
        'title' => 'Excellent care',
        'rating' => 5,
        'is_published' => true,
    ]);
    Review::factory()->for($provider)->create([
        'title' => 'Hidden review',
        'is_published' => false,
    ]);

    $this->get(route('providers.show', $provider))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('details')
            ->where('provider.name', 'Bole Recovery Studio')
            ->where('provider.amenities.0', 'Parking')
            ->where('provider.opening_hours.weekdays', '08:00-20:00')
            ->where('provider.services.0.name', 'Deep Tissue Massage')
            ->where('provider.services.0.price_amount', 1200)
            ->missing('provider.services.1')
            ->where('provider.reviews.0.title', 'Excellent care')
            ->missing('provider.reviews.1')
            ->missing('googleMapsApiKey'));
});

test('draft provider detail page is not public', function () {
    $provider = Provider::factory()->draft()->create();
    Service::factory()->for($provider)->create();

    $this->get(route('providers.show', $provider))->assertNotFound();
});

test('provider without active services is not public', function () {
    $provider = Provider::factory()->create();
    Service::factory()->inactive()->for($provider)->create();

    $this->get(route('providers.show', $provider))->assertNotFound();
});

test('providers index still resolves to authenticated dashboard', function () {
    $user = User::factory()->create([
        'email_verified_at' => now(),
    ]);

    $this->actingAs($user)
        ->get(route('provider.dashboard'))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page->component('dashboard'));
});
