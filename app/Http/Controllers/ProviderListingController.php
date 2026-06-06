<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProviderProfileRequest;
use App\Models\Provider;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ProviderListingController extends Controller
{
    public function create(): RedirectResponse
    {
        return to_route('provider.dashboard');
    }

    public function store(ProviderProfileRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $provider = Provider::query()
            ->where('user_id', $request->user()->id)
            ->first();

        $attributes = [
            ...$validated,
            'user_id' => $request->user()->id,
            'slug' => $provider?->name === $validated['name']
                ? $provider->slug
                : $this->uniqueSlug(Str::slug($validated['name']), $provider),
            'published_at' => $validated['status'] === 'published'
                ? ($provider?->published_at ?? now())
                : null,
        ];

        if ($provider) {
            $provider->update($attributes);
        } else {
            Provider::query()->create($attributes);
        }

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => $provider ? __('Provider listing saved.') : __('Provider listing created.'),
        ]);

        return to_route('provider.dashboard');
    }

    public function edit(Request $request): RedirectResponse
    {
        $this->providerForUser($request->user()->id);

        return to_route('provider.dashboard');
    }

    public function update(ProviderProfileRequest $request): RedirectResponse
    {
        $provider = $this->providerForUser($request->user()->id);
        $validated = $request->validated();

        $provider->fill([
            ...$validated,
            'slug' => $provider->name === $validated['name']
                ? $provider->slug
                : $this->uniqueSlug(Str::slug($validated['name']), $provider),
            'published_at' => $validated['status'] === 'published'
                ? ($provider->published_at ?? now())
                : null,
        ]);
        $provider->save();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Provider listing saved.'),
        ]);

        return to_route('provider.dashboard');
    }

    protected function providerForUser(int $userId): Provider
    {
        return Provider::query()
            ->where('user_id', $userId)
            ->firstOrFail();
    }

    protected function uniqueSlug(string $slug, ?Provider $ignoreProvider = null): string
    {
        $candidate = $slug;
        $counter = 2;

        while (Provider::query()
            ->when($ignoreProvider, fn ($query) => $query->whereKeyNot($ignoreProvider->id))
            ->where('slug', $candidate)
            ->exists()) {
            $candidate = "{$slug}-{$counter}";
            $counter++;
        }

        return $candidate;
    }
}
