import { Link } from '@inertiajs/react';
import {
    ArrowUpRight,
    Clock3,
    MapPin,
    ShieldCheck,
    Sparkles,
    Star,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { show as showProvider } from '@/routes/providers';

export type SearchProviderService = {
    name: string;
    name_am: string | null;
    price_amount: number | null;
    currency: string | null;
    duration_minutes: number | null;
};

export type SearchProvider = {
    id: number;
    name: string;
    name_am: string | null;
    slug: string;
    logo_url: string | null;
    headline: string | null;
    headline_am: string | null;
    description: string | null;
    description_am: string | null;
    category: {
        name: string;
        name_am: string | null;
        slug: string;
    } | null;
    services: SearchProviderService[];
    starting_price: number | null;
    currency: string;
    neighborhood: string | null;
    address: string | null;
    rating: number | null;
    reviews_count: number;
    is_featured: boolean;
};

type SearchCardProps = {
    provider: SearchProvider;
};

function formatPrice(amount: number | null, currency: string): string {
    if (amount === null) {
        return 'Ask';
    }

    return new Intl.NumberFormat('en', {
        maximumFractionDigits: 0,
        style: 'currency',
        currency,
    }).format(amount);
}

function localizedValue(
    value: string | null | undefined,
    valueAm: string | null | undefined,
    locale: string,
): string | null {
    return locale === 'am' ? (valueAm ?? value ?? null) : (value ?? null);
}

export default function SearchCard({ provider }: SearchCardProps) {
    const { locale } = useTranslation();
    const location = provider.neighborhood ?? provider.address ?? 'Addis Ababa';
    const primaryService = provider.services[0];
    const remainingServices = provider.services.slice(1, 4);
    const providerName =
        localizedValue(provider.name, provider.name_am, locale) ??
        provider.name;
    const providerHeadline = localizedValue(
        provider.headline,
        provider.headline_am,
        locale,
    );
    const providerDescription = localizedValue(
        provider.description,
        provider.description_am,
        locale,
    );

    return (
        <Link
            className="group grid min-h-[260px] overflow-hidden rounded-lg border border-outline-variant/40 bg-surface shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none md:grid-cols-[minmax(0,1fr)_300px]"
            href={showProvider.url(provider.id)}
            prefetch
        >
            <div className="flex min-w-0 flex-col justify-between gap-lg p-lg">
                <div className="space-y-md">
                    <div className="flex flex-wrap items-center gap-sm">
                        <span className="inline-flex items-center gap-xs rounded-full bg-primary-fixed px-sm py-xs font-label-sm text-label-sm text-on-primary-fixed">
                            <Sparkles className="h-3.5 w-3.5" />
                            {localizedValue(
                                provider.category?.name,
                                provider.category?.name_am,
                                locale,
                            ) ?? 'Wellness'}
                        </span>
                        {provider.is_featured && (
                            <span className="inline-flex items-center gap-xs rounded-full bg-secondary-fixed px-sm py-xs font-label-sm text-label-sm text-on-secondary-fixed">
                                <ShieldCheck className="h-3.5 w-3.5" />
                                Featured
                            </span>
                        )}
                    </div>

                    <div>
                        <div className="flex min-w-0 items-center gap-md">
                            {provider.logo_url && (
                                <img
                                    alt={`${providerName} logo`}
                                    className="h-14 w-14 shrink-0 rounded-lg border border-outline-variant/30 bg-surface-container object-cover"
                                    src={provider.logo_url}
                                />
                            )}
                            <h2 className="min-w-0 font-headline-lg text-headline-lg text-on-surface transition-colors group-hover:text-primary">
                                {providerName}
                            </h2>
                        </div>
                        <p className="mt-sm line-clamp-2 font-body-md text-body-md text-on-surface-variant">
                            {providerHeadline ??
                                providerDescription ??
                                localizedValue(
                                    primaryService?.name,
                                    primaryService?.name_am,
                                    locale,
                                ) ??
                                'Wellness provider'}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-md text-on-surface-variant">
                        <span className="inline-flex items-center gap-xs font-label-md text-label-md">
                            <MapPin className="h-4 w-4 text-primary" />
                            {location}
                        </span>
                        <span className="inline-flex items-center gap-xs font-label-md text-label-md">
                            <Star className="h-4 w-4 fill-[#FFB800] text-[#FFB800]" />
                            {provider.rating ?? 'New'} ({provider.reviews_count})
                        </span>
                        {primaryService?.duration_minutes && (
                            <span className="inline-flex items-center gap-xs font-label-md text-label-md">
                                <Clock3 className="h-4 w-4 text-primary" />
                                From {primaryService.duration_minutes} min
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-md border-t border-outline-variant/30 pt-md sm:flex-row sm:items-end sm:justify-between">
                    <div className="min-w-0">
                        {primaryService && (
                            <p className="truncate font-label-md text-label-md text-on-surface">
                                {localizedValue(
                                    primaryService.name,
                                    primaryService.name_am,
                                    locale,
                                )}
                            </p>
                        )}
                        {remainingServices.length > 0 && (
                            <p className="mt-xs line-clamp-1 font-body-sm text-body-sm text-outline">
                                Also:{' '}
                                {remainingServices
                                    .map((service) =>
                                        localizedValue(
                                            service.name,
                                            service.name_am,
                                            locale,
                                        ),
                                    )
                                    .join(', ')}
                            </p>
                        )}
                    </div>
                    <div className="flex shrink-0 items-center justify-between gap-md sm:justify-end">
                        <span className="font-headline-sm text-headline-sm text-primary">
                            {formatPrice(provider.starting_price, provider.currency)}
                        </span>
                        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary text-on-primary transition-transform group-hover:translate-x-1">
                            <ArrowUpRight className="h-5 w-5" />
                        </span>
                    </div>
                </div>
            </div>

            <div className="relative hidden bg-surface-container-low md:block">
                {provider.logo_url ? (
                    <img
                        alt={`${providerName} logo`}
                        className="absolute inset-0 h-full w-full object-cover"
                        src={provider.logo_url}
                    />
                ) : (
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(176,240,214,0.9),transparent_36%),linear-gradient(135deg,rgba(0,53,39,0.92),rgba(0,101,145,0.78))]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/30 to-transparent" />
                <div className="relative flex h-full flex-col justify-between p-lg text-on-primary">
                    <div className="self-end rounded-full bg-surface/95 px-sm py-xs font-label-sm text-label-sm text-on-surface shadow-sm">
                        {provider.reviews_count > 0 ? 'Trusted by clients' : 'New listing'}
                    </div>
                    <div>
                        <p className="mb-sm font-label-sm text-label-sm uppercase text-on-primary/70">
                            Next step
                        </p>
                        <p className="max-w-[220px] font-headline-sm text-headline-sm">
                            View services, reviews, hours, and booking options.
                        </p>
                    </div>
                </div>
            </div>
        </Link>
    );
}
