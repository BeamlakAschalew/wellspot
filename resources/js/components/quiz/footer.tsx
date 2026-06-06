const mobileItems = [
    { icon: 'explore', label: 'Explore' },
    { icon: 'psychology_alt', label: 'Quizzes', isActive: true },
    { icon: 'show_chart', label: 'Tracking' },
    { icon: 'person', label: 'Profile' },
];

const footerLinks = ['About', 'Privacy Policy', 'Terms of Service', 'Contact'];

function MaterialIcon({
    children,
    filled = false,
}: {
    children: string;
    filled?: boolean;
}) {
    return (
        <span
            className="material-symbols-outlined"
            style={filled ? { fontVariationSettings: "'FILL' 1" } : undefined}
        >
            {children}
        </span>
    );
}

export function QuizFooter() {
    return (
        <>
            <nav className="fixed bottom-0 left-0 z-50 flex h-16 w-full items-center justify-around border-t border-outline-variant/20 bg-surface/95 px-4 shadow-lg backdrop-blur-lg md:hidden">
                {mobileItems.map((item) => (
                    <a
                        className={
                            item.isActive
                                ? 'flex flex-col items-center justify-center rounded-full bg-primary-fixed/20 px-4 py-1 text-primary'
                                : 'flex flex-col items-center justify-center text-on-surface-variant'
                        }
                        href="#"
                        key={item.label}
                    >
                        <MaterialIcon filled={item.isActive}>
                            {item.icon}
                        </MaterialIcon>
                        <span className="font-label-sm text-label-sm">
                            {item.label}
                        </span>
                    </a>
                ))}
            </nav>

            <footer className="mt-auto w-full border-t border-outline-variant/30 bg-surface-container-lowest py-xl">
                <div className="mx-auto flex max-w-container-max flex-col items-center justify-between gap-md px-lg md:flex-row">
                    <span className="font-headline-sm text-headline-sm font-bold text-primary">
                        WellSpot
                    </span>
                    <div className="flex flex-wrap justify-center gap-lg">
                        {footerLinks.map((link) => (
                            <a
                                className="font-body-sm text-body-sm text-on-surface-variant transition-all hover:text-primary hover:underline"
                                href="#"
                                key={link}
                            >
                                {link}
                            </a>
                        ))}
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                        &copy; 2024 WellSpot Marketplace. All rights wellness.
                    </p>
                </div>
            </footer>
        </>
    );
}
