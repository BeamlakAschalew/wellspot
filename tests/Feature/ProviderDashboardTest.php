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
            ->where('googleMapsApiKey', config('services.google_maps.key'))
            ->where('googleMapsMapId', config('services.google_maps.map_id'))
            ->where('stats.services', 0)
            ->where('billing.status', 'due')
            ->where('billing.active_service_count', 0)
            ->where('billing.service_monthly_amount', 2000)
            ->where('billing.monthly_total', 0)
            ->where('billing.can_start_checkout', false)
            ->has('categories', 1)
        );

    expect($user->providers()->count())->toBe(1);
});

test('provider dashboard includes service booking and review summaries', function () {
    $category = Category::factory()->create(['name' => 'Yoga & Mindfulness']);
    $owner = User::factory()->create();
    $provider = Provider::factory()
        ->for($owner)
        ->for($category)
        ->create([
            'name' => 'Bole Balance Studio',
            'logo_path' => 'provider-logos/bole-balance-studio.png',
        ]);
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
    $response = $this->actingAs($owner)->get(route('provider.dashboard'));

    $response
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->where('provider.name', 'Bole Balance Studio')
            ->where('provider.logo_url', $provider->logo_url)
            ->where('stats.services', 1)
            ->where('stats.pending_bookings', 1)
            ->where('stats.completed_bookings', 1)
            ->where('stats.average_rating', 5)
            ->where('billing.active_service_count', 1)
            ->where('billing.monthly_total', 2000)
            ->where('billing.can_start_checkout', true)
            ->where('services.0.name', 'Guided Breathwork')
            ->where('bookings.0.customer_name', 'Aster Tesfaye')
            ->where('reviews.0.title', 'Great care')
        );
});

test('pending subscription attempts do not block retrying Chapa checkout', function () {
    $category = Category::factory()->create();
    $owner = User::factory()->create();
    $provider = Provider::factory()
        ->for($owner)
        ->for($category)
        ->draft()
        ->create();
    Service::factory()->for($provider)->for($category)->create();
    ProviderSubscription::query()->create([
        'provider_id' => $provider->id,
        'plan' => 'monthly',
        'amount' => 8000,
        'currency' => 'ETB',
        'chapa_tx_ref' => 'wellspot-pending-test',
        'chapa_checkout_url' => 'https://checkout.chapa.co/checkout/test',
        'status' => 'pending',
    ]);

    $response = $this->actingAs($owner)->get(route('provider.dashboard'));

    $response
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('billing.status', 'due')
            ->where('billing.can_start_checkout', true)
            ->where('subscription.status', 'pending')
        );
});

test('active subscription sets next pay day and blocks checkout', function () {
    $this->travelTo(now());

    $category = Category::factory()->create();
    $owner = User::factory()->create();
    $provider = Provider::factory()
        ->for($owner)
        ->for($category)
        ->create();
    Service::factory()->for($provider)->for($category)->create();
    ProviderSubscription::query()->create([
        'provider_id' => $provider->id,
        'plan' => 'monthly',
        'amount' => 2000,
        'currency' => 'ETB',
        'chapa_tx_ref' => 'wellspot-active-test',
        'chapa_checkout_url' => 'https://checkout.chapa.co/checkout/test',
        'status' => 'active',
        'started_at' => now(),
        'expires_at' => now()->addDays(30),
    ]);

    $response = $this->actingAs($owner)->get(route('provider.dashboard'));

    $response
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('billing.status', 'active')
            ->where('billing.can_start_checkout', false)
            ->where('subscription.status', 'active')
            ->where('billing.next_payment_due_at', fn (string $value): bool => str_starts_with($value, now()->addDays(30)->format('Y-m-d')))
        );
});
