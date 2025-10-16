<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ProfileBuyer;
use App\Models\ProfileSeller;
use App\Models\Appointment;
use App\Models\Report;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProfileController extends Controller
{
    // Get profile (READ)
    public function show($role)
    {
        $userId = Auth::id();

        if ($role === 'Buyer') {
            $profile = ProfileBuyer::where('user_id', $userId)->first();
        } else {
            $profile = ProfileSeller::where('user_id', $userId)->first();
        }

        // Get completed transactions
        $completedTransactions = $this->getCompletedTransactions($userId, $role);

        return Inertia::render('Profile', [
            'role' => $role,
            'profile' => $profile,
            'user' => Auth::user(),
            'completedTransactions' => $completedTransactions,
        ]);
    }

    /**
     * Get completed transactions for user
     */
    private function getCompletedTransactions($userId, $role)
    {
        $query = Appointment::with(['product', 'user'])
            ->where('status', 'completed');

        if ($role === 'Seller') {
            // Seller: get appointments where their product was sold
            $query->whereHas('product', function($q) use ($userId) {
                $q->where('user_id', $userId);
            });
        } else {
            // Buyer: get appointments they made
            $query->where('users_id', $userId);
        }

        return $query->orderByDesc('date')
            ->get()
            ->map(function($appointment) use ($role) {
                return [
                    'date' => $appointment->date->format('M d, Y'),
                    'buyer' => $role === 'Seller' ? $appointment->user->name : 'You',
                    'buyer_id' => $appointment->users_id, // ID buyer
                    'seller_id' => $appointment->product->user_id, // ID seller
                    'method' => 'COD',
                    'id' => 'INV' . str_pad($appointment->id, 10, '0', STR_PAD_LEFT),
                    'amount' => 'Rp ' . number_format($appointment->product->product_price, 0, ',', '.'),
                    'success' => true,
                    'appointment_id' => $appointment->id,
                ];
            });
    }

    // Create or Update profile (CREATE/UPDATE)
public function storeOrUpdate(Request $request, $role)
{
    $validated = $request->validate([
        'angkatan' => 'required|string',
        'firstname' => 'required|string',
        'lastname' => 'required|string',
        'university' => 'required|string',
        'email' => 'required|string',
    ]);

    $validated['user_id'] = Auth::id();
    $validated['item_buyed'] = 0; // tambahkan default ini
    $validated['item_selled'] = 0; // tambahkan default ini

    if ($role === 'Buyer') {
        $profile = ProfileBuyer::updateOrCreate(
            ['user_id' => $validated['user_id']],
            $validated
        );
    } else {
        $profile = ProfileSeller::updateOrCreate(
            ['user_id' => $validated['user_id']],
            $validated
        );
    }


   return response()->json($profile);


}


    // DELETE profile
    public function destroy($role)
    {
        $userId = Auth::id();

        if ($role === 'Buyer') {
            ProfileBuyer::where('user_id', $userId)->delete();
        } else {
            ProfileSeller::where('user_id', $userId)->delete();
        }

        return response()->json(['message' => 'Profile deleted']);
    }

    /**
     * Submit a report
     */
    public function submitReport(Request $request, $role)
    {
        $validated = $request->validate([
            'reported_id' => 'required|exists:users,id',
            'appointment_id' => 'nullable|exists:appointment,id',
            'reasons' => 'required|array|min:1',
            'reasons.*' => 'required|string',
            'additional_notes' => 'nullable|string',
        ]);

        $report = Report::create([
            'reporter_id' => Auth::id(),
            'reported_id' => $validated['reported_id'],
            'appointment_id' => $validated['appointment_id'] ?? null,
            'report_type' => $role === 'Seller' ? 'buyer' : 'seller',
            'reasons' => $validated['reasons'],
            'additional_notes' => $validated['additional_notes'] ?? null,
            'status' => 'pending',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Report submitted successfully',
            'report' => $report
        ]);
    }
}
