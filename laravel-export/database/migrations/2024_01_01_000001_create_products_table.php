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
            $table->string('color', 7);       // hex colour e.g. #9B1B1B
            $table->unsignedInteger('price'); // PKR
            $table->string('brand');
            $table->string('finish')->default('');
            $table->json('suitable_for');     // ["fair","light","medium","tan","deep"]
            $table->string('image');          // filename in public/products/
            $table->string('shade_image')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
