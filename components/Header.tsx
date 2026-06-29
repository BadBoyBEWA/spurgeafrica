"use client";

import Link from "next/link";
import { Menu, Moon, ShoppingBag, Sun, X } from "lucide-react";
import { useEffect, useState } from "react";
import { navLinks } from "@/lib/data";
import { useCart, useThemeMode } from "@/components/Providers";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { count, openCart } = useCart();
  const { theme, setTheme } = useThemeMode();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b hairline transition-all duration-300 ${
        scrolled ? "bg-night/78 py-3 backdrop-blur-xl light:bg-cream/88" : "bg-transparent py-5"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8" aria-label="Primary navigation">
        <Link href="/" className="font-serif text-2xl tracking-wide">
          Spurge <span className="text-gold">Africa</span>
        </Link>
        <div className="hidden items-center gap-7 lg:flex">
          {navLinks.map(([label, href]) => (
            <Link key={href} href={href} className="font-display text-xs uppercase tracking-[.22em] text-muted transition hover:text-gold">
              {label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            aria-label="Toggle color mode"
            className="grid h-10 w-10 place-items-center rounded-full border hairline transition hover:border-gold hover:text-gold"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            aria-label="Open cart"
            className={`relative grid h-10 w-10 place-items-center rounded-full border hairline transition hover:border-gold hover:text-gold ${count ? "animate-pulseCart" : ""}`}
            onClick={openCart}
          >
            <ShoppingBag size={18} />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-[11px] font-bold text-night">
                {count}
              </span>
            )}
          </button>
          <button
            aria-label="Open menu"
            className="grid h-10 w-10 place-items-center rounded-full border hairline lg:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={19} />
          </button>
        </div>
      </nav>
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-night/96 p-5 text-cream lg:hidden">
          <div className="flex items-center justify-between">
            <span className="font-serif text-2xl">Spurge Africa</span>
            <button aria-label="Close menu" onClick={() => setMobileOpen(false)} className="grid h-10 w-10 place-items-center rounded-full border border-white/15">
              <X size={20} />
            </button>
          </div>
          <div className="mt-12 grid gap-6">
            {navLinks.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="border-b border-white/10 pb-4 font-serif text-3xl"
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
