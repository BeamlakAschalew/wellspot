<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProviderProfileRequest;
use App\Models\Provider;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;

class ProviderProfileController extends Controller
{
    public function update(ProviderProfileRequest $request): RedirectResponse
    {
        $provider = Provider::query()
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

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

        return to_route('provider.dashboard');
    }

    private function uniqueSlug(string $slug, Provider $ignoreProvider): string
    {
        $candidate = $slug;
        $counter = 2;

        while (Provider::query()
            ->whereKeyNot($ignoreProvider->id)
            ->where('slug', $candidate)
            ->exists()) {
            $candidate = "{$slug}-{$counter}";
            $counter++;
        }

        return $candidate;
    }
}
