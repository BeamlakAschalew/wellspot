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

type Category = {
    icon: IconType;
    label: string;
    iconClass: string;
    backgroundClass: string;
};

const categories: Category[] = [
    {
        icon: FaDiagnoses,
        label: 'Massage',
        iconClass: 'text-primary',
        backgroundClass: 'bg-primary-fixed group-hover:bg-primary-fixed-dim',
    },
    {
        icon: PiBowlSteamThin,
        label: 'Yoga',
        iconClass: 'text-secondary',
        backgroundClass:
            'bg-secondary-fixed group-hover:bg-secondary-fixed-dim',
    },
    {
        icon: RiPsychotherapyLine,
        label: 'Therapy',
        iconClass: 'text-tertiary',
        backgroundClass: 'bg-tertiary-fixed group-hover:bg-tertiary-fixed-dim',
    },
    {
        icon: FaSpa,
        label: 'Spa',
        iconClass: 'text-on-surface-variant',
        backgroundClass:
            'bg-surface-container group-hover:bg-surface-container-high',
    },
    {
        icon: IoMdFitness,
        label: 'Fitness',
        iconClass: 'text-on-surface-variant',
        backgroundClass:
            'bg-surface-container group-hover:bg-surface-container-high',
    },
    {
        icon: GiMeditation,
        label: 'Meditation',
        iconClass: 'text-on-surface-variant',
        backgroundClass:
            'bg-surface-container group-hover:bg-surface-container-high',
    },
    {
        icon: RiShieldCrossLine,
        label: 'Wellness',
        iconClass: 'text-on-surface-variant',
        backgroundClass:
            'bg-surface-container group-hover:bg-surface-container-high',
    },
];

const providers = [
    {
        image: providerMassageImage,
        imageAlt:
            'A professional massage therapist in a high-end wellness clinic.',
        name: 'Serenity Spa & Massage',
        price: 'From $85',
        services: 'Therapeutic, Deep Tissue, Aromatherapy',
        location: 'Downtown, SF',
        rating: '4.9',
    },
    {
        image: providerYogaImage,
        imageAlt: 'A yoga instructor in a peaceful bamboo studio.',
        name: 'The Flow Studio',
        price: 'From $25',
        services: 'Vinyasa, Hatha, Guided Meditation',
        location: 'Mission District',
        rating: '5.0',
    },
    {
        image: providerTherapyImage,
        imageAlt: 'A modern therapy office with comfortable armchairs.',
        name: 'Mindful Pathways',
        price: 'From $120',
        services: 'CBT, Holistic Therapy, Wellness Coaching',
        location: 'Pacific Heights',
        rating: '4.8',
    },
    {
        image: providerSpaImage,
        imageAlt: 'An upscale spa treatment room with a copper soaking tub.',
        name: 'The Ritual House',
        price: 'From $150',
        services: 'Skin Rituals, Hydrotherapy, Body Polish',
        location: 'Marin County',
        rating: '4.9',
    },
];

const steps = [
    {
        icon: 'search',
        title: '1. Search',
        body: 'Filter by service, location, or provider to find your perfect match.',
        hoverClass: 'group-hover:bg-primary-fixed',
        iconClass: 'text-primary',
    },
    {
        icon: 'calendar_month',
        title: '2. Book',
        body: 'Check real-time availability and book your session instantly.',
        hoverClass: 'group-hover:bg-secondary-fixed',
        iconClass: 'text-secondary',
    },
    {
        icon: 'mood',
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
        quote: 'As a busy developer, I often forget to take care of myself. WellSpot makes it easy to find high-quality yoga classes that fit into my weird schedule.',
    },
];

function MaterialIcon({
    children,
    className = '',
    filled = false,
}: {
    children: string;
    className?: string;
    filled?: boolean;
}) {
    return (
        <span
            className={`material-symbols-outlined ${className}`}
            style={filled ? { fontVariationSettings: "'FILL' 1" } : undefined}
        >
            {children}
        </span>
    );
}

function HeroSection() {
    return (
        <section
            className="relative flex min-h-[870px] items-center justify-center overflow-hidden px-margin-mobile"
            id="top"
        >
            <div className="absolute inset-0 z-0">
                <img
                    alt="A serene wellness studio interior with natural sunlight, oak flooring, and lush indoor plants."
                    className="h-full w-full object-cover"
                    src={heroImage}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-surface/20 via-surface/40 to-surface" />
            </div>

            <div className="relative z-10 w-full max-w-4xl text-center">
                <h1 className="animate-fade-in-up mb-md font-display text-display">
                    Find your balance
                </h1>
                <p className="mx-auto mb-xl w-full text-on-surface-variant">
                    Discover top-rated local wellness providers. From
                    therapeutic massage to restorative yoga, book your next
                    moment of zen in seconds.
                </p>

                <div className="glass-search mx-auto flex max-w-3xl flex-col items-center gap-base rounded-full border border-outline-variant/30 p-2 shadow-lg md:flex-row md:p-base">
                    {[
                        {
                            icon: 'search',
                            label: 'Service',
                            placeholder: 'What are you looking for?',
                            hasBorder: true,
                        },
                        {
                            icon: 'location_on',
                            label: 'Location',
                            placeholder: 'Where to?',
                            hasBorder: true,
                        },
                    ].map((field) => (
                        <div
                            className={`flex w-full flex-1 items-center px-lg py-sm ${field.hasBorder ? 'md:border-r md:border-outline-variant/30' : ''}`}
                            key={field.label}
                        >
                            <MaterialIcon className="mr-sm text-primary">
                                {field.icon}
                            </MaterialIcon>
                            <div className="w-full text-left">
                                <p className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                                    {field.label}
                                </p>
                                <input
                                    className="w-full border-none bg-transparent p-0 font-body-md text-body-md placeholder:text-outline focus:ring-0"
                                    placeholder={field.placeholder}
                                    type="text"
                                />
                            </div>
                        </div>
                    ))}
                    <button
                        className="flex w-full items-center justify-center rounded-full bg-primary p-md text-on-primary shadow-md transition-all hover:opacity-90 active:scale-95 md:w-auto"
                        type="button"
                    >
                        <MaterialIcon>search</MaterialIcon>
                    </button>
                </div>
            </div>
        </section>
    );
}

function CategoriesSection() {
    return (
        <section
            className="mx-auto max-w-container-max px-margin-mobile py-2xl"
            id="discover"
        >
            <div className="mb-xl flex items-center justify-between">
                <h2 className="font-headline-lg text-headline-lg text-primary">
                    Explore Categories
                </h2>
                <a
                    className="font-label-md text-label-md text-secondary hover:underline"
                    href="#"
                >
                    View all
                </a>
            </div>
            <div className="no-scrollbar flex gap-gutter overflow-x-auto pb-md">
                {categories.map((category) => {
                    const CategoryIcon = category.icon;

                    return (
                        <div
                            className="group flex-shrink-0 cursor-pointer text-center"
                            key={category.label}
                        >
                            <div
                                className={`mb-sm flex h-20 w-20 items-center justify-center rounded-full transition-colors ${category.backgroundClass}`}
                            >
                                <CategoryIcon
                                    aria-hidden="true"
                                    className={`${category.iconClass} text-[32px]`}
                                />
                            </div>
                            <p className="font-label-md text-label-md text-on-surface-variant">
                                {category.label}
                            </p>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

function ProvidersSection() {
    return (
        <section className="bg-surface-container-low py-2xl" id="providers">
            <div className="mx-auto max-w-container-max px-margin-mobile">
                <div className="mb-xl flex flex-col justify-between gap-md md:flex-row md:items-end">
                    <div>
                        <h2 className="mb-xs font-headline-lg text-headline-lg text-primary">
                            Top Rated Providers
                        </h2>
                        <p className="font-body-md text-body-md text-on-surface-variant">
                            Handpicked professionals committed to your
                            well-being.
                        </p>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-gutter sm:grid-cols-2 lg:grid-cols-4">
                    {providers.map((provider) => (
                        <div
                            className="bento-card group flex cursor-pointer flex-col overflow-hidden rounded-xl border border-outline-variant/30 bg-surface"
                            key={provider.name}
                        >
                            <div className="relative aspect-[4/5] overflow-hidden">
                                <img
                                    alt={provider.imageAlt}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    src={provider.image}
                                />
                                <div className="absolute top-md right-md flex items-center gap-xs rounded-lg bg-surface/90 px-sm py-xs shadow-sm backdrop-blur-sm">
                                    <MaterialIcon
                                        className="text-[18px] text-[#FFB800]"
                                        filled
                                    >
                                        star
                                    </MaterialIcon>
                                    <span className="font-label-sm text-label-sm text-on-surface">
                                        {provider.rating}
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-1 flex-col justify-between p-md">
                                <div>
                                    <div className="mb-xs flex items-start justify-between gap-sm">
                                        <h3 className="font-headline-sm text-headline-sm text-on-surface">
                                            {provider.name}
                                        </h3>
                                        <span className="font-label-md text-label-md font-bold text-primary">
                                            {provider.price}
                                        </span>
                                    </div>
                                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                                        {provider.services}
                                    </p>
                                </div>
                                <div className="mt-md flex items-center gap-xs border-t border-outline-variant/20 pt-md">
                                    <MaterialIcon className="text-[16px] text-outline">
                                        location_on
                                    </MaterialIcon>
                                    <span className="font-label-sm text-label-sm text-outline">
                                        {provider.location}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
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
                {steps.map((step) => (
                    <div className="group text-center" key={step.title}>
                        <div
                            className={`mx-auto mb-lg flex h-24 w-24 items-center justify-center rounded-full bg-surface-container transition-all duration-300 ${step.hoverClass}`}
                        >
                            <MaterialIcon
                                className={`${step.iconClass} text-[40px]`}
                            >
                                {step.icon}
                            </MaterialIcon>
                        </div>
                        <h3 className="mb-sm font-headline-sm text-headline-sm">
                            {step.title}
                        </h3>
                        <p className="font-body-md text-body-md text-on-surface-variant">
                            {step.body}
                        </p>
                    </div>
                ))}
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
                            Join thousands of people who found their wellness
                            routine through WellSpot.
                        </p>
                        <div className="flex gap-md">
                            {['arrow_back', 'arrow_forward'].map((icon) => (
                                <button
                                    className="flex h-12 w-12 items-center justify-center rounded-full border border-on-primary/20 transition-colors hover:bg-on-primary/10"
                                    key={icon}
                                    type="button"
                                >
                                    <MaterialIcon>{icon}</MaterialIcon>
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="no-scrollbar flex w-full gap-gutter overflow-x-auto pb-md md:w-2/3">
                        {testimonials.map((testimonial) => (
                            <div
                                className="w-full flex-shrink-0 rounded-2xl border border-on-primary/10 bg-on-primary/5 p-xl backdrop-blur-md sm:w-[400px]"
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
                    Join WellSpot today and start your journey towards a more
                    balanced life with our network of professionals.
                </p>
                <div className="flex flex-col items-center justify-center gap-md sm:flex-row">
                    <button
                        className="w-full rounded-full bg-primary px-2xl py-md font-label-md text-label-md text-on-primary shadow-lg transition-all hover:opacity-90 active:scale-95 sm:w-auto"
                        type="button"
                    >
                        Find a Provider
                    </button>
                    <button
                        className="w-full rounded-full border border-outline px-2xl py-md font-label-md text-label-md transition-all hover:bg-surface-container active:scale-95 sm:w-auto"
                        type="button"
                    >
                        List Your Service
                    </button>
                </div>
            </div>
        </section>
    );
}

export function MainContent() {
    return (
        <main className="pt-16">
            <HeroSection />
            <CategoriesSection />
            <ProvidersSection />
            <HowItWorksSection />
            <TestimonialsSection />
            <CtaSection />
        </main>
    );
}
