<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class Message implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public int $conversationId;
    public int $messageId;
    public string $username;
    public string $message;
    public int $senderId;

    public function __construct(int $conversationId, int $messageId, string $username, string $message, int $senderId)
    {
        $this->conversationId = $conversationId;
        $this->messageId = $messageId;
        $this->username = $username;
        $this->message = $message;
        $this->senderId = $senderId;
    }

    public function broadcastOn(): array
    {
        // Broadcast ke channel khusus untuk conversation ini
        return [new Channel('chat.' . $this->conversationId)];
    }

    public function broadcastAs(): string
    {
        return 'message';
    }

    public function broadcastWith(): array
    {
        return [
            'id' => $this->messageId,
            'conversation_id' => $this->conversationId,
            'message' => $this->message,
            'sender_name' => $this->username,
            'sender_id' => $this->senderId,
        ];
    }
}
