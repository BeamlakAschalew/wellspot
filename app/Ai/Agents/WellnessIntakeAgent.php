<?php

namespace App\Ai\Agents;

use App\Ai\Concerns\FailsOverToAnthropic;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Contracts\Agent;
use Laravel\Ai\Contracts\HasStructuredOutput;
use Laravel\Ai\Promptable;
use Stringable;

/**
 * Turns the user's first wellness check-in into a short choice-based intake.
 */
class WellnessIntakeAgent implements Agent, HasStructuredOutput
{
    use FailsOverToAnthropic;
    use Promptable;

    /**
     * The wellness category slugs the AI may reference.
     *
     * @var list<string>
     */
    public const CATEGORIES = [
        'spa-massage',
        'gym-fitness',
        'yoga-meditation',
        'nutrition-dietitian',
        'mental-health',
        'retreat-wellness',
        'beauty-aesthetics',
        'physiotherapy',
    ];

    public function instructions(): Stringable|string
    {
        $categories = implode(', ', self::CATEGORIES);

        return <<<PROMPT
        You are WellSpot's wellness intake guide.

        Start from the user's own words about how they are feeling today and
        produce 3 to 5 short multiple-choice questions. The answers should help
        WellSpot rank local wellness providers and services.

        Only use these category slugs when tagging options: {$categories}.

        Keep the questions practical and gentle. Do not diagnose, do not give
        clinical medical advice, and do not invent providers, services, prices,
        or availability. If the user describes urgent danger or severe symptoms,
        include a safety-oriented question that can steer them toward immediate
        support instead of marketplace recommendations.
        PROMPT;
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'opening_message' => $schema->string()
                ->description('A warm one-sentence acknowledgement of how the user feels.')
                ->required(),

            'questions' => $schema->array()
                ->items($schema->object(fn (JsonSchema $schema): array => [
                    'key' => $schema->string()
                        ->description('Stable snake_case key for this question.')
                        ->required(),
                    'label' => $schema->string()
                        ->description('The user-facing question text.')
                        ->required(),
                    'options' => $schema->array()
                        ->items($schema->object(fn (JsonSchema $schema): array => [
                            'value' => $schema->string()
                                ->description('Stable snake_case option value.')
                                ->required(),
                            'label' => $schema->string()
                                ->description('Short user-facing option label.')
                                ->required(),
                            'category_slugs' => $schema->array()
                                ->items($schema->string()->enum(self::CATEGORIES))
                                ->min(1)
                                ->max(3)
                                ->description('Provider/service categories this answer points toward.')
                                ->required(),
                            'keywords' => $schema->array()
                                ->items($schema->string())
                                ->min(1)
                                ->max(6)
                                ->description('Search terms that may match provider or service text.')
                                ->required(),
                        ]))
                        ->min(2)
                        ->max(5)
                        ->required(),
                ]))
                ->min(3)
                ->max(5)
                ->required(),
        ];
    }
}
