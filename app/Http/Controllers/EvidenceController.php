<?php

namespace App\Http\Controllers;

use App\Models\Evidence;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class EvidenceController extends Controller
{
    /**
     * Show the upload evidence page
     */
    public function show(Request $request)
    {
        $user = Auth::user();
        $role = $user?->role ?? 'Buyer';
        $appointmentId = (int) $request->query('appointment_id');

        // If no appointment_id provided, try to find a completed appointment
        if (!$appointmentId) {
            if (strtolower($role) === 'buyer') {
                $appointment = Appointment::where('users_id', $user->id)
                    ->where('status', 'completed')
                    ->orderBy('updated_at', 'desc')
                    ->first();
            } else {
                $appointment = Appointment::whereHas('product', function($q) use ($user) {
                        $q->where('user_id', $user->id);
                    })
                    ->where('status', 'completed')
                    ->orderBy('updated_at', 'desc')
                    ->first();
            }

            if ($appointment) {
                $appointmentId = $appointment->id;
            }
        }

        return Inertia::render('UploadEvidence', [
            'role' => ucfirst(strtolower($role)),
            'appointment_id' => $appointmentId,
        ]);
    }

    /**
     * Store uploaded evidence
     */
    public function store(Request $request)
    {
        $request->validate([
            'appointment_id' => 'required|integer|exists:appointment,id',
            'evidence_file' => 'required|file|mimes:jpeg,jpg,png,pdf|max:10240', // 10MB max
            'description' => 'nullable|string|max:500',
        ]);

        $user = Auth::user();
        $appointment = Appointment::findOrFail($request->appointment_id);

        // Authorization check
        $isAuthorized = false;
        if (strtolower($user->role) === 'buyer') {
            $isAuthorized = $appointment->users_id === $user->id;
        } else {
            $isAuthorized = $appointment->product?->user_id === $user->id;
        }

        if (!$isAuthorized) {
            return redirect()->back()->with('error', 'Unauthorized to upload evidence for this appointment.');
        }

        try {
            $file = $request->file('evidence_file');

            // Generate unique filename with ID
            $fileName = time() . '_' . $appointment->id . '_' . $user->id . '.' . $file->getClientOriginalExtension();

            // Store file in storage/app/public/evidence
            $filePath = $file->storeAs('evidence', $fileName, 'public');

            // Create evidence record
            $evidence = Evidence::create([
                'appointment_id' => $appointment->id,
                'uploaded_by' => $user->id,
                'file_name' => $file->getClientOriginalName(),
                'file_path' => $filePath,
                'file_type' => $file->getClientMimeType(),
                'file_size' => $file->getSize(),
                'description' => $request->description,
                'status' => 'pending',
            ]);

            return redirect()->back()->with('success', 'Evidence uploaded successfully!');

        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to upload evidence: ' . $e->getMessage());
        }
    }

    /**
     * Get evidence for an appointment
     */
    public function getEvidence(Request $request)
    {
        $request->validate([
            'appointment_id' => 'required|integer|exists:appointment,id',
        ]);

        $user = Auth::user();
        $appointment = Appointment::findOrFail($request->appointment_id);

        // Authorization check
        $isAuthorized = false;
        if (strtolower($user->role) === 'buyer') {
            $isAuthorized = $appointment->users_id === $user->id;
        } else {
            $isAuthorized = $appointment->product?->user_id === $user->id;
        }

        if (!$isAuthorized) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $evidence = Evidence::where('appointment_id', $appointment->id)
            ->with('uploadedBy')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($evidence);
    }

    /**
     * Delete evidence
     */
    public function destroy(Evidence $evidence)
    {
        $user = Auth::user();

        // Only the uploader can delete their evidence
        if ($evidence->uploaded_by !== $user->id) {
            return redirect()->back()->with('error', 'Unauthorized to delete this evidence.');
        }

        try {
            // Delete file from storage
            if (Storage::disk('public')->exists($evidence->file_path)) {
                Storage::disk('public')->delete($evidence->file_path);
            }

            // Delete record
            $evidence->delete();

            return redirect()->back()->with('success', 'Evidence deleted successfully!');

        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to delete evidence: ' . $e->getMessage());
        }
    }
}
