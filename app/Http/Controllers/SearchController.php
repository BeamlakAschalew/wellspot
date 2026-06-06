<?php

namespace App\Http\Controllers;

use App\Models\Provider;
use App\Services\ProviderGeoSearch;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    /**
     * Geo "near me" search for published providers within a radius.
     */
    public function nearby(Request $request, ProviderGeoSearch $geoSearch): JsonResponse
    {
        $validated = $request->validate([
            'lat' => ['required', 'numeric', 'between:-90,90'],
            'lng' => ['required', 'numeric', 'between:-180,180'],
            'radius' => ['nullable', 'numeric', 'min:1', 'max:50'],
            'category' => ['nullable', 'string', 'max:60'],
        ]);

        $query = Provider::query()
            ->with([
                'category',
                'services' => fn ($query) => $query
                    ->where('status', 'active')
                    ->orderBy('sort_order')
                    ->orderBy('name'),
            ])
            ->where('status', 'published')
            ->whereHas('services', fn ($query) => $query->where('status', 'active'))
            ->when(
                $validated['category'] ?? null,
                fn ($query, $slug) => $query->whereHas('category', fn ($category) => $category->where('slug', $slug)),
            );

        $providers = $geoSearch->within(
            $query,
            (float) $validated['lat'],
            (float) $validated['lng'],
            (float) ($validated['radius'] ?? 10),
            50,
        );

        return response()->json($providers);
    }
}
