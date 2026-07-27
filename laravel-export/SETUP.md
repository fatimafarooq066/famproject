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
