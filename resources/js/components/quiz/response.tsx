import { Link } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { quiz } from '@/routes';
import { show as showProvider } from '@/routes/providers';
import { WELLNESS_RECOMMENDATION_STORAGE_KEY } from '@/types/wellness';
import type {
    WellnessRecommendation,
    WellnessRecommendationResult,
} from '@/types/wellness';

function readStoredResult(): WellnessRecommendationResult | null {
    try {
        const stored = sessionStorage.getItem(
            WELLNESS_RECOMMENDATION_STORAGE_KEY,
        );

        if (!stored) {
            return null;
        }

        return JSON.parse(stored) as WellnessRecommendationResult;
    } catch {
        return null;
    }
}

function formatRating(rating: number): string {
    return rating > 0 ? rating.toFixed(1) : 'New';
}

function ProviderRecommendationCard({
    recommendation,
    rank,
}: {
    recommendation: WellnessRecommendation;
    rank: number;
}) {
    const provider = recommendation.provider;
    const display = recommendation.display;
    const services =
        recommendation.services.length > 0
            ? recommendation.services
            : display.services.map((serviceName, index) => ({
                  category: null,
                  currency: null,
                  description: null,
                  duration_minutes: null,
                  id: index,
                  name: serviceName,
                  price_amount: null,
              }));

    return (
        <article className="overflow-hidden rounded-xl border border-outline-variant/40 bg-surface shadow-sm">
            <div className="flex flex-col gap-lg p-lg md:flex-row md:items-start md:justify-between">
                <div className="min-w-0 flex-1">
                    <div className="mb-sm flex flex-wrap items-center gap-sm">
                        <span className="rounded-full bg-primary-fixed px-sm py-xs font-label-sm text-label-sm text-primary">
                            #{rank} match
                        </span>
                        {display.category ? (
                            <span className="rounded-full bg-surface-container-high px-sm py-xs font-label-sm text-label-sm text-on-surface-variant">
                                {display.category}
                            </span>
                        ) : null}
                        <span className="rounded-full bg-secondary-fixed px-sm py-xs font-label-sm text-label-sm text-secondary">
                            Score {recommendation.score}
                        </span>
                    </div>

                    <h2 className="font-headline-lg text-headline-lg text-on-surface">
                        {display.provider_name || provider.name}
                    </h2>

                    {provider.headline || provider.description ? (
                        <p className="mt-sm max-w-2xl font-body-md text-body-md text-on-surface-variant">
                            {provider.headline ?? provider.description}
                        </p>
                    ) : null}

                    <div className="mt-md flex flex-wrap gap-md font-label-sm text-label-sm text-on-surface-variant">
                        <span>
                            {display.place || 'Location available soon'}
                        </span>
                        <span>
                            {formatRating(recommendation.average_rating)} rating
                        </span>
                        <span>
                            {recommendation.active_services_count} services
                        </span>
                        {display.starting_price ? (
                            <span>From {display.starting_price}</span>
                        ) : null}
                    </div>
                </div>

                <Link
                    className="inline-flex shrink-0 items-center justify-center rounded-xl bg-primary-container px-lg py-md font-label-md text-label-md text-on-primary shadow-sm transition-all hover:brightness-110 active:scale-95"
                    href={showProvider.url(provider.id)}
                >
                    View provider
                </Link>
            </div>

            <div className="grid gap-md border-t border-outline-variant/30 bg-surface-container-low p-lg lg:grid-cols-[minmax(0,1fr)_minmax(260px,360px)]">
                <div>
                    <h3 className="mb-sm font-label-md text-label-md font-bold text-on-surface">
                        Recommended services
                    </h3>
                    <div className="grid gap-sm sm:grid-cols-2">
                        {services.slice(0, 4).map((service) => (
                            <div
                                className="rounded-lg border border-outline-variant/30 bg-surface px-md py-sm"
                                key={`${provider.id}-${service.id}-${service.name}`}
                            >
                                <p className="font-label-md text-label-md font-bold text-on-surface">
                                    {service.name}
                                </p>
                                {service.category?.name ? (
                                    <p className="mt-xs font-label-sm text-label-sm text-outline">
                                        {service.category.name}
                                    </p>
                                ) : null}
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="mb-sm font-label-md text-label-md font-bold text-on-surface">
                        Why this matched
                    </h3>
                    <ul className="space-y-xs font-label-sm text-label-sm text-on-surface-variant">
                        {recommendation.reasons.map((reason) => (
                            <li className="flex gap-xs" key={reason}>
                                <span className="text-primary">check</span>
                                <span>{reason}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </article>
    );
}

export default function ResponseCard() {
    const [result] = useState<WellnessRecommendationResult | null>(() =>
        readStoredResult(),
    );

    const recommendations = useMemo(
        () => result?.recommendations ?? [],
        [result],
    );

    return (
        <main className="mx-auto w-full max-w-container-max px-margin-mobile pt-24 pb-24 md:px-lg">
            <div className="mb-xl">
                <span className="mb-sm block font-label-sm text-label-sm tracking-wider text-primary uppercase">
                    Wellness match
                </span>
                <h1 className="max-w-3xl font-display text-display text-on-surface">
                    Provider recommendations for right now
                </h1>
                <p className="mt-md max-w-3xl font-body-lg text-body-lg text-on-surface-variant">
                    {result?.summary ??
                        'Finish the quiz to generate ranked provider recommendations.'}
                </p>
            </div>

            {recommendations.length > 0 ? (
                <div className="space-y-lg">
                    {recommendations.map((recommendation, index) => (
                        <ProviderRecommendationCard
                            key={recommendation.provider.id}
                            rank={index + 1}
                            recommendation={recommendation}
                        />
                    ))}
                </div>
            ) : (
                <div className="rounded-xl border border-outline-variant/40 bg-surface-container-low p-xl text-center">
                    <h2 className="font-headline-md text-headline-md text-on-surface">
                        No provider recommendation yet
                    </h2>
                    <p className="mx-auto mt-sm max-w-xl font-body-md text-body-md text-on-surface-variant">
                        Start from the quiz so the recommendation can use your
                        selected answer keywords and services.
                    </p>
                    <Link
                        className="mt-lg inline-flex rounded-xl bg-primary-container px-lg py-md font-label-md text-label-md text-on-primary shadow-sm transition-all hover:brightness-110 active:scale-95"
                        href={quiz.url()}
                    >
                        Take quiz
                    </Link>
                </div>
            )}
        </main>
    );
}
