import React from 'react';
import { Header } from '@/components/user/header';
import WellSpotFooter from '@/components/user/footerSmall';
import ResponseCard from '@/components/quiz/response';

const response = () => {
    return (
        <div>
            <Header />
            <ResponseCard />
            <WellSpotFooter />
        </div>
    );
};

export default response;
