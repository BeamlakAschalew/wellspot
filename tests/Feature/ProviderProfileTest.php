<?php

use App\Models\Category;
use App\Models\Provider;
use App\Models\User;
use Inertia\Support\SessionKey;

test('providers can update and publish their profile', function () {
    $category = Category::factory()->create(['name' => 'Spa & Massage']);
    $newCategory = Category::factory()->create(['name' => 'Yoga & Mindfulness']);
    $user = User::factory()->create();
    $provider = Provider::factory()
        ->for($user)
        ->for($category)
        ->draft()
        ->create(['name' => 'Draft Wellness']);

    $response = $this->actingAs($user)->patch(route('provider.profile.update'), [
        'category_id' => $newCategory->id,
        'name' => 'Bole Recovery Studio',
        'headline' => 'Recovery sessions near Bole Medhanialem.',
        'description' => 'Massage, stretching, and practical recovery care for busy Addis schedules.',
        'phone' => '+251911223344',
        'email' => 'hello@bolerecovery.test',
        'address' => 'Bole Road, Addis Ababa',
        'neighborhood' => 'Bole',
        'latitude' => 9.0108,
        'longitude' => 38.7613,
        'status' => 'published',
    ]);

    $response->assertRedirect(route('provider.dashboard'));
    $response->assertSessionHas(SessionKey::FLASH_DATA, [
        'toast' => [
            'type' => 'success',
            'message' => 'Provider profile saved.',
        ],
    ]);

    expect($provider->refresh())
        ->category_id->toBe($newCategory->id)
        ->name->toBe('Bole Recovery Studio')
        ->slug->toBe('bole-recovery-studio')
        ->headline->toBe('Recovery sessions near Bole Medhanialem.')
        ->description->toBe('Massage, stretching, and practical recovery care for busy Addis schedules.')
        ->phone->toBe('+251911223344')
        ->email->toBe('hello@bolerecovery.test')
        ->address->toBe('Bole Road, Addis Ababa')
        ->neighborhood->toBe('Bole')
        ->status->toBe('published')
        ->published_at->not->toBeNull();
});

test('provider profile validation rejects incomplete payloads', function () {
    $category = Category::factory()->create();
    $user = User::factory()->create();
    Provider::factory()->for($user)->for($category)->create();

    $response = $this->actingAs($user)->patch(route('provider.profile.update'), [
        'category_id' => null,
        'name' => '',
        'address' => '',
        'status' => 'archived',
        'email' => 'not-an-email',
        'latitude' => 120,
        'longitude' => 220,
    ]);

    $response->assertSessionHasErrors([
        'category_id',
        'name',
        'address',
        'status',
        'email',
        'latitude',
        'longitude',
    ]);
});
