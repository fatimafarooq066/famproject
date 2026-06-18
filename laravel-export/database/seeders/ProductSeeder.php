<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        Product::truncate();

        $products = [
            // ── LIPS ──
            ['name' => 'Ruby Woo',        'shade' => 'Retro Matte',      'category' => 'lips', 'color' => '#9B1B1B', 'price' => 6200,  'brand' => 'MAC',               'suitable_for' => ['medium','tan','deep']],
            ['name' => 'Velvet Teddy',    'shade' => 'Matte',            'category' => 'lips', 'color' => '#9B7155', 'price' => 6200,  'brand' => 'MAC',               'suitable_for' => ['light','medium']],
            ['name' => 'Diva',            'shade' => 'Matte',            'category' => 'lips', 'color' => '#572137', 'price' => 6200,  'brand' => 'MAC',               'suitable_for' => ['tan','deep']],
            ['name' => 'Pillow Talk',     'shade' => 'Matte Revolution', 'category' => 'lips', 'color' => '#C07A8C', 'price' => 10700, 'brand' => 'Charlotte Tilbury', 'suitable_for' => ['fair','light']],
            ['name' => 'Walk of No Shame','shade' => 'Matte',            'category' => 'lips', 'color' => '#B83A3A', 'price' => 10700, 'brand' => 'Charlotte Tilbury', 'suitable_for' => ['medium','tan']],
            ['name' => 'Vienna',          'shade' => 'Soft Matte',       'category' => 'lips', 'color' => '#C4A0A8', 'price' => 2800,  'brand' => 'NYX',               'suitable_for' => ['fair','light','medium']],
            ['name' => 'Cannes',          'shade' => 'Soft Matte',       'category' => 'lips', 'color' => '#B22222', 'price' => 2800,  'brand' => 'NYX',               'suitable_for' => ['medium','tan','deep']],
            ['name' => 'Jungle Red',      'shade' => 'Satin Lip Pencil', 'category' => 'lips', 'color' => '#C41E3A', 'price' => 10100, 'brand' => 'NARS',              'suitable_for' => ['medium','tan','deep']],
            ['name' => 'Dragon Girl',     'shade' => 'Powermatte',       'category' => 'lips', 'color' => '#8B1A3A', 'price' => 10100, 'brand' => 'NARS',              'suitable_for' => ['tan','deep']],
            ['name' => 'Raspberry Red',   'shade' => 'Colour Riche',     'category' => 'lips', 'color' => '#C0396B', 'price' => 3400,  'brand' => "L'Oréal",           'suitable_for' => ['medium','tan','deep']],
            // ── EYES ──
            ['name' => 'Half Baked',         'shade' => 'Eyeshadow',         'category' => 'eyes', 'color' => '#A0693C', 'price' => 6700,  'brand' => 'Urban Decay',       'suitable_for' => ['fair','light','medium','tan','deep']],
            ['name' => 'Midnight Cowboy',    'shade' => 'Eyeshadow',         'category' => 'eyes', 'color' => '#C4966A', 'price' => 6700,  'brand' => 'Urban Decay',       'suitable_for' => ['fair','light','medium']],
            ['name' => 'Club',               'shade' => 'Eyeshadow',         'category' => 'eyes', 'color' => '#4A3728', 'price' => 6200,  'brand' => 'MAC',               'suitable_for' => ['fair','light','medium','tan','deep']],
            ['name' => 'Woodwinked',         'shade' => 'Eyeshadow',         'category' => 'eyes', 'color' => '#B8733C', 'price' => 6200,  'brand' => 'MAC',               'suitable_for' => ['medium','tan','deep']],
            ['name' => 'Night Rider',        'shade' => 'Eyeshadow',         'category' => 'eyes', 'color' => '#1C1826', 'price' => 10100, 'brand' => 'NARS',              'suitable_for' => ['fair','light','medium','tan','deep']],
            ['name' => 'Canyon (Soft Glam)', 'shade' => 'Palette',           'category' => 'eyes', 'color' => '#C4905A', 'price' => 12600, 'brand' => 'Anastasia BH',      'suitable_for' => ['medium','tan','deep']],
            ['name' => 'Pillow Talk Rose',   'shade' => 'Luxury Palette',    'category' => 'eyes', 'color' => '#C4A0A0', 'price' => 19000, 'brand' => 'Charlotte Tilbury', 'suitable_for' => ['fair','light']],
            ['name' => 'Obsidian Smoky',     'shade' => 'Eyeshadow Palette', 'category' => 'eyes', 'color' => '#2C1F38', 'price' => 16200, 'brand' => 'Huda Beauty',       'suitable_for' => ['fair','light','medium','tan','deep']],
            // ── BLUSH ──
            ['name' => 'Orgasm',      'shade' => 'Blush',        'category' => 'blush', 'color' => '#E8906A', 'price' => 9500, 'brand' => 'NARS',         'suitable_for' => ['fair','light','medium']],
            ['name' => 'Deep Throat', 'shade' => 'Blush',        'category' => 'blush', 'color' => '#F0B0C0', 'price' => 9500, 'brand' => 'NARS',         'suitable_for' => ['fair','light']],
            ['name' => 'Exhibit A',   'shade' => 'Blush',        'category' => 'blush', 'color' => '#E05A40', 'price' => 9500, 'brand' => 'NARS',         'suitable_for' => ['medium','tan','deep']],
            ['name' => 'Peaches',     'shade' => 'Powder Blush', 'category' => 'blush', 'color' => '#F0A060', 'price' => 7800, 'brand' => 'MAC',          'suitable_for' => ['fair','light']],
            ['name' => 'Mocha',       'shade' => 'Powder Blush', 'category' => 'blush', 'color' => '#9B6B5A', 'price' => 7800, 'brand' => 'MAC',          'suitable_for' => ['tan','deep']],
            ['name' => 'Fiji',        'shade' => 'Cheeks Out',   'category' => 'blush', 'color' => '#C47480', 'price' => 6200, 'brand' => 'Fenty Beauty', 'suitable_for' => ['medium','tan']],
            // ── FOUNDATION ──
            ['name' => 'NC15', 'shade' => 'Studio Fix Fluid', 'category' => 'foundation', 'color' => '#F2D8B8', 'price' => 12600, 'brand' => 'MAC',          'suitable_for' => ['fair','light']],
            ['name' => 'NC30', 'shade' => 'Studio Fix Fluid', 'category' => 'foundation', 'color' => '#C8945A', 'price' => 12600, 'brand' => 'MAC',          'suitable_for' => ['medium']],
            ['name' => 'NC45', 'shade' => 'Studio Fix Fluid', 'category' => 'foundation', 'color' => '#9B6B3A', 'price' => 12600, 'brand' => 'MAC',          'suitable_for' => ['tan']],
            ['name' => 'NC55', 'shade' => 'Studio Fix Fluid', 'category' => 'foundation', 'color' => '#6B3A1A', 'price' => 12600, 'brand' => 'MAC',          'suitable_for' => ['deep']],
            ['name' => '420W', 'shade' => "Pro Filt'r",       'category' => 'foundation', 'color' => '#C8A07A', 'price' => 11200, 'brand' => 'Fenty Beauty', 'suitable_for' => ['medium']],
            ['name' => '490W', 'shade' => "Pro Filt'r",       'category' => 'foundation', 'color' => '#7A4A2A', 'price' => 11200, 'brand' => 'Fenty Beauty', 'suitable_for' => ['deep']],
        ];

        foreach ($products as $data) {
            Product::create($data);
        }
    }
}
