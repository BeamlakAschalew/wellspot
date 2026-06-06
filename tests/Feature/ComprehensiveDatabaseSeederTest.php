<?php

use App\Models\Booking;
use App\Models\Category;
use App\Models\Provider;
use App\Models\ProviderSubscription;
use App\Models\Review;
use App\Models\Service;

test('database seeder creates a realistic wellness marketplace graph', function () {
    $this->seed();
    $this->seed();

    expect(Category::query()->count())->toBe(8)
        ->and(Provider::query()->count())->toBe(9)
        ->and(Service::query()->count())->toBe(28)
        ->and(Booking::query()->count())->toBe(12)
        ->and(Review::query()->count())->toBe(8)
        ->and(ProviderSubscription::query()->count())->toBe(9);

    $publishedProvidersWithActiveServices = Provider::query()
        ->where('status', 'published')
        ->whereHas('services', fn ($query) => $query->where('status', 'active'))
        ->count();

    expect($publishedProvidersWithActiveServices)->toBe(8)
        ->and(Booking::query()->whereNull('user_id')->count())->toBe(4)
        ->and(Booking::query()->where('status', 'completed')->count())->toBe(7)
        ->and(Review::query()->where('is_published', true)->count())->toBe(7)
        ->and(ProviderSubscription::query()->where('status', 'active')->count())->toBe(6);

    $reviewWithBooking = Review::query()
        ->with(['booking', 'provider'])
        ->where('title', 'Exactly the reset I needed')
        ->firstOrFail();

    expect($reviewWithBooking->booking)->not->toBeNull()
        ->and($reviewWithBooking->booking->provider_id)->toBe($reviewWithBooking->provider_id)
        ->and($reviewWithBooking->provider->slug)->toBe('bole-recovery-spa');
});
