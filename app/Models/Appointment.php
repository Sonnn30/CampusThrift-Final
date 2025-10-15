<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Appointment extends Model
{
    protected $table = 'appointment';

    protected $fillable = [
        'product_id',
        'users_id',
        'status',
        'date',
        'time',
        'locations'
    ];

    protected $casts = [
        'date' => 'date',
        'time' => 'string'
    ];

    /**
     * Get the product that owns the appointment
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Get the user that owns the appointment
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'users_id');
    }

    /**
     * Get the reviews for this appointment
     */
    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    /**
     * Get the evidence for this appointment
     */
    public function evidence(): HasMany
    {
        return $this->hasMany(Evidence::class);
    }
}
