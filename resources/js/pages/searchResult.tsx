import { Head, Link, router } from '@inertiajs/react';
import { MapPin, Search, SlidersHorizontal, Sparkles, X } from 'lucide-react';
import type { FormEvent } from 'react';
import { useMemo, useState } from 'react';
import { Footer } from '@/components/user/footer';
import { Header } from '@/components/user/header';
import SearchCard from '@/components/user/searchCard';
import type { SearchProvider } from '@/components/user/searchCard';
import { explore, home } from '@/routes';

type ExploreFilters = {
    search: string;
    location: string;
    category: string;
};

type ExploreCategory = {
    id: number;
    name: string;
    slug: string;
    icon: string | null;
    color: string | null;
    description: string | null;
    providers_count: number;
};

type SearchResultProps = {
    filters: ExploreFilters;
    categories: ExploreCategory[];
    providers: SearchProvider[];
};

function compactFilters(filters: ExploreFilters): Partial<ExploreFilters> {
    return Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value.trim() !== ''),
    ) as Partial<ExploreFilters>;
}

function categoryUrl(filters: ExploreFilters, category: string): string {
    return explore.url({
        query: compactFilters({
            ...filters,
            category: filters.category === category ? '' : category,
        }),
    });
}

export default function SearchResult({
    filters,
    categories,
    providers,
}: SearchResultProps) {
    const normalizedFilters = useMemo(
        () => ({
            search: filters.search ?? '',
            location: filters.location ?? '',
            category: filters.category ?? '',
        }),
        [filters],
    );
    const [form, setForm] = useState<ExploreFilters>(normalizedFilters);
    const activeCategory = categories.find(
        (category) => category.slug === normalizedFilters.category,
    );
    const hasFilters = Object.values(normalizedFilters).some(
        (value) => value.trim() !== '',
    );

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        router.get(explore.url(), compactFilters(form), {
            preserveScroll: true,
            replace: true,
        });
    }

    return (
        <>
            <Head title="Explore Wellness Providers | WellSpot" />

            <div className="wellspot-home min-h-screen bg-background text-on-surface">
                <Header />

                <main className="pt-16">
                    <section className="border-b border-outline-variant/30 bg-surface">
                        <div className="mx-auto grid w-full max-w-container-max items-end gap-xl px-margin-mobile py-xl md:px-lg md:py-2xl lg:grid-cols-[minmax(0,1fr)_360px]">
                            <div className="min-w-0">
                                <Link
                                    className="mb-lg inline-flex w-fit items-center gap-xs rounded-full border border-outline-variant px-md py-sm font-label-md text-label-md text-on-surface-variant transition hover:bg-surface-container"
                                    href={home.url()}
                                >
                                    <X className="h-4 w-4" />
                                    Back home
                                </Link>
                                <p className="mb-sm inline-flex items-center gap-xs font-label-md text-label-md text-secondary uppercase">
                                    <Sparkles className="h-4 w-4" />
                                    Explore WellSpot
                                </p>
                                <h1 className="w-full max-w-[48rem] font-display text-display text-balance text-primary">
                                    Find the right wellness provider.
                                </h1>
                                <p className="mt-md w-full max-w-[42rem] font-body-lg text-body-lg text-pretty text-on-surface-variant">
                                    Compare published providers with active
                                    services, clear locations, starting prices,
                                    and real review signals.
                                </p>
                            </div>

                            <form
                                className="w-full rounded-lg border border-outline-variant/40 bg-surface-container-low p-md shadow-sm"
                                onSubmit={submit}
                            >
                                <div className="mb-md flex items-center gap-sm font-label-md text-label-md text-primary">
                                    <SlidersHorizontal className="h-4 w-4" />
                                    Refine results
                                </div>
                                <div className="grid gap-sm">
                                    <label className="flex items-center gap-sm rounded-lg border border-outline-variant/40 bg-surface px-md py-sm">
                                        <Search className="h-4 w-4 text-primary" />
                                        <input
                                            className="min-w-0 flex-1 border-none bg-transparent font-body-md text-body-md placeholder:text-outline focus:ring-0 focus:outline-none"
                                            onChange={(event) =>
                                                setForm((current) => ({
                                                    ...current,
                                                    search: event.target.value,
                                                }))
                                            }
                                            placeholder="Service or provider"
                                            type="search"
                                            value={form.search}
                                        />
                                    </label>
                                    <label className="flex items-center gap-sm rounded-lg border border-outline-variant/40 bg-surface px-md py-sm">
                                        <MapPin className="h-4 w-4 text-primary" />
                                        <input
                                            className="min-w-0 flex-1 border-none bg-transparent font-body-md text-body-md placeholder:text-outline focus:ring-0 focus:outline-none"
                                            onChange={(event) =>
                                                setForm((current) => ({
                                                    ...current,
                                                    location:
                                                        event.target.value,
                                                }))
                                            }
                                            placeholder="Neighborhood"
                                            type="search"
                                            value={form.location}
                                        />
                                    </label>
                                    <select
                                        aria-label="Category"
                                        className="rounded-lg border border-outline-variant/40 bg-surface px-md py-sm font-body-md text-body-md text-on-surface focus:ring-2 focus:ring-primary focus:outline-none"
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
                                            <option
                                                key={category.id}
                                                value={category.slug}
                                            >
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        className="inline-flex items-center justify-center gap-sm rounded-lg bg-primary px-lg py-md font-label-md text-label-md text-on-primary shadow-sm transition hover:opacity-90 active:scale-[0.99]"
                                        type="submit"
                                    >
                                        <Search className="h-4 w-4" />
                                        Search
                                    </button>
                                </div>
                            </form>
                        </div>
                    </section>

                    <section className="mx-auto grid w-full max-w-container-max gap-xl px-margin-mobile py-xl md:grid-cols-[260px_minmax(0,1fr)] md:px-lg md:py-2xl">
                        <aside className="md:sticky md:top-24 md:self-start">
                            <div className="rounded-lg border border-outline-variant/40 bg-surface p-md">
                                <div className="mb-md flex items-center justify-between gap-sm">
                                    <h2 className="font-headline-sm text-headline-sm text-primary">
                                        Categories
                                    </h2>
                                    {hasFilters && (
                                        <Link
                                            className="font-label-sm text-label-sm text-secondary hover:underline"
                                            href={explore.url()}
                                        >
                                            Clear
                                        </Link>
                                    )}
                                </div>
                                <div className="flex gap-sm overflow-x-auto pb-xs md:flex-col md:overflow-visible md:pb-0">
                                    {categories.map((category) => {
                                        const isActive =
                                            normalizedFilters.category ===
                                            category.slug;

                                        return (
                                            <Link
                                                className={`flex min-w-52 items-center justify-between gap-sm rounded-lg border px-md py-sm text-left transition md:min-w-0 ${
                                                    isActive
                                                        ? 'border-primary bg-primary-fixed text-on-primary-fixed'
                                                        : 'border-outline-variant/30 bg-surface-container-low text-on-surface-variant hover:border-primary/40 hover:bg-surface-container'
                                                }`}
                                                href={categoryUrl(
                                                    normalizedFilters,
                                                    category.slug,
                                                )}
                                                key={category.id}
                                                preserveScroll
                                            >
                                                <span className="font-label-md text-label-md">
                                                    {category.name}
                                                </span>
                                                <span className="rounded-full bg-surface/80 px-sm py-xs font-label-sm text-label-sm text-on-surface">
                                                    {category.providers_count}
                                                </span>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        </aside>

                        <div className="min-w-0">
                            <div className="mb-lg flex flex-col justify-between gap-md border-b border-outline-variant/30 pb-md sm:flex-row sm:items-end">
                                <div>
                                    <p className="font-label-md text-label-md text-secondary uppercase">
                                        {activeCategory?.name ??
                                            'All providers'}
                                    </p>
                                    <h2 className="mt-xs font-headline-lg text-headline-lg text-primary">
                                        {providers.length} result
                                        {providers.length === 1 ? '' : 's'}
                                    </h2>
                                </div>
                                {hasFilters && (
                                    <div className="flex flex-wrap gap-sm">
                                        {normalizedFilters.search && (
                                            <span className="rounded-full bg-surface-container px-md py-sm font-label-sm text-label-sm text-on-surface-variant">
                                                {normalizedFilters.search}
                                            </span>
                                        )}
                                        {normalizedFilters.location && (
                                            <span className="rounded-full bg-surface-container px-md py-sm font-label-sm text-label-sm text-on-surface-variant">
                                                {normalizedFilters.location}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>

                            {providers.length > 0 ? (
                                <div className="grid gap-lg">
                                    {providers.map((provider) => (
                                        <SearchCard
                                            key={provider.id}
                                            provider={provider}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="flex min-h-[360px] flex-col items-center justify-center rounded-lg border border-dashed border-outline-variant bg-surface-container-low px-lg py-2xl text-center">
                                    <div className="mb-md flex h-14 w-14 items-center justify-center rounded-full bg-primary-fixed text-primary">
                                        <Search className="h-6 w-6" />
                                    </div>
                                    <h2 className="font-headline-sm text-headline-sm text-on-surface">
                                        No providers match this search
                                    </h2>
                                    <p className="mt-sm max-w-md font-body-md text-body-md text-on-surface-variant">
                                        Try a broader service, another
                                        neighborhood, or clear the category
                                        filter.
                                    </p>
                                    <Link
                                        className="mt-lg rounded-full bg-primary px-lg py-md font-label-md text-label-md text-on-primary transition hover:opacity-90"
                                        href={explore.url()}
                                    >
                                        Reset search
                                    </Link>
                                </div>
                            )}
                        </div>
                    </section>
                </main>

                <Footer />
            </div>
        </>
    );
}
