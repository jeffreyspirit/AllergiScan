"use client";

import { useState, useEffect } from "react";
import { User, Plus, X, ShieldAlert, Sparkles, Save, Trash2 } from "lucide-react";
import { inciDatabase } from "@/lib/inci";

export default function ProfilePage() {
  const [personalAllergens, setPersonalAllergens] = useState<string[]>([]);
  const [newAllergen, setNewAllergen] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedAllergens = localStorage.getItem("personalAllergens");
    if (savedAllergens) {
      setPersonalAllergens(JSON.parse(savedAllergens));
    }
  }, []);

  const handleAdd = (name: string) => {
    const cleanName = name.trim().toUpperCase();
    if (cleanName && !personalAllergens.includes(cleanName)) {
      const updated = [...personalAllergens, cleanName];
      setPersonalAllergens(updated);
      localStorage.setItem("personalAllergens", JSON.stringify(updated));
      setNewAllergen("");
      setSuggestions([]);
      showSavedFeedback();
    }
  };

  const handleRemove = (name: string) => {
    const updated = personalAllergens.filter(a => a !== name);
    setPersonalAllergens(updated);
    localStorage.setItem("personalAllergens", JSON.stringify(updated));
    showSavedFeedback();
  };

  const showSavedFeedback = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleInputChange = (val: string) => {
    setNewAllergen(val);
    if (val.length > 1) {
      const filtered = inciDatabase
        .filter(ing => ing.name.toLowerCase().includes(val.toLowerCase()))
        .slice(0, 5)
        .map(ing => ing.name);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  return (
    <div className="p-5 space-y-8 animate-fade-in pb-20">
      <header className="space-y-2 text-center py-4">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-surface shadow-xl shadow-primary/20">
          <User className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-2xl font-black text-foreground">Personal Health Profile</h2>
        <p className="text-text-muted text-sm px-10">Manage your custom allergens to get instant alerts during scans.</p>
      </header>

      <section className="card p-6 bg-surface space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-lg flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-500" />
            My Allergens
          </h3>
          <span className="text-[10px] font-black bg-red-500/10 text-red-500 px-2 py-1 rounded-full uppercase tracking-wider">
            {personalAllergens.length} active
          </span>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={newAllergen}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd(newAllergen)}
              placeholder="Add ingredient name..."
              className="w-full px-5 py-4 bg-surface-2 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm font-medium"
            />
            <button
              onClick={() => handleAdd(newAllergen)}
              className="absolute right-2 top-2 p-3 bg-primary text-white rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/30"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {suggestions.length > 0 && (
            <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-xl animate-scale-in">
              {suggestions.map(s => (
                <button
                  key={s}
                  onClick={() => handleAdd(s)}
                  className="w-full text-left px-5 py-3 hover:bg-surface-2 text-sm font-bold border-b border-border last:border-0 flex items-center justify-between group"
                >
                  {s}
                  <Plus className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-2 pt-2">
            {personalAllergens.length === 0 ? (
              <div className="w-full py-8 text-center bg-surface-2 rounded-2xl border-2 border-dashed border-border">
                <Sparkles className="w-8 h-8 text-text-muted/30 mx-auto mb-2" />
                <p className="text-xs font-bold text-text-muted">No allergens added yet.</p>
              </div>
            ) : (
              personalAllergens.map(a => (
                <div
                  key={a}
                  className="flex items-center gap-2 px-4 py-2.5 bg-red-500/5 border border-red-500/20 rounded-xl group animate-scale-in"
                >
                  <span className="text-xs font-black text-red-600">{a}</span>
                  <button
                    onClick={() => handleRemove(a)}
                    className="p-1 hover:bg-red-500/10 rounded-md transition-colors"
                  >
                    <X className="w-3.5 h-3.5 text-red-400" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="card p-6 bg-surface border-primary/20 bg-primary/5 relative overflow-hidden">
        <div className="absolute right-[-10%] top-[-10%] opacity-10">
          <ShieldAlert className="w-24 h-24 text-primary" />
        </div>
        <div className="relative z-10 space-y-2">
          <h4 className="font-black text-primary text-sm flex items-center gap-2 uppercase tracking-widest">
            <Sparkles className="w-4 h-4" />
            Automatic Alerts
          </h4>
          <p className="text-xs text-text-muted font-medium leading-relaxed">
            When you scan a product, AllergiAI will cross-reference these ingredients and highlight them with a special "Personal Risk" badge.
          </p>
        </div>
      </section>

      {saved && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-badge-pop z-50">
          <Save className="w-4 h-4 text-teal-400" />
          <span className="text-xs font-black uppercase tracking-wider">Profile Updated</span>
        </div>
      )}
      
      <div className="text-center pb-10">
        <button 
           onClick={() => {
             if(confirm("Are you sure you want to clear your allergen profile?")) {
               setPersonalAllergens([]);
               localStorage.removeItem("personalAllergens");
               showSavedFeedback();
             }
           }}
           className="inline-flex items-center gap-2 text-red-500/60 hover:text-red-500 text-[10px] font-black uppercase tracking-widest transition-colors"
        >
          <Trash2 className="w-3 h-3" />
          Reset Profile Data
        </button>
      </div>
    </div>
  );
}
