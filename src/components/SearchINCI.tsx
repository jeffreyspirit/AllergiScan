"use client";

import { useState, useEffect } from "react";
import { Search as SearchIcon, CheckCircle2, AlertTriangle, ShieldAlert, FlaskConical, X, Info, ChevronDown } from "lucide-react";
import { inciDatabase, Ingredient } from "@/lib/inci";

const categories = ["All", "Solvent", "Humectant", "Emollient", "Emulsifier", "Active", "Acid", "Preservative", "Surfactant", "Fragrance", "Sunscreen", "Colorant", "Thickener"];
const safetyFilters = ["All", "Safe", "Caution", "Risk", "Personal"];

export default function SearchINCI() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [safetyFilter, setSafetyFilter] = useState("All");
  const [personalAllergens, setPersonalAllergens] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("personalAllergens");
    if (saved) setPersonalAllergens(JSON.parse(saved));
  }, []);

  const results = inciDatabase.filter((ing) => {
    const isPersonal = personalAllergens.some(a => a.toUpperCase() === ing.name.toUpperCase());
    
    const matchesQuery =
      !query.trim() ||
      ing.name.toLowerCase().includes(query.toLowerCase()) ||
      ing.description.toLowerCase().includes(query.toLowerCase()) ||
      ing.functions.some((f) => f.toLowerCase().includes(query.toLowerCase()));

    const matchesCategory = activeCategory === "All" || ing.category === activeCategory;

    const matchesSafety =
      safetyFilter === "All" ||
      (safetyFilter === "Safe" && ing.safetyProfile === "safe") ||
      (safetyFilter === "Caution" && ing.safetyProfile === "caution") ||
      (safetyFilter === "Risk" && ing.safetyProfile === "danger") ||
      (safetyFilter === "Personal" && isPersonal);

    return matchesQuery && matchesCategory && matchesSafety;
  });

  return (
    <div className="flex flex-col h-full bg-background animate-fade-in">
      {/* Search Bar & Primary Filters */}
      <div className="px-5 pt-6 pb-4 space-y-5 bg-surface/80 backdrop-blur-xl border-b border-border sticky top-0 z-20">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-colors group-focus-within:text-primary">
            <SearchIcon className="h-5 w-5 text-text-muted" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by INCI name, function, or category..."
            className="w-full pl-12 pr-12 py-4 bg-surface-2 border border-border rounded-[20px] focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/50 transition-all text-sm font-medium shadow-inner"
          />
          {query && (
            <button 
              onClick={() => setQuery("")}
              className="absolute inset-y-0 right-0 pr-5 flex items-center text-text-muted hover:text-primary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="space-y-3">
           <div className="flex items-center justify-between px-1">
             <span className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em]">Safety Profile</span>
           </div>
           <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {safetyFilters.map((f) => (
              <button
                key={f}
                onClick={() => setSafetyFilter(f)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                  safetyFilter === f
                    ? "bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/20"
                    : "bg-surface border-border text-text-muted hover:border-primary/40"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pt-4 pb-24 scrollbar-hide">
        {/* Category Carousel */}
        <div className="mb-6">
           <div className="flex items-center justify-between px-1 mb-3">
             <span className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em]">Categories</span>
           </div>
           <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeCategory === cat
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "bg-surface-2 border border-transparent text-text-muted hover:bg-surface hover:border-border"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between px-1 mb-4">
          <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">
            {results.length} results matching filter
          </p>
        </div>

        <div className="space-y-4">
          {results.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
              <div className="w-20 h-20 bg-surface-2 rounded-[32px] flex items-center justify-center border-2 border-dashed border-border animate-pulse">
                <FlaskConical className="w-10 h-10 text-text-muted/30" />
              </div>
              <div className="space-y-1">
                <p className="font-black text-foreground uppercase tracking-tight">No ingredients found</p>
                <p className="text-xs text-text-muted font-medium">Try adjusting your filters or search term.</p>
              </div>
              <button
                onClick={() => { setQuery(""); setSafetyFilter("All"); setActiveCategory("All"); }}
                className="px-6 py-3 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/30"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            results.map((ingredient, i) => (
              <IngredientCard 
                key={ingredient.id} 
                ingredient={ingredient} 
                isPersonal={personalAllergens.some(a => a.toUpperCase() === ingredient.name.toUpperCase())}
                index={i}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function IngredientCard({ ingredient, isPersonal, index }: { ingredient: Ingredient; isPersonal: boolean; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`card bg-surface border-border overflow-hidden cursor-pointer hover:scale-[1.01] transition-all animate-slide-up ${
        isPersonal ? "ring-2 ring-red-500/30 border-red-500/30" : ""
      }`}
      style={{ animationDelay: `${Math.min(index * 0.05, 0.5)}s` }}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h4 className="font-black text-base text-foreground tracking-tight truncate max-w-[200px]">
                {ingredient.name}
              </h4>
              <span className="text-[9px] font-black bg-surface-2 text-text-muted px-2 py-0.5 rounded-lg border border-border uppercase tracking-widest">
                {ingredient.category || "General"}
              </span>
              {isPersonal && (
                <span className="px-2 py-0.5 bg-red-600 text-white text-[8px] font-black rounded-lg uppercase tracking-widest animate-badge-pop">
                  Personal Risk
                </span>
              )}
            </div>
            <p className={`text-xs text-text-muted font-medium leading-relaxed transition-all ${expanded ? "" : "line-clamp-2"}`}>
              {ingredient.description}
            </p>
          </div>
          <div className="flex-shrink-0 p-2.5 bg-surface-2 rounded-2xl transition-transform duration-500 group-hover:scale-110">
            {ingredient.safetyProfile === "safe" && <CheckCircle2 className="w-5 h-5 text-teal-500" />}
            {ingredient.safetyProfile === "caution" && <AlertTriangle className="w-5 h-5 text-amber-500" />}
            {ingredient.safetyProfile === "danger" && <ShieldAlert className="w-5 h-5 text-red-500" />}
          </div>
        </div>

        <div className="flex items-center justify-between">
           <div className="flex items-center gap-2">
             {ingredient.cas && (
               <span className="text-[9px] font-bold text-text-muted/40 uppercase tracking-tighter">CAS: {ingredient.cas}</span>
             )}
           </div>
           <div className={`p-1.5 rounded-xl transition-all ${expanded ? "bg-primary/10 text-primary rotate-180" : "bg-surface-2 text-text-muted"}`}>
              <ChevronDown className="w-4 h-4" />
           </div>
        </div>
      </div>

      {expanded && (
        <div className="px-5 pb-5 border-t border-border pt-4 bg-surface-2/50 animate-fade-in space-y-4">
          <div>
            <p className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em] mb-3">Ingredient Functions</p>
            <div className="flex flex-wrap gap-2">
              {ingredient.functions.map((fn) => (
                <span
                  key={fn}
                  className="px-3 py-1.5 bg-surface border border-border text-foreground text-[10px] rounded-xl font-black uppercase tracking-tighter shadow-sm"
                >
                  {fn}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            {ingredient.allergen && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 text-red-600 rounded-xl border border-red-500/20">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span className="text-[10px] font-black uppercase tracking-widest">Known Allergen</span>
              </div>
            )}
            {ingredient.euAllergen && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 text-purple-600 rounded-xl border border-purple-500/20">
                <Info className="w-3.5 h-3.5" />
                <span className="text-[10px] font-black uppercase tracking-widest">EU Regulated</span>
              </div>
            )}
          </div>

          <div className={`p-4 rounded-[20px] flex items-center justify-between ${
            ingredient.safetyProfile === 'safe' ? 'bg-teal-500/10 text-teal-600 border border-teal-500/20' : 
            ingredient.safetyProfile === 'caution' ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20' : 
            'bg-red-500/10 text-red-600 border border-red-500/20'
          }`}>
             <div className="flex items-center gap-3">
               {ingredient.safetyProfile === 'safe' ? <CheckCircle2 className="w-5 h-5" /> : 
                ingredient.safetyProfile === 'caution' ? <AlertTriangle className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
               <span className="text-xs font-black uppercase tracking-[0.1em]">
                 {ingredient.safetyProfile === 'safe' ? 'Safety Level: High' : 
                  ingredient.safetyProfile === 'caution' ? 'Safety Level: Moderate' : 'Safety Level: Low'}
               </span>
             </div>
             <span className="text-[10px] font-bold opacity-60">INCI Verified</span>
          </div>
        </div>
      )}
    </div>
  );
}
