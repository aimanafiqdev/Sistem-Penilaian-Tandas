<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('audits', function (Blueprint $table) {
            $table->string('nama_pegawai')->nullable()->after('bintang');
            $table->text('cadangan')->nullable()->after('nama_pegawai');
            $table->string('nama_wakil')->nullable()->after('cadangan');
            $table->longText('tandatangan_pegawai')->nullable()->after('nama_wakil');
            $table->longText('tandatangan_wakil')->nullable()->after('tandatangan_pegawai');
        });
    }

    public function down(): void
    {
        Schema::table('audits', function (Blueprint $table) {
            $table->dropColumn([
                'nama_pegawai',
                'cadangan',
                'nama_wakil',
                'tandatangan_pegawai',
                'tandatangan_wakil',
            ]);
        });
    }
};
