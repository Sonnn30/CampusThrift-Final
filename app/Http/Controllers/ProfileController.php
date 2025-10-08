<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ProfileBuyer;
use App\Models\ProfileSeller;
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

        return Inertia::render('Profile', [
            'role' => $role,
            'profile' => $profile,
            'user' => Auth::user(),
        ]);

        return response()->json($profile);
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
}
