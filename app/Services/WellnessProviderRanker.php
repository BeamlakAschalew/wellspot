<?php

namespace App\Services;

use App\Ai\Agents\WellnessIntakeAgent;
use App\Models\Provider;
use App\Models\Service;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class WellnessProviderRanker
{
    private const RESULT_LIMIT = 5;

    public function __construct(private ProviderGeoSearch $geoSearch) {}

    /**
     * Rank published providers by how well their categories and active services
     * match the user's current feeling and selected intake answers.
     *
     * @param  array<string, mixed>  $input
     * @return Collection<int, array<string, mixed>>
     */
    public function rank(array $input): Collection
    {
        $signals = $this->signals($input);
        $providers = $this->providers($signals);

        if ($providers->isEmpty()) {
            return collect();
        }

        $ranked = $providers
            ->map(fn (Provider $provider): array => $this->score($provider, $signals))
            ->filter(fn (array $result): bool => $result['score'] > 0)
            ->sort($this->sortByScore(...))
            ->values();

        if ($ranked->isEmpty()) {
            $ranked = $providers
                ->map(fn (Provider $provider): array => $this->score($provider, $signals, includeFallbackReason: true))
                ->sort($this->sortByScore(...))
                ->values();
        }

        return $ranked->take(self::RESULT_LIMIT);
    }

    /**
     * @param  array<string, mixed>  $input
     * @return array{categories: list<string>, keywords: list<string>, latitude: float|null, longitude: float|null, radius: float}
     */
    private function signals(array $input): array
    {
        $answers = collect($input['answers']);

        $categories = $answers
            ->flatMap(fn (array $answer): array => $answer['category_slugs'] ?? [])
            ->intersect(WellnessIntakeAgent::CATEGORIES)
            ->unique()
            ->values()
            ->all();

        $text = collect([$input['feeling']])
            ->merge($answers->pluck('label'))
            ->merge($answers->pluck('question')->filter())
            ->implode(' ');

        $keywords = $answers
            ->flatMap(fn (array $answer): array => $answer['keywords'] ?? [])
            ->merge($this->keywordsFromText($text))
            ->map(fn (string $keyword): string => Str::lower(trim($keyword)))
            ->filter(fn (string $keyword): bool => mb_strlen($keyword) >= 3)
            ->unique()
            ->values()
            ->all();

        return [
            'categories' => $categories,
            'keywords' => $keywords,
            'latitude' => isset($input['latitude']) ? (float) $input['latitude'] : null,
            'longitude' => isset($input['longitude']) ? (float) $input['longitude'] : null,
            'radius' => (float) ($input['radius'] ?? 15),
        ];
    }

    /**
     * @param  array{categories: list<string>, keywords: list<string>, latitude: float|null, longitude: float|null, radius: float}  $signals
     * @return Collection<int, Provider>
     */
    private function providers(array $signals): Collection
    {
        $query = Provider::query()
            ->with([
                'category:id,name,slug',
                'services' => fn ($query) => $query
                    ->where('status', 'active')
                    ->orderBy('sort_order')
                    ->orderBy('name'),
                'services.category:id,name,slug',
            ])
            ->withCount(['services as active_services_count' => fn (Builder $query) => $query->where('status', 'active')])
            ->withAvg(['reviews as average_rating' => fn (Builder $query) => $query->where('is_published', true)], 'rating')
            ->where('status', 'published')
            ->whereHas('services', fn (Builder $query) => $query->where('status', 'active'))
            ->when($signals['categories'] !== [], function (Builder $query) use ($signals): void {
                $query->where(function (Builder $query) use ($signals): void {
                    $query->whereHas(
                        'category',
                        fn (Builder $category) => $category->whereIn('slug', $signals['categories']),
                    )->orWhereHas(
                        'services.category',
                        fn (Builder $category) => $category->whereIn('slug', $signals['categories']),
                    );
                });
            })
            ->limit(50);

        if ($signals['latitude'] !== null && $signals['longitude'] !== null) {
            return $this->geoSearch->within(
                $query,
                $signals['latitude'],
                $signals['longitude'],
                $signals['radius'],
                50,
            );
        }

        return $query->get();
    }

    /**
     * @param  array{categories: list<string>, keywords: list<string>, latitude: float|null, longitude: float|null, radius: float}  $signals
     * @return array<string, mixed>
     */
    private function score(Provider $provider, array $signals, bool $includeFallbackReason = false): array
    {
        $score = 0;
        $reasons = [];

        $providerCategorySlug = $provider->category?->slug;

        if ($providerCategorySlug !== null && in_array($providerCategorySlug, $signals['categories'], true)) {
            $score += 35;
            $reasons[] = "Matches {$provider->category->name}";
        }

        $matchedServices = $provider->services
            ->filter(function (Service $service) use ($signals): bool {
                $serviceCategorySlug = $service->category?->slug;

                return $serviceCategorySlug !== null
                    && in_array($serviceCategorySlug, $signals['categories'], true);
            })
            ->values();

        if ($matchedServices->isNotEmpty()) {
            $score += min(30, $matchedServices->count() * 15);
            $reasons[] = 'Offers '.$matchedServices->pluck('name')->take(2)->implode(', ');
        }

        $keywordMatches = $this->keywordMatches($provider, $signals['keywords']);

        if ($keywordMatches !== []) {
            $score += min(25, count($keywordMatches) * 5);
            $reasons[] = 'Matches '.implode(', ', array_slice($keywordMatches, 0, 3));
        }

        $averageRating = round((float) ($provider->average_rating ?? 0), 1);

        if ($averageRating > 0) {
            $score += (int) round($averageRating * 2);
            $reasons[] = "{$averageRating} star average";
        }

        if ($provider->is_featured) {
            $score += 3;
        }

        if (isset($provider->distance)) {
            $score += max(0, 10 - (int) floor((float) $provider->distance));
            $reasons[] = "{$provider->distance} km away";
        }

        if ($includeFallbackReason && $reasons === []) {
            $reasons[] = 'Has active wellness services available';
        }

        return [
            'score' => $score,
            'reasons' => array_values(array_unique($reasons)),
            'average_rating' => $averageRating,
            'active_services_count' => (int) $provider->active_services_count,
            'provider' => [
                'id' => $provider->id,
                'name' => $provider->name,
                'slug' => $provider->slug,
                'headline' => $provider->headline,
                'description' => $provider->description,
                'category' => $provider->category ? [
                    'id' => $provider->category->id,
                    'name' => $provider->category->name,
                    'slug' => $provider->category->slug,
                ] : null,
                'address' => $provider->address,
                'neighborhood' => $provider->neighborhood,
                'latitude' => $provider->latitude,
                'longitude' => $provider->longitude,
                'distance' => $provider->distance ?? null,
                'is_featured' => $provider->is_featured,
            ],
            'services' => $provider->services
                ->take(3)
                ->map(fn (Service $service): array => [
                    'id' => $service->id,
                    'name' => $service->name,
                    'description' => $service->description,
                    'duration_minutes' => $service->duration_minutes,
                    'price_amount' => $service->price_amount,
                    'currency' => $service->currency,
                    'category' => $service->category ? [
                        'id' => $service->category->id,
                        'name' => $service->category->name,
                        'slug' => $service->category->slug,
                    ] : null,
                ])
                ->values()
                ->all(),
        ];
    }

    /**
     * @param  array<string, mixed>  $first
     * @param  array<string, mixed>  $second
     */
    private function sortByScore(array $first, array $second): int
    {
        return [
            $second['score'],
            $second['average_rating'],
            $second['active_services_count'],
            (int) $second['provider']['id'],
        ] <=> [
            $first['score'],
            $first['average_rating'],
            $first['active_services_count'],
            (int) $first['provider']['id'],
        ];
    }

    /**
     * @return list<string>
     */
    private function keywordMatches(Provider $provider, array $keywords): array
    {
        $haystack = Str::lower(collect([
            $provider->name,
            $provider->headline,
            $provider->description,
            $provider->category?->name,
            $provider->category?->slug,
        ])->merge(
            $provider->services->flatMap(fn (Service $service): array => [
                $service->name,
                $service->description,
                $service->category?->name,
                $service->category?->slug,
            ])
        )->filter()->implode(' '));

        return collect($keywords)
            ->filter(fn (string $keyword): bool => Str::contains($haystack, $keyword))
            ->values()
            ->all();
    }

    /**
     * @return list<string>
     */
    private function keywordsFromText(string $text): array
    {
        $ignored = [
            'about', 'after', 'again', 'also', 'because', 'could', 'feel',
            'feeling', 'have', 'help', 'right', 'should', 'today', 'want',
            'wellness', 'what', 'with', 'would',
        ];

        preg_match_all('/[a-zA-Z][a-zA-Z-]{2,}/', Str::lower($text), $matches);

        return collect($matches[0] ?? [])
            ->reject(fn (string $word): bool => in_array($word, $ignored, true))
            ->values()
            ->all();
    }
}
