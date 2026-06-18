@extends('layouts.app')

@section('content')

<!-- ══════════════════ HEADER ══════════════════ -->
<header class="header">
    <span class="header-logo">FAM Fashion</span>
    <span class="header-subtitle">AI Virtual Try-On</span>
    <div class="header-actions" id="headerActions" style="display:none;">
        <button class="btn btn-outline btn-sm" id="btnNewPhoto">&#8635; New Photo</button>
        <button class="btn btn-primary btn-sm" id="btnSaveLook">&#8595; Save Look</button>
    </div>
</header>

<!-- ══════════════════ MAIN LAYOUT ══════════════════ -->
<main class="main-layout">

    <!-- ── LEFT: Photo / Camera / Result ── -->
    <section class="photo-section">

        <!-- Upload Zone (default) -->
        <div class="upload-zone" id="uploadZone">
            <div class="upload-zone-inner" id="dropArea">
                <div class="upload-icon-wrap" id="uploadIconWrap">
                    <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#7B1C2E" stroke-width="1.7">
                        <rect x="3" y="3" width="18" height="18" rx="3"/>
                        <path d="M12 8v8M8 12h8" stroke-linecap="round"/>
                    </svg>
                </div>
                <p class="upload-title" id="uploadTitle">Add your photo</p>
                <p class="upload-sub" id="uploadSub">Use a clear front-facing photo for best results</p>
                <div class="upload-buttons" id="uploadButtons">
                    <button class="btn btn-primary" id="btnUploadPhoto">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                        Upload Photo
                    </button>
                    <button class="btn btn-outline" id="btnUseCamera">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                        Use Camera
                    </button>
                </div>
                <p class="upload-drag-hint">or drag &amp; drop an image here</p>
                <p class="upload-error" id="uploadError" style="display:none;"></p>
            </div>
            <input type="file" id="fileInput" accept="image/*" style="display:none;" />
        </div>

        <!-- Camera Preview -->
        <div class="camera-zone" id="cameraZone" style="display:none;">
            <div class="camera-preview-wrap">
                <video id="cameraVideo" autoplay playsinline muted class="camera-video"></video>
                <div class="camera-guide-ring"></div>
            </div>
            <div class="camera-actions">
                <button class="btn btn-primary" id="btnCapture">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/></svg>
                    Capture
                </button>
                <button class="btn btn-outline" id="btnCancelCamera">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    Cancel
                </button>
            </div>
        </div>

        <!-- Result Canvas -->
        <div class="result-zone" id="resultZone" style="display:none;">
            <div class="skin-tone-badge" id="skinToneBadge" style="display:none;">
                <span class="skin-tone-dot" id="skinToneDot"></span>
                Skin tone detected: <strong id="skinToneLabel"></strong>
            </div>
            <div class="result-canvas-wrap">
                <canvas id="resultCanvas" class="result-canvas"></canvas>
            </div>
            <div class="intensity-row">
                <span class="intensity-label">Intensity</span>
                <input type="range" id="intensitySlider" min="20" max="100" value="65" class="intensity-slider" />
                <span class="intensity-value" id="intensityValue">65%</span>
            </div>
        </div>

        <!-- Try On / Save button at bottom -->
        <button class="btn btn-primary btn-full btn-tall" id="btnTryOn" disabled>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            Try On with AI
        </button>
    </section>

    <!-- ── RIGHT: Products ── -->
    <aside class="product-panel">
        <h2 class="collection-title">Collection</h2>

        <!-- Category tabs -->
        <div class="category-tabs" id="categoryTabs">
            <button class="cat-tab active" data-cat="lips">Lips</button>
            <button class="cat-tab" data-cat="eyes">Eyes</button>
            <button class="cat-tab" data-cat="blush">Blush</button>
            <button class="cat-tab" data-cat="foundation">Foundation</button>
        </div>

        <!-- Recommendation banner -->
        <div class="rec-banner" id="recBanner" style="display:none;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#92400e" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <div>
                <p class="rec-banner-title">Better matches for your skin tone:</p>
                <div class="rec-chips" id="recChips"></div>
            </div>
        </div>

        <!-- Product grid (rendered per category from Blade, hidden/shown via JS) -->
        @foreach($categories as $cat)
        <div class="product-grid" id="grid-{{ $cat }}" style="{{ $cat !== 'lips' ? 'display:none;' : '' }}">
            @foreach($products[$cat] as $product)
            <button
                class="product-card"
                data-id="{{ $product->id }}"
                data-category="{{ $product->category }}"
                data-color="{{ $product->color }}"
                data-suitable="{{ implode(',', $product->suitable_for) }}"
                data-name="{{ $product->name }}"
            >
                <div class="product-card-top">
                    <div class="product-swatch" style="background:{{ $product->color }};"></div>
                    <span class="product-price">Rs. {{ number_format($product->price) }}</span>
                </div>
                <p class="product-name">{{ $product->name }}</p>
                <p class="product-brand">{{ $product->brand }}</p>
                <p class="product-shade">{{ $product->shade }}</p>
            </button>
            @endforeach
        </div>
        @endforeach

        <!-- Placeholder when no photo loaded -->
        <div class="no-photo-hint" id="noPhotoHint">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#C4A99E" stroke-width="1.4"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M12 8v8M8 12h8" stroke-linecap="round"/></svg>
            <p>Upload a photo to try on products</p>
        </div>
    </aside>

</main>

<!-- Hidden canvas for MediaPipe image processing -->
<canvas id="processingCanvas" style="display:none;"></canvas>

@endsection

@push('scripts')
<script>
    // Pass PHP product data to JS
    window.ALL_PRODUCTS = @json(collect($products)->flatten()->values());
</script>
@endpush
