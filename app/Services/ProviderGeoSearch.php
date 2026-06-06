<?php

namespace App\Services;

use App\Models\Provider;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;

/**
 * "Near me" provider search that works identically on SQLite and MySQL.
 *
 * Raw trigonometric Haversine SQL (acos/cos/radians) is not available on
 * SQLite, so instead we apply a cheap, portable bounding-box pre-filter in SQL
 * and compute the exact Haversine distance in PHP. Each returned provider gets
 * a `distance` attribute (kilometres, rounded) and the set is sorted nearest
 * first.
 */
class ProviderGeoSearch
{
    private const EARTH_RADIUS_KM = 6371.0;

    /**
     * Filter and sort a provider query by distance from a coordinate.
     *
     * @param  Builder<Provider>  $query
     * @return Collection<int, Provider>
     */
    public function within(
        Builder $query,
        float $latitude,
        float $longitude,
        float $radiusKm = 10.0,
        ?int $limit = null,
    ): Collection {
        [$minLat, $maxLat, $minLng, $maxLng] = $this->boundingBox($latitude, $longitude, $radiusKm);

        return $query
            ->whereBetween('latitude', [$minLat, $maxLat])
            ->whereBetween('longitude', [$minLng, $maxLng])
            ->get()
            ->each(function (Model $provider) use ($latitude, $longitude): void {
                $provider->distance = $this->haversine(
                    $latitude,
                    $longitude,
                    (float) $provider->latitude,
                    (float) $provider->longitude,
                );
            })
            ->filter(fn (Model $provider): bool => $provider->distance <= $radiusKm)
            ->sortBy('distance')
            ->when($limit !== null, fn (Collection $providers): Collection => $providers->take($limit))
            ->values();
    }

    /**
     * Compute a latitude/longitude bounding box around a point.
     *
     * @return array{0: float, 1: float, 2: float, 3: float} [minLat, maxLat, minLng, maxLng]
     */
    private function boundingBox(float $latitude, float $longitude, float $radiusKm): array
    {
        $latDelta = rad2deg($radiusKm / self::EARTH_RADIUS_KM);

        // Guard against division by zero at the geographic poles.
        $cosLat = max(cos(deg2rad($latitude)), 1e-9);
        $lngDelta = rad2deg($radiusKm / (self::EARTH_RADIUS_KM * $cosLat));

        return [
            $latitude - $latDelta,
            $latitude + $latDelta,
            $longitude - $lngDelta,
            $longitude + $lngDelta,
        ];
    }

    /**
     * Great-circle distance between two coordinates, in kilometres.
     */
    private function haversine(float $lat1, float $lng1, float $lat2, float $lng2): float
    {
        $dLat = deg2rad($lat2 - $lat1);
        $dLng = deg2rad($lng2 - $lng1);

        $a = sin($dLat / 2) ** 2
            + cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * sin($dLng / 2) ** 2;

        return round(self::EARTH_RADIUS_KM * 2 * asin(min(1.0, sqrt($a))), 2);
    }
}
