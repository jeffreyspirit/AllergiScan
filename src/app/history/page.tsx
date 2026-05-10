"use client";

import { useState, useEffect } from "react";
import { History, Trash2, Calendar, ShieldCheck, AlertTriangle, ShieldAlert, ChevronRight, FlaskConical, Search } from "lucide-react";
import Link from "next/link";

export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const saved = localStorage.getItem("scanHistory");
    if (saved) {
      setHistory(JSON.parse(saved).reverse()); // Newest first
    }
  }, []);

  const clearHistory = () => {
    if (confirm("Clear all scan history?")) {
      setHistory([]);
      localStorage.removeItem("scanHistory");
    }
  };

  const filteredHistory = history.filter(item => {
    if (filter === "all") return true;
    return item.status === filter;
  });

  return (
    <div className="p-5 space-y-6 animate-fade-in pb-20">
      <header className="flex items-center justify-between py-2">
        <div>
          <h2 className="text-2xl font-black text-foreground">Scan History</h2>
          <p className="text-text-muted text-xs font-bold uppercase tracking-widest mt-1">
            {history.length} records saved
          </p>
        </div>
        {history.length > 0 && (
          <button 
            onClick={clearHistory}
            className="p-3 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all active:scale-95 shadow-sm"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </header>

      {history.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {["all", "safe", "caution", "danger"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                filter === f
                  ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                  : "bg-surface border-border text-text-muted hover:border-primary/40"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-4">
        {filteredHistory.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <div className="w-20 h-20 bg-surface-2 rounded-full flex items-center justify-center mx-auto border-2 border-dashed border-border">
              <History className="w-10 h-10 text-text-muted/30" />
            </div>
            <div className="space-y-1">
              <p className="font-black text-foreground">No records found</p>
              <p className="text-xs text-text-muted font-medium">Your scan results will appear here.</p>
            </div>
            <Link 
              href="/scan" 
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
            >
              Start Scanning
            </Link>
          </div>
        ) : (
          filteredHistory.map((item, i) => (
            <div 
              key={i} 
              className="card p-4 bg-surface border-border flex items-center gap-4 group hover:border-primary/40 transition-all animate-slide-up"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="w-14 h-14 bg-surface-2 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform flex-shrink-0">
                {item.emoji || "🧴"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                   <h4 className="font-black text-sm text-foreground truncate pr-2">{item.name}</h4>
                   <span className="text-[9px] font-black text-text-muted opacity-50 uppercase tracking-tighter flex items-center gap-1">
                     <Calendar className="w-2.5 h-2.5" />
                     {item.time}
                   </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-text-muted">
                    <FlaskConical className="w-3 h-3" />
                    {item.count} ingredients
                  </div>
                  <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-tighter ${
                    item.status === 'safe' ? 'text-teal-500' : 
                    item.status === 'caution' ? 'text-amber-500' : 'text-red-500'
                  }`}>
                    {item.status === 'safe' ? <ShieldCheck className="w-3 h-3" /> : 
                     item.status === 'caution' ? <AlertTriangle className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />}
                    {item.status}
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-text-muted opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </div>
          ))
        )}
      </div>

      {history.length > 0 && (
         <div className="card p-5 bg-teal-500/5 border-teal-500/10 flex items-start gap-4">
            <Search className="w-6 h-6 text-teal-500 mt-1" />
            <div className="space-y-1">
              <p className="text-sm font-black text-teal-600">Smart Persistence</p>
              <p className="text-xs text-text-muted font-medium leading-relaxed">
                Your history is stored locally on this device. Clearing your browser data will remove these records.
              </p>
            </div>
         </div>
      )}
    </div>
  );
}
