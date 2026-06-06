export const WELLNESS_RECOMMENDATION_STORAGE_KEY =
    'wellspot.wellness.recommendations';

export type WellnessAnswer = {
    question_key: string;
    question: string;
    value: string;
    label: string;
    category_slugs: string[];
    keywords: string[];
};

export type WellnessRecommendationService = {
    id: number;
    name: string;
    description: string | null;
    duration_minutes: number | null;
    price_amount: number | string | null;
    currency: string | null;
    category: {
        id: number;
        name: string;
        slug: string;
    } | null;
};

export type WellnessRecommendationProvider = {
    id: number;
    name: string;
    slug: string;
    logo_url: string | null;
    headline: string | null;
    description: string | null;
    category: {
        id: number;
        name: string;
        slug: string;
    } | null;
    address: string | null;
    neighborhood: string | null;
    latitude: string | null;
    longitude: string | null;
    distance: number | string | null;
    is_featured: boolean;
};

export type WellnessRecommendation = {
    score: number;
    reasons: string[];
    average_rating: number;
    active_services_count: number;
    display: {
        provider_name: string;
        place: string;
        category: string | null;
        services: string[];
        starting_price: string | null;
        distance: number | string | null;
    };
    provider: WellnessRecommendationProvider;
    services: WellnessRecommendationService[];
};

export type WellnessRecommendationResult = {
    feeling: string;
    answers: WellnessAnswer[];
    summary: string;
    recommendations: WellnessRecommendation[];
};
