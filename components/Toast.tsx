"use client";

import { useCart } from "@/components/Providers";

export function Toast() {
  const { toast } = useCart();

  return (
    <div
      aria-live="polite"
      className={`fixed bottom-5 left-1/2 z-[70] -translate-x-1/2 bg-gold px-5 py-3 text-sm font-semibold text-night shadow-glow transition ${
        toast ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
    >
      {toast}
    </div>
  );
}
