# FAM Fashion – Laravel Setup Guide

## Requirements
- PHP 8.1+
- Composer
- MySQL / MariaDB
- Laravel 10 or 11

---

## Step 1 – Create a new Laravel project

```bash
composer create-project laravel/laravel fam-fashion
cd fam-fashion
```

---

## Step 2 – Copy these files into your project

Copy the files from this export into the matching paths in your Laravel project:

```
routes/web.php                           → routes/web.php
app/Http/Controllers/TryOnController.php → app/Http/Controllers/TryOnController.php
app/Models/Product.php                   → app/Models/Product.php
database/migrations/2024_01_01_...php   → database/migrations/
database/seeders/ProductSeeder.php       → database/seeders/ProductSeeder.php
database/seeders/DatabaseSeeder.php      → database/seeders/DatabaseSeeder.php
resources/views/layouts/app.blade.php   → resources/views/layouts/app.blade.php
resources/views/tryon/index.blade.php   → resources/views/tryon/index.blade.php
public/css/fam-fashion.css              → public/css/fam-fashion.css
public/js/fam-fashion.js               → public/js/fam-fashion.js
```

---

## Step 3 – Configure the database

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
CREATE DATABASE fam_fashion;
```

---

## Step 4 – Run migrations and seed

```bash
php artisan migrate
php artisan db:seed
```

This creates the `products` table and inserts all 30 makeup products.

---

## Step 5 – Run the app

```bash
php artisan serve
```

Visit: http://127.0.0.1:8000

---

## How it works

| Layer       | Technology                          |
|-------------|--------------------------------------|
| Backend     | Laravel (PHP) – routes, controllers, models, DB |
| Views       | Blade templates                      |
| Styling     | Plain CSS (`public/css/fam-fashion.css`) |
| Face AI     | MediaPipe Tasks Vision (loaded from CDN, runs in browser) |
| Makeup AR   | HTML5 Canvas API (vanilla JS)        |
| Database    | MySQL via Eloquent ORM               |

### Important note on MediaPipe
The face detection and makeup rendering run **entirely in the user's browser** using JavaScript.
This is unavoidable — MediaPipe is a client-side library. The Laravel backend only serves
the product data; the AI try-on is frontend-only.

---

## Adding more products

Either insert directly via the seeder, or add an admin route:

```php
// In routes/web.php
Route::post('/admin/products', [ProductController::class, 'store'])->middleware('auth');
```

Product fields:
- `name` – product name (e.g. "Ruby Woo")
- `shade` – finish/shade name (e.g. "Retro Matte")
- `category` – one of: `lips`, `eyes`, `blush`, `foundation`
- `color` – hex color (e.g. `#9B1B1B`)
- `price` – price in PKR (integer)
- `brand` – brand name
- `suitable_for` – JSON array of skin tones: `["fair","light","medium","tan","deep"]`
