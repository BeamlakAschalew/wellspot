<?php

use App\Models\Booking;
use App\Models\Category;
use App\Models\Provider;
use App\Models\ProviderSubscription;
use App\Models\Review;
use App\Models\Service;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected from the provider dashboard', function () {
    $response = $this->get(route('provider.dashboard'));

    $response->assertRedirect(route('login'));
});

test('authenticated users get a draft provider dashboard scaffold', function () {
    $user = User::factory()->create(['name' => 'Mekdes Wellness']);

    $response = $this->actingAs($user)->get(route('provider.dashboard'));

    $response
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->where('provider.name', 'Mekdes Wellness\'s Wellness Studio')
            ->where('provider.status', 'draft')
            ->where('stats.services', 0)
            ->has('categories', 1)
        );

    expect($user->providers()->count())->toBe(1);
});

test('provider dashboard includes service booking review and subscription summaries', function () {
    $category = Category::factory()->create(['name' => 'Yoga & Mindfulness']);
    $owner = User::factory()->create();
    $provider = Provider::factory()
        ->for($owner)
        ->for($category)
        ->create(['name' => 'Bole Balance Studio']);
    $service = Service::factory()
        ->for($provider)
        ->for($category)
        ->create(['name' => 'Guided Breathwork', 'price_amount' => 1200]);

    Booking::factory()
        ->for($owner)
        ->for($provider)
        ->for($service)
        ->pending()
        ->create(['customer_name' => 'Aster Tesfaye']);
    Booking::factory()
        ->for($owner)
        ->for($provider)
        ->for($service)
        ->completed()
        ->create(['total_amount' => 1200]);
    Review::factory()
        ->for($owner)
        ->for($provider)
        ->create(['rating' => 5, 'title' => 'Great care']);
    ProviderSubscription::factory()
        ->for($provider)
        ->active()
        ->create(['plan' => 'growth']);

    $response = $this->actingAs($owner)->get(route('provider.dashboard'));

    $response
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->where('provider.name', 'Bole Balance Studio')
            ->where('provider.subscription.plan', 'growth')
            ->where('stats.services', 1)
            ->where('stats.pending_bookings', 1)
            ->where('stats.monthly_revenue', 1200)
            ->where('stats.average_rating', 5)
            ->where('services.0.name', 'Guided Breathwork')
            ->where('bookings.0.customer_name', 'Aster Tesfaye')
            ->where('reviews.0.title', 'Great care')
        );
});
