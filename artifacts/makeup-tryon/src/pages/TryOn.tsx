import React, { useEffect, useRef, useState, useCallback } from "react";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Loader2, Camera, Upload, RotateCcw, Sparkles, X, Info, ImagePlus } from "lucide-react";
import { cn } from "@/lib/utils";

/* ─────────────────────────── Types ─────────────────────────── */
type SkinTone = "fair" | "light" | "medium" | "tan" | "deep";
type Category = "lips" | "eyes" | "blush" | "foundation";

interface Product {
  id: number;
  name: string;
  shade: string;
  category: Category;
  color: string;
  price: number;
  brand: string;
  suitableFor: SkinTone[];
}

/* ─────────────────────────── Products ─────────────────────────── */
const PRODUCTS: Product[] = [
  // LIPS
  { id: 1,  name: "Ruby Woo",          shade: "Retro Matte",        category: "lips",       color: "#9B1B1B", price: 22, brand: "MAC",               suitableFor: ["medium","tan","deep"] },
  { id: 2,  name: "Velvet Teddy",       shade: "Matte",              category: "lips",       color: "#9B7155", price: 22, brand: "MAC",               suitableFor: ["light","medium"] },
  { id: 3,  name: "Diva",               shade: "Matte",              category: "lips",       color: "#572137", price: 22, brand: "MAC",               suitableFor: ["tan","deep"] },
  { id: 4,  name: "Pillow Talk",        shade: "Matte Revolution",   category: "lips",       color: "#C07A8C", price: 38, brand: "Charlotte Tilbury", suitableFor: ["fair","light"] },
  { id: 5,  name: "Walk of No Shame",   shade: "Matte",              category: "lips",       color: "#B83A3A", price: 38, brand: "Charlotte Tilbury", suitableFor: ["medium","tan"] },
  { id: 6,  name: "Vienna",             shade: "Soft Matte",         category: "lips",       color: "#C4A0A8", price: 10, brand: "NYX",               suitableFor: ["fair","light","medium"] },
  { id: 7,  name: "Cannes",             shade: "Soft Matte",         category: "lips",       color: "#B22222", price: 10, brand: "NYX",               suitableFor: ["medium","tan","deep"] },
  { id: 8,  name: "Jungle Red",         shade: "Satin Lip Pencil",   category: "lips",       color: "#C41E3A", price: 36, brand: "NARS",              suitableFor: ["medium","tan","deep"] },
  { id: 9,  name: "Dragon Girl",        shade: "Powermatte",         category: "lips",       color: "#8B1A3A", price: 36, brand: "NARS",              suitableFor: ["tan","deep"] },
  { id: 10, name: "Raspberry Red",      shade: "Colour Riche",       category: "lips",       color: "#C0396B", price: 12, brand: "L'Oréal",           suitableFor: ["medium","tan","deep"] },
  // EYES
  { id: 11, name: "Half Baked",         shade: "Eyeshadow",          category: "eyes",       color: "#A0693C", price: 24, brand: "Urban Decay",       suitableFor: ["fair","light","medium","tan","deep"] },
  { id: 12, name: "Midnight Cowboy",    shade: "Eyeshadow",          category: "eyes",       color: "#C4966A", price: 24, brand: "Urban Decay",       suitableFor: ["fair","light","medium"] },
  { id: 13, name: "Club",               shade: "Eyeshadow",          category: "eyes",       color: "#4A3728", price: 22, brand: "MAC",               suitableFor: ["fair","light","medium","tan","deep"] },
  { id: 14, name: "Woodwinked",         shade: "Eyeshadow",          category: "eyes",       color: "#B8733C", price: 22, brand: "MAC",               suitableFor: ["medium","tan","deep"] },
  { id: 15, name: "Night Rider",        shade: "Eyeshadow",          category: "eyes",       color: "#1C1826", price: 36, brand: "NARS",              suitableFor: ["fair","light","medium","tan","deep"] },
  { id: 16, name: "Canyon (Soft Glam)", shade: "Palette",            category: "eyes",       color: "#C4905A", price: 45, brand: "Anastasia BH",      suitableFor: ["medium","tan","deep"] },
  { id: 17, name: "Pillow Talk Rose",   shade: "Luxury Palette",     category: "eyes",       color: "#C4A0A0", price: 68, brand: "Charlotte Tilbury", suitableFor: ["fair","light"] },
  { id: 18, name: "Obsidian Smoky",     shade: "Eyeshadow Palette",  category: "eyes",       color: "#2C1F38", price: 58, brand: "Huda Beauty",       suitableFor: ["fair","light","medium","tan","deep"] },
  // BLUSH
  { id: 19, name: "Orgasm",             shade: "Blush",              category: "blush",      color: "#E8906A", price: 34, brand: "NARS",              suitableFor: ["fair","light","medium"] },
  { id: 20, name: "Deep Throat",        shade: "Blush",              category: "blush",      color: "#F0B0C0", price: 34, brand: "NARS",              suitableFor: ["fair","light"] },
  { id: 21, name: "Exhibit A",          shade: "Blush",              category: "blush",      color: "#E05A40", price: 34, brand: "NARS",              suitableFor: ["medium","tan","deep"] },
  { id: 22, name: "Peaches",            shade: "Powder Blush",       category: "blush",      color: "#F0A060", price: 28, brand: "MAC",               suitableFor: ["fair","light"] },
  { id: 23, name: "Mocha",              shade: "Powder Blush",       category: "blush",      color: "#9B6B5A", price: 28, brand: "MAC",               suitableFor: ["tan","deep"] },
  { id: 24, name: "Fiji",               shade: "Cheeks Out",         category: "blush",      color: "#C47480", price: 22, brand: "Fenty Beauty",      suitableFor: ["medium","tan"] },
  // FOUNDATION
  { id: 25, name: "NC15",               shade: "Studio Fix Fluid",   category: "foundation", color: "#F2D8B8", price: 45, brand: "MAC",               suitableFor: ["fair","light"] },
  { id: 26, name: "NC30",               shade: "Studio Fix Fluid",   category: "foundation", color: "#C8945A", price: 45, brand: "MAC",               suitableFor: ["medium"] },
  { id: 27, name: "NC45",               shade: "Studio Fix Fluid",   category: "foundation", color: "#9B6B3A", price: 45, brand: "MAC",               suitableFor: ["tan"] },
  { id: 28, name: "NC55",               shade: "Studio Fix Fluid",   category: "foundation", color: "#6B3A1A", price: 45, brand: "MAC",               suitableFor: ["deep"] },
  { id: 29, name: "420W",               shade: "Pro Filt'r",         category: "foundation", color: "#C8A07A", price: 40, brand: "Fenty Beauty",      suitableFor: ["medium"] },
  { id: 30, name: "490W",               shade: "Pro Filt'r",         category: "foundation", color: "#7A4A2A", price: 40, brand: "Fenty Beauty",      suitableFor: ["deep"] },
];

/* ─────────────────────────── Landmark indices ─────────────────────────── */
const LIPS_OUTER = [61,185,40,39,37,0,267,269,270,409,291,375,321,405,314,17,84,181,91,146];
const LIPS_INNER = [78,191,80,81,82,13,312,311,310,415,308,324,318,402,317,14,87,178,88,95];

// Eye socket (lid area from brow lower edge down to upper lashline) for eyeshadow
const LEFT_EYE_SOCKET  = [46,53,52,65,55,107,66,105,63,70,156,35,31,228,229,230,231,232,233,244,245,128,121,120,119,118,117,116,123,50,101,100,126,142,36,205,206,207,187,147,93,132,58,172,136,150,149,176,148,152,377,400,378,379,365,397,288,361,323,454,356,389,251,284,332,297,338,10,109,67,103,54,21,162,127,234,93,132,58,172,136,150,149,176,148,152,377,400,378,379];

// Simplified eye socket for eyeshadow
const LEFT_LID  = [33,246,161,160,159,158,157,173,133,155,154,153,145,144,163,7];
const RIGHT_LID = [362,398,384,385,386,387,388,466,263,249,390,373,374,380,381,382];

// Eyebrow lower edges (to extend shadow upward)
const LEFT_BROW_LOWER  = [46,53,52,65,55,70,63,105,66,107];
const RIGHT_BROW_LOWER = [276,283,282,295,285,300,293,334,296,336];

// Cheek landmark anchors
const LEFT_CHEEK_ANCHOR  = 50;
const RIGHT_CHEEK_ANCHOR = 280;

// Face oval for foundation
const FACE_OVAL = [10,338,297,332,284,251,389,356,454,323,361,288,397,365,379,378,400,377,152,148,176,149,150,136,172,58,132,93,234,127,162,21,54,103,67,109];

/* ─────────────────────────── Helpers ─────────────────────────── */
function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return { r, g, b };
}

function buildPath(ctx: CanvasRenderingContext2D, lms: any[], indices: number[], w: number, h: number) {
  ctx.beginPath();
  indices.forEach((i, idx) => {
    const pt = lms[i];
    const x = pt.x * w;
    const y = pt.y * h;
    if (idx === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();
}

function applyLips(
  ctx: CanvasRenderingContext2D,
  lms: any[],
  color: string,
  opacity: number,
  w: number,
  h: number
) {
  const { r, g, b } = hexToRgb(color);
  const tmp = document.createElement("canvas");
  tmp.width = w; tmp.height = h;
  const tCtx = tmp.getContext("2d")!;

  // Outer lip fill
  buildPath(tCtx, lms, LIPS_OUTER, w, h);
  tCtx.fillStyle = color;
  tCtx.fill();

  // Hollow out inner lips to not fill mouth opening
  tCtx.globalCompositeOperation = "destination-out";
  buildPath(tCtx, lms, LIPS_INNER, w, h);
  tCtx.fill();
  tCtx.globalCompositeOperation = "source-over";

  // Soft edge
  ctx.save();
  ctx.filter = "blur(1.2px)";
  ctx.globalAlpha = opacity * 0.9;
  ctx.globalCompositeOperation = "multiply";
  ctx.drawImage(tmp, 0, 0);
  ctx.filter = "none";

  // Gloss highlight on lower lip center
  const lowerCenter = lms[17];
  const glossX = lowerCenter.x * w;
  const glossY = lowerCenter.y * h;
  const glossGrad = ctx.createRadialGradient(glossX, glossY - 3, 0, glossX, glossY - 3, 20);
  glossGrad.addColorStop(0, `rgba(255,255,255,0.35)`);
  glossGrad.addColorStop(1, "rgba(255,255,255,0)");
  ctx.globalCompositeOperation = "screen";
  ctx.globalAlpha = opacity * 0.5;
  ctx.fillStyle = glossGrad;
  buildPath(ctx, lms, LIPS_OUTER, w, h);
  ctx.fill();
  ctx.restore();
}

function applyEyeshadow(
  ctx: CanvasRenderingContext2D,
  lms: any[],
  color: string,
  opacity: number,
  w: number,
  h: number
) {
  const { r, g, b } = hexToRgb(color);

  [
    { lid: LEFT_LID,  brow: LEFT_BROW_LOWER },
    { lid: RIGHT_LID, brow: RIGHT_BROW_LOWER },
  ].forEach(({ lid, brow }) => {
    const tmp = document.createElement("canvas");
    tmp.width = w; tmp.height = h;
    const tCtx = tmp.getContext("2d")!;

    // Compute bounding box to create gradient
    const allIdx = [...lid, ...brow];
    const xs = allIdx.map(i => lms[i].x * w);
    const ys = allIdx.map(i => lms[i].y * h);
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    const minY = Math.min(...ys), maxY = Math.max(...ys);
    const midX = (minX + maxX) / 2;

    // Gradient: dense at lash line, fades toward brow
    const grad = tCtx.createLinearGradient(midX, maxY, midX, minY);
    grad.addColorStop(0, `rgba(${r},${g},${b},0.85)`);
    grad.addColorStop(0.5, `rgba(${r},${g},${b},0.45)`);
    grad.addColorStop(1, `rgba(${r},${g},${b},0)`);

    // Draw the eye socket region (lid + brow outline)
    tCtx.beginPath();
    brow.forEach((i, idx) => {
      const pt = lms[i];
      if (idx === 0) tCtx.moveTo(pt.x * w, pt.y * h);
      else tCtx.lineTo(pt.x * w, pt.y * h);
    });
    lid.slice().reverse().forEach(i => {
      const pt = lms[i];
      tCtx.lineTo(pt.x * w, pt.y * h);
    });
    tCtx.closePath();
    tCtx.fillStyle = grad;
    tCtx.fill();

    ctx.save();
    ctx.filter = "blur(2.5px)";
    ctx.globalAlpha = opacity * 0.75;
    ctx.globalCompositeOperation = "multiply";
    ctx.drawImage(tmp, 0, 0);
    ctx.filter = "none";
    ctx.restore();
  });
}

function applyBlush(
  ctx: CanvasRenderingContext2D,
  lms: any[],
  color: string,
  opacity: number,
  w: number,
  h: number
) {
  const { r, g, b } = hexToRgb(color);

  [LEFT_CHEEK_ANCHOR, RIGHT_CHEEK_ANCHOR].forEach((anchor, side) => {
    const pt = lms[anchor];
    const cx = pt.x * w;
    const cy = pt.y * h;
    const rx = w * 0.085;
    const ry = h * 0.055;
    const angle = side === 0 ? -0.2 : 0.2;

    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, rx);
    grad.addColorStop(0, `rgba(${r},${g},${b},0.70)`);
    grad.addColorStop(0.5, `rgba(${r},${g},${b},0.30)`);
    grad.addColorStop(1, `rgba(${r},${g},${b},0)`);

    ctx.save();
    ctx.filter = "blur(3px)";
    ctx.globalAlpha = opacity * 0.65;
    ctx.globalCompositeOperation = "multiply";
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.scale(1, ry / rx);
    ctx.translate(-cx, -cy);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, rx, 0, Math.PI * 2);
    ctx.fill();
    ctx.filter = "none";
    ctx.restore();
  });
}

function applyFoundation(
  ctx: CanvasRenderingContext2D,
  lms: any[],
  color: string,
  opacity: number,
  w: number,
  h: number
) {
  const { r, g, b } = hexToRgb(color);
  const tmp = document.createElement("canvas");
  tmp.width = w; tmp.height = h;
  const tCtx = tmp.getContext("2d")!;
  buildPath(tCtx, lms, FACE_OVAL, w, h);
  tCtx.fillStyle = `rgba(${r},${g},${b},1)`;
  tCtx.fill();

  ctx.save();
  ctx.filter = "blur(4px)";
  ctx.globalAlpha = opacity * 0.28;
  ctx.globalCompositeOperation = "multiply";
  ctx.drawImage(tmp, 0, 0);
  ctx.filter = "none";
  ctx.restore();
}

function detectSkinTone(canvas: HTMLCanvasElement, lms: any[]): SkinTone {
  const ctx = canvas.getContext("2d");
  if (!ctx) return "medium";
  const w = canvas.width, h = canvas.height;
  // Sample from forehead (lm 10), left cheek (50), right cheek (280)
  const pts = [lms[10], lms[50], lms[280]];
  let lum = 0;
  let valid = 0;
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

/* ─────────────────────────── Component ─────────────────────────── */
type Mode = "upload" | "camera" | "processing" | "result";

export default function TryOn() {
  const [mode, setMode] = useState<Mode>("upload");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [landmarks, setLandmarks] = useState<any[] | null>(null);
  const [skinTone, setSkinTone] = useState<SkinTone | null>(null);
  const [modelReady, setModelReady] = useState(false);
  const [modelError, setModelError] = useState<string | null>(null);
  const [intensity, setIntensity] = useState(0.65);
  const [activeCategory, setActiveCategory] = useState<Category>("lips");
  const [selectedProducts, setSelectedProducts] = useState<Record<Category, Product | null>>({
    lips: null, eyes: null, blush: null, foundation: null,
  });
  const [dragging, setDragging] = useState(false);
  const [processingError, setProcessingError] = useState<string | null>(null);

  const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const resultCanvasRef = useRef<HTMLCanvasElement>(null);
  const photoImgRef = useRef<HTMLImageElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load MediaPipe model eagerly
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const fs = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );
        const fl = await FaceLandmarker.createFromOptions(fs, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
            delegate: "GPU",
          },
          runningMode: "IMAGE",
          numFaces: 1,
        });
        if (!cancelled) { faceLandmarkerRef.current = fl; setModelReady(true); }
      } catch {
        if (!cancelled) setModelError("Could not load AI model. Please refresh and try again.");
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Stop camera stream on unmount or mode change away from camera
  useEffect(() => {
    if (mode !== "camera") stopCamera();
  }, [mode]);

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
  };

  const startCamera = async () => {
    setMode("camera");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
      });
      streamRef.current = stream;
      if (videoRef.current) { videoRef.current.srcObject = stream; }
    } catch {
      setMode("upload");
      alert("Could not access camera. Please allow camera permission and try again.");
    }
  };

  const captureFromCamera = () => {
    const video = videoRef.current;
    if (!video) return;
    const tmp = document.createElement("canvas");
    tmp.width = video.videoWidth;
    tmp.height = video.videoHeight;
    const ctx = tmp.getContext("2d")!;
    // Don't flip — capture raw frame, MediaPipe will detect correctly
    ctx.drawImage(video, 0, 0);
    stopCamera();
    processImageCanvas(tmp);
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = e => {
      const url = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const tmp = document.createElement("canvas");
        tmp.width = img.naturalWidth;
        tmp.height = img.naturalHeight;
        tmp.getContext("2d")!.drawImage(img, 0, 0);
        processImageCanvas(tmp, url);
      };
      img.src = url;
    };
    reader.readAsDataURL(file);
  };

  const processImageCanvas = (srcCanvas: HTMLCanvasElement, existingUrl?: string) => {
    setMode("processing");
    setProcessingError(null);
    const url = existingUrl ?? srcCanvas.toDataURL("image/jpeg", 0.92);
    setPhotoUrl(url);

    if (!faceLandmarkerRef.current) {
      setProcessingError("AI model is still loading. Please wait a moment and try again.");
      setMode("upload");
      return;
    }

    // Run detection on the canvas element directly
    try {
      const results = faceLandmarkerRef.current.detect(srcCanvas);
      if (results.faceLandmarks && results.faceLandmarks.length > 0) {
        const lms = results.faceLandmarks[0];
        setLandmarks(lms);
        setSkinTone(detectSkinTone(srcCanvas, lms));
        photoImgRef.current = null;
        // Store the source canvas dimensions for later re-renders
        const img = new Image();
        img.onload = () => { photoImgRef.current = img; setMode("result"); };
        img.src = url;
      } else {
        setProcessingError("No face detected. Please use a clear front-facing photo.");
        setMode("upload");
      }
    } catch (err) {
      setProcessingError("Something went wrong. Please try a different photo.");
      setMode("upload");
    }
  };

  // Re-render makeup whenever products, intensity, or landmarks change
  useEffect(() => {
    if (mode !== "result" || !landmarks || !photoImgRef.current || !resultCanvasRef.current) return;

    const canvas = resultCanvasRef.current;
    const img = photoImgRef.current;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d")!;
    const w = canvas.width, h = canvas.height;

    // Draw base photo
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0);

    // Apply makeup layers in order (foundation first, lips last for coverage)
    if (selectedProducts.foundation) applyFoundation(ctx, landmarks, selectedProducts.foundation.color, intensity, w, h);
    if (selectedProducts.blush)      applyBlush(ctx, landmarks, selectedProducts.blush.color, intensity, w, h);
    if (selectedProducts.eyes)       applyEyeshadow(ctx, landmarks, selectedProducts.eyes.color, intensity, w, h);
    if (selectedProducts.lips)       applyLips(ctx, landmarks, selectedProducts.lips.color, intensity, w, h);
  }, [mode, landmarks, selectedProducts, intensity]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleReset = () => {
    setMode("upload");
    setPhotoUrl(null);
    setLandmarks(null);
    setSkinTone(null);
    setSelectedProducts({ lips: null, eyes: null, blush: null, foundation: null });
    setProcessingError(null);
    photoImgRef.current = null;
  };

  const handleDownload = () => {
    const canvas = resultCanvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.download = "glowar-look.png";
    a.href = canvas.toDataURL("image/png");
    a.click();
  };

  const toggleProduct = (product: Product) => {
    setSelectedProducts(prev => ({
      ...prev,
      [product.category]: prev[product.category]?.id === product.id ? null : product,
    }));
  };

  const getRecommendations = (cat: Category): Product[] => {
    if (!skinTone) return [];
    return PRODUCTS.filter(p => p.category === cat && p.suitableFor.includes(skinTone)).slice(0, 3);
  };

  const categoryProducts = PRODUCTS.filter(p => p.category === activeCategory);
  const selected = selectedProducts[activeCategory];
  const needsRec = selected && skinTone && !selected.suitableFor.includes(skinTone);
  const recs = needsRec ? getRecommendations(activeCategory) : [];

  const SKIN_TONE_LABELS: Record<SkinTone, string> = {
    fair: "Fair", light: "Light", medium: "Medium", tan: "Tan", deep: "Deep",
  };
  const SKIN_TONE_COLORS: Record<SkinTone, string> = {
    fair: "#F5E0C8", light: "#E8C9A0", medium: "#C8956A", tan: "#A0623A", deep: "#5C3317",
  };

  const CATEGORIES: Category[] = ["lips", "eyes", "blush", "foundation"];

  return (
    <div className="min-h-screen bg-[#FAF6F2] flex flex-col font-sans">
      {/* Header */}
      <header className="h-14 px-6 flex items-center justify-between bg-white border-b border-[#EDE6DF] sticky top-0 z-20">
        <span className="text-xl font-serif font-semibold text-[#7B1C2E]">GlowAR</span>
        <span className="text-sm text-[#9E8A7C] font-medium tracking-wide hidden sm:block">AI Virtual Try-On</span>
        {mode === "result" && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleReset}
              className="border-[#EDE6DF] text-[#7B1C2E] hover:bg-[#F7EFEA] h-8 text-xs gap-1.5">
              <RotateCcw className="w-3 h-3" /> New Photo
            </Button>
            <Button size="sm" onClick={handleDownload}
              className="bg-[#7B1C2E] hover:bg-[#631525] text-white h-8 text-xs gap-1.5">
              <Upload className="w-3 h-3 rotate-180" /> Save Look
            </Button>
          </div>
        )}
      </header>

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* ── LEFT: Photo zone ── */}
        <section className="flex-1 flex flex-col p-5 min-h-[55vh] lg:min-h-0">
          {/* Upload zone */}
          {(mode === "upload" || mode === "processing") && (
            <div className="flex-1 flex flex-col">
              <div
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                className={cn(
                  "flex-1 rounded-2xl border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center text-center gap-4 p-8 cursor-pointer select-none min-h-[380px]",
                  dragging ? "border-[#7B1C2E] bg-[#F7EFEA]" : "border-[#D9CEC8] bg-white hover:border-[#C4A99E] hover:bg-[#FDFBF9]"
                )}
                onClick={() => fileInputRef.current?.click()}
              >
                {mode === "processing" ? (
                  <>
                    <div className="w-16 h-16 rounded-full bg-[#F7EFEA] flex items-center justify-center">
                      <Loader2 className="w-7 h-7 text-[#7B1C2E] animate-spin" />
                    </div>
                    <div>
                      <p className="font-serif text-lg text-[#3A2822]">Analysing your photo...</p>
                      <p className="text-sm text-[#9E8A7C] mt-1">Detecting facial features</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-full bg-[#F7EFEA] flex items-center justify-center">
                      <ImagePlus className="w-7 h-7 text-[#7B1C2E]" />
                    </div>
                    <div>
                      <p className="font-serif text-xl text-[#3A2822] font-semibold">Add your photo</p>
                      <p className="text-sm text-[#9E8A7C] mt-1.5">Use a clear front-facing photo for best results</p>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        className="bg-[#7B1C2E] hover:bg-[#631525] text-white gap-2"
                        onClick={e => { e.stopPropagation(); fileInputRef.current?.click(); }}
                        data-testid="button-upload-photo"
                      >
                        <Upload className="w-4 h-4" /> Upload Photo
                      </Button>
                      <Button
                        variant="outline"
                        className="border-[#D9CEC8] text-[#3A2822] hover:bg-[#F7EFEA] gap-2"
                        onClick={e => { e.stopPropagation(); startCamera(); }}
                        data-testid="button-use-camera"
                      >
                        <Camera className="w-4 h-4" /> Use Camera
                      </Button>
                    </div>
                    <p className="text-xs text-[#B5A39A]">or drag & drop an image here</p>
                    {processingError && (
                      <div className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-lg px-4 py-3 text-sm text-red-700 max-w-sm">
                        <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        {processingError}
                      </div>
                    )}
                  </>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) processFile(f); e.target.value = ""; }}
              />

              {/* Try On button (below upload zone) */}
              {mode === "upload" && !modelReady && (
                <div className="mt-4 flex items-center gap-2 text-sm text-[#9E8A7C]">
                  <Loader2 className="w-4 h-4 animate-spin" /> Loading AI model...
                </div>
              )}
              {modelError && (
                <p className="mt-3 text-sm text-red-600">{modelError}</p>
              )}
            </div>
          )}

          {/* Camera preview */}
          {mode === "camera" && (
            <div className="flex-1 flex flex-col gap-4">
              <div className="flex-1 rounded-2xl overflow-hidden bg-black relative min-h-[380px]">
                <video
                  ref={videoRef}
                  autoPlay playsInline muted
                  className="w-full h-full object-cover scale-x-[-1]"
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-52 h-64 border-2 border-white/30 border-dashed rounded-full" />
                </div>
              </div>
              <div className="flex gap-3 justify-center">
                <Button
                  className="bg-[#7B1C2E] hover:bg-[#631525] text-white gap-2 px-8"
                  onClick={captureFromCamera}
                  data-testid="button-capture"
                >
                  <Camera className="w-4 h-4" /> Capture
                </Button>
                <Button
                  variant="outline"
                  className="border-[#D9CEC8] text-[#3A2822] hover:bg-[#F7EFEA] gap-2"
                  onClick={() => { stopCamera(); setMode("upload"); }}
                >
                  <X className="w-4 h-4" /> Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Result canvas */}
          {mode === "result" && (
            <div className="flex-1 flex flex-col gap-4">
              {skinTone && (
                <div className="flex items-center gap-2 text-xs text-[#9E8A7C]">
                  <div className="w-3.5 h-3.5 rounded-full border border-white/60 shadow-sm" style={{ backgroundColor: SKIN_TONE_COLORS[skinTone] }} />
                  Skin tone detected: <span className="font-semibold text-[#3A2822]">{SKIN_TONE_LABELS[skinTone]}</span>
                </div>
              )}
              <div className="flex-1 rounded-2xl overflow-hidden bg-black relative min-h-[380px] flex items-center justify-center">
                <canvas
                  ref={resultCanvasRef}
                  className="max-w-full max-h-full object-contain"
                  style={{ imageRendering: "auto" }}
                />
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-[#9E8A7C] font-medium uppercase tracking-wider w-20 flex-shrink-0">Intensity</span>
                <div className="flex-1">
                  <input
                    type="range"
                    min={0.2}
                    max={1}
                    step={0.05}
                    value={intensity}
                    onChange={e => setIntensity(Number(e.target.value))}
                    className="w-full accent-[#7B1C2E] cursor-pointer"
                    data-testid="slider-intensity"
                  />
                </div>
                <span className="text-xs text-[#3A2822] font-medium w-9 text-right">{Math.round(intensity * 100)}%</span>
              </div>
            </div>
          )}

          {/* Try On with AI button — visible in result mode at bottom */}
          {mode === "result" && (
            <Button
              className="mt-4 w-full bg-[#7B1C2E] hover:bg-[#631525] text-white gap-2 h-12 text-sm font-medium"
              onClick={handleDownload}
              data-testid="button-try-on"
            >
              <Sparkles className="w-4 h-4" /> Save My Look
            </Button>
          )}
          {mode === "upload" && (
            <Button
              className="mt-4 w-full bg-[#7B1C2E] hover:bg-[#631525] text-white gap-2 h-12 text-sm font-medium disabled:opacity-50"
              disabled
              data-testid="button-try-on-disabled"
            >
              <Sparkles className="w-4 h-4" /> Try On with AI
            </Button>
          )}
        </section>

        {/* ── RIGHT: Product panel ── */}
        <aside className="w-full lg:w-[340px] xl:w-[380px] bg-white border-t lg:border-t-0 lg:border-l border-[#EDE6DF] flex flex-col">
          <div className="px-5 pt-5 pb-0 flex-shrink-0">
            <h2 className="font-serif text-lg font-semibold text-[#3A2822] mb-4">Collection</h2>

            {/* Category tabs */}
            <div className="flex gap-1 mb-0">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  data-testid={`tab-${cat}`}
                  className={cn(
                    "flex-1 py-2 text-xs font-semibold rounded-lg capitalize transition-all duration-150",
                    activeCategory === cat
                      ? "bg-[#7B1C2E] text-white shadow-sm"
                      : "text-[#9E8A7C] hover:bg-[#F7EFEA] hover:text-[#3A2822]"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Recommendation banner */}
          {mode === "result" && needsRec && recs.length > 0 && (
            <div className="mx-5 mt-4 bg-amber-50 border border-amber-100 rounded-xl p-3">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-amber-800 mb-2">Better matches for your skin tone:</p>
                  <div className="flex flex-wrap gap-2">
                    {recs.map(rec => (
                      <button
                        key={rec.id}
                        onClick={() => toggleProduct(rec)}
                        className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-lg border border-amber-100 text-xs font-medium text-amber-900 hover:border-amber-300 transition-colors shadow-sm"
                      >
                        <div className="w-3 h-3 rounded-full flex-shrink-0 shadow-inner" style={{ backgroundColor: rec.color }} />
                        {rec.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Product grid */}
          <div className="flex-1 overflow-y-auto px-5 py-4">
            <div className="grid grid-cols-2 gap-3">
              {categoryProducts.map(product => {
                const isSelected = selected?.id === product.id;
                return (
                  <button
                    key={product.id}
                    onClick={() => { if (mode === "result") toggleProduct(product); }}
                    data-testid={`product-card-${product.id}`}
                    className={cn(
                      "text-left p-3 rounded-xl border transition-all duration-150 group",
                      mode !== "result" && "opacity-60 cursor-default",
                      mode === "result" && "hover:shadow-md cursor-pointer",
                      isSelected
                        ? "border-[#7B1C2E] ring-1 ring-[#7B1C2E] bg-[#FDF8F9] shadow-sm"
                        : "border-[#EDE6DF] bg-white hover:border-[#C4A99E]"
                    )}
                  >
                    {/* Shade swatch */}
                    <div className="flex items-start justify-between mb-2.5">
                      <div
                        className={cn(
                          "w-9 h-9 rounded-full shadow-inner border border-black/10 transition-transform",
                          isSelected && "ring-2 ring-offset-1 ring-[#7B1C2E]",
                          mode === "result" && "group-hover:scale-110"
                        )}
                        style={{ backgroundColor: product.color }}
                      />
                      <span className="text-[11px] font-medium text-[#9E8A7C]">${product.price}</span>
                    </div>
                    <p className="font-serif text-sm font-semibold text-[#3A2822] leading-tight">{product.name}</p>
                    <p className="text-[10px] text-[#B5A39A] mt-0.5 uppercase tracking-wide">{product.brand}</p>
                    <p className="text-[10px] text-[#C4A99E] mt-0.5 italic leading-tight">{product.shade}</p>
                  </button>
                );
              })}
            </div>

            {mode !== "result" && (
              <div className="mt-6 flex flex-col items-center gap-2 py-4 text-center">
                <div className="w-10 h-10 rounded-full bg-[#F7EFEA] flex items-center justify-center">
                  <ImagePlus className="w-5 h-5 text-[#C4A99E]" />
                </div>
                <p className="text-sm text-[#9E8A7C]">Upload a photo to try on products</p>
              </div>
            )}
          </div>
        </aside>
      </main>
    </div>
  );
}
