<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProfileSeller extends Model
{
    use HasFactory;

    protected $table = 'profile_seller';

    protected $fillable = [
        'user_id',
        'angkatan',
        'firstname',
        'lastname',
        'email',
        'university',
        'item_buyed',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
