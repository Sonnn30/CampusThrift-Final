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
    public function show($role = null, $userId = null)
    {
        $currentUserId = Auth::id();

        // CRITICAL: Get route parameters directly from request to ensure accuracy
        $routeRole = request()->route('role');
        $routeUserId = request()->route('userId');

        \Log::info('ProfileController::show - Initial parameters', [
            'method_role_param' => $role,
            'method_userId_param' => $userId,
            'route_role_param' => $routeRole,
            'route_userId_param' => $routeUserId,
            'url' => request()->fullUrl(),
            'path' => request()->path(),
        ]);

        // CRITICAL: Check if we have both parameters (new format: /Profile/{role}/{userId})
        // Use route parameters directly for accuracy
        if ($routeUserId !== null && is_numeric($routeUserId) && $routeRole !== null && !is_numeric($routeRole)) {
            // New format: /Profile/{role}/{userId}
            $targetUserId = (int) $routeUserId;
            $role = ucfirst(strtolower($routeRole));
            \Log::info('Using new format /Profile/{role}/{userId}', [
                'role' => $role,
                'userId' => $targetUserId,
                'url' => request()->fullUrl()
            ]);
        } else {
            // Old format: /Profile/{userId} - $role is actually the userId parameter
            // Use method parameter as fallback if route parameter not available
            $param = $routeRole ?? $role;

            // Check if param is numeric (user ID) or string (role)
            if (is_numeric($param)) {
                // It's a user ID
                $targetUserId = (int) $param;
                // Get role from the target user
                $targetUser = \App\Models\User::find($targetUserId);
                if (!$targetUser) {
                    $locale = request()->route('locale') ?? 'id';
                    return redirect()->route('home', ['locale' => $locale])->with('error', 'User not found');
                }
                $role = ucfirst(strtolower($targetUser->role));
                \Log::info('Using old format /Profile/{userId}', [
                    'userId' => $targetUserId,
                    'role' => $role,
                    'url' => request()->fullUrl()
                ]);
            } else {
                // It's a role string (backward compatibility: /Profile/Buyer or /Profile/Seller)
                $role = ucfirst(strtolower($param));
                $targetUserId = $currentUserId; // Use current user's ID
                \Log::info('Using old format /Profile/{role}', [
                    'role' => $role,
                    'targetUserId' => $targetUserId,
                    'url' => request()->fullUrl()
                ]);
            }
        }

        // Validate target user exists
        $targetUser = \App\Models\User::find($targetUserId);
        if (!$targetUser) {
            $locale = request()->route('locale') ?? 'id';
            return redirect()->route('home', ['locale' => $locale])->with('error', 'User not found');
        }

        // Get actual role from user and use it (don't redirect if mismatch, just use correct role)
        $actualRole = ucfirst(strtolower($targetUser->role));
        // Use actual role instead of parameter role to avoid redirect loops
        $role = $actualRole;

        // Log for debugging - CRITICAL: Verify targetUserId is correct
        \Log::info('ProfileController::show - Final values', [
            'route_role_param' => request()->route('role'),
            'route_userId_param' => request()->route('userId'),
            'method_role_param' => $role,
            'method_userId_param' => $userId,
            'targetUserId_FINAL' => $targetUserId,
            'targetUserRole_FINAL' => $role,
            'currentUserId' => $currentUserId,
            'currentUserRole' => Auth::user()?->role,
            'url' => request()->fullUrl(),
            'path' => request()->path(),
        ]);

        // CRITICAL: Get profile for the target user (NOT the current user) - Always use $targetUserId
        if ($role === 'Buyer') {
            $profile = ProfileBuyer::where('user_id', $targetUserId)->first();
        } else {
            $profile = ProfileSeller::where('user_id', $targetUserId)->first();
        }

        // CRITICAL: Get completed transactions for the target user (NOT the current user) - Always use $targetUserId
        $completedTransactions = $this->getCompletedTransactions($targetUserId, $role);

        // CRITICAL: Check if current user can edit this profile (only owner can edit)
        $canEdit = ($currentUserId !== null && $targetUserId !== null && $currentUserId === $targetUserId);

        // Get the profile owner user object
        $profileOwner = \App\Models\User::find($targetUserId);

        \Log::info('ProfileController::show returning', [
            'targetUserId' => $targetUserId,
            'targetUserName' => $profileOwner?->name,
            'targetUserRole' => $profileOwner?->role,
            'profileExists' => $profile !== null,
            'profileData' => $profile ? [
                'user_id' => $profile->user_id,
                'firstname' => $profile->firstname,
                'lastname' => $profile->lastname,
                'email' => $profile->email,
            ] : null,
            'profile_user_id_CHECK' => $profile?->user_id, // CRITICAL: Verify this matches targetUserId
            'currentUserId' => $currentUserId,
            'currentUserName' => Auth::user()?->name,
            'canEdit' => $canEdit,
            'completedTransactionsCount' => count($completedTransactions),
            'url' => request()->fullUrl(),
        ]);

        return Inertia::render('Profile', [
            'role' => $role,
            'profile' => $profile,
            'user' => Auth::user(), // Current logged-in user
            'profileOwner' => $profileOwner, // The profile owner (target user)
            'canEdit' => $canEdit, // Whether current user can edit this profile
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
public function storeOrUpdate(Request $request, $role = null, $userId = null)
{
    \Log::info('ProfileController::storeOrUpdate called', [
        'role_param' => $role,
        'userId_param' => $userId,
        'route_role' => $request->route('role'),
        'route_userId' => $request->route('userId'),
        'url' => $request->fullUrl(),
        'method' => $request->method(),
    ]);

    $currentUserId = Auth::id();

    if (!$currentUserId) {
        \Log::warning('Unauthenticated profile update attempt');
        return response()->json(['error' => 'Unauthenticated'], 401);
    }

    // Check which route was matched
    if ($userId !== null && is_numeric($userId) && $role !== null && !is_numeric($role)) {
        // New format: /Profile/{role}/{userId}
        $targetUserId = (int) $userId;
        $role = ucfirst(strtolower($role));
        \Log::info('Using new format /Profile/{role}/{userId}', [
            'role' => $role,
            'userId' => $targetUserId
        ]);
    } else {
        // Old format: /Profile/{userId} - $role is actually the userId parameter
        $param = $role;

        if (is_numeric($param)) {
            // It's a user ID
            $targetUserId = (int) $param;
            $targetUser = \App\Models\User::find($targetUserId);
            if (!$targetUser) {
                return response()->json(['error' => 'User not found'], 404);
            }
            $role = ucfirst(strtolower($targetUser->role));
        } else {
            // It's a role string (backward compatibility)
            $role = ucfirst(strtolower($param));
            $targetUserId = $currentUserId; // Use current user's ID
        }
    }

    // CRITICAL: Authorization check - Only allow users to edit their own profile
    if ($targetUserId !== $currentUserId) {
        \Log::warning('Unauthorized profile edit attempt', [
            'currentUserId' => $currentUserId,
            'targetUserId' => $targetUserId,
            'ip' => $request->ip(),
        ]);
        return response()->json(['error' => 'Unauthorized: You can only edit your own profile'], 403);
    }

    $validated = $request->validate([
        'angkatan' => 'required|string',
        'firstname' => 'required|string',
        'lastname' => 'required|string',
        'university' => 'required|string',
        'email' => 'required|string',
    ]);

    // Ensure user_id is always the authenticated user's ID (security)
    $validated['user_id'] = $currentUserId;
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

    \Log::info('Profile updated successfully', [
        'user_id' => $validated['user_id'],
        'role' => $role,
        'profile_id' => $profile->id,
        'currentUserId' => $currentUserId,
        'targetUserId' => $targetUserId,
    ]);

    // Redirect back to profile page to show updated data
    $locale = $request->route('locale') ?? 'id';
    return redirect()->to("/{$locale}/Profile/{$role}/{$currentUserId}")->with('success', 'Profile updated successfully');
}


    // DELETE profile
    public function destroy($role = null, $userId = null)
    {
        $currentUserId = Auth::id();

        // Check which route was matched
        if ($userId !== null && is_numeric($userId)) {
            // New format: /Profile/{role}/{userId}
            $targetUserId = (int) $userId;
            $role = ucfirst(strtolower($role));
        } else {
            // Old format: /Profile/{userId} - $role is actually the userId parameter
            $param = $role;

            if (is_numeric($param)) {
                // It's a user ID
                $targetUserId = (int) $param;
                $targetUser = \App\Models\User::find($targetUserId);
                if (!$targetUser) {
                    return response()->json(['error' => 'User not found'], 404);
                }
                $role = ucfirst(strtolower($targetUser->role));
            } else {
                // It's a role string (backward compatibility)
                $role = ucfirst(strtolower($param));
                $targetUserId = $currentUserId; // Use current user's ID
            }
        }

        // Authorization: Only allow users to delete their own profile
        if ($targetUserId !== $currentUserId) {
            return response()->json(['error' => 'Unauthorized: You can only delete your own profile'], 403);
        }

        if ($role === 'Buyer') {
            ProfileBuyer::where('user_id', $targetUserId)->delete();
        } else {
            ProfileSeller::where('user_id', $targetUserId)->delete();
        }

        return response()->json(['message' => 'Profile deleted']);
    }

    /**
     * Submit a report
     */
    public function submitReport(Request $request, $role = null, $userId = null)
    {
        // Check which route was matched
        if ($userId !== null && is_numeric($userId)) {
            // New format: /Profile/{role}/{userId}/report
            $targetUserId = (int) $userId;
            $role = ucfirst(strtolower($role));
        } else {
            // Old format: /Profile/{userId}/report - $role is actually the userId parameter
            $param = $role;

            if (is_numeric($param)) {
                // It's a user ID
                $targetUserId = (int) $param;
                $targetUser = \App\Models\User::find($targetUserId);
                $role = $targetUser ? ucfirst(strtolower($targetUser->role)) : 'Buyer';
            } else {
                // It's a role string (backward compatibility)
                $role = ucfirst(strtolower($param));
            }
        }

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
