"use client";

import Link from "next/link";
import { Minus, Plus, Tag, Trash2, X } from "lucide-react";
import { formatPrice } from "@/lib/data";
import { useCart } from "@/components/Providers";

export function CartDrawer() {
  const { isCartOpen, closeCart, items, updateQuantity, removeItem, subtotal } = useCart();

  return (
    <div className={`fixed inset-0 z-[60] transition ${isCartOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
      <div
        className={`absolute inset-0 bg-black/65 transition-opacity ${isCartOpen ? "opacity-100" : "opacity-0"}`}
        onClick={closeCart}
      />
      <aside
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-night p-5 text-cream shadow-soft transition-transform duration-500 ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Shopping cart"
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <p className="font-display text-xs uppercase tracking-[.24em] text-gold">Cart</p>
            <h2 className="font-serif text-3xl">Selected pieces</h2>
          </div>
          <button aria-label="Close cart" onClick={closeCart} className="grid h-10 w-10 place-items-center rounded-full border border-white/15">
            <X size={18} />
          </button>
        </div>
        <div className="mt-5 flex max-h-[52vh] flex-col gap-4 overflow-auto pr-1">
          {items.length === 0 && (
            <div className="rounded-sm border border-white/10 p-6 text-sm text-white/65">
              Your cart is waiting for something tailored.
            </div>
          )}
          {items.map(item => (
            <div key={item.id} className="grid grid-cols-[76px_1fr] gap-4 border-b border-white/10 pb-4">
              <img src={item.image} alt="" className="h-24 w-full object-cover" />
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="mt-1 text-sm text-white/60">{formatPrice(item.price)}</p>
                  </div>
                  <button aria-label={`Remove ${item.name}`} onClick={() => removeItem(item.id)} className="text-white/55 hover:text-terracotta">
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <button aria-label="Decrease quantity" onClick={() => updateQuantity(item.id, item.quantity - 1)} className="grid h-8 w-8 place-items-center border border-white/15">
                    <Minus size={14} />
                  </button>
                  <span className="grid h-8 min-w-10 place-items-center border border-white/15 text-sm">{item.quantity}</span>
                  <button aria-label="Increase quantity" onClick={() => updateQuantity(item.id, item.quantity + 1)} className="grid h-8 w-8 place-items-center border border-white/15">
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <label className="mt-6 flex items-center gap-2 border border-white/15 px-3 py-3 text-sm text-white/70">
          <Tag size={16} />
          <input placeholder="Coupon code" className="w-full bg-transparent outline-none placeholder:text-white/40" />
        </label>
        <div className="mt-6 border-t border-white/10 pt-5">
          <div className="flex justify-between text-lg">
            <span>Subtotal</span>
            <strong>{formatPrice(subtotal)}</strong>
          </div>
          <Link href="/checkout" onClick={closeCart} className="mt-5 block bg-gold px-5 py-4 text-center font-display text-xs uppercase tracking-[.22em] text-night transition hover:bg-terracotta hover:text-cream">
            Checkout
          </Link>
        </div>
      </aside>
    </div>
  );
}
