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
        Schema::create('profile_seller', function (Blueprint $table) {
            $table->id();
            $table->foreignId("user_id");
            $table->string("angkatan");
            $table->string("firstname");
            $table->string("lastname");
            $table->string("email");
            $table->string("university");
            $table->integer("item_buyed");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('profile_seller');
    }
};
