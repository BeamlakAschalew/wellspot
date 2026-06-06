<?php

use App\Ai\Agents\WellnessIntakeAgent;
use App\Models\Category;
use App\Models\Provider;
use App\Models\Review;
use App\Models\Service;
use App\Models\User;
use Illuminate\Testing\Fluent\AssertableJson;
use Laravel\Ai\Prompts\AgentPrompt;

it('generates follow-up questions from the initial feeling', function () {
    WellnessIntakeAgent::fake([
        [
            'opening_message' => 'That sounds heavy, so let us narrow down what support fits.',
            'questions' => [
                [
                    'key' => 'support_type',
                    'label' => 'What would help most right now?',
                    'options' => [
                        [
                            'value' => 'body_relief',
                            'label' => 'Body relief',
                            'category_slugs' => ['spa-massage'],
                            'keywords' => ['massage', 'relaxation'],
                        ],
                        [
                            'value' => 'quiet_mind',
                            'label' => 'Quiet my mind',
                            'category_slugs' => ['yoga-meditation'],
                            'keywords' => ['meditation', 'breathwork'],
                        ],
                    ],
                ],
                [
                    'key' => 'energy_level',
                    'label' => 'How much energy do you have?',
                    'options' => [
                        [
                            'value' => 'low',
                            'label' => 'Low',
                            'category_slugs' => ['spa-massage'],
                            'keywords' => ['rest'],
                        ],
                        [
                            'value' => 'medium',
                            'label' => 'Medium',
                            'category_slugs' => ['gym-fitness'],
                            'keywords' => ['training'],
                        ],
                    ],
                ],
                [
                    'key' => 'time_available',
                    'label' => 'How much time do you have?',
                    'options' => [
                        [
                            'value' => 'short',
                            'label' => 'Under an hour',
                            'category_slugs' => ['spa-massage'],
                            'keywords' => ['quick'],
                        ],
                        [
                            'value' => 'long',
                            'label' => 'A longer reset',
                            'category_slugs' => ['retreat-wellness'],
                            'keywords' => ['retreat'],
                        ],
                    ],
                ],
            ],
        ],
    ])->preventStrayPrompts();

    $response = $this->postJson('/api/wellness/questions', [
        'feeling' => 'I feel tense and mentally drained after work.',
    ]);

    $response->assertSuccessful()
        ->assertJson(fn (AssertableJson $json) => $json
            ->where('feeling', 'I feel tense and mentally drained after work.')
            ->where('opening_message', 'That sounds heavy, so let us narrow down what support fits.')
            ->has('questions', 3)
            ->has('questions.0.options', 2)
        );

    WellnessIntakeAgent::assertPrompted(
        fn (AgentPrompt $prompt): bool => $prompt->contains('mentally drained')
            && $prompt->contains('3 to 5 choice-based follow-up questions'),
    );
});

it('ranks matching providers by category, services, keywords, and reviews', function () {
    $massage = Category::factory()->create([
        'name' => 'Spa & Massage',
        'slug' => 'spa-massage',
    ]);
    $fitness = Category::factory()->create([
        'name' => 'Fitness',
        'slug' => 'gym-fitness',
    ]);

    $bestProvider = Provider::factory()->for($massage)->create([
        'name' => 'Calm Recovery Studio',
        'description' => 'Deep tissue massage and relaxation support.',
        'status' => 'published',
    ]);
    Service::factory()->for($bestProvider)->for($massage)->create([
        'name' => 'Deep Tissue Massage',
        'description' => 'Focused tension relief.',
        'status' => 'active',
    ]);
    Review::factory()->for($bestProvider)->for(User::factory())->create(['rating' => 5]);

    $secondProvider = Provider::factory()->for($massage)->create([
        'name' => 'Simple Spa',
        'description' => 'General relaxation care.',
        'status' => 'published',
    ]);
    Service::factory()->for($secondProvider)->for($massage)->create([
        'name' => 'Classic Massage',
        'description' => 'A calm massage session.',
        'status' => 'active',
    ]);
    Review::factory()->for($secondProvider)->for(User::factory())->create(['rating' => 3]);

    $draftProvider = Provider::factory()->for($massage)->draft()->create(['name' => 'Draft Spa']);
    Service::factory()->for($draftProvider)->for($massage)->create(['status' => 'active']);

    $fitnessProvider = Provider::factory()->for($fitness)->create([
        'name' => 'Strength Lab',
        'status' => 'published',
    ]);
    Service::factory()->for($fitnessProvider)->for($fitness)->create(['status' => 'active']);

    $response = $this->postJson('/api/wellness/recommendations', [
        'feeling' => 'My shoulders are tense and I need massage relaxation.',
        'answers' => [
            [
                'question_key' => 'support_type',
                'question' => 'What would help most right now?',
                'value' => 'body_relief',
                'label' => 'Body relief',
                'category_slugs' => ['spa-massage'],
                'keywords' => ['deep tissue', 'relaxation'],
            ],
        ],
    ]);

    $response->assertSuccessful()
        ->assertJson(fn (AssertableJson $json) => $json
            ->has('summary')
            ->has('recommendations', 2)
            ->where('recommendations.0.provider.name', 'Calm Recovery Studio')
            ->where('recommendations.1.provider.name', 'Simple Spa')
            ->etc()
        );

    expect(collect($response->json('recommendations'))->pluck('provider.name')->all())
        ->not->toContain('Draft Spa')
        ->not->toContain('Strength Lab');
});

it('does not recommend providers without active services', function () {
    $massage = Category::factory()->create([
        'name' => 'Spa & Massage',
        'slug' => 'spa-massage',
    ]);

    $provider = Provider::factory()->for($massage)->create(['status' => 'published']);
    Service::factory()->for($provider)->for($massage)->inactive()->create();

    $response = $this->postJson('/api/wellness/recommendations', [
        'feeling' => 'I want to relax.',
        'answers' => [
            [
                'question_key' => 'support_type',
                'value' => 'body_relief',
                'label' => 'Body relief',
                'category_slugs' => ['spa-massage'],
            ],
        ],
    ]);

    $response->assertSuccessful()
        ->assertJson(fn (AssertableJson $json) => $json
            ->has('recommendations', 0)
            ->etc()
        );
});
