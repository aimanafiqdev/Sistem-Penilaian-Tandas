<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('toilet_types', function (Blueprint $table) {
            $table->id();
            $table->foreignId('toilet_id')->constrained('toilets')->cascadeOnDelete();
            $table->enum('type', ['lelaki', 'perempuan', 'unisex', 'oku']);
            $table->unsignedInteger('bilangan_kubikel');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('toilet_types');
    }
};
