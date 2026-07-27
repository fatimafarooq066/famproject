<?php

namespace App\Mcp\Tools;

use App\Mcp\McpServer;
use App\Models\Product;

/**
 * Tools the AI shopping assistant can call to answer customer questions
 * grounded in the real product catalogue — instead of guessing.
 */
class ProductTools
{
    protected const CATEGORIES = ['lips', 'eyes', 'blush', 'foundation'];
    protected const SKIN_TONES = ['fair', 'light', 'medium', 'tan', 'deep'];

    public static function register(McpServer $server): void
    {
        $server->tool(
            'search_products',
            'Search the FAM Fashion product catalogue by free-text query, category, brand, skin tone suitability, and/or max price. Use this whenever a customer asks about products, shades, prices, or what is available.',
            [
                'type' => 'object',
                'properties' => [
                    'query' => ['type' => 'string', 'description' => 'Free text to match against product name, shade, or brand'],
                    'category' => ['type' => 'string', 'enum' => self::CATEGORIES],
                    'skin_tone' => ['type' => 'string', 'enum' => self::SKIN_TONES],
                    'brand' => ['type' => 'string'],
                    'max_price' => ['type' => 'integer', 'description' => 'Maximum price in PKR'],
                ],
            ],
            [self::class, 'searchProducts']
        );

        $server->tool(
            'get_product',
            'Get full details for a single product by its numeric ID. Use this after search_products to answer follow-up questions about one specific item.',
            [
                'type' => 'object',
                'properties' => [
                    'id' => ['type' => 'integer'],
                ],
                'required' => ['id'],
            ],
            [self::class, 'getProduct']
        );

        $server->tool(
            'list_categories',
            'List the product categories available in the store along with how many products are in each.',
            ['type' => 'object', 'properties' => new \stdClass()],
            [self::class, 'listCategories']
        );

        $server->tool(
            'recommend_for_skin_tone',
            'Recommend suitable products for a given skin tone, optionally narrowed to one category. Use this when a customer asks what would suit them.',
            [
                'type' => 'object',
                'properties' => [
                    'skin_tone' => ['type' => 'string', 'enum' => self::SKIN_TONES],
                    'category' => ['type' => 'string', 'enum' => self::CATEGORIES],
                ],
                'required' => ['skin_tone'],
            ],
            [self::class, 'recommendForSkinTone']
        );

        $server->tool(
            'get_price_range',
            'Get the min, max, and average price (PKR) for a category, or for the whole catalogue if no category is given.',
            [
                'type' => 'object',
                'properties' => [
                    'category' => ['type' => 'string', 'enum' => self::CATEGORIES],
                ],
            ],
            [self::class, 'getPriceRange']
        );

        $server->tool(
            'contact_human_support',
            'Escalate to a human support agent. Use this ONLY for things outside the product catalogue — order status, complaints, refunds, account issues — or when the customer explicitly asks for a human. Do not use it for product questions.',
            [
                'type' => 'object',
                'properties' => [
                    'reason' => ['type' => 'string', 'description' => 'Short summary of what the customer needs help with'],
                ],
            ],
            [self::class, 'contactHumanSupport']
        );
    }

    public static function searchProducts(array $args): array
    {
        $q = Product::query();

        if (!empty($args['category'])) {
            $q->where('category', $args['category']);
        }

        if (!empty($args['brand'])) {
            $q->where('brand', 'like', '%' . $args['brand'] . '%');
        }

        if (!empty($args['skin_tone'])) {
            $q->whereJsonContains('suitable_for', $args['skin_tone']);
        }

        if (!empty($args['max_price'])) {
            $q->where('price', '<=', (int) $args['max_price']);
        }

        if (!empty($args['query'])) {
            $term = $args['query'];
            $q->where(function ($sub) use ($term) {
                $sub->where('name', 'like', "%{$term}%")
                    ->orWhere('shade', 'like', "%{$term}%")
                    ->orWhere('brand', 'like', "%{$term}%");
            });
        }

        $products = $q->orderBy('brand')->orderBy('name')->limit(20)->get();

        return [
            'count' => $products->count(),
            'products' => $products->map(fn (Product $p) => self::summarize($p))->all(),
        ];
    }

    public static function getProduct(array $args): array
    {
        $product = Product::find($args['id'] ?? null);

        if (!$product) {
            return ['found' => false, 'message' => 'No product with that ID.'];
        }

        return ['found' => true, 'product' => self::summarize($product, detailed: true)];
    }

    public static function listCategories(array $args): array
    {
        $counts = Product::selectRaw('category, count(*) as total')
            ->groupBy('category')
            ->pluck('total', 'category');

        return ['categories' => $counts];
    }

    public static function recommendForSkinTone(array $args): array
    {
        $q = Product::query()->whereJsonContains('suitable_for', $args['skin_tone'] ?? '');

        if (!empty($args['category'])) {
            $q->where('category', $args['category']);
        }

        $products = $q->orderBy('category')->limit(10)->get();

        return [
            'skin_tone' => $args['skin_tone'] ?? null,
            'count' => $products->count(),
            'products' => $products->map(fn (Product $p) => self::summarize($p))->all(),
        ];
    }

    public static function getPriceRange(array $args): array
    {
        $q = Product::query();

        if (!empty($args['category'])) {
            $q->where('category', $args['category']);
        }

        return [
            'category' => $args['category'] ?? 'all',
            'min_price' => (int) $q->min('price'),
            'max_price' => (int) (clone $q)->max('price'),
            'avg_price' => round((clone $q)->avg('price')),
        ];
    }

    public static function contactHumanSupport(array $args): array
    {
        return [
            'escalated' => true,
            'reason' => $args['reason'] ?? null,
            'message' => 'A human support agent has been notified and will follow up by email within 24 hours. In the meantime, you can also reach the team at support@famfashion.example.',
        ];
    }

    protected static function summarize(Product $p, bool $detailed = false): array
    {
        $data = [
            'id' => $p->id,
            'name' => $p->name,
            'brand' => $p->brand,
            'shade' => $p->shade,
            'category' => $p->category,
            'finish' => $p->finish,
            'price_pkr' => $p->price,
            'suitable_for' => $p->suitable_for,
            'image_url' => $p->image_url,
        ];

        if ($detailed) {
            $data['color'] = $p->color;
            $data['shade_image_url'] = $p->shade_image_url;
        }

        return $data;
    }
}
