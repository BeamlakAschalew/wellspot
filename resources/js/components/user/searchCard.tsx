import React from 'react';

// Define the type interface for the card properties
interface SearchCardProps {
    name: string;
    location: string;
    rating: number;
    imageUrl: string;
    imageAlt?: string;
    onViewDetails?: () => void;
}

export default function SearchCard({
    name,
    location,
    rating,
    imageUrl,
    imageAlt = 'Spa and wellness facility treatment room',
    onViewDetails,
}: SearchCardProps) {
    return (
        <div className="group w-full max-w-sm overflow-hidden rounded-xl border border-zinc-200 bg-white transition-all duration-300 hover:border-zinc-800 hover:shadow-lg">
            {/* Card Media Header Frame */}
            <div className="relative h-48 overflow-hidden bg-zinc-100">
                <img
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    src={imageUrl}
                    alt={imageAlt}
                />

                {/* Dynamic Badge Overlays */}
                <div className="absolute top-3 right-3 flex items-center gap-1 rounded-lg border border-zinc-200/20 bg-white/90 px-2.5 py-1 shadow-sm backdrop-blur-md">
                    <span className="text-xs leading-none text-amber-500">
                        ★
                    </span>
                    <span className="text-xs leading-none font-bold text-zinc-800">
                        {rating.toFixed(1)}
                    </span>
                </div>
            </div>

            {/* Card Content & Operations Block */}
            <div className="space-y-4 p-4">
                <div>
                    <h3 className="truncate text-lg font-bold tracking-tight text-zinc-900">
                        {name}
                    </h3>
                    <div className="mt-1 flex items-center gap-1.5 text-zinc-500">
                        {/* Location pin indicator */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.8}
                            stroke="currentColor"
                            className="h-4 w-4 text-zinc-400"
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
                        <span className="text-xs font-medium">{location}</span>
                    </div>
                </div>

                {/* Dynamic CTA button that maps to parent routing handlers */}
                <button
                    onClick={onViewDetails}
                    type="button"
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 text-xs font-semibold text-zinc-800 transition-all group-hover:border-zinc-900 group-hover:bg-zinc-900 group-hover:text-white active:scale-[0.98]"
                >
                    View Details
                </button>
            </div>
        </div>
    );
}
