import { Footer } from '@/components/user/footer';
import { Header } from '@/components/user/header';
import ProviderDetails, {
    type ProviderDetailData,
} from '@/components/user/provider-details';
import { Head } from '@inertiajs/react';

type DetailsProps = {
    provider: ProviderDetailData;
    googleMapsApiKey: string | null;
};

export default function Details({ provider, googleMapsApiKey }: DetailsProps) {
    return (
        <>
            <Head title={`${provider.name} | WellSpot`}>
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
            <div className="wellspot-home min-h-screen bg-background text-on-surface">
                <Header />
                <ProviderDetails
                    googleMapsApiKey={googleMapsApiKey}
                    provider={provider}
                />
                <Footer />
            </div>
        </>
    );
}
