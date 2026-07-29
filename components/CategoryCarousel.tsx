"use client";

import { useRef } from "react";
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

export function CategoryCarousel({ items = categories }: { items?: CategoryItem[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(direction: "left" | "right") {
    if (!scrollRef.current) return;
    const amount = 280;
    scrollRef.current.scrollBy({
      left: direction === "right" ? amount : -amount,
      behavior: "smooth",
    });
  }

  const displayItems: CategoryItem[] = (items && items.length > 0 ? items : categories) as CategoryItem[];

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
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory px-8 pb-8 pt-4 lg:px-0 lg:justify-center [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {displayItems.map((category) => (
          <Link
            key={category.id || category.title}
            href={category.href}
            className="group flex-shrink-0 snap-start flex flex-col items-center gap-4"
          >
            <div className="relative h-48 w-48 overflow-hidden rounded-full border border-white/10 shadow-[0_28px_90px_rgba(0,0,0,.32)] md:h-60 md:w-60">
              <Image
                src={category.image}
                alt={category.title}
                fill
                sizes="(max-width: 1024px) 200px, 260px"
                className="object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              {/* Label inside circle on hover */}
              <span className="absolute bottom-4 left-0 right-0 text-center font-display text-[10px] uppercase tracking-[.22em] text-gold opacity-0 transition duration-300 group-hover:opacity-100">
                Shop →
              </span>
            </div>
            <h3 className="font-serif text-lg text-[var(--fg)] transition group-hover:text-gold">
              {category.title}
            </h3>
          </Link>
        ))}
      </div>
    </div>
  );
}
