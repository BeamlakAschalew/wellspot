import { home } from '@/routes';

const navItems = [
    { href: `${home.url()}#discover`, label: 'Discover', isActive: true },
    { href: `${home.url()}#how-it-works`, label: 'How it Works' },
    { href: `${home.url()}#providers`, label: 'For Providers' },
];

export function Header() {
    return (
        <nav className="fixed top-0 z-50 w-full border-b border-outline-variant/30 bg-surface/80 shadow-sm backdrop-blur-md dark:bg-surface/80">
            <div className="mx-auto flex h-16 max-w-container-max items-center justify-between px-margin-mobile md:px-lg">
                <a
                    className="font-headline-md text-headline-md tracking-tight text-primary"
                    href={home.url()}
                >
                    WellSpot
                </a>

                <div className="hidden items-center gap-xl md:flex">
                    {navItems.map((item) => (
                        <a
                            className={
                                item.isActive
                                    ? 'border-b-2 border-primary font-label-md text-label-md font-bold text-primary transition-colors hover:text-primary'
                                    : 'font-label-md text-label-md text-on-surface-variant transition-colors hover:text-primary'
                            }
                            href={item.href}
                            key={item.label}
                        >
                            {item.label}
                        </a>
                    ))}
                </div>
            </div>
        </nav>
    );
}
