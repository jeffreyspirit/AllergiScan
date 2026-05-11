"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { Worker as TesseractWorker } from "tesseract.js";
import {
  Camera,
  CameraOff,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  ZapOff,
  Zap,
} from "lucide-react";
import { analyzeIngredients, Ingredient } from "@/lib/inci";

type ScanStatus = "idle" | "scanning" | "detected" | "error";

interface LiveScannerProps {
  onResult: (ingredients: Ingredient[], rawText: string) => void;
}

export default function LiveScanner({ onResult }: LiveScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const workerRef = useRef<TesseractWorker | null>(null);
  const isProcessingRef = useRef(false);

  const [cameraActive, setCameraActive] = useState(false);
  const [status, setStatus] = useState<ScanStatus>("idle");
  const [scanCount, setScanCount] = useState(0);
  const [lastIngredients, setLastIngredients] = useState<Ingredient[]>([]);
  const [selectedLang, setSelectedLang] = useState<"auto" | "tha" | "chi_sim" | "eng">("auto");
  const [fps, setFps] = useState(0);
  const [isWorkerReady, setIsWorkerReady] = useState(false);
  const fpsRef = useRef({ frames: 0, last: Date.now() });

  // Initialise Tesseract worker
  const initWorker = useCallback(async (lang: string) => {
    setIsWorkerReady(false);
    if (workerRef.current) {
      await workerRef.current.terminate();
      workerRef.current = null;
    }
    const Tesseract = (await import("tesseract.js")).default;
    const worker = await Tesseract.createWorker(lang, 1, {
      logger: (m) => {
        if (m.status === "recognizing text") {
          // Can track progress if needed
        }
      },
    });

    // Set parameters for speed
    await worker.setParameters({
      tessedit_pageseg_mode: "3" as any, // Fully automatic page segmentation, but no OSD
      tessjs_create_hocr: "0",
      tessjs_create_tsv: "0",
    });

    workerRef.current = worker;
    setIsWorkerReady(true);
  }, []);

  const getLangCode = useCallback(() => {
    if (selectedLang === "auto") return "tha+chi_sim+eng";
    return selectedLang;
  }, [selectedLang]);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraActive(true);
      setStatus("scanning");

      // Init worker
      await initWorker(getLangCode());

      // Start scanning loop immediately after worker is ready
    } catch {
      setStatus("error");
    }
  }, [getLangCode, initWorker]);

  const stopCamera = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }
    setCameraActive(false);
    setStatus("idle");
    isProcessingRef.current = false;
  }, []);

  const captureAndScan = useCallback(async () => {
    if (isProcessingRef.current || !workerRef.current || !videoRef.current || !canvasRef.current || !isWorkerReady) return;
    if (!videoRef.current.videoWidth) return;

    isProcessingRef.current = true;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Scan only a focused center area to increase speed and accuracy
    const scale = 0.8;
    const sw = video.videoWidth * scale;
    const sh = video.videoHeight * scale;
    const sx = (video.videoWidth - sw) / 2;
    const sy = (video.videoHeight - sh) / 2;

    canvas.width = sw;
    canvas.height = sh;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) { isProcessingRef.current = false; return; }

    // Draw and apply simple preprocessing (grayscale + contrast)
    ctx.filter = "grayscale(100%) contrast(150%) brightness(110%)";
    ctx.drawImage(video, sx, sy, sw, sh, 0, 0, sw, sh);
    
    const imageData = canvas.toDataURL("image/jpeg", 0.7);

    try {
      const { data } = await workerRef.current.recognize(imageData);
      const text = data.text.trim();

      if (text.length > 5) {
        const found = analyzeIngredients(text);
        if (found.length > 0) {
          setLastIngredients(found);
          setStatus("detected");
          onResult(found, text);
          setScanCount((c) => c + 1);
          
          // Flash detected status for a bit then go back to scanning
          setTimeout(() => setStatus("scanning"), 1000);
        }
      }
    } catch (err) {
      console.error("OCR Error:", err);
    } finally {
      isProcessingRef.current = false;
      
      // Schedule next scan with a very small delay for "real-time" feel
      if (cameraActive) {
        intervalRef.current = setTimeout(captureAndScan, 400); 
      }

      // FPS counter
      fpsRef.current.frames++;
      const now = Date.now();
      if (now - fpsRef.current.last >= 5000) {
        setFps(Math.round((fpsRef.current.frames / (now - fpsRef.current.last)) * 1000 * 10) / 10);
        fpsRef.current = { frames: 0, last: now };
      }
    }
  }, [onResult, cameraActive, isWorkerReady]);

  // Start loop when worker is ready
  useEffect(() => {
    if (cameraActive && isWorkerReady) {
      captureAndScan();
    }
    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
    }
  }, [cameraActive, isWorkerReady, captureAndScan]);

  // Re-init worker when language changes
  useEffect(() => {
    if (cameraActive && workerRef.current) {
      initWorker(getLangCode());
    }
  }, [selectedLang, cameraActive, getLangCode, initWorker]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  const langOptions = [
    { value: "auto", label: "Auto", flag: "🌐" },
    { value: "tha", label: "ไทย", flag: "🇹🇭" },
    { value: "chi_sim", label: "中文", flag: "🇨🇳" },
    { value: "eng", label: "English", flag: "🇬🇧" },
  ] as const;

  return (
    <div className="flex flex-col h-full bg-gray-950">
      {/* Camera viewport */}
      <div className="relative flex-1 bg-black overflow-hidden min-h-0">
        <video
          ref={videoRef}
          className={`w-full h-full object-cover transition-opacity duration-300 ${cameraActive ? "opacity-100" : "opacity-0"}`}
          playsInline
          muted
        />
        <canvas ref={canvasRef} className="hidden" />

        {/* Overlay when idle */}
        {!cameraActive && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-white">
            <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
              <Camera className="w-10 h-10 text-white/80" />
            </div>
            <p className="text-sm font-medium text-white/70">Camera is off</p>
          </div>
        )}

        {/* Scanning frame overlay */}
        {cameraActive && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Corner brackets */}
            <div className="absolute inset-6">
              <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-emerald-400 rounded-tl-lg" />
              <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-emerald-400 rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-emerald-400 rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-emerald-400 rounded-br-lg" />
            </div>

            {/* Scanning beam */}
            {status === "scanning" && (
              <div className="absolute left-6 right-6 top-6 bottom-6 overflow-hidden rounded-lg">
                <div className="animate-scan w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-lg shadow-emerald-400/60" />
              </div>
            )}

            {/* Detected pulse */}
            {status === "detected" && (
              <div className="absolute inset-6 rounded-lg border-2 border-emerald-400 animate-pulse" />
            )}

            {/* Status badge */}
            <div className="absolute top-3 left-3 flex flex-col gap-1">
              {status === "scanning" && (
                <span className="flex items-center gap-1.5 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-full text-[11px] font-bold text-emerald-400">
                  <span className={`w-1.5 h-1.5 rounded-full ${isWorkerReady ? "bg-emerald-400 animate-pulse" : "bg-amber-400 animate-spin"}`} />
                  {isWorkerReady ? "LIVE SCANNING" : "INITIALIZING AI..."}
                </span>
              )}
              {status === "detected" && (
                <span className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/80 backdrop-blur-sm rounded-full text-[11px] font-bold text-white">
                  <CheckCircle2 className="w-3 h-3" />
                  DETECTED ({scanCount})
                </span>
              )}
              {isWorkerReady && (
                 <span className="text-[9px] text-white/40 font-mono bg-black/40 px-1.5 py-0.5 rounded-md self-start">
                   {fps > 0 ? `${fps} FPS` : "READY"}
                 </span>
              )}
            </div>

            {/* Guide text */}
            <div className="absolute bottom-3 left-0 right-0 flex justify-center">
              <span className="px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full text-[11px] text-white/70">
                Point at ingredient list — Thai · English · 中文
              </span>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white bg-black/80">
            <CameraOff className="w-10 h-10 text-red-400" />
            <p className="text-sm font-semibold">Camera access denied</p>
            <p className="text-xs text-white/60 text-center max-w-[220px]">
              Please allow camera permission in your browser settings and try again.
            </p>
          </div>
        )}
      </div>

      {/* Controls bar */}
      <div className="bg-gray-900 border-t border-gray-800 px-4 py-3 flex-shrink-0">
        {/* Language selector */}
        <div className="flex gap-1.5 mb-3 justify-center">
          {langOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSelectedLang(opt.value)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedLang === opt.value
                  ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              <span>{opt.flag}</span>
              <span>{opt.label}</span>
            </button>
          ))}
        </div>

        {/* Main camera toggle button */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={cameraActive ? stopCamera : startCamera}
            className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-semibold text-sm transition-all active:scale-95 shadow-lg ${
              cameraActive
                ? "bg-red-500 text-white shadow-red-500/30 hover:bg-red-600"
                : "bg-emerald-500 text-white shadow-emerald-500/30 hover:bg-emerald-600"
            }`}
          >
            {cameraActive ? (
              <>
                <ZapOff className="w-4 h-4" />
                Stop Camera
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Start Live Scan
              </>
            )}
          </button>
        </div>

        {cameraActive && (
          <p className="text-center text-[10px] text-gray-600 mt-2">
            Auto-scanning every 2.5s · {selectedLang === "auto" ? "Auto-detect language" : `${langOptions.find(l => l.value === selectedLang)?.flag} language selected`}
          </p>
        )}
      </div>

      {/* Recent live results mini-bar */}
      {lastIngredients.length > 0 && cameraActive && (
        <div className="bg-gray-900 border-t border-gray-800 px-4 py-2 flex-shrink-0">
          <p className="text-[10px] text-gray-500 mb-1.5 uppercase tracking-wider font-semibold">Last detected</p>
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {lastIngredients.slice(0, 5).map((ing) => (
              <span
                key={ing.id}
                className={`flex-shrink-0 flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold ${
                  ing.safetyProfile === "safe"
                    ? "bg-emerald-900/60 text-emerald-400"
                    : ing.safetyProfile === "caution"
                    ? "bg-amber-900/60 text-amber-400"
                    : "bg-red-900/60 text-red-400"
                }`}
              >
                {ing.safetyProfile === "safe" && <CheckCircle2 className="w-2.5 h-2.5" />}
                {ing.safetyProfile === "caution" && <AlertTriangle className="w-2.5 h-2.5" />}
                {ing.safetyProfile === "danger" && <ShieldAlert className="w-2.5 h-2.5" />}
                {ing.name}
              </span>
            ))}
            {lastIngredients.length > 5 && (
              <span className="flex-shrink-0 px-2 py-1 rounded-full text-[10px] text-gray-500 bg-gray-800">
                +{lastIngredients.length - 5} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
