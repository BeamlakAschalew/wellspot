<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Review;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReviewController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'booking_id' => ['required', 'integer', 'exists:bookings,id'],
            'customer_phone' => ['required', 'string', 'max:40'],
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'title' => ['nullable', 'string', 'max:120'],
            'comment' => ['nullable', 'string', 'max:1000'],
        ]);

        /** @var Booking $booking */
        $booking = Booking::query()->findOrFail($validated['booking_id']);

        abort_unless($booking->customer_phone === $validated['customer_phone'], 404);

        Review::query()->updateOrCreate(
            ['booking_id' => $booking->id],
            [
                'user_id' => $booking->user_id,
                'provider_id' => $booking->provider_id,
                'rating' => $validated['rating'],
                'title' => $validated['title'] ?? null,
                'comment' => $validated['comment'] ?? null,
                'is_published' => true,
            ],
        );

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Review submitted.'),
        ]);

        return back();
    }
}
