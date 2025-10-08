<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProfileBuyer extends Model
{
    use HasFactory;

    protected $table = 'profile_buyer';

    protected $fillable = [
        'user_id',
        'angkatan',
        'firstname',
        'lastname',
        'email',
        'university',
        'item_selled',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
