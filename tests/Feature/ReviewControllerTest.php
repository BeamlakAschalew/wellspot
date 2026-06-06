<?php

use App\Models\Booking;
use App\Models\Category;
use App\Models\Provider;
use App\Models\Review;
use App\Models\Service;

test('guests can submit a review for their booking', function () {
    $category = Category::factory()->create();
    $provider = Provider::factory()->for($category)->create();
    $service = Service::factory()->for($provider)->for($category)->create();
    $booking = Booking::factory()
        ->guest()
        ->for($provider)
        ->for($service)
        ->completed()
        ->create([
            'customer_name' => 'Aster Tesfaye',
            'customer_phone' => '+251911000111',
        ]);

    $response = $this->from('/bookings/'.$booking->id)->post(route('reviews.store'), [
        'booking_id' => $booking->id,
        'customer_phone' => '+251911000111',
        'rating' => 5,
        'title' => 'Great care',
        'comment' => 'Helpful and easy to book.',
    ]);

    $response->assertRedirect('/bookings/'.$booking->id);

    expect(Review::query()->firstOrFail())
        ->user_id->toBeNull()
        ->provider_id->toBe($provider->id)
        ->booking_id->toBe($booking->id)
        ->rating->toBe(5)
        ->title->toBe('Great care')
        ->is_published->toBeTrue();
});

test('review submission requires the booking customer phone', function () {
    $booking = Booking::factory()->guest()->create(['customer_phone' => '+251911000111']);

    $response = $this->post(route('reviews.store'), [
        'booking_id' => $booking->id,
        'customer_phone' => '+251922000111',
        'rating' => 5,
    ]);

    $response->assertNotFound();
});
