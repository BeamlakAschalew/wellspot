<?php

use App\Http\Controllers\SearchController;
use App\Http\Controllers\WellnessRecommendationController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| These routes are stateless and prefixed with "/api". The wellness intake flow
| asks how the user feels, gathers a few choice-based answers, then ranks
| published providers by their active services.
|
*/

Route::post('/wellness/questions', [WellnessRecommendationController::class, 'questions'])
    ->middleware('throttle:20,1')
    ->name('api.wellness.questions');

Route::post('/wellness/recommendations', [WellnessRecommendationController::class, 'recommend'])
    ->middleware('throttle:40,1')
    ->name('api.wellness.recommendations');

Route::get('/providers/nearby', [SearchController::class, 'nearby'])
    ->middleware('throttle:60,1')
    ->name('api.providers.nearby');
