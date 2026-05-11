"use client";

import { useState, useRef, useEffect } from "react";
import {
  Image as ImageIcon,
  Loader2,
  RefreshCcw,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  ScanLine,
  FileText,
  FlaskConical,
  ChevronRight,
  Video,
  Upload,
  Info,
  ChevronLeft,
  X,
  History,
  Sparkles,
} from "lucide-react";
import { analyzeIngredients, Ingredient } from "@/lib/inci";
import LiveScanner from "./LiveScanner";

type Tab = "inci" | "raw";
type Mode = "home" | "upload" | "live";

const LANG_OPTIONS = [
  { value: "tha+chi_sim+eng", label: "Auto-detect", flag: "🌐" },
  { value: "tha",             label: "Thai · ไทย", flag: "🇹🇭" },
  { value: "chi_sim",         label: "Chinese · 中文",  flag: "🇨🇳" },
  { value: "eng",             label: "English",          flag: "🇬🇧" },
] as const;

type LangValue = typeof LANG_OPTIONS[number]["value"];

export default function Scanner() {
  const [mode, setMode] = useState<Mode>("home");
  const [image, setImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<(Ingredient & { isPersonalAllergen?: boolean })[] | null>(null);
  const [rawText, setRawText] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("inci");
  const [manualText, setManualText] = useState("");
  const [showManual, setShowManual] = useState(false);
  const [selectedLang, setSelectedLang] = useState<LangValue>("tha+chi_sim+eng");
  const [personalAllergens, setPersonalAllergens] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("personalAllergens");
    if (saved) setPersonalAllergens(JSON.parse(saved));
  }, []);

  // ─── Save Result to History ──────────────────────────────────────────
  const saveToHistory = (found: any[], raw: string) => {
    const history = JSON.parse(localStorage.getItem("scanHistory") || "[]");
    
    // Determine status
    let status = "safe";
    if (found.some(r => r.safetyProfile === "danger" || r.isPersonalAllergen)) status = "danger";
    else if (found.some(r => r.safetyProfile === "caution")) status = "caution";

    const newEntry = {
      name: "Product Scan " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      count: found.length,
      status: status,
      time: "Just now",
      date: new Date().toISOString(),
      raw: raw.substring(0, 100),
      emoji: "🧴"
    };

    const updated = [newEntry, ...history].slice(0, 20);
    localStorage.setItem("scanHistory", JSON.stringify(updated));
  };

  // ─── Process uploaded image via Tesseract ───────────────────────────
  const processImage = async (imageSrc: string) => {
    setIsScanning(true);
    setResults(null);
    setRawText("");
    try {
      const Tesseract = (await import("tesseract.js")).default;
      const { data } = await Tesseract.recognize(imageSrc, selectedLang, {
        logger: () => {},
      });
      setRawText(data.text);
      const found = analyzeIngredients(data.text, personalAllergens);
      setResults(found);
      saveToHistory(found, data.text);
    } catch (err) {
      console.error(err);
      alert("Error scanning image. Please try again.");
    } finally {
      setIsScanning(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const imageSrc = reader.result as string;
      setImage(imageSrc);
      setShowManual(false);
      setMode("upload");
      processImage(imageSrc);
    };
    reader.readAsDataURL(file);
  };

  const handleManualAnalyze = () => {
    if (!manualText.trim()) return;
    setShowManual(false);
    setImage(null);
    setRawText(manualText);
    const found = analyzeIngredients(manualText, personalAllergens);
    setResults(found);
    saveToHistory(found, manualText);
  };

  const reset = () => {
    setImage(null);
    setResults(null);
    setRawText("");
    setManualText("");
    setShowManual(false);
    setMode("home");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const lastSavedRef = useRef<number>(0);
  const lastFoundIdsRef = useRef<string>("");

  const handleLiveResult = (ingredients: Ingredient[], raw: string) => {
    // Check personal allergens for live results
    const enriched = ingredients.map(ing => ({
      ...ing,
      isPersonalAllergen: personalAllergens.some(a => a.toUpperCase() === ing.name.toUpperCase())
    }));
    
    setResults(enriched);
    setRawText(raw);
    setImage(null);
    
    // Throttle history: Save only if significant change or 15s passed
    const now = Date.now();
    const ids = ingredients.map(i => i.id).sort().join(",");
    if (now - lastSavedRef.current > 15000 || ids !== lastFoundIdsRef.current) {
      saveToHistory(enriched, raw);
      lastSavedRef.current = now;
      lastFoundIdsRef.current = ids;
    }
  };

  const safetyBadge = () => {
    if (!results) return null;
    const hasPersonal = results.some(r => r.isPersonalAllergen);
    const hasDanger = results.some(r => r.safetyProfile === "danger");
    const hasCaution = results.some(r => r.safetyProfile === "caution");

    if (hasPersonal)
      return (
        <span className="px-3 py-1.5 bg-red-600 text-white text-[10px] rounded-xl font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg shadow-red-500/30 animate-badge-pop">
          <ShieldAlert className="w-3 h-3" /> Personal Risk
        </span>
      );
    if (hasDanger)
      return (
        <span className="px-3 py-1.5 bg-red-500/10 text-red-500 text-[10px] rounded-xl font-black uppercase tracking-widest flex items-center gap-1.5 border border-red-500/20 animate-badge-pop">
          <ShieldAlert className="w-3 h-3" /> Risk Found
        </span>
      );
    if (hasCaution)
      return (
        <span className="px-3 py-1.5 bg-amber-500/10 text-amber-600 text-[10px] rounded-xl font-black uppercase tracking-widest flex items-center gap-1.5 border border-amber-500/20 animate-badge-pop">
          <AlertTriangle className="w-3 h-3" /> Caution
        </span>
      );
    return (
      <span className="px-3 py-1.5 bg-teal-500/10 text-teal-600 text-[10px] rounded-xl font-black uppercase tracking-widest flex items-center gap-1.5 border border-teal-500/20 animate-badge-pop">
        <CheckCircle2 className="w-3 h-3" /> All Safe
      </span>
    );
  };

  // ─── LIVE MODE ───────────────────────────────────────────────────────
  if (mode === "live") {
    return (
      <div className="flex flex-col h-full bg-slate-950">
        <div className="flex items-center justify-between px-5 py-4 bg-slate-950/80 backdrop-blur-md border-b border-white/5 flex-shrink-0 z-10">
          <button
            onClick={reset}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-white transition-all active:scale-95"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-black text-teal-400 tracking-[0.2em] uppercase">Vision AI</span>
            <span className="text-xs font-bold text-white/70">Scanning Ingredients</span>
          </div>
          {results && results.length > 0 ? (
            <button
              onClick={() => setMode("upload")}
              className="px-4 py-2 bg-teal-600 text-white text-[10px] font-black rounded-xl uppercase tracking-widest animate-pulse"
            >
              Results
            </button>
          ) : (
            <div className="w-10" />
          )}
        </div>

        <div className="flex-1 min-h-0">
          <LiveScanner onResult={handleLiveResult} />
        </div>
      </div>
    );
  }

  // ─── RESULTS VIEW (upload / manual) ─────────────────────────────────
  // Note: At this point, we are guaranteed NOT to be in "live" mode
  // because the live mode check above returns early.
  if (results !== null || isScanning) {
    return (
      <div className="flex flex-col h-full bg-surface animate-fade-in">
        {/* Image Preview / Header */}
        {image ? (
          <div className="relative h-56 flex-shrink-0 bg-slate-900 overflow-hidden">
            <img
              src={image}
              alt="Scanned product"
              className="w-full h-full object-cover opacity-90 blur-[1px] group-hover:blur-0 transition-all"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />
            
            <div className="absolute top-4 left-5 flex items-center gap-3">
               <button
                onClick={reset}
                className="p-2.5 bg-black/40 backdrop-blur-md rounded-2xl text-white hover:bg-black/60 transition-all active:scale-95"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h3 className="text-white font-black text-lg tracking-tight drop-shadow-lg">Scan Analysis</h3>
            </div>

            <button
              onClick={reset}
              className="absolute top-4 right-5 p-2.5 bg-black/40 backdrop-blur-md rounded-2xl text-white hover:bg-black/60 transition-all active:scale-95"
            >
              <RefreshCcw className="w-5 h-5" />
            </button>

            <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
              <div className="space-y-1">
                 <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] drop-shadow-md">Detection Complete</p>
                 <h4 className="text-2xl font-black text-foreground">{results?.length || 0} Ingredients</h4>
              </div>
              {safetyBadge()}
            </div>
          </div>
        ) : (
          <div className="px-5 pt-8 pb-4 flex items-center justify-between flex-shrink-0 animate-slide-up">
            <div className="flex items-center gap-4">
              <button
                onClick={reset}
                className="p-2.5 bg-surface-2 border border-border rounded-2xl text-foreground hover:bg-surface transition-all active:scale-95"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div>
                <h3 className="font-black text-xl tracking-tight">Analysis Results</h3>
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{results?.length || 0} Ingredients Found</p>
              </div>
            </div>
            {safetyBadge()}
          </div>
        )}

        {isScanning ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-6 p-8">
            <div className="relative">
              <div className="w-24 h-24 rounded-[32px] bg-primary/10 flex items-center justify-center animate-glow-pulse">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
              </div>
              <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-amber-400 animate-float" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-black text-foreground">
                Processing Vision AI
              </h3>
              <p className="text-xs text-text-muted font-medium max-w-[240px] leading-relaxed">
                Extracting text via <span className="text-primary font-bold">Tesseract Engine</span> and cross-referencing INCI database.
              </p>
            </div>
            <div className="w-full max-w-[200px] h-1.5 bg-surface-2 rounded-full overflow-hidden border border-border">
              <div className="h-full bg-primary animate-shimmer w-1/2 rounded-full" />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden animate-slide-up" style={{ animationDelay: "0.2s" }}>
            {/* Tabs */}
            <div className="flex gap-2 px-5 py-4 flex-shrink-0">
              <button
                onClick={() => setActiveTab("inci")}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === "inci"
                    ? "bg-slate-900 text-white shadow-xl shadow-slate-900/20"
                    : "bg-surface-2 text-text-muted border border-border"
                }`}
              >
                <FlaskConical className="w-4 h-4" /> Ingredients
              </button>
              <button
                onClick={() => setActiveTab("raw")}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === "raw"
                    ? "bg-slate-900 text-white shadow-xl shadow-slate-900/20"
                    : "bg-surface-2 text-text-muted border border-border"
                }`}
              >
                <FileText className="w-4 h-4" /> Raw OCR
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 pb-20 scrollbar-hide">
              {activeTab === "inci" ? (
                results!.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
                    <div className="w-20 h-20 bg-surface-2 rounded-full flex items-center justify-center border-2 border-dashed border-border">
                       <FlaskConical className="w-10 h-10 text-text-muted/30" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-black text-foreground">No matches detected</p>
                      <p className="text-xs text-text-muted font-medium max-w-[200px]">
                        The image might be too blurry or the text is in an unsupported format.
                      </p>
                    </div>
                    <button
                      onClick={reset}
                      className="mt-2 px-6 py-3 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/30 active:scale-95 transition-all"
                    >
                      Try Again
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {results!.map((ingredient, i) => (
                      <div
                        key={ingredient.id}
                        className={`card p-5 bg-surface border-border animate-slide-up group hover:scale-[1.01] transition-all ${
                          ingredient.isPersonalAllergen ? "border-red-500/50 bg-red-500/5" : ""
                        }`}
                        style={{ animationDelay: `${i * 0.05}s` }}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1 pr-3">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-black text-sm text-foreground tracking-tight">
                                {ingredient.name}
                              </h4>
                              {ingredient.isPersonalAllergen && (
                                <span className="px-2 py-0.5 bg-red-600 text-white text-[8px] font-black rounded-lg uppercase tracking-widest shadow-lg shadow-red-500/20">
                                  Personal Alert
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5">
                               <span className="text-[9px] font-black text-text-muted/60 uppercase tracking-widest bg-surface-2 px-2 py-0.5 rounded-md">
                                 {ingredient.category || "General"}
                               </span>
                               {ingredient.cas && <span className="text-[9px] font-bold text-text-muted/40">CAS: {ingredient.cas}</span>}
                            </div>
                          </div>
                          <div className="p-2 rounded-xl bg-surface-2 group-hover:scale-110 transition-transform">
                            {ingredient.safetyProfile === "safe" && (
                              <CheckCircle2 className="w-5 h-5 text-teal-500" />
                            )}
                            {ingredient.safetyProfile === "caution" && (
                              <AlertTriangle className="w-5 h-5 text-amber-500" />
                            )}
                            {ingredient.safetyProfile === "danger" && (
                              <ShieldAlert className="w-5 h-5 text-red-500" />
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-text-muted font-medium mb-4 leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all">
                          {ingredient.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {ingredient.functions.map((fn) => (
                            <span
                              key={fn}
                              className="px-2.5 py-1 bg-surface-2 text-foreground text-[9px] rounded-lg font-black uppercase tracking-tighter border border-border"
                            >
                              {fn}
                            </span>
                          ))}
                          {ingredient.allergen && (
                            <span className="px-2.5 py-1 bg-red-500/10 text-red-600 text-[9px] rounded-lg font-black uppercase tracking-widest border border-red-500/20">
                              ⚠ General Allergen
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                <div className="card bg-slate-950 p-6 space-y-4 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-4 opacity-10">
                      <FileText className="w-20 h-20 text-white" />
                   </div>
                  <p className="text-[10px] font-black text-teal-400 uppercase tracking-[0.2em] relative z-10">
                    Raw Extracted Text
                  </p>
                  <p className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed font-mono relative z-10">
                    {rawText || manualText || "No text could be extracted from this image."}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ─── HOME / IDLE VIEW ─────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full bg-background animate-fade-in">
      <div className="flex-1 flex flex-col items-center justify-center gap-8 p-8">
        {/* Icon & Logo */}
        <div className="relative group">
          <div className="absolute -inset-4 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/30 transition-all animate-pulse" />
          <div className="relative w-32 h-32 bg-primary rounded-[40px] flex items-center justify-center shadow-2xl shadow-primary/40 rotate-3 group-hover:rotate-0 transition-transform duration-500">
            <ScanLine className="w-16 h-16 text-white" />
          </div>
          <Sparkles className="absolute -top-2 -right-2 w-10 h-10 text-amber-400 animate-float" />
        </div>

        <div className="text-center space-y-3">
          <h2 className="text-3xl font-black text-foreground tracking-tight">
            Scanner Intelligence
          </h2>
          <p className="text-sm text-text-muted font-medium max-w-[280px] leading-relaxed mx-auto">
            Point your camera at any cosmetic label. We support <span className="text-foreground font-bold">Thai, English, and Chinese</span> automatically.
          </p>
        </div>

        {/* OCR Language Selector */}
        <div className="w-full max-w-[340px] space-y-4">
          <div className="flex items-center justify-center gap-2">
            <div className="h-px bg-border flex-1" />
            <span className="text-[9px] font-black text-text-muted uppercase tracking-[0.3em]">Recognition Mode</span>
            <div className="h-px bg-border flex-1" />
          </div>
          
          <div className="grid grid-cols-2 gap-2.5">
            {LANG_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSelectedLang(opt.value)}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-xs font-black transition-all border ${
                  selectedLang === opt.value
                    ? "bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-900/30 ring-2 ring-primary/20"
                    : "bg-surface border-border text-text-muted hover:border-primary/40"
                }`}
              >
                <span className="text-xl group-hover:scale-125 transition-transform">{opt.flag}</span>
                <span className="uppercase tracking-tighter">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Actions */}
        <div className="flex flex-col gap-4 w-full max-w-[340px] pt-4">
          <button
            onClick={() => setMode("live")}
            className="group flex items-center justify-center gap-4 px-8 py-5 bg-primary text-white rounded-3xl font-black text-base transition-all active:scale-95 shadow-2xl shadow-primary/40 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <Video className="w-6 h-6" />
            <span className="uppercase tracking-widest">Start Live Vision</span>
            <div className="ml-auto w-3 h-3 bg-white rounded-full animate-ping" />
          </button>

          <label className="flex items-center justify-center gap-4 px-8 py-5 bg-surface text-foreground border-2 border-border rounded-3xl font-black text-sm cursor-pointer hover:border-primary/50 hover:bg-surface-2 transition-all active:scale-95 shadow-lg shadow-black/5">
            <Upload className="w-5 h-5 text-primary" />
            <span className="uppercase tracking-widest">Upload From Gallery</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>

          <button
            onClick={() => setShowManual(!showManual)}
            className="flex items-center justify-center gap-4 px-8 py-4 bg-surface-2 text-text-muted border border-border rounded-2xl font-black text-xs hover:bg-surface transition-all active:scale-95 group"
          >
            <FileText className="w-4 h-4 group-hover:text-primary transition-colors" />
            <span className="uppercase tracking-[0.2em]">Paste Ingredients</span>
            <ChevronRight
              className={`w-4 h-4 ml-auto transition-transform ${showManual ? "rotate-90 text-primary" : ""}`}
            />
          </button>
        </div>

        {showManual && (
          <div className="w-full max-w-[340px] space-y-4 animate-scale-in">
            <div className="relative">
              <textarea
                value={manualText}
                onChange={(e) => setManualText(e.target.value)}
                placeholder="Paste ingredient list here... (comma separated)"
                rows={6}
                className="w-full p-5 bg-surface border-2 border-border rounded-3xl text-sm font-medium resize-none focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all shadow-inner"
              />
              {manualText && (
                <button 
                  onClick={() => setManualText("")}
                  className="absolute top-4 right-4 p-1.5 bg-surface-2 rounded-lg text-text-muted hover:text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              onClick={handleManualAnalyze}
              disabled={!manualText.trim()}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] disabled:opacity-20 disabled:grayscale transition-all shadow-xl shadow-slate-900/20 active:scale-95"
            >
              Analyze Batch
            </button>
          </div>
        )}
      </div>

      {/* Pro Tips */}
      <div className="px-5 pb-8">
        <div className="card p-6 bg-teal-500/5 border-teal-500/10 flex items-start gap-4 animate-slide-up" style={{ animationDelay: "0.5s" }}>
          <div className="p-2.5 bg-teal-500 text-white rounded-2xl shadow-lg shadow-teal-500/30">
            <Info className="w-5 h-5" />
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-black text-teal-600 uppercase tracking-widest">Scanning Mastery</h4>
            <ul className="text-[11px] text-text-muted font-bold space-y-2 uppercase tracking-tighter opacity-80">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-teal-500 rounded-full" />
                Keep label flat for better OCR
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-teal-500 rounded-full" />
                Natural daylight works best
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-teal-500 rounded-full" />
                Check Personal Profile for custom alerts
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
