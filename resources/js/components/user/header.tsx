import { router } from '@inertiajs/react';
import { Languages } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { home } from '@/routes';
import { update as updateLocale } from '@/routes/locale';

export function Header() {
    const { locale, t } = useTranslation();
    const nextLocale = locale === 'am' ? 'en' : 'am';
    const switchLabel =
        nextLocale === 'am'
            ? t('nav.switchToAmharic')
            : t('nav.switchToEnglish');
    const navItems = [
        {
            href: `${home.url()}#discover`,
            label: t('nav.discover'),
            isActive: true,
        },
        { href: `${home.url()}#how-it-works`, label: t('nav.howItWorks') },
        { href: `${home.url()}#providers`, label: t('nav.forProviders') },
    ];

    return (
        <nav className="fixed top-0 z-50 w-full border-b border-outline-variant/30 bg-surface/80 shadow-sm backdrop-blur-md dark:bg-surface/80">
            <div className="mx-auto flex h-16 max-w-container-max items-center justify-between px-margin-mobile md:px-lg">
                <a
                    className="font-headline-md text-headline-md tracking-tight text-primary"
                    href={home.url()}
                >
                    {t('app.title')}
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

                <button
                    aria-label={switchLabel}
                    className="inline-flex h-10 min-w-10 items-center justify-center gap-xs rounded-full border border-outline-variant/40 px-sm font-label-sm text-label-sm text-on-surface-variant transition-colors hover:border-primary hover:text-primary active:scale-95"
                    onClick={() =>
                        router.post(
                            updateLocale.url(),
                            { locale: nextLocale },
                            {
                                preserveScroll: true,
                            },
                        )
                    }
                    title={switchLabel}
                    type="button"
                >
                    <Languages aria-hidden="true" className="h-4 w-4" />
                    <span>{nextLocale === 'am' ? 'አማ' : 'EN'}</span>
                </button>
            </div>
        </nav>
    );
}
