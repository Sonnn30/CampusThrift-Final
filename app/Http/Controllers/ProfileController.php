<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ProfileBuyer;
use App\Models\ProfileSeller;
use App\Models\Appointment;
use App\Models\Report;
use App\Models\TransactionDetail;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ProfileController extends Controller
{
    // Get profile (READ)
    public function show($role)
    {
        $userId = Auth::id();
        $role = ucfirst(strtolower($role));

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
        $isSeller = strtolower($role) === 'seller';
        $completedStatuses = ['completed', 'confirmed'];

        // Prefer using transaction_details table if entries exist
        $transactionQuery = TransactionDetail::with(['appointment.product.user', 'appointment.user'])
            ->whereIn('status', $completedStatuses);

        if ($isSeller) {
            $transactionQuery->whereHas('appointment.product', function ($q) use ($userId) {
                $q->where('user_id', $userId);
            });
        } else {
            $transactionQuery->where('buyer_id', $userId);
        }

        $transactions = $transactionQuery->orderByDesc('updated_at')->get();

        if ($transactions->isNotEmpty()) {
            return $transactions->map(function ($txn) use ($isSeller) {
                $appointment = $txn->appointment;
                $product = $appointment?->product;
                $buyerName = $txn->buyer ?? $appointment?->user?->name ?? 'Buyer';

                $date = $appointment?->date
                    ? $appointment->date->format('M d, Y')
                    : ($txn->paid_at ? $txn->paid_at->format('M d, Y') : now()->format('M d, Y'));

                return [
                    'date' => $date,
                    'buyer' => $isSeller ? $buyerName : 'You',
                    'buyer_id' => $txn->buyer_id ?? $appointment?->users_id,
                    'seller_id' => $product?->user_id,
                    'method' => $txn->method ?? 'COD',
                    'id' => $txn->external_id ?? ('APT-' . ($appointment?->id ?? '')),
                    'amount' => 'Rp ' . number_format($txn->amount ?? ($product?->product_price ?? 0), 0, ',', '.'),
                    'success' => in_array(strtolower($txn->status ?? ''), ['completed', 'confirmed']),
                    'appointment_id' => $appointment?->id,
                ];
            })->values()->toArray();
        }

        // Fallback to appointments table if there are no transaction_details yet
        $appointmentQuery = Appointment::with(['product', 'user'])
            ->whereIn('status', $completedStatuses);

        if ($isSeller) {
            $appointmentQuery->whereHas('product', function ($q) use ($userId) {
                $q->where('user_id', $userId);
            });
        } else {
            $appointmentQuery->where('users_id', $userId);
        }

        return $appointmentQuery->orderByDesc('date')
            ->get()
            ->map(function ($appointment) use ($isSeller) {
                $product = $appointment->product;
                return [
                    'date' => $appointment->date->format('M d, Y'),
                    'buyer' => $isSeller ? ($appointment->user->name ?? 'Buyer') : 'You',
                    'buyer_id' => $appointment->users_id,
                    'seller_id' => $product?->user_id,
                    'method' => 'COD',
                    'id' => 'APT-' . $appointment->id,
                    'amount' => 'Rp ' . number_format($product?->product_price ?? 0, 0, ',', '.'),
                    'success' => true,
                    'appointment_id' => $appointment->id,
                ];
            })->values()->toArray();
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
            'reported_id' => [
                'required',
                'exists:users,id',
                Rule::notIn([Auth::id()]),
            ],
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
