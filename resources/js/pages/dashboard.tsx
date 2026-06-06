import { Form, Head } from '@inertiajs/react';
import {
    CalendarClock,
    CircleDollarSign,
    ClipboardList,
    type LucideIcon,
    Plus,
    Sparkles,
    Star,
    Trash2,
} from 'lucide-react';
import ProviderServiceController from '@/actions/App/Http/Controllers/ProviderServiceController';
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
import { dashboard as providerDashboard } from '@/routes/provider';

type CategoryOption = {
    id: number;
    name: string;
};

type ProviderSummary = {
    id: number;
    name: string;
    headline: string | null;
    status: string;
    address: string;
    neighborhood: string | null;
    category: string | null;
    subscription: {
        plan: string;
        status: string;
        renews_at: string | null;
    } | null;
};

type ProviderService = {
    id: number;
    name: string;
    description: string | null;
    duration_minutes: number;
    price_amount: number;
    currency: string;
    status: string;
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

type DashboardProps = {
    provider: ProviderSummary;
    categories: CategoryOption[];
    services: ProviderService[];
    bookings: ProviderBooking[];
    reviews: ProviderReview[];
    stats: {
        services: number;
        pending_bookings: number;
        monthly_revenue: number;
        average_rating: number;
    };
};

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

function statusTone(status: string) {
    if (['active', 'published', 'confirmed', 'completed'].includes(status)) {
        return 'default' as const;
    }

    if (['pending', 'trialing', 'draft'].includes(status)) {
        return 'secondary' as const;
    }

    return 'outline' as const;
}

export default function Dashboard({
    provider,
    categories,
    services,
    bookings,
    reviews,
    stats,
}: DashboardProps) {
    return (
        <>
            <Head title="Provider dashboard" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4">
                <section className="grid gap-4 lg:grid-cols-[1.45fr_0.55fr]">
                    <Card className="rounded-lg">
                        <CardHeader className="gap-4 lg:flex-row lg:items-start lg:justify-between">
                            <div className="space-y-2">
                                <div className="flex flex-wrap items-center gap-2">
                                    <Badge variant={statusTone(provider.status)}>
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
                            <Button variant="outline" size="sm">
                                <Sparkles />
                                AI description
                            </Button>
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
                                icon={CircleDollarSign}
                                label="Month revenue"
                                value={money(stats.monthly_revenue)}
                            />
                            <Metric
                                icon={Star}
                                label="Rating"
                                value={stats.average_rating.toFixed(1)}
                            />
                        </CardContent>
                    </Card>

                    <Card className="rounded-lg">
                        <CardHeader>
                            <CardTitle>Subscription</CardTitle>
                            <CardDescription>
                                Provider-side access for Chapa billing.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between gap-3">
                                <span className="text-muted-foreground text-sm">
                                    Plan
                                </span>
                                <Badge variant="outline">
                                    {provider.subscription?.plan ?? 'starter'}
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                                <span className="text-muted-foreground text-sm">
                                    Status
                                </span>
                                <Badge
                                    variant={statusTone(
                                        provider.subscription?.status ??
                                            'trialing',
                                    )}
                                >
                                    {provider.subscription?.status ??
                                        'trialing'}
                                </Badge>
                            </div>
                            <div className="text-muted-foreground text-sm">
                                {provider.subscription?.renews_at
                                    ? `Renews ${provider.subscription.renews_at}`
                                    : 'Payment setup is ready for the next iteration.'}
                            </div>
                        </CardContent>
                    </Card>
                </section>

                <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
                    <Card className="rounded-lg">
                        <CardHeader>
                            <CardTitle>Add service</CardTitle>
                            <CardDescription>
                                Publish a bookable offer for your wellness
                                profile.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form
                                {...ProviderServiceController.store.form()}
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
                                            <InputError
                                                message={errors.name}
                                            />
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
                                                    Price ETB
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
                                Your current provider-side catalog.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {services.length === 0 ? (
                                <EmptyState label="No services yet" />
                            ) : (
                                services.map((service) => (
                                    <div
                                        key={service.id}
                                        className="border-border/70 grid gap-3 rounded-lg border p-4 md:grid-cols-[1fr_auto]"
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
                                            <p className="text-muted-foreground line-clamp-2 text-sm">
                                                {service.description ??
                                                    'No description yet.'}
                                            </p>
                                            <div className="text-muted-foreground flex flex-wrap gap-3 text-sm">
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
                                        <Form
                                            {...ProviderServiceController.destroy.form(
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
                                Recent customers waiting on your team.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {bookings.length === 0 ? (
                                <EmptyState label="No bookings yet" />
                            ) : (
                                bookings.map((booking) => (
                                    <div
                                        key={booking.id}
                                        className="border-border/70 grid gap-3 rounded-lg border p-4 md:grid-cols-[1fr_auto]"
                                    >
                                        <div>
                                            <div className="font-medium">
                                                {booking.customer_name}
                                            </div>
                                            <div className="text-muted-foreground text-sm">
                                                {booking.service_name ??
                                                    'Service'}{' '}
                                                at{' '}
                                                {dateTime(booking.starts_at)}
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
                                        className="border-border/70 rounded-lg border p-4"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <div className="font-medium">
                                                    {review.title ??
                                                        'Customer review'}
                                                </div>
                                                <div className="text-muted-foreground text-sm">
                                                    {review.reviewer_name ??
                                                        'WellSpot customer'}
                                                </div>
                                            </div>
                                            <Badge variant="outline">
                                                {review.rating}.0
                                                <Star className="fill-current" />
                                            </Badge>
                                        </div>
                                        <p className="text-muted-foreground mt-3 text-sm">
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
        <div className="border-border/70 rounded-lg border p-4">
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
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
        <div className="border-border/70 text-muted-foreground rounded-lg border border-dashed p-6 text-center text-sm">
            {label}
        </div>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Provider dashboard',
            href: providerDashboard(),
        },
    ],
};
