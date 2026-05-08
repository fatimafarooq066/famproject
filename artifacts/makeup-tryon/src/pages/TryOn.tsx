import React, { useEffect, useRef, useState, useCallback } from "react";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Camera, Download, RotateCcw, Info, CameraOff } from "lucide-react";
import { cn } from "@/lib/utils";

// Types
type SkinTone = "fair" | "light" | "medium" | "tan" | "deep";
type Category = "lips" | "eyes" | "blush" | "foundation";

interface Product {
  id: number;
  name: string;
  category: Category;
  color: string;
  price: number;
  brand: string;
  suitableFor: SkinTone[];
}

// Products Catalog
const PRODUCTS: Product[] = [
  { id: 1, name: "Ruby Allure", category: "lips", color: "#C0392B", price: 28, brand: "GlowAR", suitableFor: ["medium", "tan", "deep"] },
  { id: 2, name: "Petal Kiss", category: "lips", color: "#E8A0A0", price: 24, brand: "GlowAR", suitableFor: ["fair", "light", "medium"] },
  { id: 3, name: "Berry Crush", category: "lips", color: "#7D2E5C", price: 32, brand: "GlowAR", suitableFor: ["fair", "light", "tan", "deep"] },
  { id: 4, name: "Nude Glow", category: "lips", color: "#C68B6A", price: 26, brand: "GlowAR", suitableFor: ["light", "medium", "tan"] },
  { id: 5, name: "Coral Sunset", category: "lips", color: "#E8704A", price: 28, brand: "GlowAR", suitableFor: ["fair", "light", "medium"] },
  { id: 6, name: "Mahogany", category: "lips", color: "#6B2B2B", price: 30, brand: "GlowAR", suitableFor: ["tan", "deep"] },
  
  { id: 7, name: "Smoky Obsidian", category: "eyes", color: "#2C2C2C", price: 35, brand: "GlowAR", suitableFor: ["fair", "light", "medium", "tan", "deep"] },
  { id: 8, name: "Rose Gold Dream", category: "eyes", color: "#B8846A", price: 38, brand: "GlowAR", suitableFor: ["fair", "light", "medium"] },
  { id: 9, name: "Emerald Gem", category: "eyes", color: "#2E6B4F", price: 36, brand: "GlowAR", suitableFor: ["fair", "light", "medium", "tan"] },
  { id: 10, name: "Bronze Goddess", category: "eyes", color: "#8B5A2B", price: 34, brand: "GlowAR", suitableFor: ["medium", "tan", "deep"] },
  { id: 11, name: "Ocean Blue", category: "eyes", color: "#1A5276", price: 37, brand: "GlowAR", suitableFor: ["fair", "light"] },
  { id: 12, name: "Amethyst Night", category: "eyes", color: "#6C3483", price: 39, brand: "GlowAR", suitableFor: ["light", "medium", "deep"] },
  
  { id: 13, name: "Peach Flush", category: "blush", color: "#F4A460", price: 22, brand: "GlowAR", suitableFor: ["fair", "light"] },
  { id: 14, name: "Rose Blossom", category: "blush", color: "#C47480", price: 24, brand: "GlowAR", suitableFor: ["fair", "light", "medium"] },
  { id: 15, name: "Terracotta Warmth", category: "blush", color: "#B05D3D", price: 25, brand: "GlowAR", suitableFor: ["medium", "tan", "deep"] },
  { id: 16, name: "Berry Cheek", category: "blush", color: "#8B3A5A", price: 23, brand: "GlowAR", suitableFor: ["tan", "deep"] },
  
  { id: 17, name: "Porcelain Veil", category: "foundation", color: "#F5E6D3", price: 45, brand: "GlowAR", suitableFor: ["fair"] },
  { id: 18, name: "Ivory Luminaire", category: "foundation", color: "#EDD5B0", price: 45, brand: "GlowAR", suitableFor: ["light"] },
  { id: 19, name: "Honey Sand", category: "foundation", color: "#C9956A", price: 45, brand: "GlowAR", suitableFor: ["medium"] },
  { id: 20, name: "Caramel Glow", category: "foundation", color: "#A0623A", price: 45, brand: "GlowAR", suitableFor: ["tan"] },
  { id: 21, name: "Espresso Rich", category: "foundation", color: "#5C3317", price: 45, brand: "GlowAR", suitableFor: ["deep"] },
];

// Drawing Functions
function drawPath(ctx: CanvasRenderingContext2D, landmarks: any[], indices: number[], color: string, opacity: number, width: number, height: number, fill = true) {
  if (!landmarks || indices.length === 0) return;
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.beginPath();
  indices.forEach((i, idx) => {
    const pt = landmarks[i];
    const x = (1 - pt.x) * width; // Flipped X
    const y = pt.y * height;
    if (idx === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();
  if (fill) ctx.fill();
  else ctx.stroke();
  ctx.restore();
}

function drawBlush(ctx: CanvasRenderingContext2D, cx: number, cy: number, color: string, opacity: number) {
  const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, 40);
  const colorRgba = color.startsWith('#') 
    ? `rgba(${parseInt(color.slice(1,3),16)},${parseInt(color.slice(3,5),16)},${parseInt(color.slice(5,7),16)},${opacity})`
    : color;
  gradient.addColorStop(0, colorRgba);
  gradient.addColorStop(1, 'transparent');
  
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.ellipse(cx, cy, 50, 35, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawFoundation(ctx: CanvasRenderingContext2D, landmarks: any[], width: number, height: number, color: string, opacity: number) {
  // A simplified face outline for foundation
  const faceOval = [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109];
  drawPath(ctx, landmarks, faceOval, color, opacity * 0.4, width, height, true);
}

function detectSkinTone(videoEl: HTMLVideoElement, landmarks: any[]): SkinTone {
  const canvas = document.createElement('canvas');
  canvas.width = videoEl.videoWidth;
  canvas.height = videoEl.videoHeight;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
  
  const forehead = landmarks[10];
  const x = Math.floor((1 - forehead.x) * canvas.width);
  const y = Math.floor(forehead.y * canvas.height);
  
  try {
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const [r, g, b] = [pixel[0], pixel[1], pixel[2]];
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b);
    
    if (luminance > 200) return 'fair';
    if (luminance > 160) return 'light';
    if (luminance > 120) return 'medium';
    if (luminance > 80) return 'tan';
    return 'deep';
  } catch (e) {
    return 'medium'; // fallback
  }
}

export default function TryOn() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [cameraError, setCameraError] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [skinTone, setSkinTone] = useState<SkinTone | null>(null);
  
  const [intensity, setIntensity] = useState(0.6);
  const [selectedProducts, setSelectedProducts] = useState<Record<Category, Product | null>>({
    lips: null,
    eyes: null,
    blush: null,
    foundation: null
  });

  const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);
  const reqFrameRef = useRef<number>();
  const lastSkinToneCheck = useRef<number>(0);

  useEffect(() => {
    async function setupCameraAndModel() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 1280, height: 720, facingMode: 'user' } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        setCameraError(true);
        setIsModelLoading(false);
        return;
      }

      try {
        const filesetResolver = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );
        faceLandmarkerRef.current = await FaceLandmarker.createFromOptions(filesetResolver, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
            delegate: "GPU"
          },
          runningMode: "VIDEO",
          numFaces: 1
        });
        setIsModelLoading(false);
      } catch (err) {
        console.error("Model load error", err);
      }
    }

    setupCameraAndModel();

    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(t => t.stop());
      }
      if (reqFrameRef.current) cancelAnimationFrame(reqFrameRef.current);
    };
  }, []);

  const drawMakeup = useCallback((landmarks: any[]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

    if (selectedProducts.foundation) {
      drawFoundation(ctx, landmarks, width, height, selectedProducts.foundation.color, intensity);
    }

    if (selectedProducts.blush) {
      // Left cheek approx (flipped)
      const leftCheek = landmarks[323];
      // Right cheek approx (flipped)
      const rightCheek = landmarks[93];
      drawBlush(ctx, (1 - leftCheek.x) * width, leftCheek.y * height, selectedProducts.blush.color, intensity);
      drawBlush(ctx, (1 - rightCheek.x) * width, rightCheek.y * height, selectedProducts.blush.color, intensity);
    }

    if (selectedProducts.lips) {
      const lipsOuter = [61,185,40,39,37,0,267,269,270,409,291,375,321,405,314,17,84,181,91,146];
      drawPath(ctx, landmarks, lipsOuter, selectedProducts.lips.color, intensity, width, height, true);
    }

    if (selectedProducts.eyes) {
      const leftEye = [33,7,163,144,145,153,154,155,133,173,157,158,159,160,161,246];
      const rightEye = [362,382,381,380,374,373,390,249,263,466,388,387,386,385,384,398];
      drawPath(ctx, landmarks, leftEye, selectedProducts.eyes.color, intensity * 0.7, width, height, true);
      drawPath(ctx, landmarks, rightEye, selectedProducts.eyes.color, intensity * 0.7, width, height, true);
    }
  }, [selectedProducts, intensity]);

  const predictLoop = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (video && canvas && video.readyState >= 2 && faceLandmarkerRef.current) {
      if (canvas.width !== video.videoWidth) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }

      const results = faceLandmarkerRef.current.detectForVideo(video, performance.now());
      
      if (results.faceLandmarks && results.faceLandmarks.length > 0) {
        setFaceDetected(true);
        const landmarks = results.faceLandmarks[0];
        
        drawMakeup(landmarks);

        const now = Date.now();
        if (!skinTone || now - lastSkinToneCheck.current > 2000) {
          lastSkinToneCheck.current = now;
          setSkinTone(detectSkinTone(video, landmarks));
        }
      } else {
        setFaceDetected(false);
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    reqFrameRef.current = requestAnimationFrame(predictLoop);
  }, [drawMakeup, skinTone]);

  useEffect(() => {
    if (!isModelLoading && !cameraError) {
      reqFrameRef.current = requestAnimationFrame(predictLoop);
    }
    return () => {
      if (reqFrameRef.current) cancelAnimationFrame(reqFrameRef.current);
    };
  }, [isModelLoading, cameraError, predictLoop]);

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = videoRef.current.videoWidth;
    exportCanvas.height = videoRef.current.videoHeight;
    const ctx = exportCanvas.getContext('2d');
    if (!ctx) return;
    
    // Draw flipped video
    ctx.save();
    ctx.scale(-1, 1);
    ctx.translate(-exportCanvas.width, 0);
    ctx.drawImage(videoRef.current, 0, 0);
    ctx.restore();
    
    // Draw canvas overlay
    ctx.drawImage(canvasRef.current, 0, 0);

    const link = document.createElement('a');
    link.download = 'glow-ar-look.png';
    link.href = exportCanvas.toDataURL('image/png');
    link.click();
  };

  const activeCategory = Object.values(selectedProducts).find(p => p !== null)?.category || 'lips';

  const getRecommendations = (cat: Category) => {
    if (!skinTone) return [];
    return PRODUCTS.filter(p => p.category === cat && p.suitableFor.includes(skinTone)).slice(0, 3);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {/* Header */}
      <header className="h-16 border-b flex items-center justify-between px-6 bg-card sticky top-0 z-10">
        <h1 className="text-2xl font-serif font-semibold text-primary tracking-wide">GlowAR</h1>
        <div className="flex gap-4">
          <Button variant="outline" size="sm" onClick={() => setSelectedProducts({ lips: null, eyes: null, blush: null, foundation: null })}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button size="sm" onClick={handleCapture}>
            <Download className="w-4 h-4 mr-2" />
            Capture Look
          </Button>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Camera Section */}
        <section className="flex-1 relative bg-black min-h-[50vh] lg:min-h-0 flex items-center justify-center overflow-hidden">
          {cameraError ? (
            <div className="text-white text-center p-6">
              <CameraOff className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h2 className="text-xl font-serif">Camera Access Required</h2>
              <p className="text-sm opacity-70 mt-2">Please allow camera access to try on makeup.</p>
            </div>
          ) : (
            <div className="relative w-full h-full max-w-[800px] aspect-video flex items-center justify-center">
              <video 
                ref={videoRef}
                autoPlay 
                playsInline 
                muted
                className={cn(
                  "absolute inset-0 w-full h-full object-cover transition-opacity duration-500 scale-x-[-1]",
                  isModelLoading ? "opacity-0" : "opacity-100"
                )}
              />
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full object-cover z-10 pointer-events-none"
              />
              
              {isModelLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black text-white z-20">
                  <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
                  <p className="text-sm font-medium tracking-wide">Loading AI Models...</p>
                </div>
              )}

              {!isModelLoading && !faceDetected && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                  <div className="w-64 h-80 border-2 border-white/30 border-dashed rounded-full animate-pulse flex items-center justify-center">
                    <span className="text-white/50 text-sm font-medium px-4 py-2 bg-black/40 rounded-full backdrop-blur-md">
                      Position face here
                    </span>
                  </div>
                </div>
              )}

              {!isModelLoading && faceDetected && (
                <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-black/40 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-medium">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Face Detected
                  {skinTone && (
                    <>
                      <span className="opacity-50 mx-1">|</span>
                      <span className="capitalize text-primary-foreground">{skinTone} Tone</span>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </section>

        {/* Product Panel */}
        <section className="w-full lg:w-[400px] bg-card border-l flex flex-col shadow-[-4px_0_24px_rgba(0,0,0,0.02)]">
          <div className="p-6 pb-0 flex-shrink-0">
            <h2 className="text-xl font-serif mb-6">Virtual Try-On</h2>
            
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Intensity</label>
                <span className="text-sm font-medium">{Math.round(intensity * 100)}%</span>
              </div>
              <Slider 
                value={[intensity]} 
                onValueChange={(v) => setIntensity(v[0])} 
                max={1} 
                step={0.05}
                className="w-full"
              />
            </div>
          </div>

          <Tabs defaultValue="lips" className="flex-1 flex flex-col min-h-0">
            <div className="px-6 border-b">
              <TabsList className="w-full bg-transparent p-0 justify-start space-x-6 border-none h-auto rounded-none">
                {["lips", "eyes", "blush", "foundation"].map(cat => (
                  <TabsTrigger 
                    key={cat} 
                    value={cat}
                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 py-3 capitalize text-sm font-medium text-muted-foreground data-[state=active]:text-foreground transition-none"
                  >
                    {cat}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {["lips", "eyes", "blush", "foundation"].map(cat => {
                const categoryProducts = PRODUCTS.filter(p => p.category === cat);
                const selected = selectedProducts[cat as Category];
                const needsRecommendation = selected && skinTone && !selected.suitableFor.includes(skinTone);
                
                return (
                  <TabsContent key={cat} value={cat} className="mt-0 h-full flex flex-col focus-visible:outline-none">
                    
                    {needsRecommendation && (
                      <div className="bg-orange-50 border border-orange-100 p-4 rounded-md mb-6 animate-in fade-in slide-in-from-top-2">
                        <div className="flex items-start gap-3">
                          <Info className="w-5 h-5 text-orange-400 mt-0.5" />
                          <div>
                            <p className="text-sm text-orange-900 font-medium mb-3">
                              This shade may not be the best match for your detected skin tone. Try these instead:
                            </p>
                            <div className="flex gap-3">
                              {getRecommendations(cat as Category).map(rec => (
                                <button
                                  key={rec.id}
                                  onClick={() => setSelectedProducts(prev => ({ ...prev, [cat]: rec }))}
                                  className="flex items-center gap-2 bg-white px-2 py-1.5 rounded shadow-sm hover:shadow-md transition-shadow text-xs"
                                >
                                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: rec.color }} />
                                  <span className="font-medium truncate max-w-[80px]">{rec.name}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      {categoryProducts.map(product => {
                        const isSelected = selected?.id === product.id;
                        return (
                          <button
                            key={product.id}
                            onClick={() => setSelectedProducts(prev => ({ 
                              ...prev, 
                              [cat]: prev[cat as Category]?.id === product.id ? null : product 
                            }))}
                            className={cn(
                              "text-left p-4 rounded-xl border transition-all duration-200 group relative overflow-hidden",
                              isSelected 
                                ? "border-primary bg-primary/5 ring-1 ring-primary shadow-sm" 
                                : "border-border hover:border-primary/40 hover:bg-muted/50"
                            )}
                          >
                            <div className="mb-3 flex justify-between items-start">
                              <div 
                                className={cn(
                                  "w-10 h-10 rounded-full shadow-inner transition-transform group-hover:scale-110",
                                  isSelected && "ring-2 ring-offset-2 ring-primary"
                                )}
                                style={{ backgroundColor: product.color }}
                              />
                              <span className="text-sm font-medium text-muted-foreground">${product.price}</span>
                            </div>
                            <h3 className="font-serif font-medium text-foreground">{product.name}</h3>
                            <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wide">{product.brand}</p>
                          </button>
                        );
                      })}
                    </div>
                  </TabsContent>
                );
              })}
            </div>
          </Tabs>
        </section>
      </main>
    </div>
  );
}