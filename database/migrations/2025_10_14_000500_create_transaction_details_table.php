<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('transaction_details', function (Blueprint $table) {
            $table->id();

            // Optional linkage to appointment and buyer (user)
            $table->foreignId('appointment_id')->nullable()->constrained('appointment')->nullOnDelete();
            $table->foreignId('buyer_id')->nullable()->constrained('users')->nullOnDelete();

            // Core fields per request
            $table->time('time'); // Time
            $table->string('buyer')->nullable(); // Buyer name snapshot
            $table->string('method', 50)->default('COD'); // Method (e.g., COD, Transfer)
            $table->string('external_id')->nullable(); // ID (external/payment reference)
            $table->decimal('amount', 12, 2)->default(0); // Amount
            $table->string('status', 30)->default('pending'); // Status

            // Optional timestamps
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transaction_details');
    }
};


