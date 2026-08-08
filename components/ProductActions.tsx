"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/Providers";

const AVAILABLE_SIZES = ["S", "M", "L", "XL", "XXL", "Custom"];

export function ProductActions({
  product
}: {
  product: { id: string; name: string; price: number; image: string };
}) {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState("M");

  return (
    <div className="mt-6 space-y-5">
      {/* Size Selection */}
      <div>
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-[.22em] text-cream">
            Select Size: <span className="text-gold font-bold">{selectedSize}</span>
          </label>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {AVAILABLE_SIZES.map((size) => {
            const isSelected = selectedSize === size;
            return (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                className={`min-w-[48px] px-3.5 py-2 text-xs font-semibold uppercase tracking-wider transition-all rounded-sm border ${
                  isSelected
                    ? "border-gold bg-gold text-night font-bold shadow-md shadow-gold/20"
                    : "border-white/15 bg-zinc-900/60 text-zinc-300 hover:border-gold/50 hover:text-white"
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          onClick={() => addItem({ ...product, size: selectedSize })}
          className="bg-gold px-7 py-4 font-display text-xs uppercase tracking-[.22em] text-night transition hover:bg-[#f0d172]"
        >
          Add to Cart ({selectedSize})
        </button>
        <Link
          href="/tailoring"
          className="border hairline px-7 py-4 text-center font-display text-xs uppercase tracking-[.22em] transition hover:border-gold hover:text-gold"
        >
          Customize This Style
        </Link>
      </div>
    </div>
  );
}
