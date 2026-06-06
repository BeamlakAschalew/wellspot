<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Service;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class BookingController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'service_id' => ['required', 'integer', Rule::exists('services', 'id')],
            'starts_at' => ['required', 'date', 'after:now'],
            'customer_name' => ['required', 'string', 'max:120'],
            'customer_phone' => ['required', 'string', 'max:40'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);

        /** @var Service $service */
        $service = Service::query()
            ->where('status', 'active')
            ->findOrFail($validated['service_id']);

        $booking = Booking::query()->create([
            'user_id' => $request->user()?->id,
            'provider_id' => $service->provider_id,
            'service_id' => $service->id,
            'starts_at' => Carbon::parse($validated['starts_at']),
            'status' => 'pending',
            'customer_name' => $validated['customer_name'],
            'customer_phone' => $validated['customer_phone'],
            'notes' => $validated['notes'] ?? null,
            'total_amount' => $service->price_amount,
            'currency' => $service->currency,
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Booking request sent.'),
        ]);

        return back()->with('booking_id', $booking->id);
    }

    public function updateStatus(Request $request, Booking $booking): RedirectResponse
    {
        $provider = $request->user()
            ?->providers()
            ->whereKey($booking->provider_id)
            ->first();

        abort_unless($provider !== null, 404);

        $validated = $request->validate([
            'status' => ['required', 'string', Rule::in(['pending', 'confirmed', 'completed', 'cancelled'])],
        ]);

        $booking->update([
            'status' => $validated['status'],
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Booking status updated.'),
        ]);

        return to_route('provider.dashboard');
    }
}
