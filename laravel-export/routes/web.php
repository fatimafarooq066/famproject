<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TryOnController;

Route::get('/', [TryOnController::class, 'index'])->name('tryon.index');
Route::get('/api/products', [TryOnController::class, 'products'])->name('tryon.products');
Route::get('/api/products/{id}', [TryOnController::class, 'show'])->name('tryon.show');
Route::get('/api/products/category/{category}', [TryOnController::class, 'byCategory'])->name('tryon.byCategory');
