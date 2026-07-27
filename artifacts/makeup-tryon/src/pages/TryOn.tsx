import React, { useEffect, useRef, useState } from "react";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { Button } from "@/components/ui/button";
import { Loader2, Camera, Upload, RotateCcw, Sparkles, X, Info, ImagePlus, ShoppingCart, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

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
  finish: string;
  suitableFor: SkinTone[];
  image: string;
  shadeImage?: string;
}

/* ─────────────────────────── Products ─────────────────────────── */
const PRODUCTS: Product[] = [
  // ── LIPS ──
  {
    id: 1, name: "Ruby Woo", shade: "Retro Matte", category: "lips",
    color: "#9B1B1B", price: 6200, brand: "MAC", finish: "Matte",
    suitableFor: ["medium","tan","deep"],
    image: "/products/ruby woo.png", shadeImage: "/products/ruby woo shade.png"
  },
  {
    id: 2, name: "Velvet Teddy", shade: "Matte", category: "lips",
    color: "#9B7155", price: 6200, brand: "MAC", finish: "Matte",
    suitableFor: ["light","medium"],
    image: "/products/velvet teddy.png", shadeImage: "/products/velvet teddy shade.png"
  },
  {
    id: 3, name: "Diva", shade: "Matte", category: "lips",
    color: "#572137", price: 6200, brand: "MAC", finish: "Matte",
    suitableFor: ["tan","deep"],
    image: "/products/diva.png", shadeImage: "/products/diva shade.png"
  },
  {
    id: 4, name: "Pillow Talk", shade: "Matte Revolution", category: "lips",
    color: "#C07A8C", price: 10700, brand: "Charlotte Tilbury", finish: "Matte",
    suitableFor: ["fair","light"],
    image: "/products/pillow talk.png", shadeImage: "/products/pillow talk shade.png"
  },
  {
    id: 5, name: "Walk of No Shame", shade: "Matte", category: "lips",
    color: "#B83A3A", price: 10700, brand: "Charlotte Tilbury", finish: "Matte",
    suitableFor: ["medium","tan"],
    image: "/products/walk of no shame.png", shadeImage: "/products/walk of no shame shade.png"
  },
  {
    id: 6, name: "Vienna", shade: "Soft Matte", category: "lips",
    color: "#C4A0A8", price: 2800, brand: "NYX", finish: "Soft Matte",
    suitableFor: ["fair","light","medium"],
    image: "/products/vienna.png", shadeImage: "/products/vienna shade.png"
  },
  {
    id: 7, name: "Cannes", shade: "Soft Matte", category: "lips",
    color: "#B22222", price: 2800, brand: "NYX", finish: "Soft Matte",
    suitableFor: ["medium","tan","deep"],
    image: "/products/cannes.png", shadeImage: "/products/cannes shade.png"
  },
  {
    id: 8, name: "Jungle Red", shade: "Satin Lip Pencil", category: "lips",
    color: "#C41E3A", price: 10100, brand: "NARS", finish: "Satin",
    suitableFor: ["medium","tan","deep"],
    image: "/products/jungle red.png", shadeImage: "/products/juncle red shade.png"
  },
  {
    id: 9, name: "Dragon Girl", shade: "Powermatte", category: "lips",
    color: "#8B1A3A", price: 10100, brand: "NARS", finish: "Powermatte",
    suitableFor: ["tan","deep"],
    image: "/products/dragon girl.png", shadeImage: "/products/dragon girl shade.png"
  },
  {
    id: 10, name: "Raspberry Red", shade: "Colour Riche", category: "lips",
    color: "#C0396B", price: 3400, brand: "L'Oréal", finish: "Satin",
    suitableFor: ["medium","tan","deep"],
    image: "/products/rasberry red.png", shadeImage: "/products/rasberry red shade.png"
  },

  // ── EYES ──
  {
    id: 11, name: "Half Baked", shade: "Eyeshadow", category: "eyes",
    color: "#A0693C", price: 6700, brand: "Urban Decay", finish: "Shimmer",
    suitableFor: ["fair","light","medium","tan","deep"],
    image: "/products/half baked.png", shadeImage: "/products/half baked shade.png"
  },
  {
    id: 12, name: "Midnight Cowboy", shade: "Eyeshadow", category: "eyes",
    color: "#C4966A", price: 6700, brand: "Urban Decay", finish: "Sparkle",
    suitableFor: ["fair","light","medium"],
    image: "/products/midnight cowboy.png", shadeImage: "/products/midnight cowboy shade.png"
  },
  {
    id: 13, name: "Club", shade: "Eyeshadow", category: "eyes",
    color: "#4A3728", price: 6200, brand: "MAC", finish: "Velvet",
    suitableFor: ["fair","light","medium","tan","deep"],
    image: "/products/club.png", shadeImage: "/products/club shade.png"
  },
  {
    id: 14, name: "Woodwinked", shade: "Eyeshadow", category: "eyes",
    color: "#B8733C", price: 6200, brand: "MAC", finish: "Velvet",
    suitableFor: ["medium","tan","deep"],
    image: "/products/woody.png", shadeImage: "/products/woody shade.png"
  },
  {
    id: 15, name: "Night Rider", shade: "Eyeshadow", category: "eyes",
    color: "#1C1826", price: 10100, brand: "NARS", finish: "Matte",
    suitableFor: ["fair","light","medium","tan","deep"],
    image: "/products/night rider.png", shadeImage: "/products/night rider shades.png"
  },
  {
    id: 16, name: "Pillow Talk Rose", shade: "Luxury Eye Palette", category: "eyes",
    color: "#C4A0A0", price: 19000, brand: "Charlotte Tilbury", finish: "Mixed",
    suitableFor: ["fair","light"],
    image: "/products/pillow talk rose.png", shadeImage: "/products/pillow talk rose shades.png"
  },
  {
    id: 17, name: "Obsidian Smoky", shade: "Eyeshadow Palette", category: "eyes",
    color: "#2C1F38", price: 16200, brand: "Huda Beauty", finish: "Mixed",
    suitableFor: ["fair","light","medium","tan","deep"],
    image: "/products/obsidian smoky.png", shadeImage: "/products/obsidisn smoky shades.png"
  },

  // ── BLUSH ──
  {
    id: 18, name: "Orgasm", shade: "Blush", category: "blush",
    color: "#E8906A", price: 9500, brand: "NARS", finish: "Shimmer",
    suitableFor: ["fair","light","medium"],
    image: "/products/orgasam.png"
  },
  {
    id: 19, name: "Deep Throat", shade: "Blush", category: "blush",
    color: "#F0B0C0", price: 9500, brand: "NARS", finish: "Shimmer",
    suitableFor: ["fair","light"],
    image: "/products/deep throat.png"
  },
  {
    id: 20, name: "Exhibit A", shade: "Blush", category: "blush",
    color: "#E05A40", price: 9500, brand: "NARS", finish: "Matte",
    suitableFor: ["medium","tan","deep"],
    image: "/products/exibit a.png"
  },
  {
    id: 21, name: "Peaches", shade: "Powder Blush", category: "blush",
    color: "#F0A060", price: 7800, brand: "MAC", finish: "Satin",
    suitableFor: ["fair","light"],
    image: "/products/peachy.png"
  },
  {
    id: 22, name: "Mocha", shade: "Powder Blush", category: "blush",
    color: "#9B6B5A", price: 7800, brand: "MAC", finish: "Matte",
    suitableFor: ["tan","deep"],
    image: "/products/mocha.png"
  },
  {
    id: 23, name: "Fiji", shade: "Cheeks Out", category: "blush",
    color: "#C47480", price: 6200, brand: "Fenty Beauty", finish: "Satin",
    suitableFor: ["medium","tan"],
    image: "/products/fiji.png"
  },

  // ── FOUNDATION ──
  {
    id: 24, name: "NC15", shade: "Studio Fix Fluid", category: "foundation",
    color: "#F2D8B8", price: 12600, brand: "MAC", finish: "Matte",
    suitableFor: ["fair","light"],
    image: "/products/NC15.png"
  },
  {
    id: 25, name: "NC30", shade: "Studio Fix Fluid", category: "foundation",
    color: "#C8945A", price: 12600, brand: "MAC", finish: "Matte",
    suitableFor: ["medium"],
    image: "/products/NC30.png"
  },
  {
    id: 26, name: "NC45", shade: "Studio Fix Fluid", category: "foundation",
    color: "#9B6B3A", price: 12600, brand: "MAC", finish: "Matte",
    suitableFor: ["tan"],
    image: "/products/NC45.png"
  },
  {
    id: 27, name: "NC55", shade: "Studio Fix Fluid", category: "foundation",
    color: "#6B3A1A", price: 12600, brand: "MAC", finish: "Matte",
    suitableFor: ["deep"],
    image: "/products/NC55.png"
  },
  {
    id: 28, name: "420W", shade: "Pro Filt'r", category: "foundation",
    color: "#C8A07A", price: 11200, brand: "Fenty Beauty", finish: "Soft Matte",
    suitableFor: ["medium"],
    image: "/products/420.png"
  },
  {
    id: 29, name: "490W", shade: "Pro Filt'r", category: "foundation",
    color: "#7A4A2A", price: 11200, brand: "Fenty Beauty", finish: "Soft Matte",
    suitableFor: ["deep"],
    image: "/products/490.png"
  },
];

/* ─────────────────────────── Landmark indices ─────────────────────────── */
const LIPS_OUTER = [61,185,40,39,37,0,267,269,270,409,291,375,321,405,314,17,84,181,91,146];
const LIPS_INNER = [78,191,80,81,82,13,312,311,310,415,308,324,318,402,317,14,87,178,88,95];
const LEFT_LID  = [33,246,161,160,159,158,157,173,133,155,154,153,145,144,163,7];
const RIGHT_LID = [362,398,384,385,386,387,388,466,263,249,390,373,374,380,381,382];
const LEFT_BROW_LOWER  = [46,53,52,65,55,70,63,105,66,107];
const RIGHT_BROW_LOWER = [276,283,282,295,285,300,293,334,296,336];
const LEFT_CHEEK_ANCHOR  = 50;
const RIGHT_CHEEK_ANCHOR = 280;
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

function applyLips(ctx: CanvasRenderingContext2D, lms: any[], color: string, opacity: number, w: number, h: number) {
  const { r, g, b } = hexToRgb(color);
  const tmp = document.createElement("canvas");
  tmp.width = w; tmp.height = h;
  const tCtx = tmp.getContext("2d")!;
  buildPath(tCtx, lms, LIPS_OUTER, w, h);
  tCtx.fillStyle = color;
  tCtx.fill();
  tCtx.globalCompositeOperation = "destination-out";
  buildPath(tCtx, lms, LIPS_INNER, w, h);
  tCtx.fill();
  tCtx.globalCompositeOperation = "source-over";

  ctx.save();
  ctx.filter = "blur(1.2px)";
  ctx.globalAlpha = opacity * 0.9;
  ctx.globalCompositeOperation = "multiply";
  ctx.drawImage(tmp, 0, 0);
  ctx.filter = "none";

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

function applyEyeshadow(ctx: CanvasRenderingContext2D, lms: any[], color: string, opacity: number, w: number, h: number) {
  const { r, g, b } = hexToRgb(color);
  [
    { lid: LEFT_LID,  brow: LEFT_BROW_LOWER },
    { lid: RIGHT_LID, brow: RIGHT_BROW_LOWER },
  ].forEach(({ lid, brow }) => {
    const tmp = document.createElement("canvas");
    tmp.width = w; tmp.height = h;
    const tCtx = tmp.getContext("2d")!;
    const allIdx = [...lid, ...brow];
    const xs = allIdx.map(i => lms[i].x * w);
    const ys = allIdx.map(i => lms[i].y * h);
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    const minY = Math.min(...ys), maxY = Math.max(...ys);
    const midX = (minX + maxX) / 2;
    const grad = tCtx.createLinearGradient(midX, maxY, midX, minY);
    grad.addColorStop(0, `rgba(${r},${g},${b},0.85)`);
    grad.addColorStop(0.5, `rgba(${r},${g},${b},0.45)`);
    grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
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

function applyBlush(ctx: CanvasRenderingContext2D, lms: any[], color: string, opacity: number, w: number, h: number) {
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

function applyFoundation(ctx: CanvasRenderingContext2D, lms: any[], color: string, opacity: number, w: number, h: number) {
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
  if (lum > 80) return "tan";
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
  const { cartItems, addToCart: ctxAddToCart } = useCart();
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);

  const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const resultCanvasRef = useRef<HTMLCanvasElement>(null);
  const photoImgRef = useRef<HTMLImageElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      if (videoRef.current) videoRef.current.srcObject = stream;
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
    tmp.getContext("2d")!.drawImage(video, 0, 0);
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
    try {
      const results = faceLandmarkerRef.current.detect(srcCanvas);
      if (results.faceLandmarks && results.faceLandmarks.length > 0) {
        const lms = results.faceLandmarks[0];
        setLandmarks(lms);
        setSkinTone(detectSkinTone(srcCanvas, lms));
        photoImgRef.current = null;
        const img = new Image();
        img.onload = () => { photoImgRef.current = img; setMode("result"); };
        img.src = url;
      } else {
        setProcessingError("No face detected. Please use a clear front-facing photo.");
        setMode("upload");
      }
    } catch {
      setProcessingError("Something went wrong. Please try a different photo.");
      setMode("upload");
    }
  };

  useEffect(() => {
    if (mode !== "result" || !landmarks || !photoImgRef.current || !resultCanvasRef.current) return;
    const canvas = resultCanvasRef.current;
    const img = photoImgRef.current;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d")!;
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0);
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
    a.download = "fam-fashion-look.png";
    a.href = canvas.toDataURL("image/png");
    a.click();
  };

  const toggleProduct = (product: Product) => {
    setSelectedProducts(prev => ({
      ...prev,
      [product.category]: prev[product.category]?.id === product.id ? null : product,
    }));
  };

  const addToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    ctxAddToCart(product as any);
  };

  const getRecommendations = (cat: Category): Product[] => {
    if (!skinTone) return [];
    return PRODUCTS.filter(p => p.category === cat && p.suitableFor.includes(skinTone)).slice(0, 3);
  };

  const categoryProducts = PRODUCTS.filter(p => p.category === activeCategory);
  const selected = selectedProducts[activeCategory];
  const needsRec = selected && skinTone && !selected.suitableFor.includes(skinTone);
  const recs = needsRec ? getRecommendations(activeCategory) : [];

  const SKIN_TONE_LABELS: Record<SkinTone, string> = { fair:"Fair", light:"Light", medium:"Medium", tan:"Tan", deep:"Deep" };
  const SKIN_TONE_COLORS: Record<SkinTone, string> = { fair:"#F5E0C8", light:"#E8C9A0", medium:"#C8956A", tan:"#A0623A", deep:"#5C3317" };
  const CATEGORIES: Category[] = ["lips","eyes","blush","foundation"];

  const inCart = (id: number) => cartItems.some(p => p.id === id);

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#FAF6F2] flex flex-col font-sans">
      {mode === "result" && (
        <div className="flex items-center justify-end gap-2 px-4 sm:px-6 pt-4 pb-0">
          <Button variant="outline" size="sm" onClick={handleReset}
            className="border-[#EDE6DF] text-[#7B1C2E] hover:bg-[#F7EFEA] h-8 text-xs gap-1.5 bg-white">
            <RotateCcw className="w-3 h-3" /> New Photo
          </Button>
          <Button size="sm" onClick={handleDownload}
            className="bg-[#7B1C2E] hover:bg-[#631525] text-white h-8 text-xs gap-1.5">
            <Upload className="w-3 h-3 rotate-180" /> Save Look
          </Button>
        </div>
      )}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* ── LEFT: Photo zone ── */}
        <section className="flex-1 flex flex-col p-4 sm:p-5 min-h-[55vh] lg:min-h-0">

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
                      <p className="text-sm text-[#9E8A7C] mt-1">Detecting facial features & skin tone</p>
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
                    <div className="flex gap-3 flex-wrap justify-center">
                      <Button
                        className="bg-[#7B1C2E] hover:bg-[#631525] text-white gap-2"
                        onClick={e => { e.stopPropagation(); fileInputRef.current?.click(); }}
                      >
                        <Upload className="w-4 h-4" /> Upload Photo
                      </Button>
                      <Button
                        variant="outline"
                        className="border-[#D9CEC8] text-[#3A2822] hover:bg-[#F7EFEA] gap-2"
                        onClick={e => { e.stopPropagation(); startCamera(); }}
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
                    {!modelReady && (
                      <div className="flex items-center gap-2 text-xs text-[#9E8A7C]">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading AI model...
                      </div>
                    )}
                    {modelError && <p className="text-sm text-red-600">{modelError}</p>}
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
              <Button
                className="mt-4 w-full bg-[#7B1C2E] hover:bg-[#631525] text-white gap-2 h-12 text-sm font-medium opacity-50 cursor-not-allowed"
                disabled
              >
                <Sparkles className="w-4 h-4" /> Try On with AI
              </Button>
            </div>
          )}

          {/* Camera preview */}
          {mode === "camera" && (
            <div className="flex-1 flex flex-col gap-4">
              <div className="flex-1 rounded-2xl overflow-hidden bg-black relative min-h-[380px]">
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-52 h-64 border-2 border-white/30 border-dashed rounded-full" />
                </div>
              </div>
              <div className="flex gap-3 justify-center">
                <Button
                  className="bg-[#7B1C2E] hover:bg-[#631525] text-white gap-2 px-8"
                  onClick={captureFromCamera}
                >
                  <Camera className="w-4 h-4" /> Capture Photo
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
            <div className="flex-1 flex flex-col gap-3">
              {skinTone && (
                <div className="flex items-center gap-2 text-xs text-[#9E8A7C]">
                  <div className="w-3.5 h-3.5 rounded-full border border-white/60 shadow-sm flex-shrink-0" style={{ backgroundColor: SKIN_TONE_COLORS[skinTone] }} />
                  Skin tone detected: <span className="font-semibold text-[#3A2822]">{SKIN_TONE_LABELS[skinTone]}</span>
                </div>
              )}
              <div className="flex-1 rounded-2xl overflow-hidden bg-black relative min-h-[380px] flex items-center justify-center">
                <canvas ref={resultCanvasRef} className="max-w-full max-h-full object-contain" style={{ imageRendering: "auto" }} />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-[#9E8A7C] font-medium uppercase tracking-wider w-16 flex-shrink-0">Intensity</span>
                <input
                  type="range" min={0.2} max={1} step={0.05}
                  value={intensity}
                  onChange={e => setIntensity(Number(e.target.value))}
                  className="flex-1 accent-[#7B1C2E] cursor-pointer"
                />
                <span className="text-xs text-[#3A2822] font-medium w-9 text-right">{Math.round(intensity * 100)}%</span>
              </div>
              <Button
                className="w-full bg-[#7B1C2E] hover:bg-[#631525] text-white gap-2 h-11 text-sm font-medium"
                onClick={handleDownload}
              >
                <Sparkles className="w-4 h-4" /> Save My Look
              </Button>
            </div>
          )}
        </section>

        {/* ── RIGHT: Product panel ── */}
        <aside className="w-full lg:w-[360px] xl:w-[400px] bg-white border-t lg:border-t-0 lg:border-l border-[#EDE6DF] flex flex-col">
          <div className="px-4 sm:px-5 pt-4 sm:pt-5 pb-0 flex-shrink-0">
            <h2 className="font-serif text-lg font-semibold text-[#3A2822] mb-3">Collection</h2>

            {/* Category tabs */}
            <div className="flex gap-1 mb-0">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
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
            <div className="mx-4 sm:mx-5 mt-3 bg-amber-50 border border-amber-100 rounded-xl p-3">
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
                        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: rec.color }} />
                        {rec.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Product grid */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-4">
            <div className="grid grid-cols-2 gap-3">
              {categoryProducts.map(product => {
                const isSelected = selected?.id === product.id;
                const isInCart = inCart(product.id);
                return (
                  <div
                    key={product.id}
                    className={cn(
                      "relative rounded-xl border transition-all duration-150 overflow-hidden group cursor-pointer",
                      mode !== "result" && "cursor-default",
                      isSelected
                        ? "border-[#7B1C2E] ring-1 ring-[#7B1C2E] shadow-sm"
                        : "border-[#EDE6DF] hover:border-[#C4A99E] hover:shadow-sm"
                    )}
                    onClick={() => { if (mode === "result") toggleProduct(product); }}
                    onMouseEnter={() => setPreviewProduct(product)}
                    onMouseLeave={() => setPreviewProduct(null)}
                  >
                    {/* Product image */}
                    <div className="relative bg-[#FAF6F2] h-[110px] overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain p-1.5 transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                        onError={e => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                      {/* Selected checkmark */}
                      {isSelected && (
                        <div className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full bg-[#7B1C2E] flex items-center justify-center shadow-sm">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                      {/* Add to cart button */}
                      <button
                        onClick={e => addToCart(product, e)}
                        className={cn(
                          "absolute top-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-150 shadow-sm",
                          isInCart
                            ? "bg-[#7B1C2E] text-white"
                            : "bg-white/90 text-[#7B1C2E] opacity-0 group-hover:opacity-100 hover:bg-[#7B1C2E] hover:text-white"
                        )}
                        title={isInCart ? "In cart" : "Add to cart"}
                      >
                        {isInCart ? <Check className="w-3.5 h-3.5" /> : <ShoppingCart className="w-3 h-3" />}
                      </button>
                      {/* Color swatch overlay */}
                      <div
                        className="absolute bottom-1.5 left-1.5 w-4 h-4 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: product.color }}
                      />
                    </div>
                    {/* Product info */}
                    <div className="p-2.5">
                      <p className="font-serif text-xs font-semibold text-[#3A2822] leading-tight">{product.name}</p>
                      <p className="text-[10px] text-[#B5A39A] mt-0.5 uppercase tracking-wide leading-tight">{product.brand}</p>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-[10px] text-[#C4A99E] italic">{product.finish}</span>
                        <span className="text-[11px] font-semibold text-[#7B1C2E]">Rs.{product.price.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
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

          {/* Shade preview — shown when hovering a product that has a shade image */}
          {previewProduct?.shadeImage && (
            <div className="flex-shrink-0 border-t border-[#EDE6DF] bg-[#FAF6F2] px-4 sm:px-5 py-3">
              <p className="text-[10px] text-[#9E8A7C] uppercase tracking-wider mb-2">Shade swatch</p>
              <img
                src={previewProduct.shadeImage}
                alt={`${previewProduct.name} shade`}
                className="w-full h-12 object-contain rounded-lg"
                loading="lazy"
              />
            </div>
          )}
        </aside>
      </main>

    </div>
  );
}
