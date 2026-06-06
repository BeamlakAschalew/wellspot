import { Header } from '@/components/user/header';
import { Footer } from '@/components/user/footer';
import ProviderDetails from '@/components/user/provider-details';
import { Head, usePage } from '@inertiajs/react';
import type { Auth } from '@/types';

import React from 'react';

const details = () => {
    return (
        <div>
            <Header />
            <ProviderDetails />
            <Footer />
        </div>
    );
};

export default details;
