<?php

use App\Http\Controllers\BookingController;
use App\Http\Controllers\ExploreController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\LocaleController;
use App\Http\Controllers\ProviderDashboardController;
use App\Http\Controllers\ProviderDetailController;
use App\Http\Controllers\ProviderListingController;
use App\Http\Controllers\ProviderProfileController;
use App\Http\Controllers\ProviderServiceController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\SubscriptionController;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class)->name('home');
Route::get('/explore', ExploreController::class)->name('explore');
Route::post('locale', LocaleController::class)->name('locale.update');
Route::inertia('/quiz', 'quiz')->name('quiz');
Route::inertia('/response', 'response')->name('response');
Route::get('providers/{provider}', ProviderDetailController::class)->name('providers.show');
Route::post('bookings', [BookingController::class, 'store'])->name('bookings.store');
Route::post('reviews', [ReviewController::class, 'store'])->name('reviews.store');
Route::get('provider/subscription/callback', [SubscriptionController::class, 'callback'])->name('provider.subscription.callback');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::redirect('provider/dashboard', '/providers')->name('provider.dashboard.legacy');
    Route::get('providers', ProviderDashboardController::class)->name('provider.dashboard');

    Route::prefix('provider')->name('provider.')->group(function () {
        Route::get('listing/create', [ProviderListingController::class, 'create'])->name('listing.create');
        Route::post('listing', [ProviderListingController::class, 'store'])->name('listing.store');
        Route::get('listing/edit', [ProviderListingController::class, 'edit'])->name('listing.edit');
        Route::patch('listing', [ProviderListingController::class, 'update'])->name('listing.update');
        Route::patch('profile', [ProviderProfileController::class, 'update'])->name('profile.update');
        Route::post('services', [ProviderServiceController::class, 'store'])->name('services.store');
        Route::patch('services/{service}', [ProviderServiceController::class, 'update'])->name('services.update');
        Route::delete('services/{service}', [ProviderServiceController::class, 'destroy'])->name('services.destroy');
        Route::post('service-listings', [ServiceController::class, 'store'])->name('service-listings.store');
        Route::patch('service-listings/{service}', [ServiceController::class, 'update'])->name('service-listings.update');
        Route::delete('service-listings/{service}', [ServiceController::class, 'destroy'])->name('service-listings.destroy');
        Route::patch('bookings/{booking}/status', [BookingController::class, 'updateStatus'])->name('bookings.status.update');
        Route::post('subscription', [SubscriptionController::class, 'store'])->name('subscription.store');
    });
});

require __DIR__.'/settings.php';
