<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Events\Message as MessageEvent;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ChatController extends Controller
{
    /**
     * Show chat page with specific user
     */
    public function show($recipientId)
    {
        $currentUser = Auth::user();
        $recipient = User::findOrFail($recipientId);

        // Get or create conversation
        $conversation = Conversation::findOrCreateConversation($currentUser->id, $recipientId);

        // Load messages
        $messages = $conversation->messages()->with('sender')->get()->map(function($msg) use ($currentUser) {
            return [
                'id' => $msg->id,
                'message' => $msg->message,
                'sender' => $msg->sender_id == $currentUser->id ? 'me' : 'other',
                'sender_name' => $msg->sender->name,
                'created_at' => $msg->created_at->toISOString(),
            ];
        });

        return Inertia::render('chat', [
            'conversation_id' => $conversation->id,
            'recipient' => [
                'id' => $recipient->id,
                'name' => $recipient->name,
                'email' => $recipient->email,
            ],
            'messages' => $messages,
        ]);
    }

    /**
     * Send message in conversation
     */
    public function message(Request $request)
    {
        $request->validate([
            'conversation_id' => 'required|exists:conversations,id',
            'message' => 'required|string',
        ]);

        $currentUser = Auth::user();
        $conversation = Conversation::findOrFail($request->conversation_id);

        // Verify user is part of this conversation
        if ($conversation->user1_id != $currentUser->id && $conversation->user2_id != $currentUser->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Create message
        $message = Message::create([
            'conversation_id' => $conversation->id,
            'sender_id' => $currentUser->id,
            'message' => $request->message,
        ]);

        // Update last message time
        $conversation->update(['last_message_at' => now()]);

        // Broadcast event
        event(new MessageEvent(
            $conversation->id,
            $message->id,
            $currentUser->name,
            $request->message,
            $currentUser->id
        ));

        return response()->json([
            'status' => 'success',
            'message' => $message,
        ]);
    }

    /**
     * Get messages for a conversation
     */
    public function getMessages($conversationId)
    {
        $currentUser = Auth::user();
        $conversation = Conversation::findOrFail($conversationId);

        // Verify user is part of this conversation
        if ($conversation->user1_id != $currentUser->id && $conversation->user2_id != $currentUser->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $messages = $conversation->messages()->with('sender')->get()->map(function($msg) use ($currentUser) {
            return [
                'id' => $msg->id,
                'message' => $msg->message,
                'sender' => $msg->sender_id == $currentUser->id ? 'me' : 'other',
                'sender_name' => $msg->sender->name,
                'created_at' => $msg->created_at->toISOString(),
            ];
        });

        return response()->json($messages);
    }

    /**
     * Get list of all conversations for current user
     */
    public function index()
    {
        $currentUser = Auth::user();

        // Get all conversations where user is participant
        $conversations = Conversation::where(function($query) use ($currentUser) {
                $query->where('user1_id', $currentUser->id)
                      ->orWhere('user2_id', $currentUser->id);
            })
            ->with(['user1', 'user2', 'messages' => function($query) {
                $query->latest()->limit(1);
            }])
            ->orderByDesc('last_message_at')
            ->orderByDesc('updated_at')
            ->get()
            ->map(function($conv) use ($currentUser) {
                // Get the other user in conversation
                $otherUser = $conv->user1_id == $currentUser->id ? $conv->user2 : $conv->user1;

                // Get last message
                $lastMessage = $conv->messages->first();

                // Count unread messages
                $unreadCount = $conv->messages()
                    ->where('sender_id', '!=', $currentUser->id)
                    ->where('is_read', false)
                    ->count();

                return [
                    'id' => $conv->id,
                    'other_user' => [
                        'id' => $otherUser->id,
                        'name' => $otherUser->name,
                        'email' => $otherUser->email,
                    ],
                    'last_message' => $lastMessage ? [
                        'text' => $lastMessage->message,
                        'time' => $lastMessage->created_at->diffForHumans(),
                        'created_at' => $lastMessage->created_at->toISOString(),
                    ] : null,
                    'unread_count' => $unreadCount,
                    'updated_at' => $conv->updated_at->toISOString(),
                ];
            });

        return Inertia::render('chatlist', [
            'role' => ucfirst(strtolower($currentUser->role ?? 'Buyer')),
            'conversations' => $conversations,
        ]);
    }
}
