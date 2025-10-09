<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Appointment;
use Illuminate\Http\Request;

class MyScheduleController extends Controller
{
    public function index(string $role)
    {
        $user = Auth::user();

        $query = Appointment::with(['product', 'user'])
            ->orderBy('date', 'asc')
            ->orderBy('time', 'asc');

        if ($user) {
            $query->where('users_id', $user->id);
        }

        $appointments = $query->get()->map(function ($a) {
            return [
                'id' => $a->id,
                'title' => $a->product?->product_name ? ('COD ' . $a->product->product_name) : 'Appointment',
                'date' => (string)$a->date,
                'time' => (string)$a->time,
                'status' => $a->status,
                'color' => $a->status === 'confirmed' ? 'bg-blue-200' : 'bg-red-300',
            ];
        });

        return Inertia::render('MySchedule', [
            'role' => $role,
            'events' => $appointments,
        ]);
    }

    public function confirm(Request $request, Appointment $appointment)
    {
        $this->authorizeAppointment($appointment);
        $appointment->status = 'confirmed';
        $appointment->save();
        return back();
    }

    public function reject(Request $request, Appointment $appointment)
    {
        $this->authorizeAppointment($appointment);
        $appointment->status = 'rejected';
        $appointment->save();
        return back();
    }

    private function authorizeAppointment(Appointment $appointment): void
    {
        $user = Auth::user();
        if (!$user || $appointment->users_id !== $user->id) {
            abort(403);
        }
    }
}


