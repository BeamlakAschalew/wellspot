<?php

namespace App\Http\Controllers;

use App\Models\Provider;
use App\Models\Review;
use App\Models\Service;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

class ProviderDetailController extends Controller
{
    public function __invoke(Provider $provider): Response
    {
        abort_unless($provider->status === 'published', 404);

        $provider->load([
            'category:id,name,slug',
            'services' => fn ($query) => $query
                ->where('status', 'active')
                ->orderBy('sort_order')
                ->orderBy('name'),
            'reviews' => fn ($query) => $query
                ->with(['user:id,name', 'booking:id,customer_name'])
                ->where('is_published', true)
                ->latest()
                ->limit(6),
        ])->loadCount([
            'reviews' => fn ($query) => $query->where('is_published', true),
        ])->loadAvg([
            'reviews' => fn ($query) => $query->where('is_published', true),
        ], 'rating');

        abort_if($provider->services->isEmpty(), 404);

        return Inertia::render('details', [
            'provider' => $this->providerPayload($provider),
        ]);
    }

    /**
     * @return array{id: int, name: string, slug: string, logo_url: ?string, headline: ?string, description: ?string, phone: ?string, email: ?string, address: ?string, neighborhood: ?string, latitude: ?string, longitude: ?string, amenities: array<int, string>, opening_hours: array<string, mixed>, category: ?array{name: string, slug: string}, services: array<int, array{id: int, name: string, slug: string, description: ?string, duration_minutes: ?int, price_amount: ?int, currency: string}>, reviews: array<int, array{id: int, reviewer_name: ?string, rating: int, title: ?string, comment: ?string, created_at: ?string}>, rating: ?float, reviews_count: int, starting_price: ?int, currency: string, is_featured: bool}
     */
    protected function providerPayload(Provider $provider): array
    {
        /** @var Collection<int, Service> $services */
        $services = $provider->services;

        /** @var Collection<int, Review> $reviews */
        $reviews = $provider->reviews;

        return [
            'id' => $provider->id,
            'name' => $provider->name,
            'slug' => $provider->slug,
            'logo_url' => $provider->logo_url,
            'headline' => $provider->headline,
            'description' => $provider->description,
            'phone' => $provider->phone,
            'email' => $provider->email,
            'address' => $provider->address,
            'neighborhood' => $provider->neighborhood,
            'latitude' => $provider->latitude,
            'longitude' => $provider->longitude,
            'amenities' => $provider->amenities ?? [],
            'opening_hours' => $provider->opening_hours ?? [],
            'category' => $provider->category ? [
                'name' => $provider->category->name,
                'slug' => $provider->category->slug,
            ] : null,
            'services' => $services->map(fn (Service $service): array => [
                'id' => $service->id,
                'name' => $service->name,
                'slug' => $service->slug,
                'description' => $service->description,
                'duration_minutes' => $service->duration_minutes,
                'price_amount' => $service->price_amount,
                'currency' => $service->currency ?? 'ETB',
            ])->values()->all(),
            'reviews' => $reviews->map(fn (Review $review): array => [
                'id' => $review->id,
                'reviewer_name' => $review->user?->name ?? $review->booking?->customer_name,
                'rating' => $review->rating,
                'title' => $review->title,
                'comment' => $review->comment,
                'created_at' => $review->created_at?->toFormattedDateString(),
            ])->values()->all(),
            'rating' => $provider->reviews_avg_rating !== null
                ? round((float) $provider->reviews_avg_rating, 1)
                : null,
            'reviews_count' => $provider->reviews_count,
            'starting_price' => $services->min('price_amount'),
            'currency' => $services->first()?->currency ?? 'ETB',
            'is_featured' => $provider->is_featured,
        ];
    }
}
