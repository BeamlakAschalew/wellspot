<?php

namespace App\Http\Controllers;

use App\Ai\Agents\WellnessIntakeAgent;
use App\Http\Requests\WellnessQuestionRequest;
use App\Http\Requests\WellnessRecommendationRequest;
use App\Services\WellnessProviderRanker;
use Illuminate\Http\JsonResponse;

class WellnessRecommendationController extends Controller
{
    public function questions(WellnessQuestionRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $intake = WellnessIntakeAgent::make()
            ->prompt($this->questionPrompt($validated['feeling']))
            ->toArray();

        return response()->json([
            'feeling' => $validated['feeling'],
            'opening_message' => $intake['opening_message'] ?? 'Thanks for sharing how you feel. Let us narrow down what would help most right now.',
            'questions' => $intake['questions'] ?? [],
        ]);
    }

    public function recommend(WellnessRecommendationRequest $request, WellnessProviderRanker $ranker): JsonResponse
    {
        $validated = $request->validated();
        $recommendations = $ranker->rank($validated);

        return response()->json([
            'summary' => $this->summary($recommendations->count()),
            'recommendations' => $recommendations,
        ]);
    }

    private function questionPrompt(string $feeling): string
    {
        return <<<PROMPT
        The user is starting a wellness recommendation flow.

        First message from user:
        "{$feeling}"

        Create 3 to 5 choice-based follow-up questions that will help rank
        provider categories and services for what they need right now.
        PROMPT;
    }

    private function summary(int $recommendationCount): string
    {
        return $recommendationCount > 0
            ? 'Here are the providers that best match how you are feeling right now.'
            : 'No matching providers were found yet, but your answers are ready for the next search pass.';
    }
}
