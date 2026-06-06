<?php

namespace App\Services;

use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Http;

class ChapaClient
{
    /**
     * @param  array<string, mixed>  $payload
     * @return array<string, mixed>
     */
    public function initialize(array $payload): array
    {
        return $this->request()
            ->post('/v1/transaction/initialize', $payload)
            ->throw()
            ->json();
    }

    /**
     * @return array<string, mixed>
     */
    public function verify(string $txRef): array
    {
        return $this->request()
            ->get("/v1/transaction/verify/{$txRef}")
            ->throw()
            ->json();
    }

    private function request(): PendingRequest
    {
        return Http::baseUrl((string) config('services.chapa.base_url'))
            ->withToken((string) config('services.chapa.secret_key'))
            ->acceptJson()
            ->asJson()
            ->timeout(15)
            ->connectTimeout(5);
    }
}
