"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ScanLine, Search, User, History, Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/history", icon: History, label: "History" },
    { href: "/search", icon: Search, label: "Search" },
    { href: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <html lang="en" className="light">
      <head>
        <title>AllergiScan — Ingredient Safety Scanner</title>
        <meta name="description" content="Scan cosmetic labels in Thai, English, and Chinese to identify allergens and INCI ingredients instantly." />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </head>
      <body className={`${inter.className} bg-background text-foreground transition-colors duration-300`}>
        <div className="max-w-md mx-auto min-h-screen bg-surface shadow-2xl relative overflow-hidden flex flex-col noise">
          {/* Header */}
          <header className="bg-surface/80 backdrop-blur-md sticky top-0 z-30 px-5 py-4 border-b border-border flex items-center justify-between shadow-sm">
            <h1 className="text-2xl font-black bg-gradient-to-r from-teal-600 to-cyan-500 bg-clip-text text-transparent tracking-tighter">
              AllergiScan
            </h1>
          </header>

          {/* Content */}
          <main className="flex-1 overflow-y-auto pb-32">
            <div className="animate-fade-in h-full">
              {children}
            </div>
          </main>

          {/* Bottom Navigation */}
          <nav className="fixed bottom-0 w-full md:absolute max-w-md bg-surface/90 backdrop-blur-xl border-t border-border px-6 pt-3 pb-safe flex justify-between items-center z-40">
            {navItems.slice(0, 2).map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link 
                  key={item.href} 
                  href={item.href} 
                  className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${isActive ? "text-primary scale-110" : "text-text-muted hover:text-primary/70"}`}
                >
                  <item.icon className={`w-6 h-6 ${isActive ? "stroke-[2.5px]" : "stroke-[2px]"}`} />
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${isActive ? "opacity-100" : "opacity-60"}`}>{item.label}</span>
                </Link>
              );
            })}

            {/* Floating Scan Button */}
            <div className="relative -top-6">
              <Link 
                href="/scan" 
                className="flex flex-col items-center group"
              >
                <div className={`p-4 rounded-3xl bg-primary text-white shadow-xl shadow-primary/40 group-hover:scale-110 transition-all duration-300 animate-glow-pulse border-4 border-surface ${pathname === "/scan" ? "scale-110" : ""}`}>
                  <ScanLine className="w-8 h-8 stroke-[2.5px]" />
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest mt-2 transition-colors ${pathname === "/scan" ? "text-primary" : "text-text-muted"}`}>Scan</span>
              </Link>
            </div>

            {navItems.slice(2).map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link 
                  key={item.href} 
                  href={item.href} 
                  className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${isActive ? "text-primary scale-110" : "text-text-muted hover:text-primary/70"}`}
                >
                  <item.icon className={`w-6 h-6 ${isActive ? "stroke-[2.5px]" : "stroke-[2px]"}`} />
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${isActive ? "opacity-100" : "opacity-60"}`}>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </body>
    </html>
  );
}
