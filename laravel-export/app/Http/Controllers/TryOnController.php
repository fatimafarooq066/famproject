<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class TryOnController extends Controller
{
    /**
     * Main try-on page — groups products by category for the Blade view.
     */
    public function index()
    {
        $products = Product::orderBy('category')->orderBy('name')->get()->groupBy('category');

        return view('tryon.index', compact('products'));
    }

    /**
     * JSON API — all products (optional ?category= filter).
     */
    public function products(Request $request)
    {
        $query = Product::orderBy('brand')->orderBy('name');

        if ($request->has('category')) {
            $query->where('category', $request->query('category'));
        }

        if ($request->has('skin_tone')) {
            $tone = $request->query('skin_tone');
            $query->whereJsonContains('suitable_for', $tone);
        }

        return response()->json($query->get());
    }

    /**
     * JSON API — single product.
     */
    public function show(int $id)
    {
        return response()->json(Product::findOrFail($id));
    }

    /**
     * JSON API — products by category.
     */
    public function byCategory(string $category)
    {
        $allowed = ['lips', 'eyes', 'blush', 'foundation'];
        if (!in_array($category, $allowed)) {
            return response()->json(['error' => 'Invalid category'], 422);
        }

        return response()->json(Product::where('category', $category)->orderBy('brand')->orderBy('name')->get());
    }
}
