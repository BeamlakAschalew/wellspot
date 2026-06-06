<?php

use App\Services\ProviderGeoSearch;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Schema;

/**
 * A lightweight stand-in for the Provider model so the geo logic can be tested
 * before Backend Dev 1's Provider model and migration are merged. ProviderGeoSearch
 * is model-agnostic, so this exercises the real bounding-box + Haversine code path.
 */
class GeoStubProvider extends Model
{
    protected $table = 'geo_stub_providers';

    public $timestamps = false;

    protected $guarded = [];
}

beforeEach(function () {
    Schema::create('geo_stub_providers', function ($table) {
        $table->id();
        $table->string('name');
        $table->decimal('latitude', 10, 8);
        $table->decimal('longitude', 11, 8);
    });

    // Addis Ababa centre is roughly 9.0320, 38.7469. ~0.01 deg latitude ≈ 1.11 km.
    GeoStubProvider::insert([
        ['name' => 'Centre', 'latitude' => 9.0320, 'longitude' => 38.7469],   // ~0 km
        ['name' => 'Near', 'latitude' => 9.0420, 'longitude' => 38.7469],     // ~1.1 km
        ['name' => 'Mid', 'latitude' => 9.0820, 'longitude' => 38.7469],      // ~5.6 km
        ['name' => 'Far', 'latitude' => 9.2320, 'longitude' => 38.7469],      // ~22 km
    ]);
});

afterEach(function () {
    Schema::dropIfExists('geo_stub_providers');
});

function geoSearch(): ProviderGeoSearch
{
    return new ProviderGeoSearch;
}

it('returns providers within the radius, nearest first, with a distance attribute', function () {
    $results = geoSearch()->within(GeoStubProvider::query(), 9.0320, 38.7469, 10);

    expect($results->pluck('name')->all())->toBe(['Centre', 'Near', 'Mid']);
    expect($results->first()->distance)->toBeLessThan(0.5);
    expect($results->last()->distance)->toBeGreaterThan(5)->toBeLessThan(7);
});

it('excludes providers outside the radius', function () {
    $results = geoSearch()->within(GeoStubProvider::query(), 9.0320, 38.7469, 2);

    expect($results->pluck('name')->all())->toBe(['Centre', 'Near']);
});

it('honours the result limit while keeping nearest first', function () {
    $results = geoSearch()->within(GeoStubProvider::query(), 9.0320, 38.7469, 50, 2);

    expect($results)->toHaveCount(2)
        ->and($results->pluck('name')->all())->toBe(['Centre', 'Near']);
});

it('sorts distances in ascending order', function () {
    $results = geoSearch()->within(GeoStubProvider::query(), 9.0320, 38.7469, 50);

    $distances = $results->pluck('distance')->all();
    $sorted = $distances;
    sort($sorted);

    expect($distances)->toBe($sorted);
});
