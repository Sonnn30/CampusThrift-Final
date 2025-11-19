<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\TransactionDetail;
use App\Models\Product;
use App\Http\Requests\CODRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class CODController extends Controller
{
    /**
     * Display COD date selection page
     */
    public function showDate(Request $request)
    {
        $user = Auth::user();

        // Check if user is buyer
        if (!$user->isBuyer()) {
            return redirect()->back()->with('error', 'Only buyers can make COD appointments.');
        }

        $productId = $request->query('product_id');

        if (!$productId) {
            return redirect()->back()->with('error', 'Product ID is required');
        }

        $product = Product::findOrFail($productId);

        return Inertia::render('CODDate', [
            'product' => $product
        ]);
    }

    /**
     * Store COD date and redirect to time selection
     */
    public function storeDate(Request $request)
    {
        $user = Auth::user();

        // Check if user is buyer
        if (!$user->isBuyer()) {
            return redirect()->back()->with('error', 'Only buyers can make COD appointments.');
        }

        $request->validate([
            'product_id' => 'required|exists:products,id',
            'date' => 'required|date|after:today'
        ]);

        // Store date in session for later use
        session(['cod_date' => $request->date]);
        session(['cod_product_id' => $request->product_id]);

        $locale = $request->route('locale') ?? 'id';
        return redirect()->route('CODTime', ['locale' => $locale]);
    }

    /**
     * Display COD time selection page
     */
    public function showTime()
    {
        $user = Auth::user();

        // Check if user is buyer
        if (!$user->isBuyer()) {
            return redirect()->back()->with('error', 'Only buyers can make COD appointments.');
        }

        $date = session('cod_date');
        $productId = session('cod_product_id');

        if (!$date || !$productId) {
            $locale = request()->route('locale') ?? 'id';
            return redirect()->route('CODDate', ['locale' => $locale])->with('error', 'Please select a date first');
        }

        $product = Product::findOrFail($productId);

        // Get available time slots (you can customize this logic)
        $availableTimes = $this->getAvailableTimeSlots($date);

        return Inertia::render('CODTime', [
            'product' => $product,
            'selectedDate' => $date,
            'availableTimes' => $availableTimes
        ]);
    }

    /**
     * Store COD time and redirect to location selection
     */
    public function storeTime(Request $request)
    {
        $user = Auth::user();

        // Check if user is buyer
        if (!$user->isBuyer()) {
            return redirect()->back()->with('error', 'Only buyers can make COD appointments.');
        }

        $request->validate([
            'time' => 'required|date_format:H:i'
        ]);

        // Store time in session
        session(['cod_time' => $request->time]);

        $locale = $request->route('locale') ?? 'id';
        return redirect()->route('CODLocation', ['locale' => $locale]);
    }

    /**
     * Display COD location selection page
     */
    public function showLocation()
    {
        $user = Auth::user();

        // Check if user is buyer
        if (!$user->isBuyer()) {
            return redirect()->back()->with('error', 'Only buyers can make COD appointments.');
        }

        $date = session('cod_date');
        $time = session('cod_time');
        $productId = session('cod_product_id');

        if (!$date || !$time || !$productId) {
            $locale = request()->route('locale') ?? 'id';
            return redirect()->route('CODDate', ['locale' => $locale])->with('error', 'Please complete date and time selection first');
        }

        $product = Product::findOrFail($productId);

        // Get available locations (you can customize this logic)
        $availableLocations = $this->getAvailableLocations();

        return Inertia::render('CODLocation', [
            'product' => $product,
            'selectedDate' => $date,
            'selectedTime' => $time,
            'availableLocations' => $availableLocations
        ]);
    }

    /**
     * Display COD location recommendation page with map
     */
    public function showLocationRecommendation()
    {
        $user = Auth::user();

        // Check if user is buyer
        if (!$user->isBuyer()) {
            return redirect()->back()->with('error', 'Only buyers can make COD appointments.');
        }

        $date = session('cod_date');
        $time = session('cod_time');
        $productId = session('cod_product_id');

        if (!$date || !$time || !$productId) {
            $locale = request()->route('locale') ?? 'id';
            return redirect()->route('CODDate', ['locale' => $locale])->with('error', 'Please complete date and time selection first');
        }

        $product = Product::findOrFail($productId);

        // Get recommended safe locations
        $availableLocations = [
            'Campus Kemanggisan',
            'Campus Syahdan',
            'Binus Square Food Court',
            'Anggrek Campus Library'
        ];

        return Inertia::render('locationRecommendation', [
            'product' => [
                'id' => $product->id,
                'product_name' => $product->product_name,
                'product_price' => $product->product_price,
                'description' => $product->description,
                'image' => $product->getMedia('product_images')->first()?->getUrl()
            ],
            'selectedDate' => $date,
            'selectedTime' => $time,
            'availableLocations' => $availableLocations
        ]);
    }

    /**
     * Store COD location and create appointment
     */
    public function storeLocation(Request $request)
    {
        $user = Auth::user();

        // Check if user is buyer
        if (!$user->isBuyer()) {
            return redirect()->back()->with('error', 'Only buyers can make COD appointments.');
        }

        $request->validate([
            'location' => 'required|string|max:255',
            'product_id' => 'required|exists:products,id',
            'date' => 'required|date',
            'time' => 'required|date_format:H:i'
        ]);

        // Create appointment
        $appointment = Appointment::create([
            'product_id' => $request->product_id,
            'users_id' => Auth::id(),
            'status' => 'pending',
            'date' => $request->date,
            'time' => $request->time,
            'locations' => $request->location
        ]);

        // Also create a corresponding transaction detail record (pending)
        $product = Product::find($request->product_id);
        TransactionDetail::create([
            'appointment_id' => $appointment->id,
            'buyer_id' => Auth::id(),
            'time' => $request->time,
            'buyer' => Auth::user()?->name ?? 'Buyer',
            'method' => 'COD',
            'external_id' => null,
            'amount' => $product?->product_price ?? 0,
            'status' => 'pending',
            'paid_at' => null,
        ]);

        // Clear session data
        session()->forget(['cod_date', 'cod_time', 'cod_product_id']);

        // Redirect to MySchedule with date query so the calendar focuses the correct week
        $locale = $request->route('locale') ?? 'id';
        return redirect()->route('BuyerMySchedule', ['locale' => $locale, 'date' => $request->date])
            ->with('success', 'COD appointment created successfully!');
    }

    /**
     * Get available time slots for a given date
     */
    private function getAvailableTimeSlots($date)
    {
        // Get existing appointments for this date
        $existingAppointments = Appointment::where('date', $date)
            ->where('status', '!=', 'cancelled')
            ->pluck('time')
            ->toArray();

        // Define available time slots (9 AM to 5 PM, every hour)
        $allTimeSlots = [
            '09:00', '10:00', '11:00', '12:00',
            '13:00', '14:00', '15:00', '16:00', '17:00'
        ];

        // Filter out booked time slots
        $availableTimes = array_diff($allTimeSlots, $existingAppointments);

        return array_values($availableTimes);
    }

    /**
     * Get available locations
     */
    private function getAvailableLocations()
    {
        // You can customize this based on your requirements
        return [
            'Campus Main Gate',
            'Library Entrance',
            'Student Center',
            'Cafeteria',
            'Sports Complex',
            'Parking Lot A',
            'Parking Lot B'
        ];
    }

    /**
     * Show appointment details
     */
    public function show(Appointment $appointment)
    {
        $appointment->load(['product', 'user']);

        return Inertia::render('AppointmentDetail', [
            'appointment' => $appointment
        ]);
    }

    /**
     * Update appointment status
     */
    public function updateStatus(Request $request, Appointment $appointment)
    {
        $request->validate([
            'status' => 'required|in:pending,confirmed,cancelled,completed'
        ]);

        $appointment->update([
            'status' => $request->status
        ]);

        return redirect()->back()->with('success', 'Appointment status updated successfully!');
    }
}
