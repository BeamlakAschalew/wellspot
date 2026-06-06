<?php

use App\Models\Category;
use App\Models\Provider;
use App\Models\Service;
use App\Models\User;
use Inertia\Support\SessionKey;

test('providers can add a service from the dashboard', function () {
    $category = Category::factory()->create();
    $user = User::factory()->create();
    $provider = Provider::factory()->for($user)->for($category)->create();

    $response = $this->actingAs($user)->post(route('provider.services.store'), [
        'category_id' => $category->id,
        'name' => 'Deep Tissue Massage',
        'name_am' => 'ዲፕ ቲሹ ማሳጅ',
        'description' => 'Focused muscle recovery session.',
        'description_am' => 'በጡንቻ ማገገም ላይ የተተኮረ ክፍለ ጊዜ።',
        'duration_minutes' => 60,
        'price_amount' => 1200,
        'status' => 'active',
        'sort_order' => 0,
    ]);

    $response->assertRedirect(route('provider.dashboard'));
    $response->assertSessionHas(SessionKey::FLASH_DATA, [
        'toast' => [
            'type' => 'success',
            'message' => 'Service created.',
        ],
    ]);

    expect($provider->services()->where('name', 'Deep Tissue Massage')->first())
        ->name_am->toBe('ዲፕ ቲሹ ማሳጅ')
        ->description_am->toBe('በጡንቻ ማገገም ላይ የተተኮረ ክፍለ ጊዜ።');
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
        'name_am' => 'ሪከቨሪ ማሳጅ',
        'description' => 'Updated recovery session for athletes.',
        'description_am' => 'ለአትሌቶች የተዘመነ የማገገሚያ ክፍለ ጊዜ።',
        'duration_minutes' => 90,
        'price_amount' => 1600,
        'status' => 'inactive',
        'sort_order' => 3,
    ]);

    $response->assertRedirect(route('provider.dashboard'));
    $response->assertSessionHas(SessionKey::FLASH_DATA, [
        'toast' => [
            'type' => 'success',
            'message' => 'Service updated.',
        ],
    ]);

    expect($service->refresh())
        ->name->toBe('Recovery Massage')
        ->name_am->toBe('ሪከቨሪ ማሳጅ')
        ->slug->toBe('recovery-massage')
        ->description->toBe('Updated recovery session for athletes.')
        ->description_am->toBe('ለአትሌቶች የተዘመነ የማገገሚያ ክፍለ ጊዜ።')
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
    $response->assertSessionHas(SessionKey::FLASH_DATA, [
        'toast' => [
            'type' => 'success',
            'message' => 'Service deleted.',
        ],
    ]);

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
