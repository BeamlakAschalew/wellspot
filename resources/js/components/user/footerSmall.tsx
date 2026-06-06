import React from 'react';

interface FooterLink {
    label: string;
    href: string;
}

interface WellSpotFooterProps {
    links?: FooterLink[];
    marketplaceName?: string;
}

const DEFAULT_LINKS: FooterLink[] = [
    { label: 'About', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Contact', href: '#' },
];

export default function WellSpotFooter({
    links = DEFAULT_LINKS,
    marketplaceName = 'WellSpot',
}: WellSpotFooterProps) {
    // Dynamically pull the current year instead of using hardcoded timestamps
    const currentYear = new Date().getFullYear();

    return (
        <footer className="mt-auto hidden w-full border-t border-zinc-200 bg-white py-6 md:block">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 md:flex-row">
                {/* Branding & Attribution Legal Flags */}
                <div className="flex items-center gap-4">
                    <span className="text-xl font-extrabold tracking-tight text-zinc-900">
                        {marketplaceName}
                    </span>
                    <span className="text-xs font-medium text-zinc-500">
                        © {currentYear} {marketplaceName} Marketplace. All
                        rights reserved.
                    </span>
                </div>

                {/* Dynamic Global Routing Elements */}
                <nav aria-label="Footer Navigation" className="flex gap-6">
                    {links.map((link, index) => (
                        <a
                            key={`${link.label}-${index}`}
                            href={link.href}
                            className="text-xs font-medium text-zinc-500 transition-all hover:text-zinc-900 hover:underline"
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>
            </div>
        </footer>
    );
}
