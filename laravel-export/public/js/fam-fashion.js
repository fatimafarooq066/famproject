/**
 * FAM Fashion – AI Virtual Try-On
 * Vanilla JavaScript (no framework required)
 * Depends on: @mediapipe/tasks-vision loaded from CDN
 */

/* ═══════════════════════ MediaPipe CDN ═══════════════════════ */
(function loadMediaPipe() {
    var script = document.createElement('script');
    script.type = 'module';
    script.innerHTML = `
import { FaceLandmarker, FilesetResolver } from
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/vision_bundle.mjs";

window._mpLoaded = { FaceLandmarker, FilesetResolver };
window.dispatchEvent(new Event('mp-ready'));
`;
    document.head.appendChild(script);
})();

/* ═══════════════════════ Landmark Indices ═══════════════════════ */
var LIPS_OUTER = [61,185,40,39,37,0,267,269,270,409,291,375,321,405,314,17,84,181,91,146];
var LIPS_INNER = [78,191,80,81,82,13,312,311,310,415,308,324,318,402,317,14,87,178,88,95];
var LEFT_LID   = [33,246,161,160,159,158,157,173,133,155,154,153,145,144,163,7];
var RIGHT_LID  = [362,398,384,385,386,387,388,466,263,249,390,373,374,380,381,382];
var LEFT_BROW  = [46,53,52,65,55,70,63,105,66,107];
var RIGHT_BROW = [276,283,282,295,285,300,293,334,296,336];
var FACE_OVAL  = [10,338,297,332,284,251,389,356,454,323,361,288,397,365,379,378,400,377,152,148,176,149,150,136,172,58,132,93,234,127,162,21,54,103,67,109];

var SKIN_TONE_COLORS = { fair:'#F5E0C8', light:'#E8C9A0', medium:'#C8956A', tan:'#A0623A', deep:'#5C3317' };
var SKIN_TONE_LABELS = { fair:'Fair', light:'Light', medium:'Medium', tan:'Tan', deep:'Deep' };

/* ═══════════════════════ State ═══════════════════════ */
var state = {
    mode: 'upload',          // upload | camera | processing | result
    faceLandmarker: null,
    modelReady: false,
    landmarks: null,
    skinTone: null,
    intensity: 0.65,
    photoImg: null,          // HTMLImageElement of captured/uploaded photo
    stream: null,            // MediaStream
    selected: { lips: null, eyes: null, blush: null, foundation: null },
    activeCategory: 'lips',
};

/* ═══════════════════════ Elements ═══════════════════════ */
var $ = function(id) { return document.getElementById(id); };

var els = {
    uploadZone:    $('uploadZone'),
    dropArea:      $('dropArea'),
    cameraZone:    $('cameraZone'),
    resultZone:    $('resultZone'),
    fileInput:     $('fileInput'),
    cameraVideo:   $('cameraVideo'),
    resultCanvas:  $('resultCanvas'),
    procCanvas:    $('processingCanvas'),
    intensSlider:  $('intensitySlider'),
    intensValue:   $('intensityValue'),
    uploadError:   $('uploadError'),
    skinToneBadge: $('skinToneBadge'),
    skinToneDot:   $('skinToneDot'),
    skinToneLabel: $('skinToneLabel'),
    recBanner:     $('recBanner'),
    recChips:      $('recChips'),
    headerActions: $('headerActions'),
    btnTryOn:      $('btnTryOn'),
    noPhotoHint:   $('noPhotoHint'),
    categoryTabs:  document.querySelectorAll('.cat-tab'),
};

/* ═══════════════════════ Init MediaPipe ═══════════════════════ */
window.addEventListener('mp-ready', function() {
    var mp = window._mpLoaded;
    mp.FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
    ).then(function(fs) {
        return mp.FaceLandmarker.createFromOptions(fs, {
            baseOptions: {
                modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
                delegate: 'GPU',
            },
            runningMode: 'IMAGE',
            numFaces: 1,
        });
    }).then(function(fl) {
        state.faceLandmarker = fl;
        state.modelReady = true;
    }).catch(function() {
        showError('AI model failed to load. Please refresh the page.');
    });
});

/* ═══════════════════════ Mode Switching ═══════════════════════ */
function setMode(mode) {
    state.mode = mode;
    els.uploadZone.style.display    = (mode === 'upload')  ? 'flex'  : 'none';
    els.cameraZone.style.display    = (mode === 'camera')  ? 'flex'  : 'none';
    els.resultZone.style.display    = (mode === 'result')  ? 'flex'  : 'none';
    els.headerActions.style.display = (mode === 'result')  ? 'flex'  : 'none';
    els.btnTryOn.disabled           = (mode !== 'result');
    els.btnTryOn.textContent        =  mode === 'result' ? '⬇ Save My Look' : '✦ Try On with AI';

    // Lock / unlock product cards
    document.querySelectorAll('.product-card').forEach(function(card) {
        card.classList.toggle('locked', mode !== 'result');
    });

    // No photo hint
    if (els.noPhotoHint) {
        els.noPhotoHint.style.display = (mode === 'result') ? 'none' : 'block';
    }
}

/* ═══════════════════════ Upload / File ═══════════════════════ */
els.dropArea.addEventListener('click', function() { els.fileInput.click(); });
els.dropArea.addEventListener('dragover', function(e) { e.preventDefault(); els.dropArea.classList.add('drag-over'); });
els.dropArea.addEventListener('dragleave', function() { els.dropArea.classList.remove('drag-over'); });
els.dropArea.addEventListener('drop', function(e) {
    e.preventDefault(); els.dropArea.classList.remove('drag-over');
    var file = e.dataTransfer.files[0];
    if (file) processFile(file);
});
els.fileInput.addEventListener('change', function() {
    var file = this.files[0];
    if (file) { processFile(file); this.value = ''; }
});

document.getElementById('btnUploadPhoto').addEventListener('click', function(e) {
    e.stopPropagation(); els.fileInput.click();
});
document.getElementById('btnUseCamera').addEventListener('click', function(e) {
    e.stopPropagation(); startCamera();
});

function processFile(file) {
    if (!file.type.startsWith('image/')) return;
    var reader = new FileReader();
    reader.onload = function(e) {
        var url = e.target.result;
        var img = new Image();
        img.onload = function() {
            var tmp = document.createElement('canvas');
            tmp.width  = img.naturalWidth;
            tmp.height = img.naturalHeight;
            tmp.getContext('2d').drawImage(img, 0, 0);
            processImageCanvas(tmp, url);
        };
        img.src = url;
    };
    reader.readAsDataURL(file);
}

/* ═══════════════════════ Camera ═══════════════════════ */
function startCamera() {
    setMode('camera');
    navigator.mediaDevices.getUserMedia({ video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' } })
        .then(function(stream) {
            state.stream = stream;
            els.cameraVideo.srcObject = stream;
        })
        .catch(function() {
            setMode('upload');
            showError('Camera access denied. Please allow camera permission in your browser settings.');
        });
}

function stopCamera() {
    if (state.stream) { state.stream.getTracks().forEach(function(t) { t.stop(); }); state.stream = null; }
}

document.getElementById('btnCapture').addEventListener('click', function() {
    var video = els.cameraVideo;
    var tmp = document.createElement('canvas');
    tmp.width  = video.videoWidth;
    tmp.height = video.videoHeight;
    tmp.getContext('2d').drawImage(video, 0, 0);
    stopCamera();
    processImageCanvas(tmp);
});

document.getElementById('btnCancelCamera').addEventListener('click', function() {
    stopCamera(); setMode('upload');
});

/* ═══════════════════════ Face Detection & Processing ═══════════════════════ */
function showProcessingOverlay(show) {
    var existing = document.getElementById('processingOverlay');
    if (show && !existing) {
        var el = document.createElement('div');
        el.id = 'processingOverlay';
        el.className = 'processing-overlay';
        el.innerHTML = '<div class="spinner"></div><p>Analysing your photo...</p><small>Detecting facial features</small>';
        document.body.appendChild(el);
    } else if (!show && existing) {
        existing.remove();
    }
}

function processImageCanvas(srcCanvas, existingUrl) {
    hideError();
    showProcessingOverlay(true);

    if (!state.modelReady) {
        showProcessingOverlay(false);
        showError('AI model is still loading. Please wait a moment and try again.');
        return;
    }

    var url = existingUrl || srcCanvas.toDataURL('image/jpeg', 0.92);

    var results;
    try {
        results = state.faceLandmarker.detect(srcCanvas);
    } catch (err) {
        showProcessingOverlay(false);
        showError('Something went wrong. Please try a different photo.');
        return;
    }

    showProcessingOverlay(false);

    if (!results.faceLandmarks || results.faceLandmarks.length === 0) {
        showError('No face detected. Please use a clear, front-facing photo.');
        return;
    }

    state.landmarks = results.faceLandmarks[0];
    state.skinTone  = detectSkinTone(srcCanvas, state.landmarks);

    // Load photo into an Image element for re-rendering
    var img = new Image();
    img.onload = function() {
        state.photoImg = img;
        setMode('result');
        updateSkinToneBadge();
        renderMakeup();
        updateRecommendationBanner();
    };
    img.src = url;
}

/* ═══════════════════════ Skin Tone ═══════════════════════ */
function detectSkinTone(canvas, lms) {
    var ctx = canvas.getContext('2d');
    var w = canvas.width, h = canvas.height;
    var pts = [lms[10], lms[50], lms[280]];
    var lum = 0, valid = 0;
    pts.forEach(function(pt) {
        try {
            var px = ctx.getImageData(Math.floor(pt.x * w), Math.floor(pt.y * h), 1, 1).data;
            lum += 0.299 * px[0] + 0.587 * px[1] + 0.114 * px[2];
            valid++;
        } catch(e) {}
    });
    lum = valid > 0 ? lum / valid : 120;
    if (lum > 200) return 'fair';
    if (lum > 165) return 'light';
    if (lum > 125) return 'medium';
    if (lum > 80)  return 'tan';
    return 'deep';
}

function updateSkinToneBadge() {
    if (!state.skinTone) return;
    els.skinToneBadge.style.display = 'flex';
    els.skinToneDot.style.backgroundColor = SKIN_TONE_COLORS[state.skinTone];
    els.skinToneLabel.textContent = SKIN_TONE_LABELS[state.skinTone];
}

/* ═══════════════════════ Makeup Rendering ═══════════════════════ */
function renderMakeup() {
    if (state.mode !== 'result' || !state.landmarks || !state.photoImg) return;

    var canvas = els.resultCanvas;
    var img    = state.photoImg;
    canvas.width  = img.naturalWidth;
    canvas.height = img.naturalHeight;
    var ctx = canvas.getContext('2d');
    var w = canvas.width, h = canvas.height;
    var op = state.intensity;

    // Base photo
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0);

    // Makeup layers
    if (state.selected.foundation) applyFoundation(ctx, state.landmarks, state.selected.foundation.color, op, w, h);
    if (state.selected.blush)      applyBlush(ctx, state.landmarks, state.selected.blush.color, op, w, h);
    if (state.selected.eyes)       applyEyeshadow(ctx, state.landmarks, state.selected.eyes.color, op, w, h);
    if (state.selected.lips)       applyLips(ctx, state.landmarks, state.selected.lips.color, op, w, h);
}

/* ── Drawing helpers ── */
function hexToRgb(hex) {
    return {
        r: parseInt(hex.slice(1,3), 16),
        g: parseInt(hex.slice(3,5), 16),
        b: parseInt(hex.slice(5,7), 16),
    };
}

function buildPath(ctx, lms, indices, w, h) {
    ctx.beginPath();
    indices.forEach(function(i, idx) {
        var pt = lms[i];
        if (idx === 0) ctx.moveTo(pt.x * w, pt.y * h);
        else           ctx.lineTo(pt.x * w, pt.y * h);
    });
    ctx.closePath();
}

function applyLips(ctx, lms, color, opacity, w, h) {
    var tmp = document.createElement('canvas');
    tmp.width = w; tmp.height = h;
    var tCtx = tmp.getContext('2d');

    buildPath(tCtx, lms, LIPS_OUTER, w, h);
    tCtx.fillStyle = color;
    tCtx.fill();

    tCtx.globalCompositeOperation = 'destination-out';
    buildPath(tCtx, lms, LIPS_INNER, w, h);
    tCtx.fill();
    tCtx.globalCompositeOperation = 'source-over';

    ctx.save();
    ctx.filter = 'blur(1.2px)';
    ctx.globalAlpha = opacity * 0.9;
    ctx.globalCompositeOperation = 'multiply';
    ctx.drawImage(tmp, 0, 0);
    ctx.filter = 'none';

    // Gloss highlight
    var lower = lms[17];
    var gx = lower.x * w, gy = lower.y * h;
    var gGrad = ctx.createRadialGradient(gx, gy - 3, 0, gx, gy - 3, 20);
    gGrad.addColorStop(0, 'rgba(255,255,255,0.35)');
    gGrad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.globalCompositeOperation = 'screen';
    ctx.globalAlpha = opacity * 0.5;
    ctx.fillStyle = gGrad;
    buildPath(ctx, lms, LIPS_OUTER, w, h);
    ctx.fill();
    ctx.restore();
}

function applyEyeshadow(ctx, lms, color, opacity, w, h) {
    var c = hexToRgb(color);
    var groups = [
        { lid: LEFT_LID,  brow: LEFT_BROW },
        { lid: RIGHT_LID, brow: RIGHT_BROW },
    ];
    groups.forEach(function(g) {
        var tmp = document.createElement('canvas');
        tmp.width = w; tmp.height = h;
        var tCtx = tmp.getContext('2d');

        var allIdx = g.lid.concat(g.brow);
        var xs = allIdx.map(function(i) { return lms[i].x * w; });
        var ys = allIdx.map(function(i) { return lms[i].y * h; });
        var minY = Math.min.apply(null, ys), maxY = Math.max.apply(null, ys);
        var midX = (Math.min.apply(null, xs) + Math.max.apply(null, xs)) / 2;

        var grad = tCtx.createLinearGradient(midX, maxY, midX, minY);
        grad.addColorStop(0, 'rgba('+c.r+','+c.g+','+c.b+',0.85)');
        grad.addColorStop(0.5, 'rgba('+c.r+','+c.g+','+c.b+',0.45)');
        grad.addColorStop(1, 'rgba('+c.r+','+c.g+','+c.b+',0)');

        tCtx.beginPath();
        g.brow.forEach(function(i, idx) {
            var pt = lms[i];
            if (idx === 0) tCtx.moveTo(pt.x * w, pt.y * h);
            else           tCtx.lineTo(pt.x * w, pt.y * h);
        });
        var revLid = g.lid.slice().reverse();
        revLid.forEach(function(i) { tCtx.lineTo(lms[i].x * w, lms[i].y * h); });
        tCtx.closePath();
        tCtx.fillStyle = grad;
        tCtx.fill();

        ctx.save();
        ctx.filter = 'blur(2.5px)';
        ctx.globalAlpha = opacity * 0.75;
        ctx.globalCompositeOperation = 'multiply';
        ctx.drawImage(tmp, 0, 0);
        ctx.filter = 'none';
        ctx.restore();
    });
}

function applyBlush(ctx, lms, color, opacity, w, h) {
    var c = hexToRgb(color);
    [[50, -0.2], [280, 0.2]].forEach(function(pair) {
        var anchor = pair[0], angle = pair[1];
        var pt = lms[anchor];
        var cx = pt.x * w, cy = pt.y * h;
        var rx = w * 0.085, ry = h * 0.055;

        var grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, rx);
        grad.addColorStop(0,   'rgba('+c.r+','+c.g+','+c.b+',0.70)');
        grad.addColorStop(0.5, 'rgba('+c.r+','+c.g+','+c.b+',0.30)');
        grad.addColorStop(1,   'rgba('+c.r+','+c.g+','+c.b+',0)');

        ctx.save();
        ctx.filter = 'blur(3px)';
        ctx.globalAlpha = opacity * 0.65;
        ctx.globalCompositeOperation = 'multiply';
        ctx.translate(cx, cy);
        ctx.rotate(angle);
        ctx.scale(1, ry / rx);
        ctx.translate(-cx, -cy);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, rx, 0, Math.PI * 2);
        ctx.fill();
        ctx.filter = 'none';
        ctx.restore();
    });
}

function applyFoundation(ctx, lms, color, opacity, w, h) {
    var c = hexToRgb(color);
    var tmp = document.createElement('canvas');
    tmp.width = w; tmp.height = h;
    var tCtx = tmp.getContext('2d');
    buildPath(tCtx, lms, FACE_OVAL, w, h);
    tCtx.fillStyle = 'rgba('+c.r+','+c.g+','+c.b+',1)';
    tCtx.fill();
    ctx.save();
    ctx.filter = 'blur(4px)';
    ctx.globalAlpha = opacity * 0.28;
    ctx.globalCompositeOperation = 'multiply';
    ctx.drawImage(tmp, 0, 0);
    ctx.filter = 'none';
    ctx.restore();
}

/* ═══════════════════════ Product Selection ═══════════════════════ */
document.querySelectorAll('.product-card').forEach(function(card) {
    card.addEventListener('click', function() {
        if (state.mode !== 'result') return;
        var id  = parseInt(this.dataset.id);
        var cat = this.dataset.category;
        var currentSel = state.selected[cat];

        // Deselect if already selected
        if (currentSel && currentSel.id === id) {
            state.selected[cat] = null;
            this.classList.remove('selected');
        } else {
            // Deselect previous in same category
            if (currentSel) {
                var prev = document.querySelector('.product-card[data-id="'+currentSel.id+'"]');
                if (prev) prev.classList.remove('selected');
            }
            state.selected[cat] = {
                id: id,
                category: cat,
                color: this.dataset.color,
                suitable_for: this.dataset.suitable.split(','),
                name: this.dataset.name,
            };
            this.classList.add('selected');
        }
        renderMakeup();
        updateRecommendationBanner();
    });
});

/* ── Category tabs ── */
els.categoryTabs.forEach(function(tab) {
    tab.addEventListener('click', function() {
        els.categoryTabs.forEach(function(t) { t.classList.remove('active'); });
        this.classList.add('active');
        state.activeCategory = this.dataset.cat;

        ['lips','eyes','blush','foundation'].forEach(function(c) {
            var grid = document.getElementById('grid-'+c);
            if (grid) grid.style.display = (c === state.activeCategory) ? 'grid' : 'none';
        });

        updateRecommendationBanner();
    });
});

/* ── Recommendation banner ── */
function updateRecommendationBanner() {
    var cat = state.activeCategory;
    var sel = state.selected[cat];
    if (!sel || !state.skinTone) { els.recBanner.style.display = 'none'; return; }

    var suitableFor = Array.isArray(sel.suitable_for) ? sel.suitable_for : sel.suitable_for.split(',');
    if (suitableFor.indexOf(state.skinTone) !== -1) { els.recBanner.style.display = 'none'; return; }

    // Find alternatives
    var recs = (window.ALL_PRODUCTS || []).filter(function(p) {
        var sf = Array.isArray(p.suitable_for) ? p.suitable_for : p.suitable_for.split(',');
        return p.category === cat && sf.indexOf(state.skinTone) !== -1;
    }).slice(0, 3);

    if (recs.length === 0) { els.recBanner.style.display = 'none'; return; }

    els.recChips.innerHTML = recs.map(function(p) {
        return '<button class="rec-chip" data-id="'+p.id+'" data-cat="'+p.category+'" data-color="'+p.color+'" data-name="'+p.name+'" data-suitable="'+(Array.isArray(p.suitable_for) ? p.suitable_for.join(',') : p.suitable_for)+'">'
            + '<span class="rec-chip-dot" style="background:'+p.color+'"></span>'
            + p.name
            + '</button>';
    }).join('');

    els.recChips.querySelectorAll('.rec-chip').forEach(function(chip) {
        chip.addEventListener('click', function() {
            var card = document.querySelector('.product-card[data-id="'+this.dataset.id+'"]');
            if (card) card.click();
        });
    });

    els.recBanner.style.display = 'flex';
}

/* ═══════════════════════ Intensity Slider ═══════════════════════ */
els.intensSlider.addEventListener('input', function() {
    state.intensity = this.value / 100;
    els.intensValue.textContent = this.value + '%';
    renderMakeup();
});

/* ═══════════════════════ Header Buttons ═══════════════════════ */
document.getElementById('btnNewPhoto').addEventListener('click', function() {
    state.landmarks = null;
    state.skinTone  = null;
    state.photoImg  = null;
    state.selected  = { lips: null, eyes: null, blush: null, foundation: null };
    document.querySelectorAll('.product-card.selected').forEach(function(c) { c.classList.remove('selected'); });
    els.recBanner.style.display    = 'none';
    els.skinToneBadge.style.display = 'none';
    setMode('upload');
});

document.getElementById('btnSaveLook').addEventListener('click', saveLook);
els.btnTryOn.addEventListener('click', saveLook);

function saveLook() {
    var canvas = els.resultCanvas;
    if (!canvas) return;
    var a = document.createElement('a');
    a.download = 'fam-fashion-look.png';
    a.href = canvas.toDataURL('image/png');
    a.click();
}

/* ═══════════════════════ Error Helpers ═══════════════════════ */
function showError(msg) {
    els.uploadError.textContent = msg;
    els.uploadError.style.display = 'block';
}
function hideError() { els.uploadError.style.display = 'none'; }

/* Init */
setMode('upload');
