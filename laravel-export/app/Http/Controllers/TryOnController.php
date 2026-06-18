<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class TryOnController extends Controller
{
    public function index()
    {
        $categories = ['lips', 'eyes', 'blush', 'foundation'];
        $products = [];

        foreach ($categories as $cat) {
            $products[$cat] = Product::where('category', $cat)->orderBy('name')->get();
        }

        return view('tryon.index', compact('products', 'categories'));
    }

    public function products(Request $request)
    {
        $category = $request->query('category');

        $query = Product::query();
        if ($category) {
            $query->where('category', $category);
        }

        return response()->json($query->orderBy('name')->get());
    }
}
