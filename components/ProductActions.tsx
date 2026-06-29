"use client";

import Link from "next/link";
import { useCart } from "@/components/Providers";

export function ProductActions({
  product
}: {
  product: { id: string; name: string; price: number; image: string };
}) {
  const { addItem } = useCart();

  return (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
      <button
        onClick={() => addItem(product)}
        className="bg-gold px-7 py-4 font-display text-xs uppercase tracking-[.22em] text-night"
      >
        Add to Cart
      </button>
      <Link href="/tailoring" className="border hairline px-7 py-4 text-center font-display text-xs uppercase tracking-[.22em] hover:border-gold hover:text-gold">
        Customize This Style
      </Link>
    </div>
  );
}
