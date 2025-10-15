<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('transaction_details', function (Blueprint $table) {
            $table->boolean('buyer_deal')->default(false)->after('status');
            $table->boolean('seller_deal')->default(false)->after('buyer_deal');
        });
    }

    public function down(): void
    {
        Schema::table('transaction_details', function (Blueprint $table) {
            $table->dropColumn(['buyer_deal', 'seller_deal']);
        });
    }
};


