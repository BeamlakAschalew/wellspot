<?php

use App\Models\Category;
use App\Models\Provider;
use App\Models\ProviderSubscription;
use App\Models\Service;
use App\Models\User;
use Illuminate\Support\Facades\Http;

test('providers can initialize a monthly Chapa subscription checkout', function () {
    config([
        'services.chapa.secret_key' => 'test-secret',
        'services.chapa.base_url' => 'https://api.chapa.co',
        'services.chapa.service_monthly_amount' => 2000,
    ]);

    Http::fake([
        'api.chapa.co/v1/transaction/initialize' => Http::response([
            'status' => 'success',
            'data' => [
                'checkout_url' => 'https://checkout.chapa.co/checkout/test',
            ],
        ]),
    ]);

    $category = Category::factory()->create();
    $user = User::factory()->create();
    $provider = Provider::factory()->for($user)->for($category)->draft()->create([
        'email' => 'provider@example.test',
        'phone' => '+251911000111',
    ]);
    Service::factory()->for($provider)->for($category)->create();
    Service::factory()->for($provider)->for($category)->create();
    Service::factory()->for($provider)->for($category)->inactive()->create();

    $response = $this
        ->actingAs($user)
        ->withHeader('X-Inertia', 'true')
        ->post(route('provider.subscription.store'));

    $response
        ->assertStatus(409)
        ->assertHeader('X-Inertia-Location', 'https://checkout.chapa.co/checkout/test');

    $subscription = ProviderSubscription::query()->firstOrFail();

    expect($subscription)
        ->provider_id->toBe($provider->id)
        ->amount->toBe(4000)
        ->currency->toBe('ETB')
        ->status->toBe('pending')
        ->chapa_checkout_url->toBe('https://checkout.chapa.co/checkout/test');

    Http::assertSent(fn ($request) => $request->hasHeader('Authorization', 'Bearer test-secret')
        && $request['amount'] === 4000
        && $request['currency'] === 'ETB'
        && $request['email'] === 'provider@example.test'
        && $request['phone_number'] === '0912345678'
        && $request['return_url'] === $request['callback_url']
        && str_contains($request['return_url'], route('provider.subscription.callback', absolute: false))
        && str_contains($request['return_url'], 'tx_ref=wellspot-'.$provider->id.'-')
        && $request['customization']['title'] === 'WellSpot'
        && mb_strlen($request['customization']['title']) <= 16
        && mb_strlen($request['customization']['description']) <= 32
        && str_starts_with($request['tx_ref'], 'wellspot-'.$provider->id.'-'));
});

test('chapa checkout falls back to a dummy email when provider email is invalid', function () {
    config([
        'services.chapa.secret_key' => 'test-secret',
        'services.chapa.base_url' => 'https://api.chapa.co',
        'services.chapa.fallback_email' => 'billing@wellspot.test',
    ]);

    Http::fake([
        'api.chapa.co/v1/transaction/initialize' => Http::response([
            'status' => 'success',
            'data' => [
                'checkout_url' => 'https://checkout.chapa.co/checkout/test',
            ],
        ]),
    ]);

    $category = Category::factory()->create();
    $user = User::factory()->create(['email' => 'not-an-email']);
    $provider = Provider::factory()
        ->for($user)
        ->for($category)
        ->draft()
        ->create(['email' => 'also-not-email']);
    Service::factory()->for($provider)->for($category)->create();

    $this
        ->actingAs($user)
        ->withHeader('X-Inertia', 'true')
        ->post(route('provider.subscription.store'))
        ->assertStatus(409);

    Http::assertSent(fn ($request) => $request['email'] === 'billing@wellspot.test');
});

test('successful Chapa callback activates the subscription and provider listing', function () {
    config([
        'services.chapa.secret_key' => 'test-secret',
        'services.chapa.base_url' => 'https://api.chapa.co',
    ]);

    Http::fake([
        'api.chapa.co/v1/transaction/verify/wellspot-1-test' => Http::response([
            'status' => 'success',
            'data' => [
                'status' => 'success',
                'reference' => 'chapa-reference-123',
            ],
        ]),
    ]);

    $category = Category::factory()->create();
    $provider = Provider::factory()->for($category)->draft()->create();
    $subscription = ProviderSubscription::query()->create([
        'provider_id' => $provider->id,
        'plan' => 'monthly',
        'amount' => 500,
        'currency' => 'ETB',
        'chapa_tx_ref' => 'wellspot-1-test',
        'chapa_checkout_url' => 'https://checkout.chapa.co/checkout/test',
        'status' => 'pending',
    ]);

    $response = $this->get(route('provider.subscription.callback', ['tx_ref' => 'wellspot-1-test']));

    $response->assertRedirect(route('provider.dashboard'));

    expect($subscription->refresh())
        ->status->toBe('active')
        ->chapa_ref_id->toBe('chapa-reference-123')
        ->started_at->not->toBeNull()
        ->expires_at->not->toBeNull();

    expect($provider->refresh())
        ->status->toBe('published')
        ->published_at->not->toBeNull();
});
