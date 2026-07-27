@extends('layouts.app')

@section('content')
<div class="app-wrapper">

  {{-- ══════════════ HEADER ══════════════ --}}
  <header class="app-header">
    <div class="header-brand">
      <span class="brand-name">FAM Fashion</span>
      <span class="brand-tagline">AI Virtual Try-On</span>
    </div>
    <div class="header-actions" id="headerActions">
      <button class="btn btn-outline btn-sm" id="btnNewPhoto" style="display:none" onclick="resetApp()">
        ↺ New Photo
      </button>
      <button class="btn btn-primary btn-sm" id="btnSaveLook" style="display:none" onclick="downloadLook()">
        ↓ Save Look
      </button>
      <button class="cart-btn" id="cartBtn" onclick="toggleCart()">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/></svg>
        <span class="cart-badge" id="cartBadge" style="display:none">0</span>
      </button>
    </div>
  </header>

  <main class="app-main">

    {{-- ══════════════ LEFT: Photo Zone ══════════════ --}}
    <section class="photo-zone">

      {{-- Upload zone --}}
      <div class="upload-zone" id="uploadZone"
           ondragover="event.preventDefault(); this.classList.add('dragover')"
           ondragleave="this.classList.remove('dragover')"
           ondrop="handleDrop(event)"
           onclick="document.getElementById('fileInput').click()">
        <div class="upload-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#7B1C2E" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M12 8v8M8 12h8"/></svg>
        </div>
        <p class="upload-title">Add your photo</p>
        <p class="upload-sub">Use a clear front-facing photo for best results</p>
        <div class="upload-buttons">
          <button class="btn btn-primary" onclick="event.stopPropagation(); document.getElementById('fileInput').click()">
            ↑ Upload Photo
          </button>
          <button class="btn btn-outline" onclick="event.stopPropagation(); startCamera()">
            ◎ Use Camera
          </button>
        </div>
        <p class="upload-hint">or drag &amp; drop an image here</p>
        <div id="uploadError" class="upload-error" style="display:none"></div>
        <div id="modelStatus" class="model-status">
          <span class="spinner"></span> Loading AI model…
        </div>
      </div>

      {{-- Processing overlay --}}
      <div class="processing-overlay" id="processingOverlay" style="display:none">
        <span class="spinner spinner-lg"></span>
        <p>Analysing your photo…</p>
        <small>Detecting facial features &amp; skin tone</small>
      </div>

      {{-- Camera preview --}}
      <div class="camera-zone" id="cameraZone" style="display:none">
        <div class="camera-video-wrap">
          <video id="cameraVideo" autoplay playsinline muted></video>
          <div class="camera-guide"></div>
        </div>
        <div class="camera-controls">
          <button class="btn btn-primary" onclick="capturePhoto()">◎ Capture Photo</button>
          <button class="btn btn-outline" onclick="stopCamera(); showZone('upload')">✕ Cancel</button>
        </div>
      </div>

      {{-- Result canvas --}}
      <div class="result-zone" id="resultZone" style="display:none">
        <div class="skin-tone-badge" id="skinToneBadge" style="display:none">
          <span class="tone-dot" id="toneDot"></span>
          Skin tone: <strong id="toneLabel"></strong>
        </div>
        <div class="canvas-wrap">
          <canvas id="resultCanvas"></canvas>
        </div>
        <div class="intensity-row">
          <span class="intensity-label">Intensity</span>
          <input type="range" id="intensitySlider" min="0.2" max="1" step="0.05" value="0.65"
                 oninput="document.getElementById('intensityVal').textContent = Math.round(this.value*100)+'%'; rerenderMakeup()" />
          <span class="intensity-val" id="intensityVal">65%</span>
        </div>
        <button class="btn btn-primary btn-full" onclick="downloadLook()">✦ Save My Look</button>
      </div>

      {{-- Try On button (disabled until photo loaded) --}}
      <div id="tryOnPlaceholder">
        <button class="btn btn-primary btn-full btn-disabled" disabled>✦ Try On with AI</button>
      </div>

      <input type="file" id="fileInput" accept="image/*" style="display:none" onchange="handleFileInput(this)" />
    </section>

    {{-- ══════════════ RIGHT: Product Panel ══════════════ --}}
    <aside class="product-panel">
      <div class="panel-header">
        <h2 class="panel-title">Collection</h2>
        <div class="category-tabs" id="categoryTabs">
          @foreach(['lips','eyes','blush','foundation'] as $cat)
          <button class="cat-tab {{ $loop->first ? 'active' : '' }}"
                  data-category="{{ $cat }}"
                  onclick="switchCategory('{{ $cat }}')">{{ ucfirst($cat) }}</button>
          @endforeach
        </div>
      </div>

      {{-- Recommendation banner --}}
      <div class="rec-banner" id="recBanner" style="display:none">
        <span class="rec-icon">ℹ</span>
        <div>
          <p class="rec-title">Better matches for your skin tone:</p>
          <div class="rec-list" id="recList"></div>
        </div>
      </div>

      {{-- Product grids (one per category) --}}
      @foreach(['lips','eyes','blush','foundation'] as $cat)
      <div class="product-grid" id="grid-{{ $cat }}" style="{{ !$loop->first ? 'display:none' : '' }}">
        @foreach($products[$cat] ?? [] as $product)
        <div class="product-card {{ $cat }}-card"
             id="card-{{ $product->id }}"
             data-id="{{ $product->id }}"
             data-category="{{ $product->category }}"
             data-color="{{ $product->color }}"
             data-name="{{ $product->name }}"
             data-suitable="{{ implode(',', $product->suitable_for) }}"
             data-shade-image="{{ $product->shade_image_url ?? '' }}"
             onclick="toggleProduct({{ $product->id }})"
             onmouseenter="showShadePreview('{{ $product->shade_image_url ?? '' }}')"
             onmouseleave="hideShadePreview()">
          <div class="product-image-wrap">
            <img src="{{ $product->image_url }}"
                 alt="{{ $product->name }}"
                 class="product-img"
                 loading="lazy"
                 onerror="this.style.display='none'" />
            <span class="selected-check" id="check-{{ $product->id }}" style="display:none">✓</span>
            <button class="cart-add-btn" id="cartBtn-{{ $product->id }}"
                    onclick="event.stopPropagation(); addToCart({{ $product->id }})"
                    title="Add to cart">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/></svg>
            </button>
            <div class="color-dot" style="background:{{ $product->color }}"></div>
          </div>
          <div class="product-info">
            <p class="product-name">{{ $product->name }}</p>
            <p class="product-brand">{{ $product->brand }}</p>
            <div class="product-meta">
              <span class="product-finish">{{ $product->finish }}</span>
              <span class="product-price">Rs.{{ number_format($product->price) }}</span>
            </div>
          </div>
        </div>
        @endforeach
      </div>
      @endforeach

      {{-- Upload prompt --}}
      <div class="upload-prompt" id="uploadPrompt">
        <div class="upload-prompt-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#C4A99E" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M12 8v8M8 12h8"/></svg>
        </div>
        <p>Upload a photo to try on products</p>
      </div>

      {{-- Shade preview strip --}}
      <div class="shade-preview" id="shadePreview" style="display:none">
        <p class="shade-label">Shade swatch</p>
        <img id="shadePreviewImg" src="" alt="Shade swatch" class="shade-img" />
      </div>
    </aside>
  </main>

  {{-- ══════════════ CART DRAWER ══════════════ --}}
  <div class="cart-backdrop" id="cartBackdrop" style="display:none" onclick="toggleCart()"></div>
  <div class="cart-drawer" id="cartDrawer">
    <div class="cart-header">
      <h2>Your Cart (<span id="cartCount">0</span>)</h2>
      <button class="cart-close" onclick="toggleCart()">✕</button>
    </div>
    <div class="cart-items" id="cartItems">
      <div class="cart-empty" id="cartEmpty">
        <div class="cart-empty-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#C4A99E" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/></svg>
        </div>
        <p>Your cart is empty</p>
        <small>Try on products and add your favourites</small>
      </div>
    </div>
    <div class="cart-footer" id="cartFooter" style="display:none">
      <div class="cart-total">
        <span>Total</span>
        <strong id="cartTotal">Rs. 0</strong>
      </div>
      <button class="btn btn-primary btn-full">Proceed to Checkout</button>
    </div>
  </div>

</div>{{-- .app-wrapper --}}

{{-- Inject PHP product data as JS object for the frontend AR layer --}}
@push('scripts')
<script>
window.ALL_PRODUCTS = @json(collect($products)->flatten()->values()->map(fn($p) => [
    'id'          => $p->id,
    'name'        => $p->name,
    'shade'       => $p->shade,
    'category'    => $p->category,
    'color'       => $p->color,
    'price'       => $p->price,
    'brand'       => $p->brand,
    'finish'      => $p->finish,
    'suitableFor' => $p->suitable_for,
    'image'       => $p->image_url,
    'shadeImage'  => $p->shade_image_url,
]));
</script>
@endpush
@endsection
