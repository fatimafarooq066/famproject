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
        'finish',
        'suitable_for',
        'image',
        'shade_image',
    ];

    protected $casts = [
        'suitable_for' => 'array',
        'price'        => 'integer',
    ];

    /**
     * Full URL for the product image.
     */
    public function getImageUrlAttribute(): string
    {
        return asset('products/' . $this->image);
    }

    /**
     * Full URL for the shade swatch image (may be null).
     */
    public function getShadeImageUrlAttribute(): ?string
    {
        return $this->shade_image ? asset('products/' . $this->shade_image) : null;
    }
}
