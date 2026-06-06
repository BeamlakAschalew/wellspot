import { Link } from '@inertiajs/react';
import profileImage from '@/assets/quiz/image-01.jpg';
import { home } from '@/routes';

const navItems = [
    { href: '#discover', label: 'Discover' },
    { href: '#schedule', label: 'Schedule', isActive: true },
    { href: '#insights', label: 'Insights' },
];

function MaterialIcon({ children }: { children: string }) {
    return <span className="material-symbols-outlined">{children}</span>;
}

export function QuizHeader() {
    return (
        <header className="fixed top-0 z-50 w-full border-b border-outline-variant/30 bg-surface/80 shadow-sm backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-container-max items-center justify-between px-margin-mobile md:px-lg">
                <div className="flex items-center gap-md">
                    <Link
                        className="font-headline-sm text-headline-sm font-bold text-primary-container"
                        href={home()}
                    >
                        WellSpot
                    </Link>
                    <nav className="ml-lg hidden gap-md md:flex">
                        {navItems.map((item) => (
                            <a
                                className={
                                    item.isActive
                                        ? 'border-b-2 border-primary pb-1 font-label-md text-label-md text-primary'
                                        : 'font-label-md text-label-md text-on-surface-variant transition-colors hover:text-primary'
                                }
                                href={item.href}
                                key={item.label}
                            >
                                {item.label}
                            </a>
                        ))}
                    </nav>
                </div>

                <div className="flex items-center gap-sm">
                    {['notifications', 'person_search'].map((icon) => (
                        <button
                            className="rounded-lg p-2 transition-all hover:bg-surface-container-low active:scale-95"
                            key={icon}
                            type="button"
                        >
                            <MaterialIcon>{icon}</MaterialIcon>
                        </button>
                    ))}
                    <div className="ml-sm h-8 w-8 overflow-hidden rounded-full bg-surface-container-highest">
                        <img
                            alt="User profile avatar"
                            className="h-full w-full object-cover"
                            src={profileImage}
                        />
                    </div>
                </div>
            </div>
        </header>
    );
}
