"use client";

import { useRef, useCallback, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { categories } from "@/lib/data";

type CategoryItem = {
  id?: string;
  title: string;
  href: string;
  image: string;
};

const GAP = 24; // matches gap-6 between items

export function CategoryCarousel({ items = categories }: { items?: CategoryItem[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollIndexRef = useRef(0); // Track total scroll position (can exceed item count)
  const [displayCounter, setDisplayCounter] = useState(0); // Counter shown to user

  const displayItems: CategoryItem[] = (items && items.length > 0 ? items : categories) as CategoryItem[];
  
  // Create an infinite carousel by repeating items 3 times
  const infiniteItems = [...displayItems, ...displayItems, ...displayItems];

  // Measure the actual width of one item (including its gap)
  const getItemWidth = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return 0;
    const first = el.querySelector<HTMLElement>("a");
    if (!first) return 0;
    return first.offsetWidth + GAP;
  }, []);

  const scroll = useCallback((direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const step = getItemWidth();
    if (step <= 0) return;

    if (direction === "right") {
      scrollIndexRef.current += 1;
    } else {
      scrollIndexRef.current -= 1;
    }

    // Calculate the visual counter (0-based, wraps around)
    const counter = ((scrollIndexRef.current % displayItems.length) + displayItems.length) % displayItems.length;
    setDisplayCounter(counter);

    // Scroll by one step in the direction
    if (direction === "right") {
      el.scrollBy({ left: step, behavior: "smooth" });
    } else {
      el.scrollBy({ left: -step, behavior: "smooth" });
    }
  }, [displayItems.length, getItemWidth]);

  return (
    <div className="relative mx-auto max-w-7xl">
      {/* Left arrow */}
      <button
        aria-label="Scroll left"
        onClick={() => scroll("left")}
        className="absolute -left-4 top-1/2 z-10 -translate-y-8 grid h-11 w-11 place-items-center rounded-full bg-night/80 text-cream border border-white/15 backdrop-blur shadow-lg transition hover:border-gold hover:text-gold"
      >
        <ChevronLeft size={22} />
      </button>

      {/* Right arrow */}
      <button
        aria-label="Scroll right"
        onClick={() => scroll("right")}
        className="absolute -right-4 top-1/2 z-10 -translate-y-8 grid h-11 w-11 place-items-center rounded-full bg-night/80 text-cream border border-white/15 backdrop-blur shadow-lg transition hover:border-gold hover:text-gold"
      >
        <ChevronRight size={22} />
      </button>

{/* Scrollable strip */}
      <div
        ref={scrollRef}

        className="flex gap-6 overflow-x-auto snap-x snap-mandatory px-4 pb-8 pt-4 sm:px-6 lg:px-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
      {infiniteItems.map((category, index) => (
          <Link
            key={`${index}-${category.id || category.title}`}
            href={category.href}
            className="group flex-shrink-0 snap-start flex flex-col items-center gap-4"
          >
            <div className="relative h-48 w-48 overflow-hidden rounded-full border border-white/10 shadow-[0_28px_90px_rgba(0,0,0,.32)] bg-white md:h-60 md:w-60">
              <Image
                src={category.image}
                alt={category.title}
                fill
                sizes="(max-width: 1024px) 200px, 260px"
                className="object-contain transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
            <h3 className="font-serif text-lg text-[var(--fg)] transition group-hover:text-gold">
              {category.title}
            </h3>
          </Link>
        ))}
      </div>

      {/* Counter Below */}
      <div className="mt-8 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="font-display text-sm tracking-[.22em] text-gold">
          {String(displayCounter + 1).padStart(2, "0")} / {String(displayItems.length).padStart(2, "0")}
        </div>
      </div>
    </div>
  );
}
