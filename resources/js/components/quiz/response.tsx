import React, { useState } from 'react';

// Quiz Configuration Types
interface QuizQuestion {
    id: string;
    question: string;
    options: { label: string; scoreValue: number; category: string }[];
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
    {
        id: 'sleep',
        question:
            'How would you rate your sleep quality over the last 48 hours?',
        options: [
            {
                label: 'Deep, restful, and uninterrupted (7-9 hours)',
                scoreValue: 35,
                category: 'Therapy',
            },
            {
                label: 'Tossing and turning, but got decent hours',
                scoreValue: 20,
                category: 'Vinyasa Flow',
            },
            {
                label: 'Exhausted, restless, or less than 5 hours',
                scoreValue: 5,
                category: 'Massage',
            },
        ],
    },
    {
        id: 'activity',
        question:
            'What has your physical activity or mobility looked like today?',
        options: [
            {
                label: 'Active movement / dedicated workout completed',
                scoreValue: 35,
                category: 'Vinyasa Flow',
            },
            {
                label: 'Mostly sedentary, but did some stretching/walking',
                scoreValue: 25,
                category: 'Massage',
            },
            {
                label: 'Stiff and desk-bound all day',
                scoreValue: 10,
                category: 'Massage',
            },
        ],
    },
    {
        id: 'stress',
        question: 'Where are your mental stress levels sitting right now?',
        options: [
            {
                label: 'Calm, focused, and centered',
                scoreValue: 30,
                category: 'Vinyasa Flow',
            },
            {
                label: 'Mild tension / typical busy day stress',
                scoreValue: 20,
                category: 'Therapy',
            },
            {
                label: 'Highly overwhelmed or experiencing muscle knots',
                scoreValue: 5,
                category: 'Massage',
            },
        ],
    },
];

const PROVIDERS_MAP = {
    'Vinyasa Flow': {
        name: 'Marcus Chen',
        bio: 'Expert in mobility and breathwork.',
        rating: '4.9',
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFPVRirobPzT7iLDvvnPQ_dXNQ4-dEKZ-FxRsh7R7-eWE_H17fmHSLHcg-NtuRH6dE3e1uQM_yVS_ufEsYEfyY-NiRvst1PY1KCcaycN5Aaauyp55Wso5amre0OLqUegfpgl-ZMaaldzR7pZ3lG6gMpBSy6oUur0ghVhxCi-_AsjSA-cmyL2RqC4QYzOi_2PK8Yjp1y0HO9s9s0miNknPpJ0FLrl032S1t7Q0y0MnX67Jk0frK4jtpxKNrXZoXpV2O2k5Rk3gKuTQ',
    },
    Therapy: {
        name: 'Aria Sullivan',
        bio: 'Specializing in trauma-informed care.',
        rating: '5.0',
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCM7iXF8jygQuLSKdo8e612V0N_308NUjqE5C9JtiluUX-eDrElbupuw7osvfLH-bQ0FY1-Tj4d1riqsSdSVRXER2vlntLS1jzmYvTn_Hq_Gz7MSvYApNVLYYpbN6kgyhtJFoFnJRRU0BpiURYpx2OoRLULJx5uUG6zp8X7vMvLcITHkosDhLAJuEwXJ6QcnLHiJ02uORxTAhw8sNZr5IyrBiupUJv-YX4pQGSiH-QptgY7liKOa-MdUzqKY7b20SwUVkP1q4NruDU',
    },
    Massage: {
        name: 'Elena R.',
        bio: 'Your favorite for recovery sessions.',
        rating: '4.8',
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAI1ffZPqoMAmmDtG36hZaxYEJyBKPju_Lv8uzVkCRT5h5lp8lZoTVn3WKLiGY6_ky26jEDswM0Pod_gqBAm3SaswhPO6gZP2hp7YD4c1-nSI8rc9OjkRijGrTist-gpPcW1CvSx5ESK58KscG-tC7a2jlukVu9Vc45eupveSRn_AAgayDY6Yr0l5yLYY1jvi9jS4g30EvNg--Y-mOeiWToB9z2j0gelCf-B1CaQPOD0Fw5R3VUa9ym4ge3AhmPfbl6SKWAS9mohO0',
    },
};

export default function WellnessQuizWidget() {
    const [currentStep, setCurrentStep] = useState(0);
    const [runningScore, setRunningScore] = useState(0);
    const [categoryCounts, setCategoryCounts] = useState<
        Record<string, number>
    >({});
    const [quizCompleted, setQuizCompleted] = useState(false);

    const handleAnswerSelect = (scoreValue: number, category: string) => {
        const updatedScore = runningScore + scoreValue;
        const updatedCounts = {
            ...categoryCounts,
            [category]: (categoryCounts[category] || 0) + 1,
        };

        setRunningScore(updatedScore);
        setCategoryCounts(updatedCounts);

        if (currentStep + 1 < QUIZ_QUESTIONS.length) {
            setCurrentStep(currentStep + 1);
        } else {
            setQuizCompleted(true);
        }
    };

    const handleRestart = () => {
        setCurrentStep(0);
        setRunningScore(0);
        setCategoryCounts({});
        setQuizCompleted(false);
    };

    // Determine top category recommendation
    const getRecommendedCategory = () => {
        return Object.keys(categoryCounts).reduce(
            (a, b) => (categoryCounts[a] > categoryCounts[b] ? a : b),
            'Massage',
        );
    };

    // SVG Circumference Logic
    const maxCircumference = 440;
    const dashOffset =
        maxCircumference - (maxCircumference * runningScore) / 100;

    return (
        <main className="mx-auto max-w-4xl p-4 pb-24 md:p-6">
            <div className="grid grid-cols-1 gap-6 overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm lg:grid-cols-12">
                {/* Dynamic Left Column: Changes between live progress or live result scorecard */}
                <div className="relative flex flex-col items-center justify-center rounded-xl border border-zinc-100 bg-zinc-50 p-4 text-center lg:col-span-5">
                    <h3 className="mb-4 text-sm font-bold tracking-tight text-zinc-800">
                        {quizCompleted
                            ? 'Your New Wellness Score'
                            : 'Assessment Score'}
                    </h3>

                    <div className="relative flex h-40 w-40 items-center justify-center">
                        <svg className="h-full w-full -rotate-90 transform">
                            <circle
                                className="text-zinc-200"
                                cx="80"
                                cy="80"
                                fill="transparent"
                                r="70"
                                stroke="currentColor"
                                strokeWidth="8"
                            />
                            <circle
                                className="transition-all骨 text-emerald-700 duration-500 ease-out"
                                cx="80"
                                cy="80"
                                fill="transparent"
                                r="70"
                                stroke="currentColor"
                                strokeWidth="8"
                                strokeDasharray={maxCircumference}
                                strokeDashoffset={
                                    quizCompleted
                                        ? dashOffset
                                        : maxCircumference
                                }
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-4xl font-extrabold tracking-tight text-zinc-900">
                                {quizCompleted ? runningScore : '--'}
                            </span>
                            <span className="mt-0.5 text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                                {quizCompleted
                                    ? runningScore >= 75
                                        ? 'Optimal'
                                        : 'Needs Care'
                                    : 'Pending'}
                            </span>
                        </div>
                    </div>

                    <p className="mt-4 max-w-[220px] text-xs leading-relaxed text-zinc-500">
                        {quizCompleted
                            ? 'Score calculated from your current indicators. See your tailored recovery action on the right.'
                            : 'Complete the questions to update your live marketplace dashboard indexing.'}
                    </p>
                </div>

                <div className="flex flex-col justify-center p-2 lg:col-span-7">
                    {!quizCompleted ? (
                        <div className="space-y-6">
                            <div>
                                <span className="mb-1 block text-[10px] font-bold tracking-wider text-emerald-700 uppercase">
                                    Question {currentStep + 1} of{' '}
                                    {QUIZ_QUESTIONS.length}
                                </span>
                                <h2 className="text-xl leading-snug font-bold tracking-tight text-zinc-900">
                                    {QUIZ_QUESTIONS[currentStep].question}
                                </h2>
                            </div>

                            <div className="space-y-2">
                                {QUIZ_QUESTIONS[currentStep].options.map(
                                    (option, index) => (
                                        <button
                                            key={index}
                                            onClick={() =>
                                                handleAnswerSelect(
                                                    option.scoreValue,
                                                    option.category,
                                                )
                                            }
                                            className="w-full rounded-xl border border-zinc-200 bg-white p-4 text-left text-sm font-medium text-zinc-800 transition-all hover:border-zinc-900 hover:bg-zinc-50/50 active:scale-[0.99]"
                                        >
                                            {option.label}
                                        </button>
                                    ),
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="animate-in space-y-4 duration-300 zoom-in-95 fade-in">
                            <div>
                                <span className="mb-0.5 block text-[10px] font-bold tracking-wider text-emerald-700 uppercase">
                                    Top Recommended Match
                                </span>
                                <h2 className="text-xl font-bold text-zinc-900">
                                    Recommended for Your Recovery
                                </h2>
                            </div>

                            {(() => {
                                const recommendedCategory =
                                    getRecommendedCategory();
                                const provider =
                                    PROVIDERS_MAP[
                                        recommendedCategory as keyof typeof PROVIDERS_MAP
                                    ];

                                return (
                                    <div className="flex flex-col items-stretch overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 shadow-sm sm:flex-row">
                                        <div className="relative h-32 w-full bg-zinc-100 sm:h-auto sm:w-1/3">
                                            <img
                                                className="h-full w-full object-cover"
                                                src={provider.img}
                                                alt={provider.name}
                                            />
                                            <div className="absolute top-2 right-2 flex items-center gap-0.5 rounded-md bg-white/90 px-2 py-0.5 text-[11px] font-bold shadow-sm backdrop-blur-md">
                                                <span className="text-amber-500">
                                                    ★
                                                </span>
                                                <span>{provider.rating}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col justify-between p-4 sm:w-2/3">
                                            <div>
                                                <span className="mb-1.5 inline-block rounded border border-emerald-200/50 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                                                    {recommendedCategory}
                                                </span>
                                                <h4 className="text-base font-bold text-zinc-900">
                                                    {provider.name}
                                                </h4>
                                                <p className="mt-0.5 text-xs leading-relaxed text-zinc-500">
                                                    {provider.bio}
                                                </p>
                                            </div>

                                            <div className="mt-4 flex gap-2">
                                                <button className="flex-1 rounded-lg bg-zinc-900 py-2 text-xs font-semibold text-white transition-colors hover:bg-zinc-800">
                                                    Book Session
                                                </button>
                                                <button
                                                    onClick={handleRestart}
                                                    className="rounded-lg border border-zinc-300 px-3 py-2 text-xs font-semibold text-zinc-700 transition-colors hover:bg-zinc-100"
                                                >
                                                    Retry
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
