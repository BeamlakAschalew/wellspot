import { Form, Head } from '@inertiajs/react';
import {
    CalendarClock,
    CheckCircle2,
    ClipboardList,
    Pencil,
    type LucideIcon,
    Plus,
    Sparkles,
    Star,
    Trash2,
} from 'lucide-react';
import ProviderProfileController from '@/actions/App/Http/Controllers/ProviderProfileController';
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
import { dashboard as providerDashboard } from '@/routes/provider';

type CategoryOption = {
    id: number;
    name: string;
};

type ProviderSummary = {
    id: number;
    name: string;
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

type DashboardProps = {
    provider: ProviderSummary;
    categories: CategoryOption[];
    services: ProviderService[];
    bookings: ProviderBooking[];
    reviews: ProviderReview[];
    stats: {
        services: number;
        pending_bookings: number;
        completed_bookings: number;
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
                <section>
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

function ProviderProfileForm({
    provider,
    categories,
}: {
    provider: ProviderSummary;
    categories: CategoryOption[];
}) {
    return (
        <Form
            {...ProviderProfileController.update.form()}
            options={{ preserveScroll: true }}
            className="grid gap-4"
        >
            {({ errors, processing, recentlySuccessful }) => (
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
                                defaultValue={provider.address}
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

                    <div className="grid gap-4 lg:grid-cols-3">
                        <div className="grid gap-2">
                            <Label htmlFor="provider-latitude">Latitude</Label>
                            <Input
                                id="provider-latitude"
                                name="latitude"
                                type="number"
                                step="0.0000001"
                                defaultValue={provider.latitude ?? ''}
                                placeholder="9.0108"
                            />
                            <InputError message={errors.latitude} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="provider-longitude">
                                Longitude
                            </Label>
                            <Input
                                id="provider-longitude"
                                name="longitude"
                                type="number"
                                step="0.0000001"
                                defaultValue={provider.longitude ?? ''}
                                placeholder="38.7613"
                            />
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
                    {...ProviderServiceController.update.form(service.id)}
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

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Provider dashboard',
            href: providerDashboard(),
        },
    ],
};
