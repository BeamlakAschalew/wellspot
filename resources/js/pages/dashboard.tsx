import { Form, Head } from '@inertiajs/react';
import {
    CalendarClock,
    CheckCircle2,
    ClipboardList,
    CreditCard,
    Pencil,
    Plus,
    Star,
    Trash2,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    type ChangeEvent,
} from 'react';
import { update as updateProviderProfile } from '@/actions/App/Http/Controllers/ProviderProfileController';
import {
    destroy as destroyProviderService,
    store as storeProviderService,
    update as updateProviderService,
} from '@/actions/App/Http/Controllers/ProviderServiceController';
import { store as startSubscriptionCheckout } from '@/actions/App/Http/Controllers/SubscriptionController';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { dashboard as providerDashboard } from '@/routes/provider';

type CategoryOption = {
    id: number;
    name: string;
};

type ProviderSummary = {
    id: number;
    name: string;
    logo_url: string | null;
    headline: string | null;
    description: string | null;
    status: string;
    category_id: number;
    address: string;
    neighborhood: string | null;
    phone: string | null;
    email: string | null;
    latitude: string | null;
    longitude: string | null;
    category: string | null;
};

type ProviderService = {
    id: number;
    category_id: number | null;
    name: string;
    description: string | null;
    duration_minutes: number;
    price_amount: number;
    currency: string;
    status: string;
    sort_order: number;
};

type ProviderBooking = {
    id: number;
    customer_name: string;
    service_name: string | null;
    starts_at: string | null;
    status: string;
    total_amount: number;
    currency: string;
};

type ProviderReview = {
    id: number;
    reviewer_name: string | null;
    rating: number;
    title: string | null;
    comment: string | null;
};

type ProviderSubscription = {
    id: number;
    plan: string;
    amount: number;
    currency: string;
    status: string;
    started_at: string | null;
    expires_at: string | null;
};

type ProviderBilling = {
    status: 'active' | 'due';
    active_service_count: number;
    service_monthly_amount: number;
    monthly_total: number;
    currency: string;
    next_payment_due_at: string;
    can_start_checkout: boolean;
    checkout_blocker: string | null;
};

type DashboardProps = {
    provider: ProviderSummary;
    googleMapsApiKey: string | null;
    googleMapsMapId: string;
    categories: CategoryOption[];
    services: ProviderService[];
    bookings: ProviderBooking[];
    reviews: ProviderReview[];
    subscription: ProviderSubscription | null;
    billing: ProviderBilling;
    stats: {
        services: number;
        pending_bookings: number;
        completed_bookings: number;
        average_rating: number;
    };
};

type ProviderLocation = {
    lat: number;
    lng: number;
};

type GoogleMapsEventListener = {
    remove: () => void;
};

type GoogleLatLng = {
    lat: () => number;
    lng: () => number;
};

type GoogleMapMouseEvent = {
    latLng?: GoogleLatLng | null;
};

type GoogleMap = {
    setCenter: (location: ProviderLocation) => void;
    setZoom: (zoom: number) => void;
    addListener: (
        eventName: 'click',
        handler: (event: GoogleMapMouseEvent) => void,
    ) => GoogleMapsEventListener;
};

type GoogleMarker = {
    addListener: (
        eventName: 'dragend',
        handler: () => void,
    ) => GoogleMapsEventListener;
    map: GoogleMap | null;
    position?: GooglePlaceLocation | null;
};

type GooglePlaceLocation =
    | GoogleLatLng
    | {
          lat: number;
          lng: number;
      };

type GooglePlace = {
    displayName?: string;
    fetchFields: (request: { fields: string[] }) => Promise<void>;
    formattedAddress?: string;
    location?: GooglePlaceLocation;
};

type GooglePlacePrediction = {
    toPlace: () => GooglePlace;
};

type GooglePlaceSelectEvent = Event & {
    placePrediction?: GooglePlacePrediction;
};

type GooglePlaceAutocompleteElement = HTMLElement & {
    includedRegionCodes?: string[];
    locationBias?: ProviderLocation;
};

type GoogleMapsNamespace = {
    Map: new (
        element: HTMLElement,
        options: Record<string, unknown>,
    ) => GoogleMap;
    importLibrary: (name: 'maps' | 'marker' | 'places') => Promise<unknown>;
};

type GoogleMarkerLibrary = {
    AdvancedMarkerElement: new (options: Record<string, unknown>) => GoogleMarker;
};

type GooglePlacesLibrary = {
    PlaceAutocompleteElement: new (
        options?: Record<string, unknown>,
    ) => GooglePlaceAutocompleteElement;
};

declare global {
    interface Window {
        google?: {
            maps: GoogleMapsNamespace;
        };
        __wellspotGoogleMapsLoaded?: () => void;
    }
}

const ADDIS_ABABA_CENTER = {
    lat: 9.0301,
    lng: 38.7589,
};

let googleMapsPromise: Promise<GoogleMapsNamespace> | null = null;

const money = (amount: number, currency = 'ETB') =>
    new Intl.NumberFormat('en-ET', {
        style: 'currency',
        currency,
        maximumFractionDigits: 0,
    }).format(amount);

const dateTime = (value: string | null) =>
    value
        ? new Intl.DateTimeFormat('en', {
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
          }).format(new Date(value))
        : 'Unscheduled';

const dateOnly = (value: string | null) =>
    value
        ? new Intl.DateTimeFormat('en', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
          }).format(new Date(value))
        : 'Not scheduled';

function statusTone(status: string) {
    if (['active', 'published', 'confirmed', 'completed'].includes(status)) {
        return 'default' as const;
    }

    if (['pending', 'trialing', 'draft'].includes(status)) {
        return 'secondary' as const;
    }

    return 'outline' as const;
}

function billingTitle(status: ProviderBilling['status']) {
    if (status === 'active') {
        return 'Subscription active';
    }

    return 'Payment due';
}

function billingDescription(status: ProviderBilling['status']) {
    if (status === 'active') {
        return 'Your provider listing is live. The next SaaS payment is due on the date below.';
    }

    return 'Providers pay monthly based on active services listed on WellSpot.';
}

function BillingPanel({
    billing,
    subscription,
}: {
    billing: ProviderBilling;
    subscription: ProviderSubscription | null;
}) {
    return (
        <aside id="billing" className="scroll-mt-6">
            <Card className="rounded-lg border-primary/30 bg-primary/5">
                <CardHeader>
                    <div className="flex items-start justify-between gap-3">
                        <div className="space-y-2">
                            <Badge variant={statusTone(billing.status)}>
                                {billing.status}
                            </Badge>
                            <div>
                                <CardTitle>{billingTitle(billing.status)}</CardTitle>
                                <CardDescription className="mt-2">
                                    {billingDescription(billing.status)}
                                </CardDescription>
                            </div>
                        </div>
                        <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-background text-primary shadow-sm">
                            <CreditCard className="size-5" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-3 rounded-lg border border-border/70 bg-background/80 p-4 text-sm">
                        <div className="flex items-center justify-between gap-4">
                            <span className="text-muted-foreground">
                                Active services
                            </span>
                            <span className="font-medium">
                                {billing.active_service_count}
                            </span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                            <span className="text-muted-foreground">
                                Price per service
                            </span>
                            <span className="font-medium">
                                {money(
                                    billing.service_monthly_amount,
                                    billing.currency,
                                )}
                            </span>
                        </div>
                        <div className="flex items-center justify-between gap-4 border-t border-border/70 pt-3">
                            <span className="font-medium">Monthly total</span>
                            <span className="text-lg font-semibold">
                                {money(billing.monthly_total, billing.currency)}
                            </span>
                        </div>
                    </div>

                    <div className="grid gap-1">
                        <span className="text-xs font-medium uppercase text-muted-foreground">
                            Next pay day
                        </span>
                        <span className="text-xl font-semibold">
                            {dateOnly(billing.next_payment_due_at)}
                        </span>
                    </div>

                    {subscription && (
                        <div className="rounded-lg border border-border/70 bg-background/70 p-3 text-xs text-muted-foreground">
                            Last checkout attempt:{' '}
                            {money(subscription.amount, subscription.currency)} ·{' '}
                            {subscription.plan}
                        </div>
                    )}

                    <Form
                        action={startSubscriptionCheckout()}
                        options={{ preserveScroll: true }}
                    >
                        {({ processing }) => (
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={
                                    processing || !billing.can_start_checkout
                                }
                            >
                                <CreditCard />
                                {billing.status === 'active'
                                    ? 'Renew with Chapa'
                                    : 'Pay with Chapa'}
                            </Button>
                        )}
                    </Form>

                    {billing.checkout_blocker && (
                        <p className="text-sm text-muted-foreground">
                            {billing.checkout_blocker}
                        </p>
                    )}
                </CardContent>
            </Card>
        </aside>
    );
}

export default function Dashboard({
    provider,
    googleMapsApiKey,
    googleMapsMapId,
    categories,
    services,
    bookings,
    reviews,
    subscription,
    billing,
    stats,
}: DashboardProps) {
    return (
        <>
            <Head title="Provider dashboard" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4">
                <section className="grid gap-4 xl:grid-cols-[1fr_22rem]">
                    <Card className="rounded-lg">
                        <CardHeader className="gap-4 lg:flex-row lg:items-start lg:justify-between">
                            <div className="space-y-2">
                                <div className="flex flex-wrap items-center gap-2">
                                    <Badge
                                        variant={statusTone(provider.status)}
                                    >
                                        {provider.status}
                                    </Badge>
                                    {provider.category && (
                                        <Badge variant="outline">
                                            {provider.category}
                                        </Badge>
                                    )}
                                </div>
                                <div>
                                    <CardTitle className="text-2xl">
                                        {provider.name}
                                    </CardTitle>
                                    <CardDescription className="mt-2 max-w-2xl">
                                        {provider.headline ??
                                            'Build your WellSpot provider profile and manage bookings from one place.'}
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-4">
                            <Metric
                                icon={ClipboardList}
                                label="Services"
                                value={stats.services.toString()}
                            />
                            <Metric
                                icon={CalendarClock}
                                label="Pending bookings"
                                value={stats.pending_bookings.toString()}
                            />
                            <Metric
                                icon={CheckCircle2}
                                label="Completed bookings"
                                value={stats.completed_bookings.toString()}
                            />
                            <Metric
                                icon={Star}
                                label="Rating"
                                value={stats.average_rating.toFixed(1)}
                            />
                        </CardContent>
                    </Card>

                    <BillingPanel
                        billing={billing}
                        subscription={subscription}
                    />
                </section>

                <section>
                    <Card className="rounded-lg">
                        <CardHeader>
                            <CardTitle>Provider profile</CardTitle>
                            <CardDescription>
                                Keep your marketplace details ready for
                                discovery and bookings.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ProviderProfileForm
                                provider={provider}
                                googleMapsApiKey={googleMapsApiKey}
                                googleMapsMapId={googleMapsMapId}
                                categories={categories}
                            />
                        </CardContent>
                    </Card>
                </section>

                <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
                    <Card className="rounded-lg">
                        <CardHeader>
                            <CardTitle>Add service</CardTitle>
                            <CardDescription>
                                Publish a bookable offer. Customers pay you in
                                person.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form
                                action={storeProviderService()}
                                options={{ preserveScroll: true }}
                                resetOnSuccess
                                className="grid gap-4"
                            >
                                {({ errors, processing }) => (
                                    <>
                                        <div className="grid gap-2">
                                            <Label htmlFor="service-name">
                                                Name
                                            </Label>
                                            <Input
                                                id="service-name"
                                                name="name"
                                                placeholder="Deep tissue massage"
                                                required
                                            />
                                            <InputError message={errors.name} />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="category-id">
                                                Category
                                            </Label>
                                            <Select name="category_id">
                                                <SelectTrigger
                                                    id="category-id"
                                                    className="w-full"
                                                >
                                                    <SelectValue placeholder="Use provider category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {categories.map(
                                                        (category) => (
                                                            <SelectItem
                                                                key={
                                                                    category.id
                                                                }
                                                                value={String(
                                                                    category.id,
                                                                )}
                                                            >
                                                                {category.name}
                                                            </SelectItem>
                                                        ),
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <InputError
                                                message={errors.category_id}
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="service-description">
                                                Description
                                            </Label>
                                            <Textarea
                                                id="service-description"
                                                name="description"
                                                placeholder="Who this helps, what is included, and what customers should expect."
                                            />
                                            <InputError
                                                message={errors.description}
                                            />
                                        </div>

                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div className="grid gap-2">
                                                <Label htmlFor="duration-minutes">
                                                    Minutes
                                                </Label>
                                                <Input
                                                    id="duration-minutes"
                                                    name="duration_minutes"
                                                    type="number"
                                                    min="15"
                                                    step="15"
                                                    defaultValue="60"
                                                    required
                                                />
                                                <InputError
                                                    message={
                                                        errors.duration_minutes
                                                    }
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="price-amount">
                                                    In-person price ETB
                                                </Label>
                                                <Input
                                                    id="price-amount"
                                                    name="price_amount"
                                                    type="number"
                                                    min="1"
                                                    defaultValue="1200"
                                                    required
                                                />
                                                <InputError
                                                    message={
                                                        errors.price_amount
                                                    }
                                                />
                                            </div>
                                        </div>

                                        <input
                                            type="hidden"
                                            name="status"
                                            value="active"
                                        />
                                        <input
                                            type="hidden"
                                            name="sort_order"
                                            value="0"
                                        />

                                        <Button
                                            disabled={processing}
                                            type="submit"
                                        >
                                            <Plus />
                                            Add service
                                        </Button>
                                    </>
                                )}
                            </Form>
                        </CardContent>
                    </Card>

                    <Card className="rounded-lg">
                        <CardHeader>
                            <CardTitle>Services</CardTitle>
                            <CardDescription>
                                Prices are displayed for customers; payment is
                                collected in person.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {services.length === 0 ? (
                                <EmptyState label="No services yet" />
                            ) : (
                                services.map((service) => (
                                    <div
                                        key={service.id}
                                        className="grid gap-3 rounded-lg border border-border/70 p-4 md:grid-cols-[1fr_auto]"
                                    >
                                        <div className="space-y-2">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h3 className="font-medium">
                                                    {service.name}
                                                </h3>
                                                <Badge
                                                    variant={statusTone(
                                                        service.status,
                                                    )}
                                                >
                                                    {service.status}
                                                </Badge>
                                            </div>
                                            <p className="line-clamp-2 text-sm text-muted-foreground">
                                                {service.description ??
                                                    'No description yet.'}
                                            </p>
                                            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                                                <span>
                                                    {service.duration_minutes}{' '}
                                                    min
                                                </span>
                                                <span>
                                                    {money(
                                                        service.price_amount,
                                                        service.currency,
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 md:justify-end">
                                            <ServiceEditDialog
                                                service={service}
                                                categories={categories}
                                            />
                                            <Form
                                                action={destroyProviderService(
                                                    service.id,
                                                )}
                                                options={{
                                                    preserveScroll: true,
                                                }}
                                            >
                                                {({ processing }) => (
                                                    <Button
                                                        type="submit"
                                                        variant="outline"
                                                        size="icon"
                                                        disabled={processing}
                                                        aria-label={`Delete ${service.name}`}
                                                    >
                                                        <Trash2 />
                                                    </Button>
                                                )}
                                            </Form>
                                        </div>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </section>

                <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
                    <Card className="rounded-lg">
                        <CardHeader>
                            <CardTitle>Booking queue</CardTitle>
                            <CardDescription>
                                Recent customers waiting on your team. Collect
                                payment in person.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {bookings.length === 0 ? (
                                <EmptyState label="No bookings yet" />
                            ) : (
                                bookings.map((booking) => (
                                    <div
                                        key={booking.id}
                                        className="grid gap-3 rounded-lg border border-border/70 p-4 md:grid-cols-[1fr_auto]"
                                    >
                                        <div>
                                            <div className="font-medium">
                                                {booking.customer_name}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {booking.service_name ??
                                                    'Service'}{' '}
                                                at {dateTime(booking.starts_at)}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 md:justify-end">
                                            <Badge
                                                variant={statusTone(
                                                    booking.status,
                                                )}
                                            >
                                                {booking.status}
                                            </Badge>
                                            <span className="text-sm font-medium">
                                                {money(
                                                    booking.total_amount,
                                                    booking.currency,
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    <Card className="rounded-lg">
                        <CardHeader>
                            <CardTitle>Latest reviews</CardTitle>
                            <CardDescription>
                                Published customer feedback.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {reviews.length === 0 ? (
                                <EmptyState label="No reviews yet" />
                            ) : (
                                reviews.map((review) => (
                                    <div
                                        key={review.id}
                                        className="rounded-lg border border-border/70 p-4"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <div className="font-medium">
                                                    {review.title ??
                                                        'Customer review'}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {review.reviewer_name ??
                                                        'WellSpot customer'}
                                                </div>
                                            </div>
                                            <Badge variant="outline">
                                                {review.rating}.0
                                                <Star className="fill-current" />
                                            </Badge>
                                        </div>
                                        <p className="mt-3 text-sm text-muted-foreground">
                                            {review.comment ??
                                                'No written comment.'}
                                        </p>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </section>
            </div>
        </>
    );
}

function parseCoordinate(value: string | null): number | null {
    if (!value) {
        return null;
    }

    const parsed = Number(value);

    return Number.isFinite(parsed) ? parsed : null;
}

function parseLocation(
    latitude: string | null,
    longitude: string | null,
): ProviderLocation | null {
    const lat = parseCoordinate(latitude);
    const lng = parseCoordinate(longitude);

    if (lat === null || lng === null) {
        return null;
    }

    return { lat, lng };
}

function formatCoordinate(value: number): string {
    return value.toFixed(7);
}

function latLngToLocation(value: GoogleLatLng): ProviderLocation {
    return {
        lat: value.lat(),
        lng: value.lng(),
    };
}

function placeLocationToLocation(value: GooglePlaceLocation): ProviderLocation {
    if (typeof value.lat === 'function' && typeof value.lng === 'function') {
        return {
            lat: value.lat(),
            lng: value.lng(),
        };
    }

    return {
        lat: value.lat as number,
        lng: value.lng as number,
    };
}

function loadGoogleMaps(apiKey: string): Promise<GoogleMapsNamespace> {
    if (window.google?.maps) {
        return Promise.resolve(window.google.maps);
    }

    if (googleMapsPromise) {
        return googleMapsPromise;
    }

    googleMapsPromise = new Promise((resolve, reject) => {
        window.__wellspotGoogleMapsLoaded = () => {
            if (window.google?.maps) {
                resolve(window.google.maps);

                return;
            }

            reject(new Error('Google Maps did not load.'));
        };

        const existingScript = document.getElementById('wellspot-google-maps');

        if (existingScript) {
            return;
        }

        const script = document.createElement('script');
        script.id = 'wellspot-google-maps';
        script.async = true;
        script.defer = true;
        script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&v=weekly&loading=async&callback=__wellspotGoogleMapsLoaded`;
        script.onerror = () => reject(new Error('Google Maps failed to load.'));

        document.head.appendChild(script);
    });

    return googleMapsPromise;
}

function ProviderProfileForm({
    provider,
    googleMapsApiKey,
    googleMapsMapId,
    categories,
}: {
    provider: ProviderSummary;
    googleMapsApiKey: string | null;
    googleMapsMapId: string;
    categories: CategoryOption[];
}) {
    const [address, setAddress] = useState(provider.address);
    const [latitude, setLatitude] = useState(provider.latitude ?? '');
    const [longitude, setLongitude] = useState(provider.longitude ?? '');
    const selectedLocation = parseLocation(latitude, longitude);
    const handleLocationChange = useCallback(
        (location: ProviderLocation, placeAddress?: string) => {
            setLatitude(formatCoordinate(location.lat));
            setLongitude(formatCoordinate(location.lng));

            if (placeAddress) {
                setAddress(placeAddress);
            }
        },
        [],
    );

    return (
        <Form
            {...updateProviderProfile.form()}
            options={{ preserveScroll: true }}
            className="grid gap-4"
        >
            {({ errors, processing, progress, recentlySuccessful }) => (
                <>
                    <div className="grid gap-4 lg:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="provider-name">Business name</Label>
                            <Input
                                id="provider-name"
                                name="name"
                                defaultValue={provider.name}
                                required
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="provider-category">Category</Label>
                            <Select
                                name="category_id"
                                defaultValue={String(provider.category_id)}
                            >
                                <SelectTrigger
                                    id="provider-category"
                                    className="w-full"
                                >
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem
                                            key={category.id}
                                            value={String(category.id)}
                                        >
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.category_id} />
                        </div>
                    </div>

                    <div className="grid gap-3 rounded-lg border border-border/70 bg-background/60 p-4 sm:grid-cols-[5rem_minmax(0,1fr)] sm:items-center">
                        <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted text-xl font-semibold text-muted-foreground">
                            {provider.logo_url ? (
                                <img
                                    alt={`${provider.name} logo`}
                                    className="h-full w-full object-cover"
                                    src={provider.logo_url}
                                />
                            ) : (
                                provider.name.charAt(0).toUpperCase()
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="provider-logo">
                                Provider logo
                            </Label>
                            <Input
                                accept="image/*"
                                id="provider-logo"
                                name="logo"
                                type="file"
                            />
                            <p className="text-sm text-muted-foreground">
                                Optional image shown on provider cards and
                                detail pages.
                            </p>
                            {progress && (
                                <progress
                                    className="h-2 w-full"
                                    max="100"
                                    value={progress.percentage}
                                >
                                    {progress.percentage}%
                                </progress>
                            )}
                            <InputError message={errors.logo} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="provider-headline">Headline</Label>
                        <Input
                            id="provider-headline"
                            name="headline"
                            defaultValue={provider.headline ?? ''}
                            placeholder="Calm recovery sessions near Bole"
                        />
                        <InputError message={errors.headline} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="provider-description">
                            Description
                        </Label>
                        <Textarea
                            id="provider-description"
                            name="description"
                            defaultValue={provider.description ?? ''}
                            placeholder="Share your care style, amenities, and what first-time customers should expect."
                            rows={4}
                        />
                        <InputError message={errors.description} />
                    </div>

                    <div className="grid gap-4 lg:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="provider-phone">Phone</Label>
                            <Input
                                id="provider-phone"
                                name="phone"
                                defaultValue={provider.phone ?? ''}
                                placeholder="+251911234567"
                            />
                            <InputError message={errors.phone} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="provider-email">Email</Label>
                            <Input
                                id="provider-email"
                                name="email"
                                type="email"
                                defaultValue={provider.email ?? ''}
                                placeholder="hello@example.com"
                            />
                            <InputError message={errors.email} />
                        </div>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                        <div className="grid gap-2">
                            <Label htmlFor="provider-address">Address</Label>
                            <Input
                                id="provider-address"
                                name="address"
                                value={address}
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ) => setAddress(event.target.value)}
                                required
                            />
                            <InputError message={errors.address} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="provider-neighborhood">
                                Neighborhood
                            </Label>
                            <Input
                                id="provider-neighborhood"
                                name="neighborhood"
                                defaultValue={provider.neighborhood ?? ''}
                                placeholder="Bole"
                            />
                            <InputError message={errors.neighborhood} />
                        </div>
                    </div>

                    <input type="hidden" name="latitude" value={latitude} />
                    <input type="hidden" name="longitude" value={longitude} />

                    <div className="grid gap-4 lg:grid-cols-[1fr_0.32fr]">
                        <div className="grid gap-2">
                            <Label>Map location</Label>
                            <ProviderLocationPicker
                                apiKey={googleMapsApiKey}
                                mapId={googleMapsMapId}
                                location={selectedLocation}
                                onLocationChange={handleLocationChange}
                                onManualLatitudeChange={setLatitude}
                                onManualLongitudeChange={setLongitude}
                                latitude={latitude}
                                longitude={longitude}
                            />
                            <InputError message={errors.latitude} />
                            <InputError message={errors.longitude} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="provider-status">Status</Label>
                            <Select
                                name="status"
                                defaultValue={provider.status}
                            >
                                <SelectTrigger
                                    id="provider-status"
                                    className="w-full"
                                >
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="published">
                                        Published
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.status} />
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <Button disabled={processing} type="submit">
                            Save provider profile
                        </Button>
                        {recentlySuccessful && (
                            <span className="text-sm text-muted-foreground">
                                Saved
                            </span>
                        )}
                    </div>
                </>
            )}
        </Form>
    );
}

function ProviderLocationPicker({
    apiKey,
    mapId,
    location,
    latitude,
    longitude,
    onLocationChange,
    onManualLatitudeChange,
    onManualLongitudeChange,
}: {
    apiKey: string | null;
    mapId: string;
    location: ProviderLocation | null;
    latitude: string;
    longitude: string;
    onLocationChange: (
        location: ProviderLocation,
        placeAddress?: string,
    ) => void;
    onManualLatitudeChange: (value: string) => void;
    onManualLongitudeChange: (value: string) => void;
}) {
    const mapRef = useRef<HTMLDivElement | null>(null);
    const searchContainerRef = useRef<HTMLDivElement | null>(null);
    const initialLocation = useMemo(() => location, []);
    const [loadingState, setLoadingState] = useState<
        'idle' | 'loading' | 'ready' | 'error'
    >(apiKey ? 'idle' : 'error');

    useEffect(() => {
        if (!apiKey || !mapRef.current || !searchContainerRef.current) {
            return;
        }

        let isActive = true;
        let clickListener: GoogleMapsEventListener | null = null;
        let dragListener: GoogleMapsEventListener | null = null;
        let placeAutocomplete: GooglePlaceAutocompleteElement | null = null;
        let marker: GoogleMarker | null = null;

        setLoadingState('loading');

        loadGoogleMaps(apiKey)
            .then(async (maps) => {
                const [, markerLibrary, placesLibrary] = await Promise.all([
                    maps.importLibrary('maps'),
                    maps.importLibrary(
                        'marker',
                    ) as Promise<GoogleMarkerLibrary>,
                    maps.importLibrary(
                        'places',
                    ) as Promise<GooglePlacesLibrary>,
                ]);

                if (
                    !isActive ||
                    !mapRef.current ||
                    !searchContainerRef.current
                ) {
                    return;
                }

                const map = new maps.Map(mapRef.current, {
                    center: initialLocation ?? ADDIS_ABABA_CENTER,
                    clickableIcons: false,
                    fullscreenControl: false,
                    mapId,
                    mapTypeControl: false,
                    streetViewControl: false,
                    zoom: initialLocation ? 16 : 12,
                });

                marker = new markerLibrary.AdvancedMarkerElement({
                    gmpDraggable: true,
                    map: initialLocation ? map : null,
                    position: initialLocation ?? ADDIS_ABABA_CENTER,
                    title: 'Provider location',
                });

                const applyLocation = (
                    nextLocation: ProviderLocation,
                    placeAddress?: string,
                ) => {
                    if (marker) {
                        marker.position = nextLocation;
                        marker.map = map;
                    }

                    map.setCenter(nextLocation);
                    map.setZoom(16);
                    onLocationChange(nextLocation, placeAddress);
                };

                clickListener = map.addListener('click', (event) => {
                    if (!event.latLng) {
                        return;
                    }

                    applyLocation(latLngToLocation(event.latLng));
                });

                dragListener = marker.addListener('dragend', () => {
                    if (!marker?.position) {
                        return;
                    }

                    applyLocation(placeLocationToLocation(marker.position));
                });

                placeAutocomplete = new placesLibrary.PlaceAutocompleteElement({
                    includedRegionCodes: ['et'],
                    locationBias: initialLocation ?? ADDIS_ABABA_CENTER,
                });
                placeAutocomplete.className = 'wellspot-place-autocomplete';

                searchContainerRef.current.replaceChildren(placeAutocomplete);

                placeAutocomplete.addEventListener(
                    'gmp-select',
                    async (event: Event) => {
                        const placePrediction = (
                            event as GooglePlaceSelectEvent
                        ).placePrediction;

                        if (!placePrediction) {
                            return;
                        }

                        const place = placePrediction.toPlace();

                        await place.fetchFields({
                            fields: [
                                'displayName',
                                'formattedAddress',
                                'location',
                            ],
                        });

                        if (!place.location) {
                            return;
                        }

                        applyLocation(
                            placeLocationToLocation(place.location),
                            place.formattedAddress ?? place.displayName,
                        );
                    },
                );

                setLoadingState('ready');
            })
            .catch((error: unknown) => {
                console.error('Google Maps location picker failed to load.', error);

                if (isActive) {
                    setLoadingState('error');
                }
            });

        return () => {
            isActive = false;
            clickListener?.remove();
            dragListener?.remove();
            placeAutocomplete?.remove();
            if (marker) {
                marker.map = null;
            }
        };
    }, [apiKey, initialLocation, mapId, onLocationChange]);

    if (!apiKey) {
        return (
            <ManualLocationFallback
                latitude={latitude}
                longitude={longitude}
                onManualLatitudeChange={onManualLatitudeChange}
                onManualLongitudeChange={onManualLongitudeChange}
            />
        );
    }

    return (
        <div className="overflow-hidden rounded-lg border border-border/70">
            <div className="border-b border-border/70 bg-muted/30 p-3">
                <div
                    ref={searchContainerRef}
                    className="[&_.wellspot-place-autocomplete]:w-full [&_gmp-place-autocomplete]:w-full"
                />
            </div>
            <div className="relative min-h-80">
                <div ref={mapRef} className="absolute inset-0" />
                {loadingState !== 'ready' && (
                    <div className="absolute inset-0 grid place-items-center bg-background/80 p-6 text-center text-sm text-muted-foreground">
                        {loadingState === 'error'
                            ? 'Google Maps could not load. You can still save the profile and try again later.'
                            : 'Loading map...'}
                    </div>
                )}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/70 bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
                <span>
                    Search, click the map, or drag the marker to set the exact
                    provider location.
                </span>
                <span>
                    {location
                        ? `${formatCoordinate(location.lat)}, ${formatCoordinate(location.lng)}`
                        : 'No location selected'}
                </span>
            </div>
        </div>
    );
}

function ManualLocationFallback({
    latitude,
    longitude,
    onManualLatitudeChange,
    onManualLongitudeChange,
}: {
    latitude: string;
    longitude: string;
    onManualLatitudeChange: (value: string) => void;
    onManualLongitudeChange: (value: string) => void;
}) {
    return (
        <div className="rounded-lg border border-dashed border-border/70 p-4">
            <p className="text-sm text-muted-foreground">
                Google Maps is not configured. Enter coordinates manually for
                now.
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                    <Label htmlFor="provider-latitude">Latitude</Label>
                    <Input
                        id="provider-latitude"
                        type="number"
                        step="0.0000001"
                        value={latitude}
                        onChange={(event) =>
                            onManualLatitudeChange(event.target.value)
                        }
                        placeholder="9.0108"
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="provider-longitude">Longitude</Label>
                    <Input
                        id="provider-longitude"
                        type="number"
                        step="0.0000001"
                        value={longitude}
                        onChange={(event) =>
                            onManualLongitudeChange(event.target.value)
                        }
                        placeholder="38.7613"
                    />
                </div>
            </div>
        </div>
    );
}

function ServiceEditDialog({
    service,
    categories,
}: {
    service: ProviderService;
    categories: CategoryOption[];
}) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    aria-label={`Edit ${service.name}`}
                >
                    <Pencil />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Edit service</DialogTitle>
                    <DialogDescription>
                        Update the customer-facing details for this offer.
                    </DialogDescription>
                </DialogHeader>
                <Form
                    action={updateProviderService(service.id)}
                    options={{ preserveScroll: true }}
                    className="grid gap-4"
                >
                    {({ errors, processing, recentlySuccessful }) => (
                        <>
                            <ServiceFields
                                categories={categories}
                                service={service}
                                errors={errors}
                            />

                            <div className="flex flex-wrap items-center gap-3">
                                <Button disabled={processing} type="submit">
                                    Save service
                                </Button>
                                {recentlySuccessful && (
                                    <span className="text-sm text-muted-foreground">
                                        Saved
                                    </span>
                                )}
                            </div>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}

function ServiceFields({
    categories,
    service,
    errors,
}: {
    categories: CategoryOption[];
    service: ProviderService;
    errors: Record<string, string>;
}) {
    return (
        <>
            <div className="grid gap-2">
                <Label htmlFor={`service-${service.id}-name`}>Name</Label>
                <Input
                    id={`service-${service.id}-name`}
                    name="name"
                    defaultValue={service.name}
                    required
                />
                <InputError message={errors.name} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor={`service-${service.id}-category`}>
                    Category
                </Label>
                <Select
                    name="category_id"
                    defaultValue={
                        service.category_id
                            ? String(service.category_id)
                            : undefined
                    }
                >
                    <SelectTrigger
                        id={`service-${service.id}-category`}
                        className="w-full"
                    >
                        <SelectValue placeholder="Use provider category" />
                    </SelectTrigger>
                    <SelectContent>
                        {categories.map((category) => (
                            <SelectItem
                                key={category.id}
                                value={String(category.id)}
                            >
                                {category.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <InputError message={errors.category_id} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor={`service-${service.id}-description`}>
                    Description
                </Label>
                <Textarea
                    id={`service-${service.id}-description`}
                    name="description"
                    defaultValue={service.description ?? ''}
                    rows={4}
                />
                <InputError message={errors.description} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                    <Label htmlFor={`service-${service.id}-duration`}>
                        Minutes
                    </Label>
                    <Input
                        id={`service-${service.id}-duration`}
                        name="duration_minutes"
                        type="number"
                        min="15"
                        step="15"
                        defaultValue={service.duration_minutes}
                        required
                    />
                    <InputError message={errors.duration_minutes} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor={`service-${service.id}-price`}>
                        In-person price ETB
                    </Label>
                    <Input
                        id={`service-${service.id}-price`}
                        name="price_amount"
                        type="number"
                        min="1"
                        defaultValue={service.price_amount}
                        required
                    />
                    <InputError message={errors.price_amount} />
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                    <Label htmlFor={`service-${service.id}-status`}>
                        Status
                    </Label>
                    <Select name="status" defaultValue={service.status}>
                        <SelectTrigger
                            id={`service-${service.id}-status`}
                            className="w-full"
                        >
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                    </Select>
                    <InputError message={errors.status} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor={`service-${service.id}-sort-order`}>
                        Sort order
                    </Label>
                    <Input
                        id={`service-${service.id}-sort-order`}
                        name="sort_order"
                        type="number"
                        min="0"
                        defaultValue={service.sort_order}
                    />
                    <InputError message={errors.sort_order} />
                </div>
            </div>
        </>
    );
}

function Metric({
    icon: Icon,
    label,
    value,
}: {
    icon: LucideIcon;
    label: string;
    value: string;
}) {
    return (
        <div className="rounded-lg border border-border/70 p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icon className="size-4" />
                {label}
            </div>
            <div className="mt-3 text-2xl font-semibold tracking-normal">
                {value}
            </div>
        </div>
    );
}

function EmptyState({ label }: { label: string }) {
    return (
        <div className="rounded-lg border border-dashed border-border/70 p-6 text-center text-sm text-muted-foreground">
            {label}
        </div>
    );
}

Dashboard.layout = [
    AppLayout,
    {
        breadcrumbs: [
            {
                title: 'Provider dashboard',
                href: providerDashboard(),
            },
        ],
    },
];
