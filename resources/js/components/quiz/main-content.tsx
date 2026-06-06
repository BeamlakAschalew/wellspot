import { router } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from '@/lib/i18n';
import { response as wellnessResponse } from '@/routes';

import {
    questions as wellnessQuestions,
    recommendations as wellnessRecommendations,
} from '@/routes/api/wellness';
import { WELLNESS_RECOMMENDATION_STORAGE_KEY } from '@/types/wellness';
import type {
    WellnessAnswer,
    WellnessRecommendationResult,
} from '@/types/wellness';

const optionIcons = [
    'self_improvement',
    'spa',
    'psychology',
    'favorite',
    'local_florist',
];

type AiOption = {
    value: string;
    label: string;
    category_slugs: string[];
    keywords: string[];
};

type AiQuestion = {
    key: string;
    label: string;
    options: AiOption[];
};

type QuestionsResponse = {
    feeling: string;
    opening_message: string;
    questions: AiQuestion[];
};

type RecommendationsResponse = {
    summary: string;
    recommendations: WellnessRecommendationResult['recommendations'];
};

function MaterialIcon({
    children,
    className = '',
}: {
    children: string;
    className?: string;
}) {
    return (
        <span className={`material-symbols-outlined ${className}`}>
            {children}
        </span>
    );
}

export function QuizMainContent() {
    const { t } = useTranslation();
    const [feeling, setFeeling] = useState('');
    const [aiQuestions, setAiQuestions] = useState<AiQuestion[]>([]);
    const [openingMessage, setOpeningMessage] = useState<string | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, WellnessAnswer>>({});
    const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
    const [isLoadingRecommendations, setIsLoadingRecommendations] =
        useState(false);
    const [error, setError] = useState<string | null>(null);

    const isFeelingStep = aiQuestions.length === 0;
    const currentQuestion = aiQuestions[currentQuestionIndex];
    const totalQuestions = aiQuestions.length > 0 ? aiQuestions.length + 1 : 1;
    const currentStep = isFeelingStep
        ? 1
        : Math.min(currentQuestionIndex + 2, totalQuestions);
    const progressPercentage = Math.round((currentStep / totalQuestions) * 100);
    const selectedAnswer = currentQuestion
        ? answers[currentQuestion.key]
        : undefined;
    const isProcessing = isLoadingQuestions || isLoadingRecommendations;
    const canGoNext = isFeelingStep
        ? feeling.trim().length >= 3 && !isProcessing
        : Boolean(selectedAnswer) && !isProcessing;
    const questionProgressLabel =
        aiQuestions.length > 0
            ? `Question ${currentStep} of ${totalQuestions}`
            : 'Question 1';
    const completionLabel =
        aiQuestions.length > 0 ? `${progressPercentage}% Complete` : 'Start';
    const isLastQuestion =
        !isFeelingStep && currentQuestionIndex === aiQuestions.length - 1;

    async function fetchQuestions(): Promise<void> {
        const trimmedFeeling = feeling.trim();

        if (trimmedFeeling.length < 3) {
            setError('Tell us a little about how you are feeling first.');

            return;
        }

        setIsLoadingQuestions(true);
        setError(null);

        try {
            const response = await fetch(wellnessQuestions.url(), {
                body: JSON.stringify({ feeling: trimmedFeeling }),
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                method: wellnessQuestions().method,
            });
            const payload =
                (await response.json()) as Partial<QuestionsResponse> & {
                    message?: string;
                };

            if (!response.ok) {
                throw new Error(
                    payload.message ??
                        'The wellness questions could not be loaded right now.',
                );
            }

            if (!payload.questions?.length) {
                throw new Error(
                    'The wellness questions could not be loaded right now.',
                );
            }

            setOpeningMessage(payload.opening_message ?? null);
            setAiQuestions(payload.questions);
            setCurrentQuestionIndex(0);
            setAnswers({});
        } catch (fetchError) {
            setError(
                fetchError instanceof Error
                    ? fetchError.message
                    : 'The wellness questions could not be loaded right now.',
            );
        } finally {
            setIsLoadingQuestions(false);
        }
    }

    function selectOption(question: AiQuestion, option: AiOption): void {
        setAnswers((currentAnswers) => ({
            ...currentAnswers,
            [question.key]: {
                category_slugs: option.category_slugs,
                keywords: option.keywords,
                label: option.label,
                question: question.label,
                question_key: question.key,
                value: option.value,
            },
        }));
    }

    async function fetchRecommendations(): Promise<void> {
        const selectedAnswers = Object.values(answers);

        if (selectedAnswers.length === 0) {
            setError('Choose an answer before asking for recommendations.');

            return;
        }

        setIsLoadingRecommendations(true);
        setError(null);

        try {
            const response = await fetch(wellnessRecommendations.url(), {
                body: JSON.stringify({
                    answers: selectedAnswers,
                    feeling: feeling.trim(),
                }),
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                method: wellnessRecommendations().method,
            });
            const payload =
                (await response.json()) as Partial<RecommendationsResponse> & {
                    message?: string;
                };

            if (!response.ok) {
                throw new Error(
                    payload.message ??
                        'Provider recommendations could not be loaded right now.',
                );
            }

            const result: WellnessRecommendationResult = {
                answers: selectedAnswers,
                feeling: feeling.trim(),
                recommendations: payload.recommendations ?? [],
                summary:
                    payload.summary ??
                    'Here are the providers that best match how you are feeling right now.',
            };

            sessionStorage.setItem(
                WELLNESS_RECOMMENDATION_STORAGE_KEY,
                JSON.stringify(result),
            );

            router.visit(wellnessResponse.url());
        } catch (fetchError) {
            setError(
                fetchError instanceof Error
                    ? fetchError.message
                    : 'Provider recommendations could not be loaded right now.',
            );
        } finally {
            setIsLoadingRecommendations(false);
        }
    }

    function handleNext(): void {
        if (isFeelingStep) {
            void fetchQuestions();

            return;
        }

        if (!selectedAnswer) {
            return;
        }

        if (!isLastQuestion) {
            setCurrentQuestionIndex((index) => index + 1);

            return;
        }

        void fetchRecommendations();
    }

    function handlePrevious(): void {
        setError(null);

        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex((index) => index - 1);

            return;
        }

        setAiQuestions([]);
        setOpeningMessage(null);
        setAnswers({});
    }

    const title = isFeelingStep
        ? 'How are you feeling today?'
        : currentQuestion?.label;
    const description = isFeelingStep
        ? 'Share what is present for you right now, even if it is just a few words.'
        : openingMessage;

    return (
        <main className="flex w-full flex-grow items-center justify-center px-margin-mobile pt-24 pb-24 md:px-lg">
            <div className="w-full max-w-4xl">
                <div className="quiz-card-transition overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container-lowest shadow-lg">
                    <div className="px-lg pt-lg pb-md">
                        <div className="mb-sm flex items-center justify-between">
                            <span className="font-label-sm text-label-sm tracking-wider text-outline uppercase">
                                {questionProgressLabel}
                            </span>
                            <span className="font-label-sm text-label-sm font-bold text-primary-container">
                                {completionLabel}
                            </span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-surface-container-high">
                            <div
                                className="h-full bg-primary-container transition-all duration-700 ease-out"
                                style={{ width: `${progressPercentage}%` }}
                            />
                        </div>
                    </div>

                    <div className="px-lg pb-lg">
                        <div className="mt-lg mb-xl text-center">
                            <h1 className="mb-md font-headline-lg text-headline-lg text-primary">
                                {title}
                            </h1>
                            {description ? (
                                <p className="font-body-md text-body-md text-on-surface-variant">
                                    {description}
                                </p>
                            ) : null}
                        </div>

                        {isFeelingStep ? (
                            <div className="space-y-sm">
                                <textarea
                                    className="min-h-36 w-full resize-none rounded-xl border border-outline-variant/50 bg-surface-container-low px-md py-md font-body-md text-body-md text-on-surface transition-colors outline-none placeholder:text-outline focus:border-primary-container focus:ring-2 focus:ring-primary-fixed/40"
                                    onChange={(event) =>
                                        setFeeling(event.target.value)
                                    }
                                    placeholder="I feel tense and mentally drained after work."
                                    value={feeling}
                                />
                                {error ? (
                                    <p className="font-label-sm text-label-sm text-error">
                                        {error}
                                    </p>
                                ) : null}
                            </div>
                        ) : null}

                        {!isFeelingStep && currentQuestion ? (
                            <div className="grid grid-cols-1 gap-md md:grid-cols-2">
                                {currentQuestion.options.map(
                                    (option, optionIndex) => {
                                        const isSelected =
                                            selectedAnswer?.value ===
                                            option.value;
                                        const optionDetail =
                                            option.keywords.length > 0
                                                ? option.keywords
                                                      .slice(0, 3)
                                                      .join(' / ')
                                                : 'Wellness support';

                                        return (
                                            <button
                                                className={`option-card group flex min-h-28 items-start gap-md rounded-xl border p-lg text-left transition-all ${
                                                    isSelected
                                                        ? 'selected border-primary-container bg-primary-fixed/20'
                                                        : 'border-outline-variant/50 bg-surface-container-low hover:border-primary-container'
                                                }`}
                                                key={`${currentQuestion.key}-${option.value}`}
                                                onClick={() =>
                                                    selectOption(
                                                        currentQuestion,
                                                        option,
                                                    )
                                                }
                                                type="button"
                                            >
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-container-highest transition-colors group-hover:bg-primary-fixed">
                                                    <MaterialIcon className="text-primary">
                                                        {
                                                            optionIcons[
                                                                optionIndex %
                                                                    optionIcons.length
                                                            ]
                                                        }
                                                    </MaterialIcon>
                                                </div>
                                                <div>
                                                    <h2 className="mb-xs font-label-md text-label-md font-bold text-on-surface">
                                                        {option.label}
                                                    </h2>
                                                    <p className="font-label-sm text-label-sm text-outline">
                                                        {optionDetail}
                                                    </p>
                                                </div>
                                            </button>
                                        );
                                    },
                                )}
                            </div>
                        ) : null}
                    </div>

                    <div className="flex items-center justify-between border-t border-outline-variant/30 bg-surface-container-low px-lg py-md">
                        <button
                            className="flex items-center gap-xs rounded-lg px-md py-sm font-label-md text-label-md text-on-surface-variant transition-colors hover:bg-surface-container-high active:scale-95"
                            disabled={isFeelingStep || isProcessing}
                            onClick={handlePrevious}
                            type="button"
                        >
                            <MaterialIcon className="text-[18px]">
                                arrow_back
                            </MaterialIcon>
                            {t('quiz.previous')}
                        </button>
                        <button
                            className="flex items-center gap-xs rounded-xl bg-primary-container px-xl py-md font-label-md text-label-md text-on-primary shadow-sm transition-all hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                            disabled={!canGoNext}
                            onClick={handleNext}
                            type="button"
                        >
                            {isLoadingQuestions || isLoadingRecommendations
                                ? 'Loading'
                                : isLastQuestion
                                  ? 'Done'
                                  : 'Next'}
                            <MaterialIcon className="text-[18px]">
                                {isLoadingQuestions || isLoadingRecommendations
                                    ? 'progress_activity'
                                    : 'arrow_forward'}
                            </MaterialIcon>
                        </button>
                    </div>
                </div>

                <div className="mt-lg flex justify-center gap-xl text-outline">
                    <div className="flex items-center gap-xs text-label-sm">
                        <MaterialIcon className="text-[16px]">
                            lock
                        </MaterialIcon>
                        {t('quiz.secure')}
                    </div>
                    <div className="flex items-center gap-xs text-label-sm">
                        <MaterialIcon className="text-[16px]">
                            history
                        </MaterialIcon>
                        {t('quiz.duration')}
                    </div>
                </div>
            </div>
        </main>
    );
}
