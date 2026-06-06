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
            'message' => __('Provider profile saved.'),
        ]);

        return to_route('provider.dashboard');
    }
}
