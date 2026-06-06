import { Head } from '@inertiajs/react';
import { QuizMainContent } from '@/components/quiz/main-content';
import WellSpotFooter from '@/components/user/footerSmall';
import { Header } from '@/components/user/header';
import { useTranslation } from '@/lib/i18n';
export default function Quiz() {
    const { t } = useTranslation();

    return (
        <>
            <Head title={t('quiz.metaTitle')}>
                <link href="https://fonts.googleapis.com" rel="preconnect" />
                <link
                    crossOrigin="anonymous"
                    href="https://fonts.gstatic.com"
                    rel="preconnect"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Geist:wght@400;500;600;700&display=swap"
                    rel="stylesheet"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
                    rel="stylesheet"
                />
            </Head>

            <div className="wellspot-quiz flex min-h-screen flex-col bg-background font-body-md text-on-background">
                <Header />
                <QuizMainContent />
                <WellSpotFooter />
            </div>
        </>
    );
}
