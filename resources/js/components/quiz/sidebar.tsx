const navItems = [
    { icon: 'dashboard', label: 'Dashboard' },
    { icon: 'quiz', label: 'Wellness Quiz', isActive: true },
    { icon: 'event_available', label: 'Bookings' },
    { icon: 'analytics', label: 'Progress' },
    { icon: 'settings', label: 'Settings' },
];

function MaterialIcon({ children }: { children: string }) {
    return <span className="material-symbols-outlined">{children}</span>;
}

export function QuizSidebar() {
    return (
        <aside className="fixed top-0 left-0 z-40 hidden h-full w-64 flex-col border-r border-outline-variant/30 bg-surface-container-low pt-20 md:flex">
            <div className="flex flex-col gap-sm p-md">
                <div className="mb-lg flex items-center gap-md px-sm">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-fixed">
                        <MaterialIcon>psychology</MaterialIcon>
                    </div>
                    <div>
                        <h3 className="font-headline-sm text-[16px] leading-none font-bold text-primary-container">
                            WellSpot AI
                        </h3>
                        <p className="text-[12px] text-outline">
                            Ready for your check-in?
                        </p>
                    </div>
                </div>

                {navItems.map((item) => (
                    <a
                        className={
                            item.isActive
                                ? 'flex items-center gap-md rounded-xl bg-primary-container p-md font-bold text-on-primary-container transition-transform duration-200'
                                : 'flex items-center gap-md rounded-xl p-md text-on-surface-variant transition-transform duration-200 hover:translate-x-1 hover:bg-surface-container-high'
                        }
                        href="#"
                        key={item.label}
                    >
                        <MaterialIcon>{item.icon}</MaterialIcon>
                        <span className="font-label-md text-label-md">
                            {item.label}
                        </span>
                    </a>
                ))}

                <div className="mt-xl border-t border-outline-variant/30 pt-xl">
                    <button
                        className="w-full rounded-xl bg-primary-container py-md font-label-md text-label-md text-on-primary shadow-sm transition-all hover:brightness-110 active:scale-95"
                        type="button"
                    >
                        Book Session
                    </button>
                </div>
            </div>
        </aside>
    );
}
