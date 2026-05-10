"use client";

import Link from "next/link";
import {
  ScanLine,
  Search,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  FlaskConical,
  Video,
  History,
  Sparkles,
  ArrowRight,
  User,
} from "lucide-react";
import { useState, useEffect } from "react";
import { inciDatabase } from "@/lib/inci";

export default function Home() {
  const euAllergenCount = inciDatabase.filter(ing => ing.euAllergen).length;
  const highRiskCount = inciDatabase.filter(ing => ing.safetyProfile === "danger").length;

  const [stats, setStats] = useState([
    { label: "INCI Entries", value: inciDatabase.length.toString(), icon: FlaskConical, color: "text-teal-600 bg-teal-50" },
    { label: "EU Allergens",  value: euAllergenCount.toString(),  icon: AlertTriangle, color: "text-amber-500 bg-amber-50"   },
    { label: "Banned/Risk",   value: highRiskCount.toString(),  icon: ShieldAlert,   color: "text-red-500 bg-red-50"          },
  ]);

  const [recentScans, setRecentScans] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("scanHistory");
    if (saved) {
      setRecentScans(JSON.parse(saved).slice(0, 3));
    } else {
      // Default placeholder if none
      setRecentScans([
        { emoji: "🧴", name: "Face Cleanser",      count: 12, status: "safe",    time: "2d ago" },
        { emoji: "🧴", name: "Moisturizing Cream", count: 24, status: "caution", time: "5d ago" },
        { emoji: "💄", name: "Tinted SPF50",       count: 31, status: "danger",  time: "1w ago" },
      ]);
    }
  }, []);

  return (
    <div className="p-5 space-y-8 animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-[32px] bg-slate-900 p-7 text-white shadow-2xl">
        {/* Animated background elements */}
        <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-teal-500/20 rounded-full blur-[80px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-48 h-48 bg-cyan-500/20 rounded-full blur-[60px]" />
        
        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/10 animate-slide-up">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-100">
              AI-Powered Recognition
            </span>
          </div>

          <div className="space-y-3 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <h2 className="text-3xl font-black leading-tight tracking-tight">
              Analyze your <br/>
              <span className="bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent">skincare safety</span>
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed max-w-[280px]">
              Scan product labels in <span className="text-white font-medium">TH · EN · CN</span> to reveal hidden allergens and toxic ingredients.
            </p>
          </div>

          <div className="flex gap-3 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <Link
              href="/scan"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-500 text-white px-5 py-3.5 rounded-2xl font-bold text-sm transition-all active:scale-95 shadow-lg shadow-teal-500/30"
            >
              <Video className="w-4 h-4" />
              Live Scan
            </Link>
            <Link
              href="/scan"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-5 py-3.5 rounded-2xl font-bold text-sm transition-all active:scale-95 border border-white/10"
            >
              <ScanLine className="w-4 h-4" />
              Upload
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3 animate-slide-up" style={{ animationDelay: "0.3s" }}>
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className="card p-3.5 flex flex-col items-center text-center gap-2 bg-surface"
          >
            <div className={`p-2.5 rounded-2xl ${stat.color} mb-1`}>
              <stat.icon className="w-4.5 h-4.5" />
            </div>
            <div className="space-y-0.5">
              <span className="font-black text-xl leading-none block text-foreground">{stat.value}</span>
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-tight leading-tight">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Personal Health Callout */}
      <Link href="/profile" className="block animate-slide-up" style={{ animationDelay: "0.4s" }}>
        <div className="card p-5 bg-gradient-to-br from-indigo-500 to-purple-600 border-none text-white relative overflow-hidden group hover:scale-[1.02] transition-transform shadow-indigo-500/20">
          <div className="absolute right-[-20px] top-[-20px] w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors" />
          <div className="relative z-10 flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-black text-lg flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Profile
              </h3>
              <p className="text-white/80 text-xs">Set your specific allergens for automatic warnings.</p>
            </div>
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        </div>
      </Link>

      {/* Multilingual Support */}
      <section className="space-y-4 animate-slide-up" style={{ animationDelay: "0.5s" }}>
        <div className="flex items-center justify-between">
          <h3 className="font-black text-lg text-foreground px-1">Language OCR</h3>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { flag: "🇹🇭", label: "ไทย", desc: "Thai labels" },
            { flag: "🇬🇧", label: "English", desc: "Global INCI" },
            { flag: "🇨🇳", label: "中文", desc: "Chinese labels" },
          ].map((lang) => (
            <div key={lang.flag} className="card p-4 text-center bg-surface border-border">
              <div className="text-3xl mb-2 animate-float">{lang.flag}</div>
              <p className="text-[11px] font-black text-foreground">{lang.label}</p>
              <p className="text-[9px] text-text-muted font-medium">{lang.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Access */}
      <section className="grid grid-cols-2 gap-4 animate-slide-up" style={{ animationDelay: "0.6s" }}>
        <Link
          href="/search"
          className="group card p-5 bg-surface hover:border-primary/30 transition-all"
        >
          <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform mb-4">
            <Search className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <p className="font-black text-sm text-foreground">Search INCI</p>
            <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider mt-1">Database</p>
          </div>
        </Link>
        <Link
          href="/history"
          className="group card p-5 bg-surface hover:border-primary/30 transition-all"
        >
          <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform mb-4">
            <History className="w-6 h-6 text-purple-500" />
          </div>
          <div>
            <p className="font-black text-sm text-foreground">Scan History</p>
            <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider mt-1">Records</p>
          </div>
        </Link>
      </section>

      {/* Safety Legend */}
      <section className="card p-5 bg-surface animate-slide-up" style={{ animationDelay: "0.7s" }}>
        <h3 className="font-black text-base text-foreground mb-4">Safety Guide</h3>
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center gap-4 group">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-teal-500 group-hover:text-white transition-all">
              <ShieldCheck className="w-5 h-5 text-teal-500 group-hover:text-white" />
            </div>
            <div>
              <p className="text-xs font-black text-foreground">Safe Ingredient</p>
              <p className="text-[10px] font-medium text-text-muted">Approved & well-tolerated</p>
            </div>
          </div>
          <div className="flex items-center gap-4 group">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-500 group-hover:text-white transition-all">
              <AlertTriangle className="w-5 h-5 text-amber-500 group-hover:text-white" />
            </div>
            <div>
              <p className="text-xs font-black text-foreground">Cautionary</p>
              <p className="text-[10px] font-medium text-text-muted">May react on sensitive skin</p>
            </div>
          </div>
          <div className="flex items-center gap-4 group">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-red-500 group-hover:text-white transition-all">
              <ShieldAlert className="w-5 h-5 text-red-500 group-hover:text-white" />
            </div>
            <div>
              <p className="text-xs font-black text-foreground">Risk Found</p>
              <p className="text-[10px] font-medium text-text-muted">Known irritant or allergen</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="text-center py-6 animate-fade-in" style={{ animationDelay: "1s" }}>
        <p className="text-[10px] font-black text-text-muted/50 uppercase tracking-[0.2em] leading-relaxed">
          AllergiAI · Cosmetic Intelligence
          <br />
          Ref: EU 1223/2009 Standards
        </p>
      </footer>
    </div>
  );
}
