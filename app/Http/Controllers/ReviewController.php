<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ReviewController extends Controller
{
    public function show(Request $request)
    {
        $user = Auth::user();
        $role = $user?->role ?? 'Buyer';
        $appointmentId = (int) $request->query('appointment_id');

        // If no appointment_id provided
        // try to find a completed appointment for review
        if (!$appointmentId) {
            if (strtolower($role) === 'buyer') {
                $appointment = Appointment::where('users_id', $user->id)
                    ->where('status', 'completed')
                    ->whereDoesntHave('reviews', function($q) use ($user) {
                        $q->where('reviewer_id', $user->id);
                    })
                    ->orderBy('updated_at', 'desc')
                    ->first();
            } else {
                $appointment = Appointment::whereHas('product', function($q) use ($user) {
                        $q->where('user_id', $user->id);
                    })
                    ->where('status', 'completed')
                    ->whereDoesntHave('reviews', function($q) use ($user) {
                        $q->where('reviewer_id', $user->id);
                    })
                    ->orderBy('updated_at', 'desc')
                    ->first();
            }

            if ($appointment) {
                $appointmentId = $appointment->id;
            }
        }

        return Inertia::render('review', [
            'role' => ucfirst(strtolower($role)),
            'appointment_id' => $appointmentId,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'appointment_id' => 'required|integer|exists:appointment,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string',
        ]);

        $user = Auth::user();
        $appointment = Appointment::with(['product.user', 'user'])->findOrFail($data['appointment_id']);

        // Determine reviewee: 
        // if reviewer is buyer, reviewee is seller;
        // else buyer
        $revieweeId = $appointment->product?->user_id === $user->id ? $appointment->users_id : $appointment->product?->user_id;

        Review::create([
            'appointment_id' => $appointment->id,
            'reviewer_id' => $user->id,
            'reviewee_id' => $revieweeId,
            'rating' => $data['rating'],
            'comment' => $data['comment'] ?? null,
        ]);

        $user = Auth::user();
        $locale = $request->route('locale') ?? 'id';
        $redirectRoute = strtolower($user->role) === 'seller' ? 'SellerMySchedule' : 'BuyerMySchedule';
        return redirect()->route($redirectRoute, ['locale' => $locale])->with('success', 'Thank you for your review!');
    }
}


