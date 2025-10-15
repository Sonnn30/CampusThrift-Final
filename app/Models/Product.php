<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Plank\Mediable\Mediable;

class Product extends Model
{
    use HasFactory, Mediable;

    protected $fillable = [
        'user_id',
        'product_name',
        'product_price',
        'description',
        'shipping_method',
        'location',
        'category',
    ];

    protected $casts = [
        'shipping_method' => 'array', // Laravel otomatis handle JSON encode/decode
    ];

    // Accessor shipping_method supaya selalu array
    public function getShippingMethodAttribute($value)
    {
        return $value ?? [];
    }

    // Relasi ke User
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relasi ke Appointment
    public function appointments()
    {
        return $this->hasMany(Appointment::class, 'product_id');
    }
}
