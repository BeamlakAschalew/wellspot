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
        $activeServiceCount = $services->where('status', 'active')->count();
        $serviceBillingRate = (int) config('services.chapa.service_monthly_amount', 2000);

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
            ->with(['booking:id,customer_name', 'user:id,name'])
            ->where('is_published', true)
            ->latest()
            ->limit(4)
            ->get()
            ->map(fn ($review): array => [
                'id' => $review->id,
                'reviewer_name' => $review->user?->name ?? $review->booking?->customer_name,
                'rating' => $review->rating,
                'title' => $review->title,
                'comment' => $review->comment,
            ]);

        $subscription = $provider->subscription()
            ->first(['id', 'plan', 'amount', 'currency', 'status', 'started_at', 'expires_at']);
        $isSubscriptionActive = $subscription?->status === 'active'
            && $subscription->expires_at !== null
            && $subscription->expires_at->isFuture();
        $nextPaymentDueAt = $isSubscriptionActive ? $subscription->expires_at : now();

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
            'googleMapsApiKey' => config('services.google_maps.key'),
            'googleMapsMapId' => config('services.google_maps.map_id'),
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
            'subscription' => $subscription ? [
                'id' => $subscription->id,
                'plan' => $subscription->plan,
                'amount' => $subscription->amount,
                'currency' => $subscription->currency,
                'status' => $subscription->status,
                'started_at' => $subscription->started_at?->toIso8601String(),
                'expires_at' => $subscription->expires_at?->toIso8601String(),
            ] : null,
            'billing' => [
                'status' => $isSubscriptionActive
                    ? 'active'
                    : 'due',
                'active_service_count' => $activeServiceCount,
                'service_monthly_amount' => $serviceBillingRate,
                'monthly_total' => $activeServiceCount * $serviceBillingRate,
                'currency' => $subscription?->currency ?? 'ETB',
                'next_payment_due_at' => $nextPaymentDueAt->toIso8601String(),
                'can_start_checkout' => $activeServiceCount > 0,
                'checkout_blocker' => $activeServiceCount === 0
                    ? __('Add at least one active service before subscribing.')
                    : null,
            ],
            'stats' => [
                'services' => $services->count(),
                'pending_bookings' => $provider->bookings()->where('status', 'pending')->count(),
                'completed_bookings' => $provider->bookings()->where('status', 'completed')->count(),
                'average_rating' => round((float) $provider->reviews()->where('is_published', true)->avg('rating'), 1),
            ],
        ]);
    }
}
