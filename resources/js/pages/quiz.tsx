import { Head } from '@inertiajs/react';
import { QuizFooter } from '@/components/quiz/footer';
import { QuizHeader } from '@/components/quiz/header';
import { QuizMainContent } from '@/components/quiz/main-content';
import { QuizSidebar } from '@/components/quiz/sidebar';

export default function Quiz() {
    return (
        <>
            <Head title="AI Wellness Quiz - WellSpot">
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
                <QuizHeader />
                <QuizSidebar />
                <QuizMainContent />
                <QuizFooter />
            </div>
        </>
    );
}
