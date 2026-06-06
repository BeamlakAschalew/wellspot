import { Head } from '@inertiajs/react';
import { Footer } from '@/components/user/footer';
import { Header } from '@/components/user/header';
import { MainContent } from '@/components/user/main-content';

export default function Welcome() {
    return (
        <>
            <Head title="WellSpot | Find Your Balance">
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
                <MainContent />
                <Footer />
            </div>
        </>
    );
}
