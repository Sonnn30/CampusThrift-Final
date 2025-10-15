<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TransactionDetail extends Model
{
    protected $table = 'transaction_details';

    protected $fillable = [
        'appointment_id',
        'buyer_id',
        'time',
        'buyer',
        'method',
        'external_id',
        'amount',
        'status',
        'buyer_deal',
        'seller_deal',
        'paid_at',
    ];

    protected $casts = [
        'time' => 'string',
        'amount' => 'decimal:2',
        'paid_at' => 'datetime',
        'buyer_deal' => 'boolean',
        'seller_deal' => 'boolean',
    ];

    public function appointment(): BelongsTo
    {
        return $this->belongsTo(Appointment::class, 'appointment_id');
    }

    public function buyerUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'buyer_id');
    }
}


