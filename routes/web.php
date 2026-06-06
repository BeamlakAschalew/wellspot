<?php

use App\Http\Controllers\ProviderDashboardController;
use App\Http\Controllers\ProviderProfileController;
use App\Http\Controllers\ProviderServiceController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');
Route::inertia('/quiz', 'quiz')->name('quiz');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('provider')->name('provider.')->group(function () {
        Route::get('dashboard', ProviderDashboardController::class)->name('dashboard');
        Route::patch('profile', [ProviderProfileController::class, 'update'])->name('profile.update');
        Route::post('services', [ProviderServiceController::class, 'store'])->name('services.store');
        Route::patch('services/{service}', [ProviderServiceController::class, 'update'])->name('services.update');
        Route::delete('services/{service}', [ProviderServiceController::class, 'destroy'])->name('services.destroy');
    });
});

require __DIR__.'/settings.php';
