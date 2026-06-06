<?php

namespace App\Http\Controllers;

use App\Services\ProviderSearch;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ExploreController extends Controller
{
    public function __invoke(Request $request, ProviderSearch $providerSearch): Response
    {
        $validated = $request->validate([
            'search' => ['nullable', 'string', 'max:120'],
            'location' => ['nullable', 'string', 'max:120'],
            'category' => ['nullable', 'string', Rule::exists('categories', 'slug')],
        ]);

        $search = $validated['search'] ?? null;
        $location = $validated['location'] ?? null;
        $category = $validated['category'] ?? null;

        return Inertia::render('searchResult', [
            'filters' => [
                'search' => $search ?? '',
                'location' => $location ?? '',
                'category' => $category ?? '',
            ],
            'categories' => $providerSearch->categories(),
            'providers' => $providerSearch->providers($search, $location, $category, 48),
        ]);
    }
}
