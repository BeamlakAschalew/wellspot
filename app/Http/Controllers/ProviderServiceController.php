<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProviderServiceRequest;
use App\Models\Provider;
use App\Models\Service;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;

class ProviderServiceController extends Controller
{
    public function store(ProviderServiceRequest $request): RedirectResponse
    {
        $provider = $this->providerForUser($request->user()->id);
        $validated = $request->validated();
        $slug = Str::slug($validated['name']);

        $provider->services()->create([
            ...$validated,
            'slug' => $this->uniqueSlug($provider, $slug),
            'currency' => 'ETB',
            'status' => $validated['status'] ?? 'active',
        ]);

        return to_route('provider.dashboard');
    }

    public function update(ProviderServiceRequest $request, Service $service): RedirectResponse
    {
        $provider = $this->providerForUser($request->user()->id);
        abort_unless($service->provider_id === $provider->id, 404);

        $validated = $request->validated();
        $service->update([
            ...$validated,
            'slug' => $service->name === $validated['name']
                ? $service->slug
                : $this->uniqueSlug($provider, Str::slug($validated['name']), $service),
            'currency' => 'ETB',
            'status' => $validated['status'] ?? $service->status,
        ]);

        return to_route('provider.dashboard');
    }

    public function destroy(Service $service): RedirectResponse
    {
        $provider = $this->providerForUser(request()->user()->id);
        abort_unless($service->provider_id === $provider->id, 404);

        $service->delete();

        return to_route('provider.dashboard');
    }

    private function providerForUser(int $userId): Provider
    {
        return Provider::query()
            ->where('user_id', $userId)
            ->firstOrFail();
    }

    private function uniqueSlug(Provider $provider, string $slug, ?Service $ignoreService = null): string
    {
        $candidate = $slug;
        $counter = 2;

        while ($provider->services()
            ->when($ignoreService, fn ($query) => $query->whereKeyNot($ignoreService->id))
            ->where('slug', $candidate)
            ->exists()) {
            $candidate = "{$slug}-{$counter}";
            $counter++;
        }

        return $candidate;
    }
}
