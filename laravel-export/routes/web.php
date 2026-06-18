<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TryOnController;

Route::get('/', [TryOnController::class, 'index'])->name('tryon.index');
Route::get('/api/products', [TryOnController::class, 'products'])->name('tryon.products');
