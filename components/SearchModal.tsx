"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatPrice, type Product } from "@/lib/data";

export function SearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data);
        }
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onClose();
      router.push(`/collections?search=${encodeURIComponent(query.trim())}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-night/95 text-cream backdrop-blur-2xl animate-fadeIn">
      <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-6 py-6 border-b border-white/10">
        <div className="font-serif text-2xl tracking-wide">
          Search <span className="text-gold">Spurge</span>
        </div>
        <button
          onClick={onClose}
          className="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/5 text-cream transition hover:border-gold hover:text-gold"
          aria-label="Close search"
        >
          <X size={20} />
        </button>
      </div>

      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-6 pt-8 pb-12">
        <form onSubmit={handleSubmit} className="relative w-full">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gold" size={24} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search agbada, senator wear, kaftan, fila..."
            className="w-full rounded-2xl border border-white/15 bg-white/5 py-5 pl-14 pr-12 text-lg text-cream placeholder-cream/40 outline-none transition focus:border-gold focus:ring-1 focus:ring-gold"
          />
          {loading && (
            <Loader2 className="absolute right-5 top-1/2 -translate-y-1/2 animate-spin text-gold" size={22} />
          )}
        </form>

        <div className="mt-8 flex-1 overflow-y-auto pr-2">
          {query.trim() !== "" && !loading && results.length === 0 && (
            <div className="py-16 text-center text-muted">
              <p className="font-serif text-2xl text-cream/70">No results found for &ldquo;{query}&rdquo;</p>
              <p className="mt-2 text-sm">Try searching for &quot;Agbada&quot;, &quot;Senator&quot;, &quot;Fila&quot;, or &quot;Kaftan&quot;.</p>
            </div>
          )}

          {results.length > 0 && (
            <div>
              <p className="font-display text-xs uppercase tracking-[.24em] text-gold mb-4">
                Found {results.length} item{results.length > 1 ? "s" : ""}
              </p>
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.slug || product.id}`}
                    onClick={onClose}
                    className="group flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-3 transition hover:border-gold/50 hover:bg-white/10"
                  >
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover transition duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-[10px] uppercase tracking-[.2em] text-gold">{product.category}</p>
                      <h4 className="truncate font-serif text-base text-cream transition group-hover:text-gold">
                        {product.name}
                      </h4>
                      <p className="mt-1 text-sm font-semibold text-cream/90">{formatPrice(product.price)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {!query.trim() && (
            <div className="mt-6">
              <p className="font-display text-xs uppercase tracking-[.24em] text-cream/60 mb-4">Popular Searches</p>
              <div className="flex flex-wrap gap-2">
                {["Agbada", "Senator Wear", "Kaftan", "Fila", "Pants", "Danshiki", "Gold", "Wedding"].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs uppercase tracking-wider text-cream/80 transition hover:border-gold hover:text-gold"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
