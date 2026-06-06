<?php

namespace App\Models;

use Database\Factories\ProviderSubscriptionFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'provider_id',
    'plan',
    'status',
    'amount',
    'currency',
    'payment_provider',
    'payment_reference',
    'trial_ends_at',
    'renews_at',
    'ends_at',
])]
class ProviderSubscription extends Model
{
    /** @use HasFactory<ProviderSubscriptionFactory> */
    use HasFactory;

    /**
     * @return BelongsTo<Provider, $this>
     */
    public function provider(): BelongsTo
    {
        return $this->belongsTo(Provider::class);
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'trial_ends_at' => 'datetime',
            'renews_at' => 'datetime',
            'ends_at' => 'datetime',
        ];
    }
}
