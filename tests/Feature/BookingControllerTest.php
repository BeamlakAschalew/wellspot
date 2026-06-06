<?php

use App\Models\Booking;
use App\Models\Category;
use App\Models\Provider;
use App\Models\Service;
use App\Models\User;
use Inertia\Support\SessionKey;

test('guests can create booking requests without signing up', function () {
    $category = Category::factory()->create();
    $provider = Provider::factory()->for($category)->create();
    $service = Service::factory()
        ->for($provider)
        ->for($category)
        ->create(['price_amount' => 1300, 'currency' => 'ETB']);

    $response = $this->from('/providers/'.$provider->id)->post(route('bookings.store'), [
        'service_id' => $service->id,
        'starts_at' => now()->addDay()->setHour(10)->toDateTimeString(),
        'customer_name' => 'Aster Tesfaye',
        'customer_phone' => '+251911000111',
        'notes' => 'Prefer morning if possible.',
    ]);

    $response->assertRedirect('/providers/'.$provider->id);
    $response->assertSessionHas(SessionKey::FLASH_DATA, [
        'toast' => [
            'type' => 'success',
            'message' => 'Booking request sent.',
        ],
    ]);

    $booking = Booking::query()->firstOrFail();

    expect($booking)
        ->user_id->toBeNull()
        ->provider_id->toBe($provider->id)
        ->service_id->toBe($service->id)
        ->customer_name->toBe('Aster Tesfaye')
        ->total_amount->toBe(1300)
        ->currency->toBe('ETB')
        ->status->toBe('pending');
});

test('booking validation rejects incomplete guest payloads', function () {
    $response = $this->post(route('bookings.store'), [
        'starts_at' => now()->subDay()->toDateTimeString(),
        'customer_name' => '',
        'customer_phone' => '',
    ]);

    $response->assertSessionHasErrors(['service_id', 'starts_at', 'customer_name', 'customer_phone']);
});

test('providers can update their own booking statuses', function () {
    $category = Category::factory()->create();
    $owner = User::factory()->create();
    $provider = Provider::factory()->for($owner)->for($category)->create();
    $service = Service::factory()->for($provider)->for($category)->create();
    $booking = Booking::factory()
        ->guest()
        ->for($provider)
        ->for($service)
        ->pending()
        ->create();

    $response = $this->actingAs($owner)->patch(route('provider.bookings.status.update', $booking), [
        'status' => 'confirmed',
    ]);

    $response->assertRedirect(route('provider.dashboard'));
    expect($booking->refresh()->status)->toBe('confirmed');
});

test('providers cannot update bookings owned by another provider', function () {
    $category = Category::factory()->create();
    $owner = User::factory()->create();
    $otherUser = User::factory()->create();
    Provider::factory()->for($owner)->for($category)->create();
    $otherProvider = Provider::factory()->for($otherUser)->for($category)->create();
    $service = Service::factory()->for($otherProvider)->for($category)->create();
    $booking = Booking::factory()->guest()->for($otherProvider)->for($service)->pending()->create();

    $response = $this->actingAs($owner)->patch(route('provider.bookings.status.update', $booking), [
        'status' => 'confirmed',
    ]);

    $response->assertNotFound();
    expect($booking->refresh()->status)->toBe('pending');
});
