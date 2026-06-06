<?php

namespace App\Models;

use Database\Factories\ProviderFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Facades\Storage;

#[Fillable([
    'user_id',
    'category_id',
    'name',
    'slug',
    'logo_path',
    'headline',
    'description',
    'phone',
    'email',
    'address',
    'neighborhood',
    'latitude',
    'longitude',
    'amenities',
    'opening_hours',
    'status',
    'is_featured',
    'published_at',
])]
class Provider extends Model
{
    /** @use HasFactory<ProviderFactory> */
    use HasFactory;

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return BelongsTo<Category, $this>
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * @return HasMany<Service, $this>
     */
    public function services(): HasMany
    {
        return $this->hasMany(Service::class);
    }

    /**
     * @return HasMany<Booking, $this>
     */
    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    /**
     * @return HasMany<Review, $this>
     */
    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    /**
     * @return HasMany<ProviderSubscription, $this>
     */
    public function subscriptions(): HasMany
    {
        return $this->hasMany(ProviderSubscription::class);
    }

    /**
     * @return HasOne<ProviderSubscription, $this>
     */
    public function subscription(): HasOne
    {
        return $this->hasOne(ProviderSubscription::class)->latestOfMany();
    }

    /**
     * @return Attribute<?string, never>
     */
    protected function logoUrl(): Attribute
    {
        return Attribute::get(fn (): ?string => $this->logo_path
            ? Storage::disk('public')->url($this->logo_path)
            : null);
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'amenities' => 'array',
            'opening_hours' => 'array',
            'is_featured' => 'boolean',
            'latitude' => 'decimal:7',
            'longitude' => 'decimal:7',
            'published_at' => 'datetime',
        ];
    }
}
