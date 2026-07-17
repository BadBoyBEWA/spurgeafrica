"use client";

import { useMemo, useState } from "react";
import { Bookmark, Search, Send, Share2 } from "lucide-react";
import { lookbook } from "@/lib/data";

const tags = ["All", "Wedding", "Agbada", "Corporate", "Luxury", "Casual", "Celebrity Styles"];

export default function LookbookPage() {
  const [tag, setTag] = useState("All");
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => lookbook.filter(item => (tag === "All" || item.tag === tag) && item.title.toLowerCase().includes(query.toLowerCase())), [tag, query]);

  return (
    <main className="px-4 pb-20 pt-32 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="font-display text-xs uppercase tracking-[.28em] text-gold">Lookbook</p>
        <h1 className="mt-3 font-serif text-5xl">Saved style references</h1>
        <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <label className="flex min-h-12 items-center gap-3 border hairline px-4 lg:w-96">
            <Search size={17} />
            <input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search styles" className="w-full bg-transparent outline-none" />
          </label>
          <div className="flex gap-2 overflow-auto">
            {tags.map(entry => (
              <button key={entry} onClick={() => setTag(entry)} className={`whitespace-nowrap border px-4 py-3 text-sm ${tag === entry ? "border-gold text-gold" : "hairline text-muted"}`}>
                {entry}
              </button>
            ))}
          </div>
        </div>
        <section className="masonry mt-8">
          {filtered.map((item, index) => (
            <article key={`${item.title}-${index}`} className="group relative overflow-hidden border hairline">
              <img src={item.image} alt={item.title} className={`w-full object-cover ${index % 3 === 0 ? "h-[460px]" : "h-[340px]"}`} />
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/85 via-black/20 to-transparent p-5 opacity-0 transition group-hover:opacity-100">
                <p className="font-serif text-2xl text-cream">{item.title}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {[
                    ["Save Style", Bookmark],
                    ["Share Style", Share2],
                    ["Request Similar Outfit", Send]
                  ].map(([label, Icon]) => (
                    <button key={String(label)} className="flex items-center gap-2 bg-cream px-3 py-2 text-xs font-semibold text-night">
                      <Icon size={14} />{String(label)}
                    </button>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
