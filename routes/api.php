<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ChatController;

Route::middleware(['web', 'auth'])->group(function() {
    Route::post('/messages', [ChatController::class, 'message']);
    Route::get('/conversations/{conversationId}/messages', [ChatController::class, 'getMessages']);
});
