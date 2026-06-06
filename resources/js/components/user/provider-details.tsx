import { Form } from '@inertiajs/react';
import {
    CalendarDays,
    Check,
    Clock,
    Mail,
    MapPin,
    MessageSquareText,
    Phone,
    ShieldCheck,
    Sparkles,
    Star,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { store as storeBooking } from '@/routes/bookings';

export type ProviderDetailService = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    duration_minutes: number | null;
    price_amount: number | null;
    currency: string;
};

type ProviderDetailReview = {
    id: number;
    reviewer_name: string | null;
    rating: number;
    title: string | null;
    comment: string | null;
    created_at: string | null;
};

export type ProviderDetailData = {
    id: number;
    name: string;
    slug: string;
    headline: string | null;
    description: string | null;
    phone: string | null;
    email: string | null;
    address: string | null;
    neighborhood: string | null;
    latitude: string | null;
    longitude: string | null;
    amenities: string[];
    opening_hours: Record<string, string>;
    category: {
        name: string;
        slug: string;
    } | null;
    services: ProviderDetailService[];
    reviews: ProviderDetailReview[];
    rating: number | null;
    reviews_count: number;
    starting_price: number | null;
    currency: string;
    is_featured: boolean;
};

type ProviderDetailsProps = {
    provider: ProviderDetailData;
};

type BookingDay = {
    id: string;
    label: string;
    formatted: string;
};

const timeSlots = ['09:00', '10:30', '12:00', '14:00', '15:30', '17:00'];

function formatPrice(amount: number | null, currency: string): string {
    if (amount === null) {
        return 'Ask';
    }

    return new Intl.NumberFormat('en', {
        currency,
        maximumFractionDigits: 0,
        style: 'currency',
    }).format(amount);
}

function getUpcomingDays(): BookingDay[] {
    const days: BookingDay[] = [];
    const current = new Date();

    while (days.length < 5) {
        if (current.getDay() !== 0) {
            days.push({
                id: current.toISOString().split('T')[0],
                label: current.toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'short',
                    weekday: 'short',
                }),
                formatted: current.toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'long',
                    weekday: 'long',
                    year: 'numeric',
                }),
            });
        }

        current.setDate(current.getDate() + 1);
    }

    return days;
}

function googleMapsEmbedUrl(provider: ProviderDetailData): string | null {
    const query =
        provider.latitude && provider.longitude
            ? `${provider.latitude},${provider.longitude}`
            : provider.address;

    if (!query) {
        return null;
    }

    const encodedQuery = encodeURIComponent(query);

    return `https://maps.google.com/maps?q=${encodedQuery}&z=15&output=embed`;
}

function startsAtValue(date: string | null, time: string | null): string {
    if (!date || !time) {
        return '';
    }

    return `${date}T${time}`;
}

export default function ProviderDetails({ provider }: ProviderDetailsProps) {
    const [selectedServiceId, setSelectedServiceId] = useState(
        provider.services[0]?.id ?? null,
    );
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const upcomingDays = useMemo(() => getUpcomingDays(), []);
    const selectedService = provider.services.find(
        (service) => service.id === selectedServiceId,
    );
    const selectedDay = upcomingDays.find((day) => day.id === selectedDate);
    const mapUrl = googleMapsEmbedUrl(provider);
    const hours = Object.entries(provider.opening_hours ?? {});
    const location =
        [provider.neighborhood, provider.address].filter(Boolean).join(' - ') ||
        'Location shared after booking';

    return (
        <main className="pt-16">
            <section className="bg-surface px-margin-mobile py-2xl">
                <div className="mx-auto grid max-w-container-max gap-xl lg:grid-cols-[minmax(0,1fr)_360px]">
                    <div>
                        <div className="mb-md flex flex-wrap items-center gap-sm">
                            <span className="rounded-full bg-primary-fixed px-md py-xs font-label-sm text-label-sm text-primary">
                                {provider.category?.name ?? 'Wellness'}
                            </span>
                            {provider.is_featured && (
                                <span className="inline-flex items-center gap-xs rounded-full bg-secondary-fixed px-md py-xs font-label-sm text-label-sm text-secondary">
                                    <Sparkles className="h-4 w-4" />
                                    Featured
                                </span>
                            )}
                        </div>

                        <h1 className="max-w-4xl font-display text-display text-on-surface">
                            {provider.name}
                        </h1>
                        <p className="mt-md max-w-3xl font-body-lg text-body-lg text-on-surface-variant">
                            {provider.headline ??
                                provider.description ??
                                'Local wellness provider on WellSpot.'}
                        </p>

                        <div className="mt-lg flex flex-wrap gap-md text-on-surface-variant">
                            <span className="inline-flex items-center gap-xs">
                                <Star className="h-5 w-5 fill-[#FFB800] text-[#FFB800]" />
                                {provider.rating ?? 'New'} rating
                                <span className="text-outline">
                                    ({provider.reviews_count} reviews)
                                </span>
                            </span>
                            <span className="inline-flex items-center gap-xs">
                                <MapPin className="h-5 w-5 text-primary" />
                                {location}
                            </span>
                            <span className="inline-flex items-center gap-xs">
                                <CalendarDays className="h-5 w-5 text-primary" />
                                From{' '}
                                {formatPrice(
                                    provider.starting_price,
                                    provider.currency,
                                )}
                            </span>
                        </div>
                    </div>

                    <aside className="rounded-lg border border-outline-variant/30 bg-surface-container p-lg shadow-sm">
                        <h2 className="font-headline-sm text-headline-sm text-on-surface">
                            Contact
                        </h2>
                        <div className="mt-md space-y-sm">
                            {provider.phone && (
                                <a
                                    className="flex items-center gap-sm text-on-surface-variant transition hover:text-primary"
                                    href={`tel:${provider.phone}`}
                                >
                                    <Phone className="h-5 w-5" />
                                    {provider.phone}
                                </a>
                            )}
                            {provider.email && (
                                <a
                                    className="flex items-center gap-sm text-on-surface-variant transition hover:text-primary"
                                    href={`mailto:${provider.email}`}
                                >
                                    <Mail className="h-5 w-5" />
                                    {provider.email}
                                </a>
                            )}
                            {provider.address && (
                                <p className="flex items-start gap-sm text-on-surface-variant">
                                    <MapPin className="mt-0.5 h-5 w-5 shrink-0" />
                                    {provider.address}
                                </p>
                            )}
                        </div>
                    </aside>
                </div>
            </section>

            <section className="bg-surface-container-low px-margin-mobile py-2xl">
                <div className="mx-auto grid max-w-container-max gap-xl lg:grid-cols-[minmax(0,1fr)_380px]">
                    <div className="space-y-xl">
                        <section>
                            <h2 className="font-headline-lg text-headline-lg text-primary">
                                Services
                            </h2>
                            <div className="mt-lg grid gap-md">
                                {provider.services.map((service) => {
                                    const isSelected =
                                        selectedServiceId === service.id;

                                    return (
                                        <button
                                            className={`rounded-lg border bg-surface p-lg text-left transition ${
                                                isSelected
                                                    ? 'border-primary shadow-md ring-2 ring-primary/15'
                                                    : 'border-outline-variant/30 hover:border-primary/60'
                                            }`}
                                            key={service.id}
                                            onClick={() =>
                                                setSelectedServiceId(service.id)
                                            }
                                            type="button"
                                        >
                                            <span className="flex flex-col gap-md sm:flex-row sm:items-start sm:justify-between">
                                                <span>
                                                    <span className="font-headline-sm text-headline-sm text-on-surface">
                                                        {service.name}
                                                    </span>
                                                    {service.description && (
                                                        <span className="mt-xs block font-body-md text-body-md text-on-surface-variant">
                                                            {
                                                                service.description
                                                            }
                                                        </span>
                                                    )}
                                                </span>
                                                <span className="flex shrink-0 items-center gap-md font-label-md text-label-md">
                                                    <span className="inline-flex items-center gap-xs text-outline">
                                                        <Clock className="h-4 w-4" />
                                                        {service.duration_minutes ??
                                                            'Flexible'}{' '}
                                                        min
                                                    </span>
                                                    <span className="font-bold text-primary">
                                                        {formatPrice(
                                                            service.price_amount,
                                                            service.currency,
                                                        )}
                                                    </span>
                                                </span>
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </section>

                        {provider.description && (
                            <section className="rounded-lg bg-surface p-lg">
                                <h2 className="font-headline-md text-headline-md text-on-surface">
                                    About
                                </h2>
                                <p className="mt-sm font-body-md text-body-md leading-relaxed text-on-surface-variant">
                                    {provider.description}
                                </p>
                            </section>
                        )}

                        <section className="grid gap-md md:grid-cols-2">
                            <div className="rounded-lg bg-surface p-lg">
                                <h2 className="font-headline-sm text-headline-sm text-on-surface">
                                    Amenities
                                </h2>
                                <div className="mt-md grid gap-sm">
                                    {provider.amenities.length > 0 ? (
                                        provider.amenities.map((amenity) => (
                                            <span
                                                className="inline-flex items-center gap-sm text-on-surface-variant"
                                                key={amenity}
                                            >
                                                <Check className="h-4 w-4 text-primary" />
                                                {amenity}
                                            </span>
                                        ))
                                    ) : (
                                        <p className="text-on-surface-variant">
                                            Ask the provider for available
                                            amenities.
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="rounded-lg bg-surface p-lg">
                                <h2 className="font-headline-sm text-headline-sm text-on-surface">
                                    Opening Hours
                                </h2>
                                <div className="mt-md space-y-sm">
                                    {hours.length > 0 ? (
                                        hours.map(([label, value]) => (
                                            <div
                                                className="flex items-center justify-between gap-md text-on-surface-variant"
                                                key={label}
                                            >
                                                <span className="capitalize">
                                                    {label.replace('_', ' ')}
                                                </span>
                                                <span className="font-medium text-on-surface">
                                                    {value}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-on-surface-variant">
                                            Hours are confirmed when booking.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </section>

                        <section className="rounded-lg bg-surface p-lg">
                            <h2 className="font-headline-md text-headline-md text-on-surface">
                                Reviews
                            </h2>
                            <div className="mt-md grid gap-md">
                                {provider.reviews.length > 0 ? (
                                    provider.reviews.map((review) => (
                                        <article
                                            className="border-b border-outline-variant/20 pb-md last:border-b-0 last:pb-0"
                                            key={review.id}
                                        >
                                            <div className="flex flex-wrap items-center justify-between gap-sm">
                                                <h3 className="font-label-lg text-label-lg text-on-surface">
                                                    {review.title ??
                                                        'Wellness visit'}
                                                </h3>
                                                <span className="inline-flex items-center gap-xs text-primary">
                                                    <Star className="h-4 w-4 fill-current" />
                                                    {review.rating}
                                                </span>
                                            </div>
                                            {review.comment && (
                                                <p className="mt-xs text-on-surface-variant">
                                                    {review.comment}
                                                </p>
                                            )}
                                            <p className="mt-sm font-label-sm text-label-sm text-outline">
                                                {review.reviewer_name ??
                                                    'WellSpot client'}
                                                {review.created_at
                                                    ? ` - ${review.created_at}`
                                                    : ''}
                                            </p>
                                        </article>
                                    ))
                                ) : (
                                    <p className="text-on-surface-variant">
                                        No published reviews yet.
                                    </p>
                                )}
                            </div>
                        </section>

                        {mapUrl && (
                            <section className="overflow-hidden rounded-lg bg-surface">
                                <iframe
                                    className="h-[360px] w-full border-0"
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    src={mapUrl}
                                    title={`${provider.name} map`}
                                />
                            </section>
                        )}
                    </div>

                    <aside className="lg:sticky lg:top-24 lg:self-start">
                        <Form
                            {...storeBooking.form()}
                            className="rounded-lg border border-outline-variant/30 bg-surface p-lg shadow-lg"
                            resetOnSuccess
                        >
                            {({ errors, processing, recentlySuccessful }) => (
                                <div className="space-y-lg">
                                    <div>
                                        <h2 className="font-headline-md text-headline-md text-on-surface">
                                            Book appointment
                                        </h2>
                                        <p className="mt-xs text-on-surface-variant">
                                            Pick a service and send a booking
                                            request. The provider confirms the
                                            final time.
                                        </p>
                                    </div>

                                    <input
                                        name="service_id"
                                        type="hidden"
                                        value={selectedServiceId ?? ''}
                                    />
                                    <input
                                        name="starts_at"
                                        type="hidden"
                                        value={startsAtValue(
                                            selectedDate,
                                            selectedTime,
                                        )}
                                    />

                                    {selectedService && (
                                        <div className="rounded-lg bg-surface-container p-md">
                                            <p className="font-label-lg text-label-lg text-on-surface">
                                                {selectedService.name}
                                            </p>
                                            <p className="mt-xs text-on-surface-variant">
                                                {formatPrice(
                                                    selectedService.price_amount,
                                                    selectedService.currency,
                                                )}{' '}
                                                {selectedService.duration_minutes
                                                    ? `- ${selectedService.duration_minutes} min`
                                                    : ''}
                                            </p>
                                        </div>
                                    )}

                                    <div>
                                        <label className="font-label-md text-label-md text-on-surface">
                                            Date
                                        </label>
                                        <div className="mt-sm grid grid-cols-2 gap-sm">
                                            {upcomingDays.map((day) => (
                                                <button
                                                    className={`rounded-lg border px-sm py-sm text-sm transition ${
                                                        selectedDate === day.id
                                                            ? 'border-primary bg-primary-fixed text-primary'
                                                            : 'border-outline-variant/40 hover:border-primary'
                                                    }`}
                                                    key={day.id}
                                                    onClick={() => {
                                                        setSelectedDate(day.id);
                                                        setSelectedTime(null);
                                                    }}
                                                    type="button"
                                                >
                                                    {day.label}
                                                </button>
                                            ))}
                                        </div>
                                        {errors.starts_at && (
                                            <p className="mt-xs text-sm text-destructive">
                                                {errors.starts_at}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="font-label-md text-label-md text-on-surface">
                                            Time
                                        </label>
                                        <div className="mt-sm grid grid-cols-3 gap-sm">
                                            {timeSlots.map((time) => (
                                                <button
                                                    className={`rounded-lg border px-sm py-sm text-sm transition ${
                                                        selectedTime === time
                                                            ? 'border-primary bg-primary text-on-primary'
                                                            : 'border-outline-variant/40 hover:border-primary'
                                                    }`}
                                                    disabled={!selectedDate}
                                                    key={time}
                                                    onClick={() =>
                                                        setSelectedTime(time)
                                                    }
                                                    type="button"
                                                >
                                                    {time}
                                                </button>
                                            ))}
                                        </div>
                                        {selectedDay && (
                                            <p className="mt-xs font-label-sm text-label-sm text-outline">
                                                {selectedDay.formatted}
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid gap-sm">
                                        <label className="font-label-md text-label-md text-on-surface">
                                            Your name
                                            <input
                                                className="mt-xs w-full rounded-lg border border-outline-variant/40 bg-surface px-md py-sm text-on-surface focus:border-primary focus:ring-primary"
                                                name="customer_name"
                                                type="text"
                                            />
                                        </label>
                                        {errors.customer_name && (
                                            <p className="text-sm text-destructive">
                                                {errors.customer_name}
                                            </p>
                                        )}

                                        <label className="font-label-md text-label-md text-on-surface">
                                            Phone
                                            <input
                                                className="mt-xs w-full rounded-lg border border-outline-variant/40 bg-surface px-md py-sm text-on-surface focus:border-primary focus:ring-primary"
                                                name="customer_phone"
                                                type="tel"
                                            />
                                        </label>
                                        {errors.customer_phone && (
                                            <p className="text-sm text-destructive">
                                                {errors.customer_phone}
                                            </p>
                                        )}

                                        <label className="font-label-md text-label-md text-on-surface">
                                            Notes
                                            <textarea
                                                className="mt-xs min-h-24 w-full rounded-lg border border-outline-variant/40 bg-surface px-md py-sm text-on-surface focus:border-primary focus:ring-primary"
                                                name="notes"
                                            />
                                        </label>
                                    </div>

                                    <button
                                        className="font-label-lg text-label-lg flex w-full items-center justify-center gap-sm rounded-full bg-primary px-lg py-md text-on-primary transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                                        disabled={
                                            processing ||
                                            !selectedServiceId ||
                                            !selectedDate ||
                                            !selectedTime
                                        }
                                        type="submit"
                                    >
                                        <MessageSquareText className="h-5 w-5" />
                                        {processing
                                            ? 'Sending...'
                                            : 'Request booking'}
                                    </button>

                                    {recentlySuccessful && (
                                        <p className="rounded-lg bg-primary-fixed p-sm text-center font-label-md text-label-md text-primary">
                                            Booking request sent.
                                        </p>
                                    )}

                                    <p className="flex items-start gap-sm text-sm text-on-surface-variant">
                                        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                        No payment is collected until the
                                        provider confirms availability.
                                    </p>
                                </div>
                            )}
                        </Form>
                    </aside>
                </div>
            </section>
        </main>
    );
}
