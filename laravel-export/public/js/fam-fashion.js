/**
 * FAM Fashion – AI Virtual Try-On
 * Vanilla JavaScript — MediaPipe face landmark detection + canvas makeup overlay
 * Works alongside the Laravel backend; product data is injected as window.ALL_PRODUCTS
 */

import {
  FaceLandmarker,
  FilesetResolver,
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/vision_bundle.js";

/* ──────────────────────── Landmark indices ──────────────────────── */
const LIPS_OUTER = [61,185,40,39,37,0,267,269,270,409,291,375,321,405,314,17,84,181,91,146];
const LIPS_INNER = [78,191,80,81,82,13,312,311,310,415,308,324,318,402,317,14,87,178,88,95];
const LEFT_LID   = [33,246,161,160,159,158,157,173,133,155,154,153,145,144,163,7];
const RIGHT_LID  = [362,398,384,385,386,387,388,466,263,249,390,373,374,380,381,382];
const LEFT_BROW  = [46,53,52,65,55,70,63,105,66,107];
const RIGHT_BROW = [276,283,282,295,285,300,293,334,296,336];
const L_CHEEK    = 50;
const R_CHEEK    = 280;
const FACE_OVAL  = [10,338,297,332,284,251,389,356,454,323,361,288,397,365,379,378,400,377,152,148,176,149,150,136,172,58,132,93,234,127,162,21,54,103,67,109];

/* ──────────────────────── State ──────────────────────── */
let faceLandmarker = null;
let modelReady     = false;
let landmarks      = null;
let skinTone       = null;
let photoImg       = null;
let currentMode    = "upload"; // upload | camera | processing | result
let cameraStream   = null;
let cartItems      = [];

// selected product per category
const selected = { lips: null, eyes: null, blush: null, foundation: null };
let activeCategory = "lips";

/* ──────────────────────── Skin tone helpers ──────────────────────── */
const SKIN_LABELS = { fair:"Fair", light:"Light", medium:"Medium", tan:"Tan", deep:"Deep" };
const SKIN_COLORS = { fair:"#F5E0C8", light:"#E8C9A0", medium:"#C8956A", tan:"#A0623A", deep:"#5C3317" };

function detectSkinTone(canvas, lms) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return "medium";
  const w = canvas.width, h = canvas.height;
  const pts = [lms[10], lms[50], lms[280]];
  let lum = 0, valid = 0;
  for (const pt of pts) {
    try {
      const px = ctx.getImageData(Math.floor(pt.x * w), Math.floor(pt.y * h), 1, 1).data;
      lum += 0.299 * px[0] + 0.587 * px[1] + 0.114 * px[2];
      valid++;
    } catch {}
  }
  lum = valid > 0 ? lum / valid : 120;
  if (lum > 200) return "fair";
  if (lum > 165) return "light";
  if (lum > 125) return "medium";
  if (lum > 80)  return "tan";
  return "deep";
}

/* ──────────────────────── Canvas helpers ──────────────────────── */
function hexToRgb(hex) {
  return {
    r: parseInt(hex.slice(1,3),16),
    g: parseInt(hex.slice(3,5),16),
    b: parseInt(hex.slice(5,7),16),
  };
}

function buildPath(ctx, lms, indices, w, h) {
  ctx.beginPath();
  indices.forEach((i, idx) => {
    const pt = lms[i];
    if (idx === 0) ctx.moveTo(pt.x * w, pt.y * h);
    else           ctx.lineTo(pt.x * w, pt.y * h);
  });
  ctx.closePath();
}

function applyLips(ctx, lms, color, opacity, w, h) {
  const tmp = document.createElement("canvas");
  tmp.width = w; tmp.height = h;
  const tc = tmp.getContext("2d");
  buildPath(tc, lms, LIPS_OUTER, w, h);
  tc.fillStyle = color;
  tc.fill();
  tc.globalCompositeOperation = "destination-out";
  buildPath(tc, lms, LIPS_INNER, w, h);
  tc.fill();
  tc.globalCompositeOperation = "source-over";

  ctx.save();
  ctx.filter = "blur(1.2px)";
  ctx.globalAlpha = opacity * 0.9;
  ctx.globalCompositeOperation = "multiply";
  ctx.drawImage(tmp, 0, 0);
  ctx.filter = "none";

  const lc = lms[17];
  const gx = lc.x * w, gy = lc.y * h;
  const gr = ctx.createRadialGradient(gx, gy-3, 0, gx, gy-3, 20);
  gr.addColorStop(0, "rgba(255,255,255,0.35)");
  gr.addColorStop(1, "rgba(255,255,255,0)");
  ctx.globalCompositeOperation = "screen";
  ctx.globalAlpha = opacity * 0.5;
  ctx.fillStyle = gr;
  buildPath(ctx, lms, LIPS_OUTER, w, h);
  ctx.fill();
  ctx.restore();
}

function applyEyeshadow(ctx, lms, color, opacity, w, h) {
  const { r, g, b } = hexToRgb(color);
  [{ lid: LEFT_LID, brow: LEFT_BROW }, { lid: RIGHT_LID, brow: RIGHT_BROW }].forEach(({ lid, brow }) => {
    const tmp = document.createElement("canvas");
    tmp.width = w; tmp.height = h;
    const tc = tmp.getContext("2d");
    const all = [...lid, ...brow];
    const xs = all.map(i => lms[i].x * w), ys = all.map(i => lms[i].y * h);
    const minY = Math.min(...ys), maxY = Math.max(...ys);
    const midX = (Math.min(...xs) + Math.max(...xs)) / 2;
    const gr = tc.createLinearGradient(midX, maxY, midX, minY);
    gr.addColorStop(0,   `rgba(${r},${g},${b},0.85)`);
    gr.addColorStop(0.5, `rgba(${r},${g},${b},0.45)`);
    gr.addColorStop(1,   `rgba(${r},${g},${b},0)`);
    tc.beginPath();
    brow.forEach((i, idx) => {
      const pt = lms[i];
      if (idx === 0) tc.moveTo(pt.x * w, pt.y * h);
      else           tc.lineTo(pt.x * w, pt.y * h);
    });
    lid.slice().reverse().forEach(i => tc.lineTo(lms[i].x * w, lms[i].y * h));
    tc.closePath();
    tc.fillStyle = gr;
    tc.fill();
    ctx.save();
    ctx.filter = "blur(2.5px)";
    ctx.globalAlpha = opacity * 0.75;
    ctx.globalCompositeOperation = "multiply";
    ctx.drawImage(tmp, 0, 0);
    ctx.filter = "none";
    ctx.restore();
  });
}

function applyBlush(ctx, lms, color, opacity, w, h) {
  const { r, g, b } = hexToRgb(color);
  [{ anchor: L_CHEEK, angle: -0.2 }, { anchor: R_CHEEK, angle: 0.2 }].forEach(({ anchor, angle }) => {
    const pt = lms[anchor];
    const cx = pt.x * w, cy = pt.y * h;
    const rx = w * 0.085, ry = h * 0.055;
    const gr = ctx.createRadialGradient(cx, cy, 0, cx, cy, rx);
    gr.addColorStop(0,   `rgba(${r},${g},${b},0.70)`);
    gr.addColorStop(0.5, `rgba(${r},${g},${b},0.30)`);
    gr.addColorStop(1,   `rgba(${r},${g},${b},0)`);
    ctx.save();
    ctx.filter = "blur(3px)";
    ctx.globalAlpha = opacity * 0.65;
    ctx.globalCompositeOperation = "multiply";
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.scale(1, ry / rx);
    ctx.translate(-cx, -cy);
    ctx.fillStyle = gr;
    ctx.beginPath();
    ctx.arc(cx, cy, rx, 0, Math.PI * 2);
    ctx.fill();
    ctx.filter = "none";
    ctx.restore();
  });
}

function applyFoundation(ctx, lms, color, opacity, w, h) {
  const { r, g, b } = hexToRgb(color);
  const tmp = document.createElement("canvas");
  tmp.width = w; tmp.height = h;
  const tc = tmp.getContext("2d");
  buildPath(tc, lms, FACE_OVAL, w, h);
  tc.fillStyle = `rgba(${r},${g},${b},1)`;
  tc.fill();
  ctx.save();
  ctx.filter = "blur(4px)";
  ctx.globalAlpha = opacity * 0.28;
  ctx.globalCompositeOperation = "multiply";
  ctx.drawImage(tmp, 0, 0);
  ctx.filter = "none";
  ctx.restore();
}

/* ──────────────────────── Render makeup ──────────────────────── */
function rerenderMakeup() {
  const canvas = document.getElementById("resultCanvas");
  if (!canvas || !photoImg || !landmarks) return;
  canvas.width  = photoImg.naturalWidth;
  canvas.height = photoImg.naturalHeight;
  const ctx = canvas.getContext("2d");
  const w = canvas.width, h = canvas.height;
  const intensity = parseFloat(document.getElementById("intensitySlider").value);
  ctx.clearRect(0, 0, w, h);
  ctx.drawImage(photoImg, 0, 0);
  if (selected.foundation) applyFoundation(ctx, landmarks, selected.foundation.color, intensity, w, h);
  if (selected.blush)      applyBlush(ctx, landmarks, selected.blush.color, intensity, w, h);
  if (selected.eyes)       applyEyeshadow(ctx, landmarks, selected.eyes.color, intensity, w, h);
  if (selected.lips)       applyLips(ctx, landmarks, selected.lips.color, intensity, w, h);
}
window.rerenderMakeup = rerenderMakeup;

/* ──────────────────────── Zone switching ──────────────────────── */
function showZone(zone) {
  const zones = ["uploadZone","processingOverlay","cameraZone","resultZone","tryOnPlaceholder","uploadPrompt"];
  document.getElementById("uploadZone").style.display        = zone === "upload" ? "flex" : "none";
  document.getElementById("processingOverlay").style.display = zone === "processing" ? "flex" : "none";
  document.getElementById("cameraZone").style.display        = zone === "camera" ? "flex" : "none";
  document.getElementById("resultZone").style.display        = zone === "result" ? "flex" : "none";
  document.getElementById("tryOnPlaceholder").style.display  = zone === "upload" ? "block" : "none";
  document.getElementById("uploadPrompt").style.display      = zone !== "result" ? "flex" : "none";

  // Header action buttons
  document.getElementById("btnNewPhoto").style.display  = zone === "result" ? "" : "none";
  document.getElementById("btnSaveLook").style.display  = zone === "result" ? "" : "none";

  currentMode = zone;
  updateRecommendations();
}
window.showZone = showZone;

/* ──────────────────────── Model loading ──────────────────────── */
async function loadModel() {
  try {
    const fs = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );
    faceLandmarker = await FaceLandmarker.createFromOptions(fs, {
      baseOptions: {
        modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
        delegate: "GPU",
      },
      runningMode: "IMAGE",
      numFaces: 1,
    });
    modelReady = true;
    const ms = document.getElementById("modelStatus");
    if (ms) ms.style.display = "none";
  } catch (e) {
    const ms = document.getElementById("modelStatus");
    if (ms) ms.textContent = "AI model failed to load. Please refresh.";
  }
}

/* ──────────────────────── File / drag & drop ──────────────────────── */
function processFile(file) {
  if (!file || !file.type.startsWith("image/")) return;
  const reader = new FileReader();
  reader.onload = e => {
    const img = new Image();
    img.onload = () => {
      const tmp = document.createElement("canvas");
      tmp.width  = img.naturalWidth;
      tmp.height = img.naturalHeight;
      tmp.getContext("2d").drawImage(img, 0, 0);
      processCanvas(tmp, e.target.result);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function processCanvas(srcCanvas, dataUrl) {
  showZone("processing");
  if (!modelReady) {
    showError("AI model is still loading. Please wait and try again.");
    showZone("upload");
    return;
  }
  try {
    const results = faceLandmarker.detect(srcCanvas);
    if (results.faceLandmarks && results.faceLandmarks.length > 0) {
      landmarks = results.faceLandmarks[0];
      skinTone  = detectSkinTone(srcCanvas, landmarks);
      const img = new Image();
      img.onload = () => {
        photoImg = img;
        showSkinTone();
        showZone("result");
        rerenderMakeup();
      };
      img.src = dataUrl ?? srcCanvas.toDataURL("image/jpeg", 0.92);
    } else {
      showError("No face detected. Please use a clear front-facing photo.");
      showZone("upload");
    }
  } catch {
    showError("Something went wrong. Please try a different photo.");
    showZone("upload");
  }
}

function showError(msg) {
  const el = document.getElementById("uploadError");
  if (el) { el.textContent = msg; el.style.display = "flex"; }
}

function showSkinTone() {
  const badge = document.getElementById("skinToneBadge");
  const dot   = document.getElementById("toneDot");
  const label = document.getElementById("toneLabel");
  if (!badge || !skinTone) return;
  dot.style.backgroundColor = SKIN_COLORS[skinTone];
  label.textContent = SKIN_LABELS[skinTone];
  badge.style.display = "flex";
}

function handleFileInput(input) {
  const file = input.files[0];
  if (file) processFile(file);
  input.value = "";
}
window.handleFileInput = handleFileInput;

function handleDrop(event) {
  event.preventDefault();
  event.currentTarget.classList.remove("dragover");
  const file = event.dataTransfer.files[0];
  if (file) processFile(file);
}
window.handleDrop = handleDrop;

/* ──────────────────────── Camera ──────────────────────── */
async function startCamera() {
  try {
    cameraStream = await navigator.mediaDevices.getUserMedia({
      video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
    });
    const video = document.getElementById("cameraVideo");
    video.srcObject = cameraStream;
    showZone("camera");
  } catch {
    alert("Could not access camera. Please allow camera permission and try again.");
  }
}
window.startCamera = startCamera;

function stopCamera() {
  if (cameraStream) { cameraStream.getTracks().forEach(t => t.stop()); cameraStream = null; }
}
window.stopCamera = stopCamera;

function capturePhoto() {
  const video = document.getElementById("cameraVideo");
  if (!video) return;
  const tmp = document.createElement("canvas");
  tmp.width  = video.videoWidth;
  tmp.height = video.videoHeight;
  tmp.getContext("2d").drawImage(video, 0, 0);
  stopCamera();
  processCanvas(tmp);
}
window.capturePhoto = capturePhoto;

/* ──────────────────────── Reset / Download ──────────────────────── */
function resetApp() {
  landmarks = null; skinTone = null; photoImg = null;
  Object.keys(selected).forEach(k => selected[k] = null);
  document.querySelectorAll(".product-card").forEach(c => c.classList.remove("selected"));
  document.querySelectorAll(".selected-check").forEach(c => c.style.display = "none");
  showZone("upload");
}
window.resetApp = resetApp;

function downloadLook() {
  const canvas = document.getElementById("resultCanvas");
  if (!canvas) return;
  const a = document.createElement("a");
  a.download = "fam-fashion-look.png";
  a.href = canvas.toDataURL("image/png");
  a.click();
}
window.downloadLook = downloadLook;

/* ──────────────────────── Category switching ──────────────────────── */
function switchCategory(cat) {
  activeCategory = cat;
  document.querySelectorAll(".cat-tab").forEach(t => t.classList.toggle("active", t.dataset.category === cat));
  ["lips","eyes","blush","foundation"].forEach(c => {
    document.getElementById("grid-" + c).style.display = c === cat ? "grid" : "none";
  });
  updateRecommendations();
}
window.switchCategory = switchCategory;

/* ──────────────────────── Product toggle ──────────────────────── */
function toggleProduct(id) {
  if (currentMode !== "result") return;
  const product = (window.ALL_PRODUCTS || []).find(p => p.id === id);
  if (!product) return;
  const cat = product.category;
  const wasSelected = selected[cat]?.id === id;
  selected[cat] = wasSelected ? null : product;

  // Update card visuals for this category
  document.querySelectorAll(`.product-card[data-category="${cat}"]`).forEach(card => {
    const cid = parseInt(card.dataset.id);
    const isNowSelected = !wasSelected && cid === id;
    card.classList.toggle("selected", isNowSelected);
    document.getElementById("check-" + cid).style.display = isNowSelected ? "flex" : "none";
  });

  rerenderMakeup();
  updateRecommendations();
}
window.toggleProduct = toggleProduct;

/* ──────────────────────── Recommendations ──────────────────────── */
function updateRecommendations() {
  const banner = document.getElementById("recBanner");
  const list   = document.getElementById("recList");
  if (!banner || !list) return;
  if (currentMode !== "result" || !skinTone) { banner.style.display = "none"; return; }

  const cur = selected[activeCategory];
  if (!cur || cur.suitableFor.includes(skinTone)) { banner.style.display = "none"; return; }

  const recs = (window.ALL_PRODUCTS || [])
    .filter(p => p.category === activeCategory && p.suitableFor.includes(skinTone))
    .slice(0, 3);

  if (recs.length === 0) { banner.style.display = "none"; return; }

  list.innerHTML = recs.map(r => `
    <button class="rec-item" onclick="toggleProduct(${r.id})">
      <span class="rec-dot" style="background:${r.color}"></span>${r.name}
    </button>`).join("");
  banner.style.display = "flex";
}

/* ──────────────────────── Shade preview ──────────────────────── */
function showShadePreview(url) {
  const el  = document.getElementById("shadePreview");
  const img = document.getElementById("shadePreviewImg");
  if (!el || !img || !url) return;
  img.src = url;
  el.style.display = "block";
}
function hideShadePreview() {
  const el = document.getElementById("shadePreview");
  if (el) el.style.display = "none";
}
window.showShadePreview = showShadePreview;
window.hideShadePreview = hideShadePreview;

/* ──────────────────────── Cart ──────────────────────── */
function toggleCart() {
  const drawer   = document.getElementById("cartDrawer");
  const backdrop = document.getElementById("cartBackdrop");
  const isOpen   = drawer.style.transform === "translateX(0px)";
  drawer.style.transform   = isOpen ? "" : "translateX(0px)";
  backdrop.style.display   = isOpen ? "none" : "block";
  if (!isOpen) renderCart();
}
window.toggleCart = toggleCart;

// Initialise drawer offscreen
document.addEventListener("DOMContentLoaded", () => {
  const drawer = document.getElementById("cartDrawer");
  if (drawer) drawer.style.transform = "translateX(100%)";
});

function addToCart(id) {
  if (cartItems.find(p => p.id === id)) return;
  const product = (window.ALL_PRODUCTS || []).find(p => p.id === id);
  if (!product) return;
  cartItems.push(product);
  updateCartBadge();
  const btn = document.getElementById("cartBtn-" + id);
  if (btn) btn.classList.add("in-cart");
}
window.addToCart = addToCart;

function removeFromCart(id) {
  cartItems = cartItems.filter(p => p.id !== id);
  updateCartBadge();
  const btn = document.getElementById("cartBtn-" + id);
  if (btn) btn.classList.remove("in-cart");
  renderCart();
}
window.removeFromCart = removeFromCart;

function updateCartBadge() {
  const badge = document.getElementById("cartBadge");
  if (!badge) return;
  badge.textContent    = cartItems.length;
  badge.style.display  = cartItems.length > 0 ? "flex" : "none";
  document.getElementById("cartCount").textContent = cartItems.length;
}

function renderCart() {
  const list   = document.getElementById("cartItems");
  const empty  = document.getElementById("cartEmpty");
  const footer = document.getElementById("cartFooter");
  const total  = document.getElementById("cartTotal");
  if (!list) return;

  if (cartItems.length === 0) {
    list.innerHTML = "";
    list.appendChild(empty);
    empty.style.display = "flex";
    footer.style.display = "none";
    return;
  }

  empty.style.display = "none";
  list.innerHTML = cartItems.map(p => `
    <div class="cart-item">
      <img class="cart-item-img" src="${p.image}" alt="${p.name}" onerror="this.style.display='none'" />
      <div class="cart-item-info">
        <p class="cart-item-name">${p.name}</p>
        <p class="cart-item-brand">${p.brand}</p>
        <p class="cart-item-price">Rs. ${p.price.toLocaleString()}</p>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${p.id})" title="Remove">✕</button>
    </div>`).join("");

  const sum = cartItems.reduce((acc, p) => acc + p.price, 0);
  total.textContent = "Rs. " + sum.toLocaleString();
  footer.style.display = "block";
}

/* ──────────────────────── Init ──────────────────────── */
showZone("upload");
loadModel();
