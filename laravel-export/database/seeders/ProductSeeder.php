<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            // ─── LIPS ───────────────────────────────────────────────────────
            [
                'name' => 'Ruby Woo', 'shade' => 'Retro Matte', 'category' => 'lips',
                'color' => '#9B1B1B', 'price' => 6200, 'brand' => 'MAC', 'finish' => 'Matte',
                'suitable_for' => ['medium','tan','deep'],
                'image' => 'ruby woo.png', 'shade_image' => 'ruby woo shade.png',
            ],
            [
                'name' => 'Velvet Teddy', 'shade' => 'Matte', 'category' => 'lips',
                'color' => '#9B7155', 'price' => 6200, 'brand' => 'MAC', 'finish' => 'Matte',
                'suitable_for' => ['light','medium'],
                'image' => 'velvet teddy.png', 'shade_image' => 'velvet teddy shade.png',
            ],
            [
                'name' => 'Diva', 'shade' => 'Matte', 'category' => 'lips',
                'color' => '#572137', 'price' => 6200, 'brand' => 'MAC', 'finish' => 'Matte',
                'suitable_for' => ['tan','deep'],
                'image' => 'diva.png', 'shade_image' => 'diva shade.png',
            ],
            [
                'name' => 'Pillow Talk', 'shade' => 'Matte Revolution', 'category' => 'lips',
                'color' => '#C07A8C', 'price' => 10700, 'brand' => 'Charlotte Tilbury', 'finish' => 'Matte',
                'suitable_for' => ['fair','light'],
                'image' => 'pillow talk.png', 'shade_image' => 'pillow talk shade.png',
            ],
            [
                'name' => 'Walk of No Shame', 'shade' => 'Matte', 'category' => 'lips',
                'color' => '#B83A3A', 'price' => 10700, 'brand' => 'Charlotte Tilbury', 'finish' => 'Matte',
                'suitable_for' => ['medium','tan'],
                'image' => 'walk of no shame.png', 'shade_image' => 'walk of no shame shade.png',
            ],
            [
                'name' => 'Vienna', 'shade' => 'Soft Matte', 'category' => 'lips',
                'color' => '#C4A0A8', 'price' => 2800, 'brand' => 'NYX', 'finish' => 'Soft Matte',
                'suitable_for' => ['fair','light','medium'],
                'image' => 'vienna.png', 'shade_image' => 'vienna shade.png',
            ],
            [
                'name' => 'Cannes', 'shade' => 'Soft Matte', 'category' => 'lips',
                'color' => '#B22222', 'price' => 2800, 'brand' => 'NYX', 'finish' => 'Soft Matte',
                'suitable_for' => ['medium','tan','deep'],
                'image' => 'cannes.png', 'shade_image' => 'cannes shade.png',
            ],
            [
                'name' => 'Jungle Red', 'shade' => 'Satin Lip Pencil', 'category' => 'lips',
                'color' => '#C41E3A', 'price' => 10100, 'brand' => 'NARS', 'finish' => 'Satin',
                'suitable_for' => ['medium','tan','deep'],
                'image' => 'jungle red.png', 'shade_image' => 'juncle red shade.png',
            ],
            [
                'name' => 'Dragon Girl', 'shade' => 'Powermatte', 'category' => 'lips',
                'color' => '#8B1A3A', 'price' => 10100, 'brand' => 'NARS', 'finish' => 'Powermatte',
                'suitable_for' => ['tan','deep'],
                'image' => 'dragon girl.png', 'shade_image' => 'dragon girl shade.png',
            ],
            [
                'name' => 'Raspberry Red', 'shade' => 'Colour Riche', 'category' => 'lips',
                'color' => '#C0396B', 'price' => 3400, 'brand' => "L'Oréal", 'finish' => 'Satin',
                'suitable_for' => ['medium','tan','deep'],
                'image' => 'rasberry red.png', 'shade_image' => 'rasberry red shade.png',
            ],

            // ─── EYES ───────────────────────────────────────────────────────
            [
                'name' => 'Half Baked', 'shade' => 'Eyeshadow', 'category' => 'eyes',
                'color' => '#A0693C', 'price' => 6700, 'brand' => 'Urban Decay', 'finish' => 'Shimmer',
                'suitable_for' => ['fair','light','medium','tan','deep'],
                'image' => 'half baked.png', 'shade_image' => 'half baked shade.png',
            ],
            [
                'name' => 'Midnight Cowboy', 'shade' => 'Eyeshadow', 'category' => 'eyes',
                'color' => '#C4966A', 'price' => 6700, 'brand' => 'Urban Decay', 'finish' => 'Sparkle',
                'suitable_for' => ['fair','light','medium'],
                'image' => 'midnight cowboy.png', 'shade_image' => 'midnight cowboy shade.png',
            ],
            [
                'name' => 'Club', 'shade' => 'Eyeshadow', 'category' => 'eyes',
                'color' => '#4A3728', 'price' => 6200, 'brand' => 'MAC', 'finish' => 'Velvet',
                'suitable_for' => ['fair','light','medium','tan','deep'],
                'image' => 'club.png', 'shade_image' => 'club shade.png',
            ],
            [
                'name' => 'Woodwinked', 'shade' => 'Eyeshadow', 'category' => 'eyes',
                'color' => '#B8733C', 'price' => 6200, 'brand' => 'MAC', 'finish' => 'Velvet',
                'suitable_for' => ['medium','tan','deep'],
                'image' => 'woody.png', 'shade_image' => 'woody shade.png',
            ],
            [
                'name' => 'Night Rider', 'shade' => 'Eyeshadow', 'category' => 'eyes',
                'color' => '#1C1826', 'price' => 10100, 'brand' => 'NARS', 'finish' => 'Matte',
                'suitable_for' => ['fair','light','medium','tan','deep'],
                'image' => 'night rider.png', 'shade_image' => 'night rider shades.png',
            ],
            [
                'name' => 'Pillow Talk Rose', 'shade' => 'Luxury Eye Palette', 'category' => 'eyes',
                'color' => '#C4A0A0', 'price' => 19000, 'brand' => 'Charlotte Tilbury', 'finish' => 'Mixed',
                'suitable_for' => ['fair','light'],
                'image' => 'pillow talk rose.png', 'shade_image' => 'pillow talk rose shades.png',
            ],
            [
                'name' => 'Obsidian Smoky', 'shade' => 'Eyeshadow Palette', 'category' => 'eyes',
                'color' => '#2C1F38', 'price' => 16200, 'brand' => 'Huda Beauty', 'finish' => 'Mixed',
                'suitable_for' => ['fair','light','medium','tan','deep'],
                'image' => 'obsidian smoky.png', 'shade_image' => 'obsidisn smoky shades.png',
            ],

            // ─── BLUSH ──────────────────────────────────────────────────────
            [
                'name' => 'Orgasm', 'shade' => 'Blush', 'category' => 'blush',
                'color' => '#E8906A', 'price' => 9500, 'brand' => 'NARS', 'finish' => 'Shimmer',
                'suitable_for' => ['fair','light','medium'],
                'image' => 'orgasam.png', 'shade_image' => null,
            ],
            [
                'name' => 'Deep Throat', 'shade' => 'Blush', 'category' => 'blush',
                'color' => '#F0B0C0', 'price' => 9500, 'brand' => 'NARS', 'finish' => 'Shimmer',
                'suitable_for' => ['fair','light'],
                'image' => 'deep throat.png', 'shade_image' => null,
            ],
            [
                'name' => 'Exhibit A', 'shade' => 'Blush', 'category' => 'blush',
                'color' => '#E05A40', 'price' => 9500, 'brand' => 'NARS', 'finish' => 'Matte',
                'suitable_for' => ['medium','tan','deep'],
                'image' => 'exibit a.png', 'shade_image' => null,
            ],
            [
                'name' => 'Peaches', 'shade' => 'Powder Blush', 'category' => 'blush',
                'color' => '#F0A060', 'price' => 7800, 'brand' => 'MAC', 'finish' => 'Satin',
                'suitable_for' => ['fair','light'],
                'image' => 'peachy.png', 'shade_image' => null,
            ],
            [
                'name' => 'Mocha', 'shade' => 'Powder Blush', 'category' => 'blush',
                'color' => '#9B6B5A', 'price' => 7800, 'brand' => 'MAC', 'finish' => 'Matte',
                'suitable_for' => ['tan','deep'],
                'image' => 'mocha.png', 'shade_image' => null,
            ],
            [
                'name' => 'Fiji', 'shade' => 'Cheeks Out', 'category' => 'blush',
                'color' => '#C47480', 'price' => 6200, 'brand' => 'Fenty Beauty', 'finish' => 'Satin',
                'suitable_for' => ['medium','tan'],
                'image' => 'fiji.png', 'shade_image' => null,
            ],

            // ─── FOUNDATION ─────────────────────────────────────────────────
            [
                'name' => 'NC15', 'shade' => 'Studio Fix Fluid', 'category' => 'foundation',
                'color' => '#F2D8B8', 'price' => 12600, 'brand' => 'MAC', 'finish' => 'Matte',
                'suitable_for' => ['fair','light'],
                'image' => 'NC15.png', 'shade_image' => null,
            ],
            [
                'name' => 'NC30', 'shade' => 'Studio Fix Fluid', 'category' => 'foundation',
                'color' => '#C8945A', 'price' => 12600, 'brand' => 'MAC', 'finish' => 'Matte',
                'suitable_for' => ['medium'],
                'image' => 'NC30.png', 'shade_image' => null,
            ],
            [
                'name' => 'NC45', 'shade' => 'Studio Fix Fluid', 'category' => 'foundation',
                'color' => '#9B6B3A', 'price' => 12600, 'brand' => 'MAC', 'finish' => 'Matte',
                'suitable_for' => ['tan'],
                'image' => 'NC45.png', 'shade_image' => null,
            ],
            [
                'name' => 'NC55', 'shade' => 'Studio Fix Fluid', 'category' => 'foundation',
                'color' => '#6B3A1A', 'price' => 12600, 'brand' => 'MAC', 'finish' => 'Matte',
                'suitable_for' => ['deep'],
                'image' => 'NC55.png', 'shade_image' => null,
            ],
            [
                'name' => '420W', 'shade' => "Pro Filt'r", 'category' => 'foundation',
                'color' => '#C8A07A', 'price' => 11200, 'brand' => 'Fenty Beauty', 'finish' => 'Soft Matte',
                'suitable_for' => ['medium'],
                'image' => '420.png', 'shade_image' => null,
            ],
            [
                'name' => '490W', 'shade' => "Pro Filt'r", 'category' => 'foundation',
                'color' => '#7A4A2A', 'price' => 11200, 'brand' => 'Fenty Beauty', 'finish' => 'Soft Matte',
                'suitable_for' => ['deep'],
                'image' => '490.png', 'shade_image' => null,
            ],
        ];

        foreach ($products as $data) {
            Product::create($data);
        }
    }
}
