<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\TransactionDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TransactionDetailController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $role = $user?->role ?? 'Buyer';
        $requestedAppointmentId = $request->query('appointment_id');

        // Load transactions depending on role. Prefer records in transaction_details,
        // otherwise fall back to appointments as a source of truth.
        if (strtolower($role) === 'seller') {
            $appointments = Appointment::with(['product', 'user'])
                ->whereHas('product', fn($q) => $q->where('user_id', $user->id))
                ->orderByDesc('date')
                ->orderByDesc('time')
                ->get();
        } else {
            // buyer
            $appointments = Appointment::with(['product', 'user'])
                ->where('users_id', $user->id)
                ->orderByDesc('date')
                ->orderByDesc('time')
                ->get();
        }

        // If a specific appointment_id is requested, narrow down
        if ($requestedAppointmentId) {
            $appointments = $appointments->where('id', (int) $requestedAppointmentId)->values();
        }

        // Map to table rows. 
        // If a TransactionDetail exists for an appointment, use it; otherwise compose from appointment.
        $appointmentIdToTxn = TransactionDetail::whereIn('appointment_id', $appointments->pluck('id'))
            ->get()
            ->keyBy('appointment_id');

        $transactions = $appointments->map(function ($a) use ($appointmentIdToTxn) {
            $txn = $appointmentIdToTxn->get($a->id);

            // Try to get first product image url (if using Mediable)
            $imageUrl = null;
            try {
                $firstMedia = $a->product?->media()->orderBy('order')->first();
                if ($firstMedia) {
                    $imageUrl = method_exists($firstMedia, 'getUrl') ? $firstMedia->getUrl() : null;
                }
            } catch (\Throwable $e) {
                $imageUrl = null;
            }

            return [
                'time' => substr($a->time, 0, 5),
                'buyer' => $txn->buyer ?? ($a->user?->name ?? 'Unknown'),
                'buyer_id' => $a->users_id,
                'method' => $txn->method ?? 'COD',
                'id' => $txn->external_id ?? ('APT-' . $a->id),
                'appointment_id' => $a->id,
                'appointment_code' => 'APT-' . $a->id,
                'amount' => $txn->amount ?? ($a->product?->product_price ?? 0),
                'status' => $txn->status ?? $a->status,
                // extras for detail header
                'date' => $a->date?->format('Y/m/d'),
                'location' => $a->locations,
                'item' => $a->product?->product_name,
                'seller' => $a->product?->user?->name,
                'seller_id' => $a->product?->user_id,
                'image' => $imageUrl,
            ];
        });

        return Inertia::render('TransactionDetail', [
            'role' => ucfirst(strtolower($role)),
            'transactions' => $transactions,
        ]);
    }

    /**
     * Handle Deal action for Buyer: finalize appointment and redirect to Review.
     */
    public function dealBuyer(Request $request)
    {
        $request->validate([
            'appointment_id' => 'required|integer|exists:appointment,id',
        ]);

        $user = Auth::user();
        $appointment = Appointment::with(['product', 'user'])->findOrFail($request->appointment_id);

        // Authorization: must be the buyer who owns the appointment
        if ($appointment->users_id !== $user->id) {
            return redirect()->back()->with('error', 'Unauthorized');
        }

        $txn = TransactionDetail::firstOrNew(['appointment_id' => $appointment->id]);
        if (!$txn->exists) {
            $txn->buyer_id = $appointment->users_id;
            $txn->time = substr($appointment->time, 0, 5);
            $txn->buyer = $appointment->user?->name ?? 'Buyer';
            $txn->method = 'COD';
            $txn->amount = $appointment->product?->product_price ?? 0;
        }
        $txn->buyer_deal = true;
        // If both parties dealt, mark completed and redirect accordingly
        if ($txn->seller_deal) {
            $appointment->update(['status' => 'completed']);
            $txn->status = 'completed';
            $txn->save();
            // For buyer, redirect to review page instead of confirm page
            $locale = $request->route('locale') ?? 'id';
            return redirect()->route('BuyerReview', ['locale' => $locale, 'appointment_id' => $appointment->id])->with('success', 'Completed, redirecting to review.');
        }
        $txn->save();
        return redirect()->back()->with('success', 'Waiting for seller confirmation.');
    }

    /**
     * Handle Deal action for Seller: finalize appointment and redirect to ConfirmPage.
     */
    public function dealSeller(Request $request)
    {
        $request->validate([
            'appointment_id' => 'required|integer|exists:appointment,id',
        ]);

        $user = Auth::user();
        $appointment = Appointment::with(['product', 'user'])->findOrFail($request->appointment_id);

        // Authorization: appointment's product must belong to this seller
        if ($appointment->product?->user_id !== $user->id) {
            return redirect()->back()->with('error', 'Unauthorized');
        }

        $txn = TransactionDetail::firstOrNew(['appointment_id' => $appointment->id]);
        if (!$txn->exists) {
            $txn->buyer_id = $appointment->users_id;
            $txn->time = substr($appointment->time, 0, 5);
            $txn->buyer = $appointment->user?->name ?? 'Buyer';
            $txn->method = 'COD';
            $txn->amount = $appointment->product?->product_price ?? 0;
        }
        $txn->seller_deal = true;
        if ($txn->buyer_deal) {
            $appointment->update(['status' => 'completed']);
            $txn->status = 'completed';
            $txn->save();
            $locale = $request->route('locale') ?? 'id';
            return redirect()->route('ConfirmPage', ['locale' => $locale, 'appointment_id' => $appointment->id])->with('success', 'Appointment completed.');
        }
        $txn->save();
        return redirect()->back()->with('success', 'Waiting for buyer confirmation.');
    }

    /**
     * Seller confirm page - show final deal details sourced from transaction_details/appointment.
     */
    public function confirm(Request $request)
    {
        $user = Auth::user();
        $role = 'Seller';
        $appointmentId = (int) $request->query('appointment_id');

        // If no appointment_id provided, 
        // try to find the most recent completed appointment for this seller
        if (!$appointmentId) {
            $appointment = Appointment::with(['product.user', 'user'])
                ->whereHas('product', function($q) use ($user) {
                    $q->where('user_id', $user->id);
                })
                ->where('status', 'completed')
                ->orderBy('updated_at', 'desc')
                ->first();
        } else {
            $appointment = Appointment::with(['product.user', 'user'])->findOrFail($appointmentId);
        }

        if (!$appointment) {
            $locale = $request->route('locale') ?? 'id';
            return redirect()->route('SellerMySchedule', ['locale' => $locale])->with('error', 'No completed appointment found.');
        }

        // Authorization: seller must own the product
        if ($appointment->product?->user_id !== $user->id) {
            return redirect()->back()->with('error', 'Unauthorized');
        }

        $txn = TransactionDetail::firstOrNew(['appointment_id' => $appointment->id]);

        // Try to get first product image url (if using Mediable)
        $imageUrl = null;
        try {
            $firstMedia = $appointment->product?->media()->orderBy('order')->first();
            if ($firstMedia) {
                $imageUrl = method_exists($firstMedia, 'getUrl') ? $firstMedia->getUrl() : null;
            }
        } catch (\Throwable $e) {
            $imageUrl = null;
        }

        $detail = [
            'id' => 'APT-' . $appointment->id,
            'item' => $appointment->product?->product_name,
            'date' => $appointment->date?->format('Y/m/d'),
            'time' => substr($appointment->time, 0, 5),
            'amount' => $txn->amount ?? ($appointment->product?->product_price ?? 0),
            'buyer' => $appointment->user?->name,
            'seller' => $appointment->product?->user?->name,
            'image' => $imageUrl,
            'appointment_id' => $appointment->id, // Add appointment_id for reference
        ];

        return Inertia::render('ConfirmPage', [
            'role' => $role,
            'detail' => $detail,
        ]);
    }
}


