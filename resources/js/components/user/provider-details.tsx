import React, { useState } from 'react';

interface Service {
    id: string;
    name: string;
    description: string;
    duration: number;
    price: number;
}

interface Day {
    id: string;
    label: string;
    formatted: string;
}

interface Date {
    id: string;
    label: string;
    formatted: string;
}
const SERVICES = [
    {
        id: 'deep-tissue',
        name: 'Deep Tissue Massage',
        description:
            'Focuses on realigning deeper layers of muscles and connective tissue.',
        duration: 60,
        price: 120,
    },
    {
        id: 'swedish',
        name: 'Swedish Relaxation',
        description:
            'A gentle full-body massage to promote circulation and tranquility.',
        duration: 90,
        price: 155,
    },
    {
        id: 'sports',
        name: 'Sports Recovery Therapy',
        description:
            'Targeted work for athletes to improve performance and prevent injury.',
        duration: 45,
        price: 95,
    },
];

const TIME_SLOTS = ['9:00 AM', '10:30 AM', '1:00 PM', '2:30 PM', '4:00 PM'];

// Helper to generate the next 5 business days
const getUpcomingDays = () => {
    const days = [];
    // Add 'as const' right here:
    const options = {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
    } as const;
    let current = new Date();

    while (days.length < 5) {
        if (current.getDay() !== 0) {
            days.push({
                id: current.toISOString().split('T')[0],
                label: current.toLocaleDateString('en-US', options),
                formatted: current.toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                }),
            });
        }
        current.setDate(current.getDate() + 1);
    }
    return days;
};
export default function WellSpotBooking() {
    const [selectedService, setSelectedService] = useState<Service | null>(
        null,
    );
    const [selectedDate, setSelectedDate] = useState<Day | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [isBooked, setIsBooked] = useState(false);

    const upcomingDays = getUpcomingDays();

    const handleServiceSelect = (service: Service) => {
        // Prevent redundant state updates if they click the already selected service
        if (selectedService?.id === service.id) return;

        setSelectedService(service);
        setSelectedTime(null);
    };

    const handleBookAppointment = () => {
        if (selectedService && selectedDate && selectedTime) {
            setIsBooked(true);
        }
    };

    const resetWorkflow = () => {
        setSelectedService(null);
        setSelectedDate(null);
        setSelectedTime(null);
        setIsBooked(false);
    };

    if (isBooked) {
        return (
            <div className="mx-auto my-12 max-w-md animate-in rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-xl duration-300 zoom-in-95 fade-in">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2.5}
                        stroke="currentColor"
                        className="h-8 w-8"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.5 12.75l6 6 9-13.5"
                        />
                    </svg>
                </div>
                <h3 className="mb-2 text-2xl font-bold text-zinc-900">
                    Appointment Confirmed!
                </h3>
                <p className="mb-6 text-sm text-zinc-600">
                    Your session with Elena Rodriguez, LMT has been reserved.
                </p>

                <div className="mb-6 space-y-3 rounded-xl border border-zinc-100 bg-zinc-50 p-4 text-left text-sm">
                    <p className="text-zinc-800">
                        <strong className="text-zinc-900">Service:</strong>{' '}
                        {selectedService?.name} ({selectedService?.duration}{' '}
                        mins)
                    </p>
                    <p className="text-zinc-800">
                        <strong className="text-zinc-900">Date:</strong> (
                        {selectedDate?.formatted})
                    </p>
                    <p className="text-zinc-800">
                        <strong className="text-zinc-900">Time:</strong>{' '}
                        {selectedTime}
                    </p>
                    <p className="text-zinc-800">
                        <strong className="text-zinc-900">Location:</strong> 420
                        Wellness Way, Suite 102, San Francisco
                    </p>
                    <p className="rounded border border-emerald-100 bg-emerald-50 p-2 text-xs text-emerald-700">
                        ✓ Free client parking reserved in the building basement.
                    </p>
                </div>

                <button
                    onClick={resetWorkflow}
                    className="w-full rounded-xl bg-zinc-900 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
                >
                    Schedule Another Session
                </button>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-6xl px-4 py-8">
            {/* Provider Branding Header */}
            <div className="mb-8 flex flex-col justify-between gap-4 border-b border-zinc-200 pb-6 md:flex-row md:items-center">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900">
                        Elena Rodriguez, LMT
                    </h1>
                    <p className="mt-1 flex items-center gap-1 text-sm text-zinc-600">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="h-4 w-4 text-emerald-600"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                            />
                        </svg>
                        420 Wellness Way, Suite 102, San Francisco, CA
                    </p>
                </div>
                <div className="flex items-center gap-2 self-start md:self-center">
                    <span className="flex items-center gap-1 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
                        ★ 4.9 (124 Reviews)
                    </span>
                    <span className="rounded-full border border-zinc-200 bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-800">
                        Top Rated
                    </span>
                </div>
            </div>

            {/* Primary Workspace Split */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                {/* Left Interactive Configuration Block */}
                <div className="space-y-8 lg:col-span-8">
                    {/* Step 1: Services Selection */}
                    <section>
                        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-zinc-900">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-900 font-mono text-xs text-white">
                                1
                            </span>
                            Select Therapeutic Service
                        </h2>
                        <div className="space-y-3">
                            {SERVICES.map((service) => {
                                const isSelected =
                                    selectedService?.id === service.id;
                                return (
                                    <div
                                        key={service.id}
                                        onClick={() =>
                                            handleServiceSelect(service)
                                        }
                                        className={`flex cursor-pointer flex-col justify-between gap-4 rounded-xl border bg-white p-4 transition-all sm:flex-row sm:items-center ${
                                            isSelected
                                                ? 'border-emerald-600 bg-emerald-50/10 ring-2 ring-emerald-600/10'
                                                : 'border-zinc-200 hover:border-zinc-300 hover:shadow-sm'
                                        }`}
                                    >
                                        <div className="flex-1">
                                            <h3 className="flex items-center gap-2 text-base font-semibold text-zinc-900">
                                                {service.name}
                                                {isSelected && (
                                                    <span className="rounded border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-600">
                                                        Selected
                                                    </span>
                                                )}
                                            </h3>
                                            <p className="mt-0.5 text-sm text-zinc-600">
                                                {service.description}
                                            </p>
                                            <div className="mt-2 text-xs font-medium text-zinc-500">
                                                {service.duration} mins • $
                                                {service.price}
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            className={`self-start rounded-lg border px-5 py-2 text-sm font-medium transition-all sm:self-center ${
                                                isSelected
                                                    ? 'border-emerald-600 bg-emerald-600 text-white'
                                                    : 'border-zinc-300 text-zinc-700 hover:bg-zinc-50'
                                            }`}
                                        >
                                            {isSelected ? 'Selected' : 'Select'}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* Step 2: Date Selector (Horizontal Timeline) */}
                    <section>
                        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-zinc-900">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-900 font-mono text-xs text-white">
                                2
                            </span>
                            Choose Appointment Date
                        </h2>
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                            {upcomingDays.map((day) => {
                                const isSelected = selectedDate?.id === day.id;
                                return (
                                    <button
                                        key={day.id}
                                        onClick={() => {
                                            setSelectedDate(day);
                                            setSelectedTime(null);
                                        }}
                                        className={`rounded-xl border p-3 text-center transition-all ${
                                            isSelected
                                                ? 'border-emerald-600 bg-emerald-50 font-semibold text-emerald-900 shadow-sm'
                                                : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50'
                                        }`}
                                    >
                                        <span className="mb-1 block text-xs font-medium tracking-wider text-zinc-400 uppercase">
                                            Available
                                        </span>
                                        <span className="text-sm">
                                            {day.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </section>

                    {/* Step 3: Time Slot Grid */}
                    <section>
                        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-zinc-900">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-900 font-mono text-xs text-white">
                                3
                            </span>
                            Select Time Window
                        </h2>

                        {!selectedDate ? (
                            <div className="rounded-xl border-2 border-dashed border-zinc-200 bg-zinc-50 p-6 text-center text-sm text-zinc-400">
                                Please unlock hours by selecting a target date
                                first.
                            </div>
                        ) : (
                            <div className="grid animate-in grid-cols-2 gap-2 duration-200 fade-in sm:grid-cols-5">
                                {TIME_SLOTS.map((time) => {
                                    const isSelected = selectedTime === time;
                                    return (
                                        <button
                                            key={time}
                                            onClick={() =>
                                                setSelectedTime(time)
                                            }
                                            className={`rounded-xl border py-3 text-sm font-medium transition-all ${
                                                isSelected
                                                    ? 'border-emerald-600 bg-emerald-600 text-white shadow-md'
                                                    : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50'
                                            }`}
                                        >
                                            {time}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </section>
                </div>

                {/* Right Sticky Summary Sidebar */}
                <div className="relative lg:col-span-4">
                    <div className="space-y-4 lg:sticky lg:top-8">
                        {/* Summary Panel */}
                        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-lg">
                            <h3 className="mb-4 text-base font-bold text-zinc-900">
                                Book Appointment
                            </h3>

                            {selectedService ? (
                                <div className="animate-in space-y-4 duration-300 fade-in">
                                    <div className="flex items-start justify-between border-b border-zinc-100 pb-4">
                                        <div>
                                            <p className="text-sm font-semibold text-emerald-700">
                                                {selectedService.name}
                                            </p>
                                            <p className="mt-0.5 text-xs text-zinc-500">
                                                {selectedService.duration}{' '}
                                                Minute Session
                                            </p>
                                        </div>
                                        <p className="text-base font-bold text-zinc-900">
                                            ${selectedService.price}
                                        </p>
                                    </div>

                                    {/* Operational Status Verifiers */}
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3 rounded-xl border border-zinc-100 bg-zinc-50 p-3 text-xs text-zinc-700">
                                            <span className="text-base">
                                                📅
                                            </span>
                                            <div>
                                                <p className="font-medium text-zinc-900">
                                                    Target Date
                                                </p>
                                                <p className="mt-0.5 text-zinc-500">
                                                    {selectedDate
                                                        ? selectedDate.formatted
                                                        : 'Not selected yet'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 rounded-xl border border-zinc-100 bg-zinc-50 p-3 text-xs text-zinc-700">
                                            <span className="text-base">
                                                ⏰
                                            </span>
                                            <div>
                                                <p className="font-medium text-zinc-900">
                                                    Reserved Frame
                                                </p>
                                                <p className="mt-0.5 text-zinc-500">
                                                    {selectedTime
                                                        ? selectedTime
                                                        : 'Not selected yet'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-2 py-8 text-center text-sm text-zinc-400">
                                    <span className="block text-3xl">📋</span>
                                    <p className="px-4">
                                        Select a therapeutic service to
                                        calculate itemized pricing and available
                                        checkout workflows.
                                    </p>
                                </div>
                            )}

                            {/* Action Confirmation Triggers */}
                            <button
                                type="button"
                                onClick={handleBookAppointment}
                                disabled={
                                    !selectedService ||
                                    !selectedDate ||
                                    !selectedTime
                                }
                                className={`mt-6 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                                    selectedService &&
                                    selectedDate &&
                                    selectedTime
                                        ? 'bg-zinc-900 text-white shadow-md hover:bg-zinc-800 active:scale-[0.98]'
                                        : 'cursor-not-allowed bg-zinc-100 text-zinc-400 opacity-60'
                                }`}
                            >
                                Book Appointment
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2}
                                    stroke="currentColor"
                                    className="h-4 w-4"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                                    />
                                </svg>
                            </button>

                            <p className="mt-3 text-center text-xs text-zinc-400">
                                You won't be charged yet
                            </p>
                        </div>

                        {/* Quality Guarantees */}
                        <div className="flex items-start gap-3 rounded-xl border border-emerald-600/10 bg-emerald-50/40 p-4">
                            <span className="mt-0.5 text-base text-emerald-700">
                                🛡️
                            </span>
                            <div>
                                <p className="text-xs font-semibold text-emerald-800">
                                    WellSpot Guarantee
                                </p>
                                <p className="mt-0.5 text-xs leading-relaxed text-zinc-600">
                                    Free, zero-penalty cancellations up to 24
                                    hours prior to your configured treatment
                                    time.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
