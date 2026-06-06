<?php

use App\Models\Category;
use App\Models\Provider;
use App\Models\Service;
use App\Models\User;

test('providers can add a service from the dashboard', function () {
    $category = Category::factory()->create();
    $user = User::factory()->create();
    $provider = Provider::factory()->for($user)->for($category)->create();

    $response = $this->actingAs($user)->post(route('provider.services.store'), [
        'category_id' => $category->id,
        'name' => 'Deep Tissue Massage',
        'description' => 'Focused muscle recovery session.',
        'duration_minutes' => 60,
        'price_amount' => 1200,
        'status' => 'active',
        'sort_order' => 0,
    ]);

    $response->assertRedirect(route('provider.dashboard'));

    expect($provider->services()->where('name', 'Deep Tissue Massage')->exists())->toBeTrue();
});

test('service validation rejects incomplete payloads', function () {
    $category = Category::factory()->create();
    $user = User::factory()->create();
    Provider::factory()->for($user)->for($category)->create();

    $response = $this->actingAs($user)->post(route('provider.services.store'), [
        'name' => '',
        'duration_minutes' => 5,
        'price_amount' => 0,
    ]);

    $response->assertSessionHasErrors(['name', 'duration_minutes', 'price_amount']);
});

test('providers can update their own services', function () {
    $category = Category::factory()->create();
    $user = User::factory()->create();
    $provider = Provider::factory()->for($user)->for($category)->create();
    $service = Service::factory()
        ->for($provider)
        ->for($category)
        ->create(['name' => 'Classic Massage', 'price_amount' => 900]);

    $response = $this->actingAs($user)->patch(route('provider.services.update', $service), [
        'category_id' => $category->id,
        'name' => 'Recovery Massage',
        'description' => 'Updated recovery session for athletes.',
        'duration_minutes' => 90,
        'price_amount' => 1600,
        'status' => 'inactive',
        'sort_order' => 3,
    ]);

    $response->assertRedirect(route('provider.dashboard'));

    expect($service->refresh())
        ->name->toBe('Recovery Massage')
        ->slug->toBe('recovery-massage')
        ->description->toBe('Updated recovery session for athletes.')
        ->duration_minutes->toBe(90)
        ->price_amount->toBe(1600)
        ->status->toBe('inactive')
        ->sort_order->toBe(3);
});

test('providers cannot update services owned by another provider', function () {
    $category = Category::factory()->create();
    $owner = User::factory()->create();
    $otherUser = User::factory()->create();
    Provider::factory()->for($owner)->for($category)->create();
    $otherProvider = Provider::factory()->for($otherUser)->for($category)->create();
    $service = Service::factory()
        ->for($otherProvider)
        ->for($category)
        ->create(['name' => 'Original Session']);

    $response = $this->actingAs($owner)->patch(route('provider.services.update', $service), [
        'category_id' => $category->id,
        'name' => 'Wrong Update',
        'description' => 'This should not persist.',
        'duration_minutes' => 60,
        'price_amount' => 1200,
        'status' => 'active',
        'sort_order' => 0,
    ]);

    $response->assertNotFound();

    expect($service->refresh()->name)->toBe('Original Session');
});

test('providers can delete their own services', function () {
    $category = Category::factory()->create();
    $user = User::factory()->create();
    $provider = Provider::factory()->for($user)->for($category)->create();
    $service = Service::factory()->for($provider)->for($category)->create();

    $response = $this->actingAs($user)->delete(route('provider.services.destroy', $service));

    $response->assertRedirect(route('provider.dashboard'));

    expect(Service::query()->whereKey($service->id)->exists())->toBeFalse();
});

test('providers cannot delete services owned by another provider', function () {
    $category = Category::factory()->create();
    $owner = User::factory()->create();
    $otherUser = User::factory()->create();
    Provider::factory()->for($owner)->for($category)->create();
    $otherProvider = Provider::factory()->for($otherUser)->for($category)->create();
    $service = Service::factory()->for($otherProvider)->for($category)->create();

    $response = $this->actingAs($owner)->delete(route('provider.services.destroy', $service));

    $response->assertNotFound();

    expect(Service::query()->whereKey($service->id)->exists())->toBeTrue();
});
