<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProviderProfileRequest;
use App\Models\Provider;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
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
        $provider = Provider::query()
            ->where('user_id', $request->user()->id)
            ->first();

        $validated = $this->validatedProfileAttributes($request);
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

        if ($logoPath = $this->storeLogo($request->file('logo'), $provider)) {
            $attributes['logo_path'] = $logoPath;
        }

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
        $validated = $this->validatedProfileAttributes($request);

        $attributes = [
            ...$validated,
            'slug' => $provider->name === $validated['name']
                ? $provider->slug
                : $this->uniqueSlug(Str::slug($validated['name']), $provider),
            'published_at' => $validated['status'] === 'published'
                ? ($provider->published_at ?? now())
                : null,
        ];

        if ($logoPath = $this->storeLogo($request->file('logo'), $provider)) {
            $attributes['logo_path'] = $logoPath;
        }

        $provider->fill($attributes);
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

    /**
     * @return array<string, mixed>
     */
    protected function validatedProfileAttributes(ProviderProfileRequest $request): array
    {
        return $request->safe()->except('logo');
    }

    protected function storeLogo(?UploadedFile $logo, ?Provider $provider = null): ?string
    {
        if (! $logo) {
            return null;
        }

        $path = $logo->store('provider-logos', 'public');

        if (! is_string($path)) {
            return null;
        }

        if ($provider?->logo_path) {
            Storage::disk('public')->delete($provider->logo_path);
        }

        return $path;
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
