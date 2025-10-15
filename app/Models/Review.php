<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Review extends Model
{
    protected $fillable = [
        'appointment_id', 'reviewer_id', 'reviewee_id', 'rating', 'comment'
    ];

    public function appointment(): BelongsTo { return $this->belongsTo(Appointment::class, 'appointment_id'); }
    public function reviewer(): BelongsTo { return $this->belongsTo(User::class, 'reviewer_id'); }
    public function reviewee(): BelongsTo { return $this->belongsTo(User::class, 'reviewee_id'); }
}
