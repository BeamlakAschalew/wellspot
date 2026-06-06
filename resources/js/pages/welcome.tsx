import { Head } from '@inertiajs/react';
import { Footer } from '@/components/user/footer';
import { Header } from '@/components/user/header';
import type {
    HomeCategory,
    HomeFilters,
    HomeProvider,
} from '@/components/user/main-content';
import { MainContent } from '@/components/user/main-content';
import { useTranslation } from '@/lib/i18n';

type WelcomeProps = {
    filters: HomeFilters;
    categories: HomeCategory[];
    providers: HomeProvider[];
    topRatedProviders: HomeProvider[];
};

export default function Welcome({
    filters,
    categories,
    providers,
    topRatedProviders,
}: WelcomeProps) {
    const { t } = useTranslation();

    return (
        <>
            <Head title={t('home.metaTitle')}>
                <link href="https://fonts.googleapis.com" rel="preconnect" />
                <link
                    crossOrigin="anonymous"
                    href="https://fonts.gstatic.com"
                    rel="preconnect"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap"
                    rel="stylesheet"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
                    rel="stylesheet"
                />
            </Head>

            <div className="wellspot-home min-h-screen scroll-smooth bg-background text-on-surface selection:bg-primary-fixed selection:text-on-primary-fixed">
                <Header />
                <MainContent
                    categories={categories}
                    filters={filters}
                    providers={providers}
                    topRatedProviders={topRatedProviders}
                />
                <Footer />
            </div>
        </>
    );
}
