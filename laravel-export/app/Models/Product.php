<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'shade',
        'category',
        'color',
        'price',
        'brand',
        'suitable_for',
    ];

    protected $casts = [
        'suitable_for' => 'array',
        'price'        => 'integer',
    ];
}
