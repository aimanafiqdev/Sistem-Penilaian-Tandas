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
        Schema::table('toilets', function (Blueprint $table) {
            $table->enum('status', ['hijau', 'oren', 'merah'])->default('hijau')->after('longitude');
        });
    }

    public function down(): void
    {
        Schema::table('toilets', function (Blueprint $table) {
            $table->dropColumn('status');
        });
    }
};
