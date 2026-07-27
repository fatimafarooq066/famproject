<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TryOnController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\McpController;

Route::get('/', [TryOnController::class, 'index'])->name('tryon.index');
Route::get('/api/products', [TryOnController::class, 'products'])->name('tryon.products');
Route::get('/api/products/{id}', [TryOnController::class, 'show'])->name('tryon.show');
Route::get('/api/products/category/{category}', [TryOnController::class, 'byCategory'])->name('tryon.byCategory');

// Customer support chat — the AI agent that answers via MCP tools.
Route::post('/api/chat', [ChatController::class, 'send'])->name('chat.send');

// MCP server endpoint — lets any MCP client (Claude Desktop, Claude Code,
// etc.) connect and use the same product tools the chat widget uses.
Route::post('/mcp', [McpController::class, 'handle'])->name('mcp.handle');
