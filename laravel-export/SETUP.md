# FAM Fashion – Laravel Setup Guide

## Requirements
- PHP 8.1+
- Composer
- MySQL / MariaDB
- Node.js (optional — only for compiling assets with Vite/Mix)

---

## 1. Create a new Laravel project

```bash
composer create-project laravel/laravel fam-fashion
cd fam-fashion
```

---

## 2. Copy the exported files

Copy each folder from this export **into your Laravel project root**:

| Source (this export) | Destination (Laravel root) |
|---|---|
| `app/Http/Controllers/TryOnController.php` | `app/Http/Controllers/` |
| `app/Models/Product.php` | `app/Models/` |
| `database/migrations/` | `database/migrations/` |
| `database/seeders/ProductSeeder.php` | `database/seeders/` |
| `database/seeders/DatabaseSeeder.php` | `database/seeders/` |
| `resources/views/layouts/app.blade.php` | `resources/views/layouts/` |
| `resources/views/tryon/index.blade.php` | `resources/views/tryon/` |
| `public/css/fam-fashion.css` | `public/css/` |
| `public/js/fam-fashion.js` | `public/js/` |
| `public/products/*.png` | `public/products/` ← **ALL product images** |
| `routes/web.php` | `routes/` (replace existing) |
<<<<<<< HEAD
| `app/Mcp/McpServer.php` | `app/Mcp/` |
| `app/Mcp/Tools/ProductTools.php` | `app/Mcp/Tools/` |
| `app/Services/ClaudeAgentService.php` | `app/Services/` |
| `app/Http/Controllers/ChatController.php` | `app/Http/Controllers/` |
| `app/Http/Controllers/McpController.php` | `app/Http/Controllers/` |
| `resources/views/partials/chat-widget.blade.php` | `resources/views/partials/` |
| `public/css/fam-chat.css` | `public/css/` |
| `public/js/fam-chat.js` | `public/js/` |
=======
>>>>>>> fa82c8a55c1bfea9cbf43c4f4996f1189704b607

---

## 3. Configure the database

Edit `.env`:

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=fam_fashion
DB_USERNAME=root
DB_PASSWORD=your_password
```

Create the database:

```sql
CREATE DATABASE fam_fashion CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

## 4. Run migrations and seed products

```bash
php artisan migrate
php artisan db:seed --class=ProductSeeder
```

---

## 5. Start the server

```bash
php artisan serve
```

Visit **http://127.0.0.1:8000** — the try-on app will load.

---

## 6. How it works

### Backend (Laravel)
- `TryOnController@index` — fetches all products grouped by category, renders the Blade view
- `GET /api/products` — JSON endpoint (supports `?category=lips&skin_tone=medium` filters)
- `GET /api/products/{id}` — single product JSON
- Products stored in MySQL; images served as static files from `public/products/`

### Frontend (Vanilla JS)
- Face landmark detection runs **100% in the browser** via MediaPipe (no PHP involvement)
- `window.ALL_PRODUCTS` is populated by the Blade view at page load (no AJAX needed)
- Canvas blend modes (multiply / screen) create realistic-looking makeup
- Cart state is client-side only; wire up to a checkout system as needed

---

## 7. Adding new products

Option A — Seeder (recommended for bulk):
1. Add product rows to `ProductSeeder.php`
2. Run `php artisan db:seed --class=ProductSeeder`

Option B — Tinker (quick one-off):
```bash
php artisan tinker
App\Models\Product::create([
    'name'        => 'New Lip',
    'shade'       => 'Matte',
    'category'    => 'lips',
    'color'       => '#FF0000',
    'price'       => 5000,
    'brand'       => 'Brand Name',
    'finish'      => 'Matte',
    'suitable_for'=> ['medium','tan'],
    'image'       => 'new-lip.png',
]);
```

Option C — Admin panel: install `filament/filament` or `backpack/backpack` for a full CRUD UI.

---

## 8. Column reference

| Column | Type | Notes |
|---|---|---|
| `id` | bigint unsigned | Auto-increment |
| `name` | varchar | Product display name |
| `shade` | varchar | Shade descriptor |
| `category` | enum | `lips` / `eyes` / `blush` / `foundation` |
| `color` | varchar(7) | Hex colour `#RRGGBB` used for AR overlay |
| `price` | unsigned int | PKR (Pakistani Rupees) |
| `brand` | varchar | Brand name |
| `finish` | varchar | e.g. Matte, Shimmer, Satin |
| `suitable_for` | json | Array of skin tones: `["fair","light","medium","tan","deep"]` |
| `image` | varchar | Filename in `public/products/` |
| `shade_image` | varchar | Shade swatch filename (nullable) |
<<<<<<< HEAD

---

## 9. AI customer chat + MCP server

A chat bubble (bottom-right, on every page) lets customers ask an AI
agent about products, shades, prices, and skin-tone recommendations. The
agent is grounded in your real catalogue via an **MCP (Model Context
Protocol) server** — it never invents products, it looks them up.

### 9.1 How it fits together

```
Browser widget (fam-chat.js)
   → POST /api/chat  (ChatController)
       → ClaudeAgentService: calls the Claude Messages API with tools
         from McpServer, executes any tool_use calls in-process against
         McpServer, loops until Claude gives a final text reply
           → App\Mcp\Tools\ProductTools (search/get/recommend/price/escalate)
```

`McpServer` is also exposed over HTTP at `POST /mcp` (see `McpController`)
using the JSON-RPC 2.0 methods `initialize`, `tools/list`, and
`tools/call`, so any MCP client — Claude Desktop, Claude Code, etc. —
can connect to the **same** tools the chat widget uses, e.g.:

```json
{ "mcpServers": { "fam-fashion": { "url": "https://your-app.test/mcp" } } }
```

### 9.2 Environment variables

Add to `.env`:

```
ANTHROPIC_API_KEY=sk-ant-...
ANTHROPIC_MODEL=claude-sonnet-5
```

Get a key from the Anthropic Console. Without it, `/api/chat` returns a
friendly "assistant unavailable" message instead of erroring out.

### 9.3 Exempt `/api/chat` and `/mcp` from CSRF

Both routes sit in `routes/web.php` so the chat widget shares cookies
with the page, but `/mcp` is meant to be called by external clients that
won't have a CSRF token. In `app/Http/Middleware/VerifyCsrfToken.php`,
add:

```php
protected $except = [
    'mcp',
    'api/chat', // optional — fam-chat.js already sends the CSRF header
];
```

(If you're on Laravel 11+ with the slim `bootstrap/app.php` setup
instead of a Kernel/middleware class, use
`->withMiddleware(fn ($m) => $m->validateCsrfTokens(except: ['mcp', 'api/chat']))`
in `bootstrap/app.php` instead.)

### 9.4 Extending the agent

To teach the assistant about something new (e.g. orders, once you add
an `Order` model), register another tool in
`App\Mcp\Tools\ProductTools::register()` — or add a sibling class and
call its `register()` from a service provider's `boot()` method. Every
registered tool is automatically available to both the chat widget and
any external MCP client, with no other wiring needed.
=======
>>>>>>> fa82c8a55c1bfea9cbf43c4f4996f1189704b607
