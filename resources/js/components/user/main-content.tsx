import { Link, router } from '@inertiajs/react';
import {
    ArrowRight,
    Building2,
    Calendar,
    MapPin,
    Search,
    Smile,
    Sparkles,
    Star,
    X,
} from 'lucide-react';
import type { FormEvent } from 'react';
import { useMemo, useState } from 'react';
import type { IconType } from 'react-icons';
import { FaDiagnoses, FaSpa } from 'react-icons/fa';
import { GiMeditation } from 'react-icons/gi';
import { IoMdFitness } from 'react-icons/io';
import { PiBowlSteamThin } from 'react-icons/pi';
import { RiPsychotherapyLine, RiShieldCrossLine } from 'react-icons/ri';
import testimonialSarahImage from '@/assets/wellspot/image-01.jpg';
import providerMassageImage from '@/assets/wellspot/image-02.jpg';
import testimonialDavidImage from '@/assets/wellspot/image-03.jpg';
import providerTherapyImage from '@/assets/wellspot/image-04.jpg';
import providerYogaImage from '@/assets/wellspot/image-05.jpg';
import heroImage from '@/assets/wellspot/image-06.jpg';
import providerSpaImage from '@/assets/wellspot/image-07.jpg';
import { explore, home, register } from '@/routes';
import { show as showProvider } from '@/routes/providers';

export type HomeFilters = {
    search: string;
    location: string;
    category: string;
};

export type HomeCategory = {
    id: number;
    name: string;
    slug: string;
    icon: string | null;
    color: string | null;
    description: string | null;
    providers_count: number;
};

type ProviderService = {
    name: string;
    price_amount: number | null;
    currency: string | null;
    duration_minutes: number | null;
};

export type HomeProvider = {
    id: number;
    name: string;
    slug: string;
    headline: string | null;
    category: {
        name: string;
        slug: string;
    } | null;
    services: ProviderService[];
    starting_price: number | null;
    currency: string;
    neighborhood: string | null;
    address: string | null;
    rating: number | null;
    reviews_count: number;
    is_featured: boolean;
};

type MainContentProps = {
    filters: HomeFilters;
    categories: HomeCategory[];
    providers: HomeProvider[];
    topRatedProviders: HomeProvider[];
};

type CategoryIconConfig = {
    icon: IconType;
    iconClass: string;
    backgroundClass: string;
};

const categoryIconConfigs: Record<string, CategoryIconConfig> = {
    sparkles: {
        icon: FaSpa,
        iconClass: 'text-primary',
        backgroundClass: 'bg-primary-fixed group-hover:bg-primary-fixed-dim',
    },
    dumbbell: {
        icon: IoMdFitness,
        iconClass: 'text-secondary',
        backgroundClass:
            'bg-secondary-fixed group-hover:bg-secondary-fixed-dim',
    },
    leaf: {
        icon: GiMeditation,
        iconClass: 'text-tertiary',
        backgroundClass: 'bg-tertiary-fixed group-hover:bg-tertiary-fixed-dim',
    },
    'heart-pulse': {
        icon: RiShieldCrossLine,
        iconClass: 'text-on-surface-variant',
        backgroundClass:
            'bg-surface-container group-hover:bg-surface-container-high',
    },
};

const fallbackCategoryIcons: CategoryIconConfig[] = [
    {
        icon: FaDiagnoses,
        iconClass: 'text-primary',
        backgroundClass: 'bg-primary-fixed group-hover:bg-primary-fixed-dim',
    },
    {
        icon: PiBowlSteamThin,
        iconClass: 'text-secondary',
        backgroundClass:
            'bg-secondary-fixed group-hover:bg-secondary-fixed-dim',
    },
    {
        icon: RiPsychotherapyLine,
        iconClass: 'text-tertiary',
        backgroundClass: 'bg-tertiary-fixed group-hover:bg-tertiary-fixed-dim',
    },
];

const providerImages = [
    providerMassageImage,
    providerYogaImage,
    providerTherapyImage,
    providerSpaImage,
];

const steps = [
    {
        icon: Search,
        title: '1. Search',
        body: 'Filter by service, location, or provider to find your perfect match.',
        hoverClass: 'group-hover:bg-primary-fixed',
        iconClass: 'text-primary',
    },
    {
        icon: Calendar,
        title: '2. Book',
        body: 'Check availability and send your booking request instantly.',
        hoverClass: 'group-hover:bg-secondary-fixed',
        iconClass: 'text-secondary',
    },
    {
        icon: Smile,
        title: '3. Relax',
        body: 'Arrive at your appointment and let the professionals handle the rest.',
        hoverClass: 'group-hover:bg-tertiary-fixed',
        iconClass: 'text-tertiary',
    },
];

const testimonials = [
    {
        image: testimonialSarahImage,
        imageAlt: 'A satisfied wellness marketplace customer portrait.',
        name: 'Sarah Jenkins',
        role: 'Marketing Executive',
        quote: 'WellSpot completely changed how I manage my stress. I found an amazing therapist just blocks away from my office. The booking process is so seamless!',
    },
    {
        image: testimonialDavidImage,
        imageAlt: 'A relaxed wellness marketplace customer portrait.',
        name: 'David Chen',
        role: 'Software Engineer',
        quote: 'As a busy developer, I often forget to take care of myself. WellSpot makes it easy to find high-quality yoga classes that fit into my schedule.',
    },
];

function compactFilters(filters: HomeFilters): Partial<HomeFilters> {
    return Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value.trim() !== ''),
    ) as Partial<HomeFilters>;
}

function formatPrice(amount: number | null, currency: string) {
    if (amount === null) {
        return 'Ask';
    }

    return new Intl.NumberFormat('en', {
        maximumFractionDigits: 0,
        style: 'currency',
        currency,
    }).format(amount);
}

function categoryHref(filters: HomeFilters, category: string) {
    return explore.url({
        query: compactFilters({
            ...filters,
            category: filters.category === category ? '' : category,
        }),
    });
}

function HeroSection({
    categories,
    filters,
}: {
    categories: HomeCategory[];
    filters: HomeFilters;
}) {
    const [form, setForm] = useState<HomeFilters>(filters);

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        router.get(explore.url(), compactFilters(form));
    }

    return (
        <section
            className="relative flex min-h-[820px] items-center justify-center overflow-hidden px-margin-mobile"
            id="top"
        >
            <div className="absolute inset-0 z-0">
                <img
                    alt="A serene wellness studio interior with natural sunlight, oak flooring, and lush indoor plants."
                    className="h-full w-full object-cover"
                    src={heroImage}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-surface/15 via-surface/50 to-surface" />
            </div>

            <div className="relative z-10 w-full max-w-4xl text-center">
                <h1 className="mb-md font-display text-display">
                    Find your balance
                </h1>
                <p className="mx-auto mb-xl w-full max-w-2xl text-on-surface-variant">
                    Discover local wellness providers with active services, real
                    categories, and community ratings.
                </p>

                <form
                    className="glass-search mx-auto flex max-w-3xl flex-col items-stretch gap-base rounded-[32px] border border-outline-variant/30 p-2 shadow-lg md:flex-row md:items-center md:rounded-full md:p-base"
                    onSubmit={submit}
                >
                    <label className="flex w-full flex-1 items-center px-lg py-sm md:border-r md:border-outline-variant/30">
                        <Search className="mr-sm h-5 w-5 text-primary" />
                        <span className="w-full text-left">
                            <span className="block font-label-sm text-label-sm text-on-surface-variant uppercase">
                                Service
                            </span>
                            <input
                                className="w-full border-none bg-transparent p-0 font-body-md text-body-md placeholder:text-outline focus:ring-0 focus:outline-none"
                                onChange={(event) =>
                                    setForm((current) => ({
                                        ...current,
                                        search: event.target.value,
                                    }))
                                }
                                placeholder="Massage, yoga, therapy..."
                                type="search"
                                value={form.search}
                            />
                        </span>
                    </label>

                    <label className="flex w-full flex-1 items-center px-lg py-sm md:border-r md:border-outline-variant/30">
                        <MapPin className="mr-sm h-5 w-5 text-primary" />
                        <span className="w-full text-left">
                            <span className="block font-label-sm text-label-sm text-on-surface-variant uppercase">
                                Location
                            </span>
                            <input
                                className="w-full border-none bg-transparent p-0 font-body-md text-body-md placeholder:text-outline focus:ring-0 focus:outline-none"
                                onChange={(event) =>
                                    setForm((current) => ({
                                        ...current,
                                        location: event.target.value,
                                    }))
                                }
                                placeholder="Bole, Kazanchis..."
                                type="search"
                                value={form.location}
                            />
                        </span>
                    </label>

                    <select
                        aria-label="Category"
                        className="rounded-full border border-outline-variant/40 bg-surface px-md py-sm font-label-md text-label-md text-on-surface focus:ring-2 focus:ring-primary focus:outline-none md:max-w-[180px]"
                        onChange={(event) =>
                            setForm((current) => ({
                                ...current,
                                category: event.target.value,
                            }))
                        }
                        value={form.category}
                    >
                        <option value="">All categories</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.slug}>
                                {category.name}
                            </option>
                        ))}
                    </select>

                    <button
                        aria-label="Search providers"
                        className="flex w-full items-center justify-center rounded-full bg-primary p-md text-on-primary shadow-md transition-all hover:opacity-90 active:scale-95 md:w-auto"
                        type="submit"
                    >
                        <Search className="h-5 w-5" />
                    </button>
                </form>
            </div>
        </section>
    );
}

function CategoriesSection({
    categories,
    filters,
}: {
    categories: HomeCategory[];
    filters: HomeFilters;
}) {
    return (
        <section
            className="mx-auto max-w-container-max px-margin-mobile py-2xl"
            id="discover"
        >
            <div className="mb-xl flex flex-col justify-between gap-md sm:flex-row sm:items-end">
                <div>
                    <h2 className="font-headline-lg text-headline-lg text-primary">
                        Explore Categories
                    </h2>
                    <p className="mt-xs font-body-md text-body-md text-on-surface-variant">
                        Browse live categories with published providers ready to
                        book.
                    </p>
                </div>
                {filters.category && (
                    <Link
                        className="inline-flex items-center gap-xs self-start rounded-full border border-outline-variant px-md py-sm font-label-md text-label-md text-on-surface-variant transition hover:bg-surface-container"
                        href={explore.url({
                            query: compactFilters({
                                ...filters,
                                category: '',
                            }),
                        })}
                        preserveScroll
                    >
                        <X className="h-4 w-4" />
                        Clear category
                    </Link>
                )}
            </div>
            <div className="no-scrollbar flex gap-gutter overflow-x-auto pb-md">
                {categories.map((category, index) => {
                    const config =
                        categoryIconConfigs[category.icon ?? ''] ??
                        fallbackCategoryIcons[
                            index % fallbackCategoryIcons.length
                        ];
                    const CategoryIcon = config.icon;
                    const isActive = filters.category === category.slug;

                    return (
                        <Link
                            className="group flex w-28 shrink-0 flex-col items-center text-center"
                            href={categoryHref(filters, category.slug)}
                            key={category.id}
                            preserveScroll
                        >
                            <span
                                className={`mb-sm flex h-20 w-20 items-center justify-center rounded-full border transition-colors ${config.backgroundClass} ${
                                    isActive
                                        ? 'border-primary ring-2 ring-primary/20'
                                        : 'border-transparent'
                                }`}
                            >
                                <CategoryIcon
                                    aria-hidden="true"
                                    className={`${config.iconClass} text-[32px]`}
                                />
                            </span>
                            <span className="font-label-md text-label-md text-on-surface-variant">
                                {category.name}
                            </span>
                            <span className="mt-xs font-label-sm text-label-sm text-outline">
                                {category.providers_count} providers
                            </span>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}

function ProviderCard({
    provider,
    image,
}: {
    provider: HomeProvider;
    image: string;
}) {
    const serviceNames = provider.services
        .map((service) => service.name)
        .join(', ');
    const location = provider.neighborhood ?? provider.address ?? 'Addis Ababa';

    return (
        <Link
            className="bento-card group flex min-h-[520px] flex-col overflow-hidden rounded-lg border border-outline-variant/30 bg-surface focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none"
            href={showProvider.url(provider.id)}
            prefetch
        >
            <div className="relative aspect-[4/5] overflow-hidden">
                <img
                    alt={`${provider.name} wellness provider`}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    src={image}
                />
                <div className="absolute top-md right-md flex items-center gap-xs rounded-lg bg-surface/90 px-sm py-xs shadow-sm backdrop-blur-sm">
                    <Star
                        aria-hidden="true"
                        className="h-[18px] w-[18px] fill-[#FFB800] text-[#FFB800]"
                    />
                    <span className="font-label-sm text-label-sm text-on-surface">
                        {provider.rating ?? 'New'}
                    </span>
                </div>
                {provider.is_featured && (
                    <div className="absolute top-md left-md rounded-lg bg-primary px-sm py-xs font-label-sm text-label-sm text-on-primary">
                        Featured
                    </div>
                )}
            </div>
            <div className="flex flex-1 flex-col justify-between p-md">
                <div>
                    <div className="mb-xs flex items-start justify-between gap-sm">
                        <div>
                            <p className="mb-xs font-label-sm text-label-sm text-secondary uppercase">
                                {provider.category?.name ?? 'Wellness'}
                            </p>
                            <h3 className="font-headline-sm text-headline-sm text-on-surface">
                                {provider.name}
                            </h3>
                        </div>
                        <span className="shrink-0 text-right font-label-md text-label-md font-bold text-primary">
                            {formatPrice(
                                provider.starting_price,
                                provider.currency,
                            )}
                        </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                        {provider.headline ?? serviceNames}
                    </p>
                    {serviceNames && (
                        <p className="mt-sm line-clamp-2 font-body-sm text-body-sm text-outline">
                            {serviceNames}
                        </p>
                    )}
                </div>
                <div className="mt-md flex items-center justify-between gap-sm border-t border-outline-variant/20 pt-md">
                    <span className="flex min-w-0 items-center gap-xs font-label-sm text-label-sm text-outline">
                        <MapPin className="h-4 w-4 shrink-0" />
                        <span className="truncate">{location}</span>
                    </span>
                    <span className="shrink-0 font-label-sm text-label-sm text-outline">
                        {provider.reviews_count} reviews
                    </span>
                </div>
            </div>
        </Link>
    );
}

function ProvidersSection({
    filters,
    providers,
    topRatedProviders,
}: {
    filters: HomeFilters;
    providers: HomeProvider[];
    topRatedProviders: HomeProvider[];
}) {
    const hasActiveFilters = Object.values(filters).some(
        (value) => value.trim() !== '',
    );
    const visibleProviders = hasActiveFilters ? providers : topRatedProviders;
    const heading = hasActiveFilters
        ? 'Matching Providers'
        : 'Top Rated Providers';

    return (
        <section className="bg-surface-container-low py-2xl" id="providers">
            <div className="mx-auto max-w-container-max px-margin-mobile">
                <div className="mb-xl flex flex-col justify-between gap-md md:flex-row md:items-end">
                    <div>
                        <h2 className="mb-xs font-headline-lg text-headline-lg text-primary">
                            {heading}
                        </h2>
                        <p className="font-body-md text-body-md text-on-surface-variant">
                            {hasActiveFilters
                                ? `${providers.length} published provider${providers.length === 1 ? '' : 's'} match your search.`
                                : 'Published providers ranked by real customer reviews.'}
                        </p>
                    </div>
                    {hasActiveFilters && (
                        <Link
                            className="inline-flex items-center gap-xs self-start rounded-full border border-outline-variant px-md py-sm font-label-md text-label-md text-on-surface-variant transition hover:bg-surface-container"
                            href={home.url()}
                        >
                            <X className="h-4 w-4" />
                            Clear search
                        </Link>
                    )}
                </div>

                {visibleProviders.length > 0 ? (
                    <div className="grid grid-cols-1 gap-gutter sm:grid-cols-2 lg:grid-cols-4">
                        {visibleProviders.map((provider, index) => (
                            <ProviderCard
                                image={
                                    providerImages[
                                        index % providerImages.length
                                    ]
                                }
                                key={provider.id}
                                provider={provider}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed border-outline-variant bg-surface px-lg py-xl text-center">
                        <Building2 className="mb-md h-10 w-10 text-outline" />
                        <h3 className="font-headline-sm text-headline-sm text-on-surface">
                            No providers found
                        </h3>
                        <p className="mt-sm max-w-md font-body-md text-body-md text-on-surface-variant">
                            Try a broader service, another neighborhood, or
                            clear the selected category.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}

function HowItWorksSection() {
    return (
        <section
            className="mx-auto max-w-container-max px-margin-mobile py-2xl"
            id="how-it-works"
        >
            <div className="mb-2xl text-center">
                <h2 className="mb-md font-headline-lg text-headline-lg text-primary">
                    How WellSpot Works
                </h2>
                <p className="mx-auto max-w-2xl text-on-surface-variant">
                    Wellness made simple. Find and book your favorite services
                    in three easy steps.
                </p>
            </div>
            <div className="relative grid grid-cols-1 gap-xl md:grid-cols-3">
                <div className="absolute top-12 right-1/4 left-1/4 -z-10 hidden h-[2px] bg-gradient-to-r from-primary/10 via-primary/40 to-primary/10 md:block" />
                {steps.map((step) => {
                    const StepIcon = step.icon;

                    return (
                        <div className="group text-center" key={step.title}>
                            <div
                                className={`mx-auto mb-lg flex h-24 w-24 items-center justify-center rounded-full bg-surface-container transition-all duration-300 ${step.hoverClass}`}
                            >
                                <StepIcon
                                    className={`h-10 w-10 ${step.iconClass}`}
                                />
                            </div>
                            <h3 className="mb-sm font-headline-sm text-headline-sm">
                                {step.title}
                            </h3>
                            <p className="font-body-md text-body-md text-on-surface-variant">
                                {step.body}
                            </p>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

function TestimonialsSection() {
    return (
        <section className="overflow-hidden bg-primary-container py-2xl text-on-primary-container">
            <div className="mx-auto max-w-container-max px-margin-mobile">
                <div className="flex flex-col items-center gap-2xl md:flex-row">
                    <div className="w-full md:w-1/3">
                        <h2 className="mb-md font-headline-lg text-headline-lg text-on-primary">
                            Our Community
                        </h2>
                        <p className="mb-xl font-body-lg text-body-lg text-on-primary-container/80">
                            Join people who found their wellness routine through
                            WellSpot.
                        </p>
                    </div>
                    <div className="no-scrollbar flex w-full gap-gutter overflow-x-auto pb-md md:w-2/3">
                        {testimonials.map((testimonial) => (
                            <div
                                className="w-full shrink-0 rounded-lg border border-on-primary/10 bg-on-primary/5 p-xl backdrop-blur-md sm:w-[400px]"
                                key={testimonial.name}
                            >
                                <div className="mb-lg flex items-center gap-md">
                                    <img
                                        alt={testimonial.imageAlt}
                                        className="h-16 w-16 rounded-full border-2 border-on-primary-container/30 object-cover"
                                        src={testimonial.image}
                                    />
                                    <div>
                                        <h4 className="font-headline-sm text-headline-sm">
                                            {testimonial.name}
                                        </h4>
                                        <p className="font-label-sm text-label-sm text-on-primary-container/60">
                                            {testimonial.role}
                                        </p>
                                    </div>
                                </div>
                                <p className="font-body-md text-body-md italic opacity-90">
                                    "{testimonial.quote}"
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function CtaSection() {
    return (
        <section className="px-margin-mobile py-2xl text-center">
            <div className="mx-auto max-w-2xl">
                <h2 className="mb-md font-display text-display tracking-tight">
                    Ready to feel better?
                </h2>
                <p className="mb-xl font-body-lg text-body-lg text-on-surface-variant">
                    Start with a search, or create a provider account and list
                    your services.
                </p>
                <div className="flex flex-col items-center justify-center gap-md sm:flex-row">
                    <a
                        className="inline-flex w-full items-center justify-center gap-xs rounded-full bg-primary px-2xl py-md font-label-md text-label-md text-on-primary shadow-lg transition-all hover:opacity-90 active:scale-95 sm:w-auto"
                        href="#providers"
                    >
                        Find a Provider
                        <ArrowRight className="h-4 w-4" />
                    </a>
                    <Link
                        className="inline-flex w-full items-center justify-center gap-xs rounded-full border border-outline px-2xl py-md font-label-md text-label-md transition-all hover:bg-surface-container active:scale-95 sm:w-auto"
                        href={register.url()}
                    >
                        List Your Service
                        <Sparkles className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}

export function MainContent({
    categories,
    filters,
    providers,
    topRatedProviders,
}: MainContentProps) {
    const normalizedFilters = useMemo(
        () => ({
            search: filters.search ?? '',
            location: filters.location ?? '',
            category: filters.category ?? '',
        }),
        [filters],
    );

    return (
        <main className="pt-16">
            <HeroSection categories={categories} filters={normalizedFilters} />
            <CategoriesSection
                categories={categories}
                filters={normalizedFilters}
            />
            <ProvidersSection
                filters={normalizedFilters}
                providers={providers}
                topRatedProviders={topRatedProviders}
            />
            <HowItWorksSection />
            <TestimonialsSection />
            <CtaSection />
        </main>
    );
}
