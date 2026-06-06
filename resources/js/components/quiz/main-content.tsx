import { useState } from 'react';
import sleepImage from '@/assets/quiz/image-02.jpg';

const options = [
    {
        icon: 'brightness_5',
        title: 'Excellent',
        description: '8+ hours of restful, uninterrupted sleep.',
    },
    {
        icon: 'wb_sunny',
        title: 'Good',
        description: '6-8 hours with minimal waking.',
    },
    {
        icon: 'cloud',
        title: 'Fair',
        description: '4-6 hours or frequent disturbances.',
    },
    {
        icon: 'bedtime',
        title: 'Poor',
        description: 'Less than 4 hours or extremely restless.',
    },
];

function MaterialIcon({
    children,
    className = '',
}: {
    children: string;
    className?: string;
}) {
    return (
        <span className={`material-symbols-outlined ${className}`}>
            {children}
        </span>
    );
}

export function QuizMainContent() {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    return (
        <main className="flex flex-grow items-center justify-center px-margin-mobile pt-24 pb-24 md:pl-64">
            <div className="w-full max-w-2xl">
                <div className="quiz-card-transition overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container-lowest shadow-lg">
                    <div className="px-lg pt-lg pb-md">
                        <div className="mb-sm flex items-center justify-between">
                            <span className="font-label-sm text-label-sm tracking-wider text-outline uppercase">
                                Question 3 of 10
                            </span>
                            <span className="font-label-sm text-label-sm font-bold text-primary-container">
                                30% Complete
                            </span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-surface-container-high">
                            <div className="h-full w-[30%] bg-primary-container transition-all duration-700 ease-out" />
                        </div>
                    </div>

                    <div className="relative h-48 w-full overflow-hidden">
                        <img
                            alt="A serene bedroom at dusk with soft ambient lighting and plush bedding."
                            className="h-full w-full object-cover"
                            src={sleepImage}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest to-transparent opacity-60" />
                    </div>

                    <div className="px-lg pb-lg">
                        <div className="mt-lg mb-xl text-center">
                            <h1 className="mb-md font-headline-lg text-headline-lg text-primary">
                                How would you rate your sleep quality over the
                                last week?
                            </h1>
                            <p className="font-body-md text-body-md text-on-surface-variant">
                                Select the option that best describes your
                                typical nightly rest.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-md md:grid-cols-2">
                            {options.map((option) => {
                                const isSelected =
                                    selectedOption === option.title;

                                return (
                                    <button
                                        className={`option-card group flex items-start gap-md rounded-xl border p-lg text-left transition-all ${
                                            isSelected
                                                ? 'selected border-primary-container bg-primary-fixed/20'
                                                : 'border-outline-variant/50 bg-surface-container-low hover:border-primary-container'
                                        }`}
                                        key={option.title}
                                        onClick={() =>
                                            setSelectedOption(option.title)
                                        }
                                        type="button"
                                    >
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-container-highest transition-colors group-hover:bg-primary-fixed">
                                            <MaterialIcon className="text-primary">
                                                {option.icon}
                                            </MaterialIcon>
                                        </div>
                                        <div>
                                            <h2 className="mb-xs font-label-md text-label-md font-bold text-on-surface">
                                                {option.title}
                                            </h2>
                                            <p className="font-label-sm text-label-sm text-outline">
                                                {option.description}
                                            </p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-outline-variant/30 bg-surface-container-low px-lg py-md">
                        <button
                            className="flex items-center gap-xs rounded-lg px-md py-sm font-label-md text-label-md text-on-surface-variant transition-colors hover:bg-surface-container-high active:scale-95"
                            type="button"
                        >
                            <MaterialIcon className="text-[18px]">
                                arrow_back
                            </MaterialIcon>
                            Previous
                        </button>
                        <button
                            className="flex items-center gap-xs rounded-xl bg-primary-container px-xl py-md font-label-md text-label-md text-on-primary shadow-sm transition-all hover:brightness-110 active:scale-95"
                            type="button"
                        >
                            Next
                            <MaterialIcon className="text-[18px]">
                                arrow_forward
                            </MaterialIcon>
                        </button>
                    </div>
                </div>

                <div className="mt-lg flex justify-center gap-xl text-outline">
                    <div className="flex items-center gap-xs text-label-sm">
                        <MaterialIcon className="text-[16px]">
                            lock
                        </MaterialIcon>
                        Your data is secure
                    </div>
                    <div className="flex items-center gap-xs text-label-sm">
                        <MaterialIcon className="text-[16px]">
                            history
                        </MaterialIcon>
                        Takes ~5 minutes
                    </div>
                </div>
            </div>
        </main>
    );
}
