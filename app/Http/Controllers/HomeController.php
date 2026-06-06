<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Provider;
use App\Models\Service;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $validated = $request->validate([
            'search' => ['nullable', 'string', 'max:120'],
            'location' => ['nullable', 'string', 'max:120'],
            'category' => ['nullable', 'string', Rule::exists('categories', 'slug')],
        ]);

        $search = $validated['search'] ?? null;
        $location = $validated['location'] ?? null;
        $category = $validated['category'] ?? null;

        $categories = Category::query()
            ->withCount([
                'providers' => fn ($query) => $query
                    ->where('status', 'published')
                    ->whereHas('services', fn ($service) => $service->where('status', 'active')),
            ])
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get(['id', 'name', 'slug', 'icon', 'color', 'description'])
            ->map(fn (Category $category): array => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'icon' => $category->icon,
                'color' => $category->color,
                'description' => $category->description,
                'providers_count' => $category->providers_count,
            ]);

        $providers = $this->providerQuery($search, $location, $category)
            ->limit(12)
            ->get()
            ->map(fn (Provider $provider): array => $this->providerPayload($provider));

        $topRatedProviders = $this->providerQuery()
            ->orderByDesc('reviews_avg_rating')
            ->orderByDesc('reviews_count')
            ->limit(4)
            ->get()
            ->map(fn (Provider $provider): array => $this->providerPayload($provider));

        return Inertia::render('welcome', [
            'filters' => [
                'search' => $search ?? '',
                'location' => $location ?? '',
                'category' => $category ?? '',
            ],
            'categories' => $categories,
            'providers' => $providers,
            'topRatedProviders' => $topRatedProviders,
        ]);
    }

    /**
     * @return Builder<Provider>
     */
    protected function providerQuery(?string $search = null, ?string $location = null, ?string $category = null): Builder
    {
        return Provider::query()
            ->with([
                'category:id,name,slug',
                'services' => fn ($query) => $query
                    ->where('status', 'active')
                    ->orderBy('sort_order')
                    ->orderBy('name'),
            ])
            ->withCount([
                'reviews' => fn ($query) => $query->where('is_published', true),
            ])
            ->withAvg([
                'reviews' => fn ($query) => $query->where('is_published', true),
            ], 'rating')
            ->where('status', 'published')
            ->whereHas('services', fn ($query) => $query->where('status', 'active'))
            ->when($category, fn ($query, string $slug) => $query->whereHas(
                'category',
                fn ($categoryQuery) => $categoryQuery->where('slug', $slug),
            ))
            ->when($search, fn ($query, string $term) => $query->where(function ($query) use ($term): void {
                $query
                    ->where('name', 'like', "%{$term}%")
                    ->orWhere('headline', 'like', "%{$term}%")
                    ->orWhere('description', 'like', "%{$term}%")
                    ->orWhereHas('category', fn ($categoryQuery) => $categoryQuery->where('name', 'like', "%{$term}%"))
                    ->orWhereHas('services', fn ($serviceQuery) => $serviceQuery
                        ->where('status', 'active')
                        ->where(function ($serviceQuery) use ($term): void {
                            $serviceQuery
                                ->where('name', 'like', "%{$term}%")
                                ->orWhere('description', 'like', "%{$term}%");
                        }));
            }))
            ->when($location, fn ($query, string $term) => $query->where(function ($query) use ($term): void {
                $query
                    ->where('neighborhood', 'like', "%{$term}%")
                    ->orWhere('address', 'like', "%{$term}%");
            }))
            ->orderByDesc('is_featured')
            ->orderByDesc('reviews_avg_rating')
            ->orderByDesc('reviews_count')
            ->latest('published_at');
    }

    /**
     * @return array{id: int, name: string, slug: string, headline: ?string, category: ?array{name: string, slug: string}, services: array<int, array{name: string, price_amount: ?int, currency: ?string, duration_minutes: ?int}>, starting_price: ?int, currency: string, neighborhood: ?string, address: ?string, rating: ?float, reviews_count: int, is_featured: bool}
     */
    protected function providerPayload(Provider $provider): array
    {
        /** @var Collection<int, Service> $services */
        $services = $provider->services;

        return [
            'id' => $provider->id,
            'name' => $provider->name,
            'slug' => $provider->slug,
            'headline' => $provider->headline,
            'category' => $provider->category ? [
                'name' => $provider->category->name,
                'slug' => $provider->category->slug,
            ] : null,
            'services' => $services->map(fn ($service): array => [
                'name' => $service->name,
                'price_amount' => $service->price_amount,
                'currency' => $service->currency,
                'duration_minutes' => $service->duration_minutes,
            ])->values()->all(),
            'starting_price' => $services->min('price_amount'),
            'currency' => $services->first()?->currency ?? 'ETB',
            'neighborhood' => $provider->neighborhood,
            'address' => $provider->address,
            'rating' => $provider->reviews_avg_rating !== null
                ? round((float) $provider->reviews_avg_rating, 1)
                : null,
            'reviews_count' => $provider->reviews_count,
            'is_featured' => $provider->is_featured,
        ];
    }
}
