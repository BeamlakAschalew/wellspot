<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProviderProfileRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ProviderProfileController extends ProviderListingController
{
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
            'message' => __('Provider profile saved.'),
        ]);

        return to_route('provider.dashboard');
    }
}
