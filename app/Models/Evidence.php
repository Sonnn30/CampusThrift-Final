<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Evidence extends Model
{
    protected $fillable = [
        'appointment_id',
        'uploaded_by',
        'file_name',
        'file_path',
        'file_type',
        'file_size',
        'description',
        'status'
    ];

    protected $casts = [
        'file_size' => 'integer',
    ];

    /**
     * Get the appointment that owns the evidence
     */
    public function appointment(): BelongsTo
    {
        return $this->belongsTo(Appointment::class);
    }

    /**
     * Get the user who uploaded the evidence
     */
    public function uploadedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    /**
     * Get the file URL
     */
    public function getFileUrlAttribute()
    {
        return asset('storage/' . $this->file_path);
    }
}
