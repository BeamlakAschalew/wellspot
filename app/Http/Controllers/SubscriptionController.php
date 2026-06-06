<?php

namespace App\Http\Controllers;

use App\Models\Provider;
use App\Models\ProviderSubscription;
use App\Services\ChapaClient;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class SubscriptionController extends Controller
{
    public function store(Request $request, ChapaClient $chapa): Response
    {
        $provider = $this->providerForUser($request);
        $activeServiceCount = $provider->services()->where('status', 'active')->count();
        abort_unless($activeServiceCount > 0, 422, __('Add at least one active service before subscribing.'));

        $serviceRate = (int) config('services.chapa.service_monthly_amount', 2000);
        $amount = $activeServiceCount * $serviceRate;
        $txRef = 'wellspot-'.$provider->id.'-'.Str::lower(Str::random(12));
        $callbackUrl = config('services.chapa.callback_url')
            ?: route('provider.subscription.callback', ['tx_ref' => $txRef]);
        $returnUrl = config('services.chapa.return_url') ?: route('provider.dashboard');
        $currency = (string) config('services.chapa.currency', 'ETB');
        $billingEmail = $this->billingEmail($provider, $request);
        $checkoutTitle = Str::limit((string) config('services.chapa.checkout_title', 'WellSpot'), 16, '');
        $checkoutDescription = Str::limit((string) config('services.chapa.checkout_description', 'Provider plan'), 32, '');

        $payload = [
            'amount' => $amount,
            'currency' => $currency,
            'email' => $billingEmail,
            'first_name' => $request->user()->name,
            'last_name' => $provider->name,
            'phone_number' => $provider->phone,
            'tx_ref' => $txRef,
            'callback_url' => $callbackUrl,
            'return_url' => $returnUrl,
            'customization' => [
                'title' => $checkoutTitle,
                'description' => $checkoutDescription,
            ],
        ];

        $response = $chapa->initialize($payload);
        $checkoutUrl = data_get($response, 'data.checkout_url');

        abort_unless(is_string($checkoutUrl) && $checkoutUrl !== '', 502, __('Chapa did not return a checkout URL.'));

        ProviderSubscription::query()->create([
            'provider_id' => $provider->id,
            'plan' => 'monthly',
            'amount' => $amount,
            'currency' => $currency,
            'chapa_tx_ref' => $txRef,
            'chapa_checkout_url' => $checkoutUrl,
            'status' => 'pending',
        ]);

        return inertia_location($checkoutUrl);
    }

    public function callback(Request $request, ChapaClient $chapa): Response
    {
        $txRef = (string) ($request->query('tx_ref') ?: $request->query('trx_ref'));
        abort_if($txRef === '', 404);

        /** @var ProviderSubscription $subscription */
        $subscription = ProviderSubscription::query()
            ->with('provider')
            ->where('chapa_tx_ref', $txRef)
            ->firstOrFail();

        $verification = $chapa->verify($txRef);
        $status = (string) data_get($verification, 'data.status', data_get($verification, 'status'));
        $reference = data_get($verification, 'data.reference', data_get($verification, 'data.ref_id', $request->query('ref_id')));

        if ($status === 'success') {
            $subscription->update([
                'chapa_ref_id' => is_string($reference) ? $reference : null,
                'status' => 'active',
                'started_at' => now(),
                'expires_at' => now()->addDays(30),
            ]);

            $subscription->provider->update([
                'status' => 'published',
                'published_at' => $subscription->provider->published_at ?? now(),
            ]);

            Inertia::flash('toast', [
                'type' => 'success',
                'message' => __('Subscription activated.'),
            ]);
        } else {
            $subscription->update([
                'chapa_ref_id' => is_string($reference) ? $reference : null,
                'status' => 'failed',
            ]);

            Inertia::flash('toast', [
                'type' => 'error',
                'message' => __('Subscription payment was not completed.'),
            ]);
        }

        return to_route('provider.dashboard');
    }

    private function providerForUser(Request $request): Provider
    {
        return Provider::query()
            ->where('user_id', $request->user()->id)
            ->firstOrFail();
    }

    private function billingEmail(Provider $provider, Request $request): string
    {
        $candidates = [
            $provider->email,
            $request->user()->email,
            config('services.chapa.fallback_email'),
            'billing@wellspot.test',
        ];

        foreach ($candidates as $candidate) {
            if (is_string($candidate) && filter_var($candidate, FILTER_VALIDATE_EMAIL)) {
                return $candidate;
            }
        }

        return 'billing@wellspot.test';
    }
}
