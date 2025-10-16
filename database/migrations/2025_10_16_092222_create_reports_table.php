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
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reporter_id')->constrained('users')->onDelete('cascade'); // yang report
            $table->foreignId('reported_id')->constrained('users')->onDelete('cascade'); // yang di-report
            $table->foreignId('appointment_id')->nullable()->constrained('appointment')->onDelete('cascade');
            $table->enum('report_type', ['buyer', 'seller']); // report buyer atau seller
            $table->json('reasons'); // array of reasons
            $table->text('additional_notes')->nullable();
            $table->enum('status', ['pending', 'reviewed', 'resolved', 'rejected'])->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};
