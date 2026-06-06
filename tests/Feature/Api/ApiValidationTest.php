<?php

it('rejects a question request without an initial feeling', function () {
    $this->postJson('/api/wellness/questions', [])
        ->assertStatus(422)
        ->assertJsonValidationErrors('feeling');
});

it('rejects a recommendation request with no answers', function () {
    $this->postJson('/api/wellness/recommendations', [
        'feeling' => 'I feel tense and tired.',
    ])->assertStatus(422)
        ->assertJsonValidationErrors('answers');
});

it('rejects recommendation answers missing the selected label', function () {
    $this->postJson('/api/wellness/recommendations', [
        'feeling' => 'I feel tense and tired.',
        'answers' => [
            [
                'question_key' => 'focus',
                'value' => 'relax',
                'category_slugs' => ['spa-massage'],
            ],
        ],
    ])->assertStatus(422)
        ->assertJsonValidationErrors('answers.0.label');
});

it('rejects unknown recommendation category slugs', function () {
    $this->postJson('/api/wellness/recommendations', [
        'feeling' => 'I feel tense and tired.',
        'answers' => [
            [
                'question_key' => 'focus',
                'value' => 'relax',
                'label' => 'Relax my body',
                'category_slugs' => ['not-real'],
            ],
        ],
    ])->assertStatus(422)
        ->assertJsonValidationErrors('answers.0.category_slugs.0');
});

it('requires a latitude when a recommendation longitude is given', function () {
    $this->postJson('/api/wellness/recommendations', [
        'feeling' => 'I feel tense and tired.',
        'answers' => [
            [
                'question_key' => 'focus',
                'value' => 'relax',
                'label' => 'Relax my body',
                'category_slugs' => ['spa-massage'],
            ],
        ],
        'longitude' => 38.74,
    ])->assertStatus(422)
        ->assertJsonValidationErrors('latitude');
});

it('requires coordinates for the nearby search', function () {
    $this->getJson('/api/providers/nearby')
        ->assertStatus(422)
        ->assertJsonValidationErrors(['lat', 'lng']);
});

it('rejects a nearby radius above the maximum', function () {
    $this->getJson('/api/providers/nearby?lat=9.03&lng=38.74&radius=999')
        ->assertStatus(422)
        ->assertJsonValidationErrors('radius');
});
