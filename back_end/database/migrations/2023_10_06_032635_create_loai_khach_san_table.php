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
        Schema::create('loai_khach_san', function (Blueprint $table) {
            $table->id();
            $table->string('image')->nullable();
            $table->string('ten_khach_san')->nullable();
            $table->string('dia_chi')->nullable();
            $table->integer('so_sao')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('loai_khach_san');
    }
};
