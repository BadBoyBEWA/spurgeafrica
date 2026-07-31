"use client";

import Link from "next/link";
import { Eye, Heart, ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/data";
import { formatPrice } from "@/lib/data";
import { useCart } from "@/components/Providers";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const productHref = `/products/${product.slug || product.id}`;

  return (
    <article className="group relative overflow-hidden border hairline bg-black/10 light:bg-white/45">
      <Link href={productHref} className="block">
        <div className="relative aspect-[4/5] overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
          <button
            aria-label={`Add ${product.name} to wishlist`}
            className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-night/70 text-cream backdrop-blur transition hover:bg-gold hover:text-night"
          >
            <Heart size={17} />
          </button>
          {/* Stock Badge */}
          <div className="absolute left-3 top-3">
            {product.stock !== undefined && product.stock > 5 ? (
              <span className="flex items-center gap-1.5 rounded-full bg-green-500/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-green-400 backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400" /> In Stock
              </span>
            ) : product.stock !== undefined && product.stock > 0 ? (
              <span className="flex items-center gap-1.5 rounded-full bg-amber-500/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-amber-400 backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" /> Low Stock
              </span>
            ) : (
              <span className="flex items-center gap-1.5 rounded-full bg-blue-500/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-blue-400 backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400" /> Made to Order
              </span>
            )}
          </div>
          <div className="absolute inset-x-3 bottom-3 flex translate-y-16 gap-2 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <button
              type="button"
              onClick={event => {
                event.preventDefault();
                addItem({ id: product.id, name: product.name, price: product.price, image: product.image });
              }}
              className="flex flex-1 items-center justify-center gap-2 bg-gold px-3 py-3 text-xs font-bold uppercase tracking-[.18em] text-night"
            >
              <ShoppingBag size={15} />
              Quick Add
            </button>
            <span className="grid w-12 place-items-center border border-white/25 bg-night/75 text-cream backdrop-blur">
              <Eye size={16} />
            </span>
          </div>
        </div>
      </Link>
      <div className="p-4">
        <p className="font-display text-[11px] uppercase tracking-[.22em] text-gold">{product.category}</p>
        <Link href={productHref} className="mt-2 block font-serif text-xl hover:text-gold">
          {product.name}
        </Link>
        <p className="mt-2 text-sm text-muted">{formatPrice(product.price)}</p>
        {/* Delivery Timeline */}
        <p className="mt-1.5 text-[10px] text-muted">
          {product.stock !== undefined && product.stock > 5
            ? "Ships in 3\u20137 days"
            : product.stock !== undefined && product.stock > 0
            ? "Ships in 5\u201310 days"
            : "Made to order \u2022 2\u20133 weeks"}
        </p>
      </div>
    </article>
  );
}
