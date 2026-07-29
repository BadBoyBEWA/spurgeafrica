"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { ArrowUpRight, Pencil, Trash2, AlertTriangle, X, CheckSquare } from "lucide-react";
import { formatPrice } from "@/lib/data";
import { hardDeleteProduct, bulkDeleteProducts } from "./actions";

type Product = {
  id: string;
  slug: string;
  name: string;
  image: string;
  category: string;
  price: number;
  stock: number;
  isActive: boolean;
};

type Props = { products: Product[] };

export function ProductsTable({ products }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [confirmBulk, setConfirmBulk] = useState(false);
  const [isPending, startTransition] = useTransition();

  const allChecked = products.length > 0 && selected.size === products.length;
  const someChecked = selected.size > 0 && !allChecked;

  function toggleAll() {
    setSelected(allChecked ? new Set() : new Set(products.map((p) => p.id)));
  }

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function handleDelete(id: string) {
    setConfirmId(id);
  }

  function confirmSingleDelete() {
    if (!confirmId) return;
    const id = confirmId;
    setConfirmId(null);
    startTransition(async () => {
      await hardDeleteProduct(id);
      setSelected((prev) => { const n = new Set(prev); n.delete(id); return n; });
    });
  }

  function confirmBulkDelete() {
    const ids = Array.from(selected);
    setConfirmBulk(false);
    setSelected(new Set());
    startTransition(async () => {
      await bulkDeleteProducts(ids);
    });
  }

  const singleDeleteProduct = products.find((p) => p.id === confirmId);

  return (
    <>
      {/* ── Bulk action bar ─────────────────────────────────────── */}
      {selected.size > 0 && (
        <div className="flex items-center justify-between rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3">
          <div className="flex items-center gap-3">
            <CheckSquare className="h-4 w-4 text-red-400" />
            <span className="text-sm font-medium text-cream">
              {selected.size} product{selected.size !== 1 ? "s" : ""} selected
            </span>
            <button
              onClick={() => setSelected(new Set())}
              className="text-xs text-zinc-400 underline underline-offset-2 hover:text-cream"
            >
              Clear
            </button>
          </div>
          <button
            onClick={() => setConfirmBulk(true)}
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-60"
          >
            <Trash2 className="h-4 w-4" />
            Delete {selected.size} selected
          </button>
        </div>
      )}

      {/* ── Table ────────────────────────────────────────────────── */}
      <div className="overflow-hidden rounded-lg border border-white/10 bg-zinc-950/70 shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-zinc-800">
            <thead className="bg-zinc-950">
              <tr>
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={allChecked}
                    ref={(el) => { if (el) el.indeterminate = someChecked; }}
                    onChange={toggleAll}
                    aria-label="Select all products"
                    className="h-4 w-4 cursor-pointer rounded border-zinc-600 accent-gold"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">Stock</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-zinc-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {products.map((product) => (
                <tr
                  key={product.id}
                  className={`transition hover:bg-zinc-900/70 ${selected.has(product.id) ? "bg-zinc-900/50" : ""}`}
                >
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selected.has(product.id)}
                      onChange={() => toggleOne(product.id)}
                      aria-label={`Select ${product.name}`}
                      className="h-4 w-4 cursor-pointer rounded border-zinc-600 accent-gold"
                    />
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      <img className="h-11 w-11 rounded-md object-cover" src={product.image} alt="" />
                      <div className="ml-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-cream">{product.name}</span>
                          {!product.isActive && (
                            <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-red-400">
                              Hidden
                            </span>
                          )}
                        </div>
                        <Link
                          href={`/products/${product.slug}`}
                          className="mt-1 inline-flex items-center text-xs text-zinc-500 hover:text-gold"
                        >
                          View storefront
                          <ArrowUpRight className="ml-1 h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-400">{product.category}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gold">{formatPrice(product.price)}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-400">{product.stock}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <div className="inline-flex items-center gap-3">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="inline-flex items-center text-zinc-400 hover:text-gold"
                      >
                        <Pencil className="mr-1 h-4 w-4" />
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        disabled={isPending}
                        className="inline-flex items-center text-zinc-500 transition hover:text-red-400 disabled:opacity-50"
                        aria-label={`Delete ${product.name}`}
                      >
                        <Trash2 className="mr-1 h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-zinc-500">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Single delete confirmation modal ──────────────────────── */}
      {confirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl border border-white/10 bg-zinc-900 p-6 shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-full bg-red-500/15">
                <AlertTriangle className="h-5 w-5 text-red-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-lg font-semibold text-cream">Delete product?</h3>
                <p className="mt-1 text-sm text-zinc-400">
                  <span className="font-medium text-cream">{singleDeleteProduct?.name}</span> will be permanently removed from your catalog. This cannot be undone.
                </p>
                {/* Warn if product may have orders */}
                <p className="mt-2 text-xs text-amber-400/80">
                  Products linked to past orders are soft-deleted (hidden from store) to preserve order history.
                </p>
              </div>
              <button onClick={() => setConfirmId(null)} className="text-zinc-500 hover:text-cream">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setConfirmId(null)}
                className="rounded-md border border-white/10 px-4 py-2 text-sm text-zinc-300 transition hover:bg-white/[0.06]"
              >
                Cancel
              </button>
              <button
                onClick={confirmSingleDelete}
                disabled={isPending}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-60"
              >
                {isPending ? "Deleting…" : "Yes, delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Bulk delete confirmation modal ────────────────────────── */}
      {confirmBulk && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl border border-white/10 bg-zinc-900 p-6 shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-full bg-red-500/15">
                <AlertTriangle className="h-5 w-5 text-red-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-lg font-semibold text-cream">Delete {selected.size} products?</h3>
                <p className="mt-1 text-sm text-zinc-400">
                  All selected products will be permanently removed. This action cannot be undone.
                </p>
                <p className="mt-2 text-xs text-amber-400/80">
                  Products linked to past orders will be soft-deleted to preserve order history.
                </p>
              </div>
              <button onClick={() => setConfirmBulk(false)} className="text-zinc-500 hover:text-cream">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setConfirmBulk(false)}
                className="rounded-md border border-white/10 px-4 py-2 text-sm text-zinc-300 transition hover:bg-white/[0.06]"
              >
                Cancel
              </button>
              <button
                onClick={confirmBulkDelete}
                disabled={isPending}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-60"
              >
                {isPending ? "Deleting…" : `Delete ${selected.size} products`}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
