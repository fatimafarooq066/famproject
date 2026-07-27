# FAM Fashion Hub — Virtual Try-On & AI Shopping Assistant

**Live app:** https://virtual-makeup-try--companysmartei.replit.app

A Laravel-based makeup virtual try-on experience with a browser-based
face try-on tool, a product catalogue, and an AI customer support chat
agent backed by a custom **MCP (Model Context Protocol) server**.

This is one of two Final Year Projects — an AI-powered fashion/beauty
e-commerce platform combining computer-vision try-on with an AI
shopping assistant grounded in real product data.

## The problem it solves

Buying makeup online is a gamble: a shade that looks perfect in a
product photo can look completely different against a real skin tone,
and customers have no way to check without ordering it and hoping. At
the same time, the questions customers actually have — "will this shade
suit me," "what's your cheapest matte lipstick," "what's in this
finish" — usually mean waiting on a human agent who may not be
available outside business hours.

FAM Fashion Hub solves this for **customers** by letting them try shades
on their own face through the browser before buying, and by giving them
an AI assistant that answers product questions instantly and only from
the real catalogue (never a guess). It solves it for the **store** by
handling routine product Q&A automatically, escalating to a human only
for what's actually out of scope (orders, complaints).

## Contents

- [Live demo](#live-app)
- [Features](#features)
- [The AI feature](#the-ai-feature)
- [Tools, services & models used](#tools-services--models-used)
- [Screenshots](#screenshots)
- [Tech stack](#-tech-stack)
- [Project structure](#-project-structure)
- [Requirements](#️-requirements)
- [How to run the project](#-setup)
- [API endpoints](#-api-endpoints)
- [Product schema](#️-product-schema)
- [Roadmap](#️-roadmap)

## Features

- **Live virtual try-on** — webcam-based face tracking (MediaPipe) that
  overlays lipstick, eyeshadow, and blush shades on the user's face in
  real time, so customers can "try before they buy."
- **Product catalogue** — lip, eye, blush, and foundation shades with
  brand, price (PKR), finish, and skin-tone suitability metadata.
- **AI customer support chat** — a floating chat widget on every page
  where customers can ask about products, prices, and what suits their
  skin tone in plain language, answered by an AI agent.
- **MCP server** — the AI agent is grounded in the real product catalogue
  through a set of MCP tools (search, get, recommend, price lookup,
  human escalation), exposed both in-process to the chat widget and over
  HTTP at `/mcp` for any external MCP client (Claude Desktop, Claude
  Code, etc.).

## The AI feature

A floating chat widget on every page lets customers ask about products,
shades, prices, and what suits their skin tone in plain language,
instead of browsing or filtering manually. It's grounded in the real
catalogue — it never invents a product, price, or shade that doesn't
exist.

**What it does:**
- Answers free-text product questions ("what's your cheapest matte
  lipstick under 3000?")
- Recommends products for a stated skin tone
- Looks up prices and price ranges by category
- Escalates to a human for anything outside the catalogue (orders,
  refunds, complaints) instead of guessing

**How it's grounded — the MCP tools** (`App\Mcp\Tools\ProductTools`):

| Tool | Purpose |
|---|---|
| `search_products` | Free-text/category/brand/skin-tone/price search |
| `get_product` | Full detail for one product by ID |
| `list_categories` | Categories with product counts |
| `recommend_for_skin_tone` | Curated picks for a stated skin tone |
| `get_price_range` | Min/max/avg price, whole catalogue or by category |
| `contact_human_support` | Escalates anything outside product Q&A |

**System prompt behind it** (`app/Services/ClaudeAgentService.php`):

```
You are the FAM Fashion Hub shopping assistant. You help customers
find makeup products, shades, and prices, and answer general
questions about the store. Always use the provided tools to look
up real product data instead of guessing — never invent product
names, prices, or availability. Keep replies short, warm, and
conversational (2-4 sentences), and use PKR for prices. If a
request is outside the product catalogue (orders, refunds,
complaints), use the contact_human_support tool.
```

The agent runs a standard tool-use loop: the message and tool
definitions go to Claude, any `tool_use` calls are executed in-process
against the same `McpServer` the `/mcp` HTTP endpoint uses, and results
are fed back until Claude returns a final text answer (capped at 5
tool-call rounds to avoid runaway loops).

## Tools, services & models used

| Category | Used |
|---|---|
| Backend framework | Laravel (PHP 8.1+) |
| Database | MySQL (or any Laravel-supported DB) |
| Frontend | Blade templates, vanilla JS, CSS |
| Face tracking / try-on | MediaPipe, HTML5 Canvas |
| AI model | Claude (Anthropic), model `claude-sonnet-5` |
| Agent grounding | Custom MCP server — JSON-RPC 2.0 over HTTP (`/mcp`), also called in-process |
| Hosting | Replit Deployments |

## Screenshots

> ⚠️ **TODO — add at least 3 screenshots.** I don't have browser access
> to the live Replit deployment from here to capture these myself —
> grab them from the live app and drop the image files into a
> `docs/screenshots/` folder in the repo, then reference them like this:

```markdown
### Virtual try-on in action
![Virtual try-on](docs/screenshots/virtual-tryon.png)

### Product catalogue
![Product catalogue](docs/screenshots/catalogue.png)

### AI chat answering a product question
![AI chat](docs/screenshots/ai-chat.png)
```

Good screens to capture: the webcam try-on view with a shade applied,
the product catalogue/browse view, and the chat widget open mid-answer
(ideally showing it citing a real price or shade).

## 🧱 Tech stack

| Layer | Technology |
|---|---|
| Backend | Laravel (PHP) |
| Face tracking / try-on | MediaPipe, HTML5 Canvas |
| AI agent | Claude (Anthropic Messages API), tool-use / function calling |
| Agent grounding | Custom MCP server (JSON-RPC 2.0 over HTTP) |
| Database | MySQL (or any Laravel-supported DB) |
| Frontend | Blade templates, vanilla JS, CSS |

## 📁 Project structure

```
app/
├── Http/Controllers/
│   ├── TryOnController.php     # product catalogue + try-on page
│   ├── ChatController.php      # POST /api/chat — customer chat endpoint
│   └── McpController.php       # POST /mcp — MCP JSON-RPC endpoint
├── Mcp/
│   ├── McpServer.php           # JSON-RPC dispatcher + tool registry
│   └── Tools/ProductTools.php  # search/get/recommend/price/escalate tools
├── Services/
│   └── ClaudeAgentService.php  # drives the Claude tool-use loop
└── Models/
    └── Product.php

database/
├── migrations/                 # products table
└── seeders/                    # ProductSeeder — sample catalogue data

resources/views/
├── layouts/app.blade.php       # shared layout (loads chat widget + assets)
├── tryon/index.blade.php       # virtual try-on page
└── partials/chat-widget.blade.php

public/
├── css/  fam-fashion.css, fam-chat.css
├── js/   fam-fashion.js (try-on logic), fam-chat.js (chat widget)
└── products/                   # product + shade swatch images

routes/web.php
```

## ⚙️ Requirements

- PHP 8.1+
- Composer
- MySQL (or another Laravel-supported database)
- An [Anthropic API key](https://console.anthropic.com/) (for the AI chat agent)

## 🚀 Setup

This folder is exported as loose Laravel files, not a full installable
project, so start by scaffolding a fresh Laravel app and copying these
files in:

```bash
composer create-project laravel/laravel fam-fashion-hub
cd fam-fashion-hub
```

Copy every file from this export into the new project at the matching
path (see the table in `SETUP.md` for the full file-by-file mapping).

### 1. Install dependencies

```bash
composer install
```

### 2. Configure environment

Copy `.env.example` to `.env` and set:

```env
DB_CONNECTION=mysql
DB_DATABASE=fam_fashion
DB_USERNAME=root
DB_PASSWORD=

ANTHROPIC_API_KEY=sk-ant-...
ANTHROPIC_MODEL=claude-sonnet-5
```

Then generate the app key:

```bash
php artisan key:generate
```

### 3. Exempt the chat/MCP routes from CSRF

In `app/Http/Middleware/VerifyCsrfToken.php`:

```php
protected $except = ['mcp', 'api/chat'];
```

*(Laravel 11+ without that middleware class: use
`->withMiddleware(fn ($m) => $m->validateCsrfTokens(except: ['mcp', 'api/chat']))`
in `bootstrap/app.php` instead.)*

### 4. Migrate and seed

```bash
php artisan migrate
php artisan db:seed --class=ProductSeeder
```

### 5. Run it

```bash
php artisan serve
```

Visit `http://localhost:8000` for the try-on page. The chat bubble is
in the bottom-right corner of every page.

## 🔌 API endpoints

| Method | Route | Purpose |
|---|---|---|
| `GET` | `/` | Virtual try-on page |
| `GET` | `/api/products` | List all products |
| `GET` | `/api/products/{id}` | Single product |
| `GET` | `/api/products/category/{category}` | Products by category |
| `POST` | `/api/chat` | Send a message to the AI shopping assistant |
| `POST` | `/mcp` | MCP JSON-RPC endpoint (`initialize`, `tools/list`, `tools/call`) |

### Using the MCP server from an external client

The same tools are reachable over HTTP, independent of the chat widget:

```bash
curl -X POST http://localhost:8000/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
```

Point any MCP-compatible client at it:

```json
{ "mcpServers": { "fam-fashion": { "url": "http://localhost:8000/mcp" } } }
```

## 🗂️ Product schema

| Field | Type | Notes |
|---|---|---|
| `name` | string | Product name |
| `shade` | string | Shade name |
| `category` | enum | `lips`, `eyes`, `blush`, `foundation` |
| `color` | string | Hex colour, e.g. `#9B1B1B` |
| `price` | integer | PKR |
| `brand` | string | |
| `finish` | string | e.g. Matte, Shimmer, Satin |
| `suitable_for` | json | Skin tones: `["fair","light","medium","tan","deep"]` |
| `image` | string | Filename in `public/products/` |
| `shade_image` | string, nullable | Shade swatch filename |

## 🛣️ Roadmap

- Orders / checkout flow, with a matching MCP tool for order status
- Vendor management in an admin panel
- Voice search
- Full FASHN.AI / Hugging Face IDM-VTON try-on integration

## 📄 License

Academic Final Year Project — not currently licensed for external reuse.
