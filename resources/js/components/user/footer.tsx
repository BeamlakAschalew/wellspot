import type { TranslationKey } from '@/lib/i18n';
import { useTranslation } from '@/lib/i18n';

const footerGroups = [
    {
        title: 'footer.services',
        links: [
            'service.massage',
            'service.yoga',
            'service.therapy',
            'service.spa',
        ],
    },
    {
        title: 'footer.company',
        links: ['footer.about', 'footer.privacy', 'footer.contact'],
    },
] satisfies {
    title: TranslationKey;
    links: TranslationKey[];
}[];

function MaterialIcon({ children }: { children: string }) {
    return (
        <span className="material-symbols-outlined text-[20px]">
            {children}
        </span>
    );
}

export function Footer() {
    const { t } = useTranslation();

    return (
        <footer className="bg-surface-container py-xl dark:bg-inverse-surface">
            <div className="mx-auto grid max-w-container-max grid-cols-2 gap-gutter px-margin-mobile py-xl text-on-surface md:grid-cols-4 md:px-lg dark:text-inverse-on-surface">
                <div className="col-span-2 md:col-span-1">
                    <div className="mb-md font-headline-sm text-headline-sm text-primary dark:text-primary-fixed-dim">
                        {t('app.title')}
                    </div>
                    <p className="max-w-xs font-body-sm text-body-sm text-on-surface-variant dark:text-outline-variant">
                        {t('footer.tagline')}
                    </p>
                </div>

                {footerGroups.map((group) => (
                    <div key={group.title}>
                        <h5 className="mb-md font-label-md text-label-md tracking-wider text-primary uppercase dark:text-primary-fixed-dim">
                            {t(group.title)}
                        </h5>
                        <ul className="space-y-sm">
                            {group.links.map((link) => (
                                <li key={link}>
                                    <a
                                        className="font-body-sm text-body-sm text-on-surface-variant transition-all hover:text-primary dark:text-outline-variant"
                                        href="#"
                                    >
                                        {t(link)}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}

                <div>
                    <h5 className="mb-md font-label-md text-label-md tracking-wider text-primary uppercase dark:text-primary-fixed-dim">
                        {t('footer.follow')}
                    </h5>
                    <div className="flex gap-md">
                        {['public', 'chat'].map((icon) => (
                            <a
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant/30 transition-colors hover:bg-primary-fixed"
                                href="#"
                                key={icon}
                            >
                                <MaterialIcon>{icon}</MaterialIcon>
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-container-max border-t border-outline-variant/20 px-margin-mobile pt-lg text-center md:px-lg md:text-left">
                <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-outline-variant">
                    {t('footer.rights')}
                </p>
            </div>
        </footer>
    );
}
