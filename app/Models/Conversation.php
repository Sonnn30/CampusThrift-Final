<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Conversation extends Model
{
    protected $fillable = [
        'user1_id',
        'user2_id',
        'last_message_at'
    ];

    protected $casts = [
        'last_message_at' => 'datetime',
    ];

    public function user1(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user1_id');
    }

    public function user2(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user2_id');
    }

    public function messages(): HasMany
    {
        return $this->hasMany(Message::class)->orderBy('created_at', 'asc');
    }

    /**
     * Get the other user in the conversation
     */
    public function getOtherUser($currentUserId)
    {
        return $this->user1_id == $currentUserId ? $this->user2 : $this->user1;
    }

    /**
     * Find or create conversation between two users
     */
    public static function findOrCreateConversation($user1Id, $user2Id)
    {
        // Selalu simpan user dengan ID lebih kecil sebagai user1
        $smallerId = min($user1Id, $user2Id);
        $largerId = max($user1Id, $user2Id);

        return self::firstOrCreate([
            'user1_id' => $smallerId,
            'user2_id' => $largerId,
        ]);
    }
}
