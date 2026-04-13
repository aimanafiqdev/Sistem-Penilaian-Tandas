<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('audits', function (Blueprint $table) {
            $table->json('items')->nullable()->after('masa');
            $table->boolean('ada_ruang_lampin')->default(false)->after('items');
            $table->boolean('ada_tandas_oku')->default(false)->after('ada_ruang_lampin');
            $table->integer('total_markah')->nullable()->after('ada_tandas_oku');
            $table->integer('max_markah')->nullable()->after('total_markah');
            $table->decimal('peratus', 5, 2)->nullable()->after('max_markah');
            $table->tinyInteger('bintang')->nullable()->after('peratus');
        });
    }

    public function down(): void
    {
        Schema::table('audits', function (Blueprint $table) {
            $table->dropColumn([
                'items', 'ada_ruang_lampin', 'ada_tandas_oku',
                'total_markah', 'max_markah', 'peratus', 'bintang',
            ]);
        });
    }
};
