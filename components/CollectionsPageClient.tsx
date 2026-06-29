"use client";

import { useEffect, useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/lib/data";

const filters = {
  category: ["All", "Agbada", "Senator", "Kaftan", "Casual"],
  price: ["All", "Under 100k", "100k-200k", "Over 200k"],
  color: ["All", "Gold", "Emerald", "Terracotta", "Black", "Cream", "Navy"],
  fabric: ["All", "Ankara", "Cashmere", "Lace", "Guinea Brocade", "Senator Material"],
  occasion: ["All", "Wedding", "Corporate", "Casual", "Traditional", "Luxury"]
};

type CollectionsPageClientProps = {
  categoryFromQuery: string;
  occasionFromQuery: string;
};

export function CollectionsPageClient({ categoryFromQuery, occasionFromQuery }: CollectionsPageClientProps) {
  const [selected, setSelected] = useState<Record<string, string>>({
    category: categoryFromQuery,
    price: "All",
    color: "All",
    fabric: "All",
    occasion: occasionFromQuery
  });
  const [sort, setSort] = useState("Newest");

  useEffect(() => {
    setSelected(current => ({ ...current, category: categoryFromQuery, occasion: occasionFromQuery }));
  }, [categoryFromQuery, occasionFromQuery]);

  const filtered = useMemo(() => {
    let next = products.filter(product =>
      Object.entries(selected).every(([key, value]) => {
        if (value === "All") return true;
        if (key === "price") {
          if (value === "Under 100k") return product.price < 100000;
          if (value === "100k-200k") return product.price >= 100000 && product.price <= 200000;
          return product.price > 200000;
        }
        return String(product[key as keyof typeof product]).includes(value);
      })
    );

    if (sort === "Price Low-High") next = [...next].sort((a, b) => a.price - b.price);
    if (sort === "Price High-Low") next = [...next].sort((a, b) => b.price - a.price);
    if (sort === "Popular") next = [...next].reverse();

    return next;
  }, [selected, sort]);

  return (
    <main className="px-4 pb-20 pt-32 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-5 border-b hairline pb-8 md:flex-row md:items-end">
          <div>
            <p className="font-display text-xs uppercase tracking-[.28em] text-gold">Shop</p>
            <h1 className="mt-3 font-serif text-5xl">Collections</h1>
          </div>
          <label className="flex items-center gap-3 border hairline px-4 py-3">
            Sort
            <select value={sort} onChange={event => setSort(event.target.value)} className="bg-transparent outline-none">
              {["Newest", "Popular", "Price Low-High", "Price High-Low"].map(option => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="glass h-fit p-5">
            <h2 className="flex items-center gap-2 font-display text-xs uppercase tracking-[.24em] text-gold">
              <SlidersHorizontal size={16} /> Filters
            </h2>
            <div className="mt-6 grid gap-5">
              {Object.entries(filters).map(([key, options]) => (
                <label key={key} className="grid gap-2 text-sm capitalize text-[var(--fg)]">
                  {key}
                  <select
                    value={selected[key]}
                    onChange={event => setSelected(current => ({ ...current, [key]: event.target.value }))}
                    className="border border-[var(--line)] bg-[var(--panel)] px-3 py-3 text-[var(--fg)] outline-none transition focus:border-gold"
                  >
                    {options.map(option => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
          </aside>
          <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </section>
        </div>
      </div>
    </main>
  );
}
