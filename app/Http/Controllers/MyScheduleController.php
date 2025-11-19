<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\TransactionDetail;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class MyScheduleController extends Controller
{
    /**
     * Display MySchedule page based on user role
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $role = $user->role;

        if (strtolower($role) === 'buyer') {
            return $this->buyerSchedule($user);
        } elseif (strtolower($role) === 'seller') {
            return $this->sellerSchedule($user);
        }

        return redirect()->back()->with('error', 'Invalid user role');
    }

    /**
     * Get appointments for buyer
     */
    private function buyerSchedule($user)
    {
        $appointments = Appointment::with(['product.user'])
            ->where('users_id', $user->id)
            ->orderBy('date', 'asc')
            ->orderBy('time', 'asc')
            ->get();

        $events = $appointments->map(function ($appointment) {
            $eventData = [
                'id' => $appointment->id,
                'title' => 'COD ' . $appointment->product->product_name,
                'date' => $appointment->date->format('Y-m-d'),
                'time' => substr($appointment->time, 0, 5), // Format HH:MM
                'status' => $appointment->status,
                'locations' => $appointment->locations,
                'product_id' => $appointment->product_id,
                'seller_name' => $appointment->product->user->name,
                'color' => $this->getStatusColor($appointment->status)
            ];

            // Debug: Log each event
            Log::info('Buyer event data:', $eventData);

            return $eventData;
        });

        // Debug: Log final data being sent to frontend
        Log::info('Final buyer data being sent to frontend:', [
            'role' => 'Buyer',
            'appointments_count' => $appointments->count(),
            'events_count' => $events->count(),
            'events' => $events->toArray()
        ]);

        return Inertia::render('MySchedule', [
            'role' => 'Buyer',
            'appointments' => $appointments,
            'events' => $events
        ]);
    }

    /**
     * Get appointments for seller
     */
    private function sellerSchedule($user)
    {
        // Get appointments for products owned by this seller
        $appointments = Appointment::with(['product', 'user'])
            ->whereHas('product', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->orderBy('date', 'asc')
            ->orderBy('time', 'asc')
            ->get();

        $events = $appointments->map(function ($appointment) {
            $eventData = [
                'id' => $appointment->id,
                'title' => 'COD ' . $appointment->product->product_name,
                'date' => $appointment->date->format('Y-m-d'),
                'time' => substr($appointment->time, 0, 5), // Format HH:MM
                'status' => $appointment->status,
                'locations' => $appointment->locations,
                'product_id' => $appointment->product_id,
                'buyer_name' => $appointment->user->name,
                'color' => $this->getStatusColor($appointment->status)
            ];

            // Debug: Log each event
            Log::info('Seller event data:', $eventData);

            return $eventData;
        });

        // Debug: Log final data being sent to frontend
        Log::info('Final seller data being sent to frontend:', [
            'role' => 'Seller',
            'appointments_count' => $appointments->count(),
            'events_count' => $events->count(),
            'events' => $events->toArray()
        ]);

        return Inertia::render('MySchedule', [
            'role' => 'Seller',
            'appointments' => $appointments,
            'events' => $events
        ]);
    }

    /**
     * Update appointment status (for sellers)
     */
    public function updateStatus(Request $request, $routeLocale, Appointment $appointment)
    {
        $user = Auth::user();

        // Check if user is seller and owns the product
        if (!$user->isSeller() || $appointment->product->user_id !== $user->id) {
            return redirect()->back()->with('error', 'Unauthorized');
        }

        $request->validate([
            'status' => 'required|in:confirmed,rejected'
        ]);

        $appointment->update([
            'status' => $request->status
        ]);

        // Mirror status to transaction_details (if exists), else create one
        $txn = TransactionDetail::firstOrNew(['appointment_id' => $appointment->id]);
        if (!$txn->exists) {
            $txn->buyer_id = $appointment->users_id;
            $txn->time = substr($appointment->time, 0, 5);
            $txn->buyer = $appointment->user?->name ?? 'Buyer';
            $txn->method = 'COD';
            $txn->external_id = null;
            $txn->amount = $appointment->product?->product_price ?? 0;
        }
        $txn->status = $request->status;
        $txn->save();

        $locale = $routeLocale ?? ($request->route('locale') ?? 'id');
        return redirect()->route('SellerMySchedule', ['locale' => $locale])->with('success', 'Appointment status updated successfully!');
    }

    /**
     * Cancel appointment (for buyers)
     */
    public function cancelAppointment(Request $request, $routeLocale, Appointment $appointment)
    {
        $user = Auth::user();

        // Check if user is buyer and owns the appointment
        if (!$user->isBuyer() || $appointment->users_id !== $user->id) {
            return redirect()->back()->with('error', 'Unauthorized');
        }

        // Only allow cancellation if status is pending
        if ($appointment->status !== 'pending') {
            return redirect()->back()->with('error', 'Cannot cancel appointment that is not pending');
        }

        $appointment->update([
            'status' => 'cancelled'
        ]);

        $locale = $routeLocale ?? ($request->route('locale') ?? 'id');
        return redirect()->route('BuyerMySchedule', ['locale' => $locale])->with('success', 'Appointment cancelled successfully!');
    }

    /**
     * Get status color for UI
     */
    private function getStatusColor($status)
    {
        switch ($status) {
            case 'pending':
                return 'bg-yellow-200';
            case 'confirmed':
                return 'bg-green-200';
            case 'rejected':
                return 'bg-red-200';
            case 'cancelled':
                return 'bg-gray-200';
            case 'completed':
                return 'bg-blue-200';
            default:
                return 'bg-gray-200';
        }
    }

    /**
     * Get appointment details
     */
    public function show(Appointment $appointment)
    {
        $user = Auth::user();

        // Check if user has access to this appointment
        $hasAccess = false;
        if ($user->role === 'buyer' && $appointment->users_id === $user->id) {
            $hasAccess = true;
        } elseif ($user->role === 'seller' && $appointment->product->user_id === $user->id) {
            $hasAccess = true;
        }

        if (!$hasAccess) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $appointment->load(['product.user', 'user']);

        return response()->json([
            'appointment' => $appointment
        ]);
    }
}
