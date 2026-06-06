<?php

namespace App\Services;

use App\Models\Category;
use App\Models\Provider;
use App\Models\Service;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

class ProviderSearch
{
    /**
     * @return Collection<int, array{id: int, name: string, name_am: ?string, slug: string, icon: ?string, color: ?string, description: ?string, description_am: ?string, providers_count: int}>
     */
    public function categories(): Collection
    {
        return Category::query()
            ->withCount([
                'providers' => fn ($query) => $query
                    ->where('status', 'published')
                    ->whereHas('services', fn ($service) => $service->where('status', 'active')),
            ])
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get(['id', 'name', 'name_am', 'slug', 'icon', 'color', 'description', 'description_am'])
            ->map(fn (Category $category): array => [
                'id' => $category->id,
                'name' => $category->name,
                'name_am' => $category->name_am,
                'slug' => $category->slug,
                'icon' => $category->icon,
                'color' => $category->color,
                'description' => $category->description,
                'description_am' => $category->description_am,
                'providers_count' => $category->providers_count,
            ]);
    }

    /**
     * @return Collection<int, array{id: int, name: string, name_am: ?string, slug: string, logo_url: ?string, headline: ?string, headline_am: ?string, description: ?string, description_am: ?string, category: ?array{name: string, name_am: ?string, slug: string}, services: array<int, array{name: string, name_am: ?string, price_amount: ?int, currency: ?string, duration_minutes: ?int}>, starting_price: ?int, currency: string, neighborhood: ?string, address: ?string, rating: ?float, reviews_count: int, is_featured: bool}>
     */
    public function providers(?string $search = null, ?string $location = null, ?string $category = null, int $limit = 12): Collection
    {
        return $this->query($search, $location, $category)
            ->limit($limit)
            ->get()
            ->map(fn (Provider $provider): array => $this->payload($provider));
    }

    /**
     * @return Collection<int, array{id: int, name: string, name_am: ?string, slug: string, logo_url: ?string, headline: ?string, headline_am: ?string, description: ?string, description_am: ?string, category: ?array{name: string, name_am: ?string, slug: string}, services: array<int, array{name: string, name_am: ?string, price_amount: ?int, currency: ?string, duration_minutes: ?int}>, starting_price: ?int, currency: string, neighborhood: ?string, address: ?string, rating: ?float, reviews_count: int, is_featured: bool}>
     */
    public function topRated(int $limit = 4): Collection
    {
        return $this->query()
            ->orderByDesc('reviews_avg_rating')
            ->orderByDesc('reviews_count')
            ->limit($limit)
            ->get()
            ->map(fn (Provider $provider): array => $this->payload($provider));
    }

    /**
     * @return Builder<Provider>
     */
    public function query(?string $search = null, ?string $location = null, ?string $category = null): Builder
    {
        return Provider::query()
            ->with([
                'category:id,name,name_am,slug',
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
                    ->orWhere('name_am', 'like', "%{$term}%")
                    ->orWhere('headline', 'like', "%{$term}%")
                    ->orWhere('headline_am', 'like', "%{$term}%")
                    ->orWhere('description', 'like', "%{$term}%")
                    ->orWhere('description_am', 'like', "%{$term}%")
                    ->orWhereHas('category', fn ($categoryQuery) => $categoryQuery
                        ->where('name', 'like', "%{$term}%")
                        ->orWhere('name_am', 'like', "%{$term}%"))
                    ->orWhereHas('services', fn ($serviceQuery) => $serviceQuery
                        ->where('status', 'active')
                        ->where(function ($serviceQuery) use ($term): void {
                            $serviceQuery
                                ->where('name', 'like', "%{$term}%")
                                ->orWhere('name_am', 'like', "%{$term}%")
                                ->orWhere('description', 'like', "%{$term}%")
                                ->orWhere('description_am', 'like', "%{$term}%");
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
     * @return array{id: int, name: string, name_am: ?string, slug: string, logo_url: ?string, headline: ?string, headline_am: ?string, description: ?string, description_am: ?string, category: ?array{name: string, name_am: ?string, slug: string}, services: array<int, array{name: string, name_am: ?string, price_amount: ?int, currency: ?string, duration_minutes: ?int}>, starting_price: ?int, currency: string, neighborhood: ?string, address: ?string, rating: ?float, reviews_count: int, is_featured: bool}
     */
    protected function payload(Provider $provider): array
    {
        /** @var Collection<int, Service> $services */
        $services = $provider->services;

        return [
            'id' => $provider->id,
            'name' => $provider->name,
            'name_am' => $provider->name_am,
            'slug' => $provider->slug,
            'logo_url' => $provider->logo_url,
            'headline' => $provider->headline,
            'headline_am' => $provider->headline_am,
            'description' => $provider->description,
            'description_am' => $provider->description_am,
            'category' => $provider->category ? [
                'name' => $provider->category->name,
                'name_am' => $provider->category->name_am,
                'slug' => $provider->category->slug,
            ] : null,
            'services' => $services->map(fn (Service $service): array => [
                'name' => $service->name,
                'name_am' => $service->name_am,
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
