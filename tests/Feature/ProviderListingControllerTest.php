<?php

use App\Models\Category;
use App\Models\Provider;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('providers can create their listing from the guide route', function () {
    Storage::fake('public');

    $category = Category::factory()->create();
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('provider.listing.store'), [
        'category_id' => $category->id,
        'name' => 'Bole Recovery Studio',
        'headline' => 'Recovery sessions near Bole.',
        'description' => 'Simple recovery care in Addis Ababa.',
        'phone' => '+251911223344',
        'email' => 'hello@bolerecovery.test',
        'address' => 'Bole Road, Addis Ababa',
        'neighborhood' => 'Bole',
        'latitude' => 9.0108,
        'longitude' => 38.7613,
        'logo' => UploadedFile::fake()->image('bole-logo.jpg', 320, 320)->size(96),
        'status' => 'draft',
    ]);

    $response->assertRedirect(route('provider.dashboard'));

    expect($user->providers()->first())
        ->name->toBe('Bole Recovery Studio')
        ->slug->toBe('bole-recovery-studio')
        ->status->toBe('draft')
        ->published_at->toBeNull();

    Storage::disk('public')->assertExists($user->providers()->first()->logo_path);
});

test('providers can update only their own listing', function () {
    $category = Category::factory()->create();
    $newCategory = Category::factory()->create();
    $user = User::factory()->create();
    $provider = Provider::factory()->for($user)->for($category)->draft()->create(['name' => 'Old Name']);

    $response = $this->actingAs($user)->patch(route('provider.listing.update'), [
        'category_id' => $newCategory->id,
        'name' => 'Kazanchis Mindful Studio',
        'headline' => 'Mindful movement downtown.',
        'description' => 'Breathwork and yoga in Kazanchis.',
        'phone' => '+251922334455',
        'email' => 'hello@kazanchis.test',
        'address' => 'Kazanchis, Addis Ababa',
        'neighborhood' => 'Kazanchis',
        'latitude' => 9.0181,
        'longitude' => 38.7675,
        'status' => 'published',
    ]);

    $response->assertRedirect(route('provider.dashboard'));

    expect($provider->refresh())
        ->category_id->toBe($newCategory->id)
        ->name->toBe('Kazanchis Mindful Studio')
        ->slug->toBe('kazanchis-mindful-studio')
        ->status->toBe('published')
        ->published_at->not->toBeNull();
});
