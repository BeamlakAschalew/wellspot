<?php

use App\Ai\Agents\WellnessIntakeAgent;
use Illuminate\JsonSchema\JsonSchemaTypeFactory;
use Illuminate\JsonSchema\Types\Type;

it('defines the wellness intake structured schema the UI relies on', function () {
    $schema = (new WellnessIntakeAgent)->schema(new JsonSchemaTypeFactory);

    expect($schema)->toHaveKeys(['opening_message', 'questions']);
    expect($schema['opening_message'])->toBeInstanceOf(Type::class)
        ->and($schema['questions'])->toBeInstanceOf(Type::class)
        ->and($schema['questions']->toArray()['type'])->toBe('array')
        ->and($schema['questions']->toArray()['minItems'])->toBe(3)
        ->and($schema['questions']->toArray()['maxItems'])->toBe(5);
});

it('constrains generated option categories to supported wellness slugs', function () {
    $schema = (new WellnessIntakeAgent)->schema(new JsonSchemaTypeFactory);
    $question = $schema['questions']->toArray()['items']['properties'];
    $option = $question['options']['items']['properties'];

    expect($option['category_slugs']['items']['enum'])
        ->toBe(WellnessIntakeAgent::CATEGORIES);
});

it('centres intake instructions on feelings, questions, and provider ranking', function () {
    $instructions = (string) (new WellnessIntakeAgent)->instructions();

    expect($instructions)->toContain('how they are feeling today')
        ->and($instructions)->toContain('3 to 5 short multiple-choice questions')
        ->and($instructions)->toContain('rank local wellness providers and services');
});

it('uses only DeepSeek when no Anthropic fallback key is configured', function () {
    config()->set('ai.default', 'deepseek');
    config()->set('ai.providers.anthropic.key', null);

    expect((new WellnessIntakeAgent)->provider())->toBe(['deepseek']);
});

it('adds Anthropic to the failover chain when its key is present', function () {
    config()->set('ai.default', 'deepseek');
    config()->set('ai.providers.anthropic.key', 'sk-ant-test');

    expect((new WellnessIntakeAgent)->provider())->toBe(['deepseek', 'anthropic']);
});
