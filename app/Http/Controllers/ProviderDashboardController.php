<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Provider;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProviderDashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();

        $defaultCategory = Category::query()->firstOrCreate(
            ['slug' => 'spa-massage'],
            [
                'name' => 'Spa & Massage',
                'icon' => 'sparkles',
                'color' => 'emerald',
                'description' => 'Massage, spa, and body recovery providers.',
                'sort_order' => 1,
            ],
        );

        /** @var Provider $provider */
        $provider = Provider::query()
            ->with('category')
            ->firstOrCreate(
                ['user_id' => $user->id],
                [
                    'category_id' => $defaultCategory->id,
                    'name' => "{$user->name}'s Wellness Studio",
                    'slug' => Str::slug($user->name.' wellness studio').'-'.$user->id,
                    'headline' => 'Set up your WellSpot provider profile.',
                    'address' => 'Addis Ababa, Ethiopia',
                    'status' => 'draft',
                ],
            );

        $services = $provider->services()
            ->latest()
            ->get(['id', 'category_id', 'name', 'description', 'duration_minutes', 'price_amount', 'currency', 'status', 'sort_order']);

        $recentBookings = $provider->bookings()
            ->with('service:id,name')
            ->latest('starts_at')
            ->limit(6)
            ->get()
            ->map(fn ($booking): array => [
                'id' => $booking->id,
                'customer_name' => $booking->customer_name,
                'service_name' => $booking->service?->name,
                'starts_at' => $booking->starts_at?->toIso8601String(),
                'status' => $booking->status,
                'total_amount' => $booking->total_amount,
                'currency' => $booking->currency,
            ]);

        $latestReviews = $provider->reviews()
            ->with('user:id,name')
            ->where('is_published', true)
            ->latest()
            ->limit(4)
            ->get()
            ->map(fn ($review): array => [
                'id' => $review->id,
                'reviewer_name' => $review->user?->name,
                'rating' => $review->rating,
                'title' => $review->title,
                'comment' => $review->comment,
            ]);

        return Inertia::render('dashboard', [
            'provider' => [
                'id' => $provider->id,
                'name' => $provider->name,
                'headline' => $provider->headline,
                'description' => $provider->description,
                'status' => $provider->status,
                'category_id' => $provider->category_id,
                'address' => $provider->address,
                'neighborhood' => $provider->neighborhood,
                'phone' => $provider->phone,
                'email' => $provider->email,
                'latitude' => $provider->latitude,
                'longitude' => $provider->longitude,
                'category' => $provider->category?->name,
            ],
            'categories' => Category::query()
                ->orderBy('sort_order', 'asc')
                ->get(['id', 'name'])
                ->map(fn (Category $category): array => [
                    'id' => $category->id,
                    'name' => $category->name,
                ]),
            'services' => $services->map(fn ($service): array => [
                'id' => $service->id,
                'category_id' => $service->category_id,
                'name' => $service->name,
                'description' => $service->description,
                'duration_minutes' => $service->duration_minutes,
                'price_amount' => $service->price_amount,
                'currency' => $service->currency,
                'status' => $service->status,
                'sort_order' => $service->sort_order,
            ]),
            'bookings' => $recentBookings,
            'reviews' => $latestReviews,
            'stats' => [
                'services' => $services->count(),
                'pending_bookings' => $provider->bookings()->where('status', 'pending')->count(),
                'completed_bookings' => $provider->bookings()->where('status', 'completed')->count(),
                'average_rating' => round((float) $provider->reviews()->where('is_published', true)->avg('rating'), 1),
            ],
        ]);
    }
}
