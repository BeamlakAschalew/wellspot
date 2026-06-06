import React from 'react';
import SearchCard from '@/components/user/searchCard';
import { Header } from '@/components/user/header';
import WellSpotFooter from '@/components/user/footerSmall';

const searchResult = () => {
    const info = {
        name: 'Serenity Spa & Wellness',
        location: '123 Tranquil Lane, Blissville',
        rating: 4.8,
        imageUrl:
            'https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3BhJTIwYW5kJTIwd2VsbG5lc3N8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60',
    };
    return (
        <div>
            <Header />
            <SearchCard
                name={info.name}
                location={info.location}
                rating={info.rating}
                imageUrl={info.imageUrl}
            />
            <WellSpotFooter />
        </div>
    );
};

export default searchResult;
