<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('shade');
            $table->enum('category', ['lips', 'eyes', 'blush', 'foundation']);
            $table->string('color', 10);       // hex e.g. #9B1B1B
            $table->integer('price');           // in PKR
            $table->string('brand');
            $table->json('suitable_for');       // ["fair","light","medium","tan","deep"]
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
