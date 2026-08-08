"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { AlertTriangle, CheckSquare, Eye, Trash2, X } from "lucide-react";
import { formatPrice } from "@/lib/data";
import { deleteOrder } from "@/app/admin/actions";

type OrderItem = {
  id: string;
  productId: string;
  productName: string | null;
  quantity: number;
  price: number;
  product?: { name?: string } | null;
};

type Order = {
  id: string;
  createdAt: string;
  customerName: string;
  email: string;
  status: string;
  items: OrderItem[];
};

type Props = {
  orders: Order[];
};

export function OrdersTable({ orders }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [confirmBulk, setConfirmBulk] = useState(false);
  const [bulkProgress, setBulkProgress] = useState<{ total: number; completed: number } | null>(null);
  const [isPending, startTransition] = useTransition();

  const allChecked = orders.length > 0 && selected.size === orders.length;
  const someChecked = selected.size > 0 && selected.size < orders.length;

  function toggleAll() {
    setSelected(allChecked ? new Set() : new Set(orders.map((order) => order.id)));
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
      await deleteOrder(id);
      setSelected((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    });
  }

  function confirmBulkDelete() {
    const ids = Array.from(selected);
    setConfirmBulk(false);
    setSelected(new Set());
    setBulkProgress({ total: ids.length, completed: 0 });
    startTransition(async () => {
      for (const id of ids) {
        await deleteOrder(id);
        setBulkProgress((prev) => prev && ({ total: prev.total, completed: prev.completed + 1 }));
      }
      setBulkProgress(null);
    });
  }

  const singleDeleteOrder = orders.find((order) => order.id === confirmId);

  return (
    <>
      {selected.size > 0 && (
        <div className="flex items-center justify-between rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3">
          <div className="flex items-center gap-3">
            <CheckSquare className="h-4 w-4 text-red-400" />
            <span className="text-sm font-medium text-cream">
              {selected.size} order{selected.size !== 1 ? "s" : ""} selected
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
                    aria-label="Select all orders"
                    className="h-4 w-4 cursor-pointer rounded border-zinc-600 accent-gold"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-zinc-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {orders.map((order) => {
                const total = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
                return (
                  <tr key={order.id} className={`transition hover:bg-zinc-900/70 ${selected.has(order.id) ? "bg-zinc-900/50" : ""}`}>
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selected.has(order.id)}
                        onChange={() => toggleOne(order.id)}
                        aria-label={`Select order ${order.id}`}
                        className="h-4 w-4 cursor-pointer rounded border-zinc-600 accent-gold"
                      />
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-cream">{order.id}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-400">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-300">{order.customerName}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gold">{formatPrice(total)}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                        order.status === "pending"      ? "bg-yellow-400/10 text-yellow-300" :
                        order.status === "confirmed"    ? "bg-cyan-400/10 text-cyan-300" :
                        order.status === "processing"   ? "bg-purple-400/10 text-purple-300" :
                        order.status === "in_warehouse" ? "bg-indigo-400/10 text-indigo-300" :
                        order.status === "on_route"     ? "bg-orange-400/10 text-orange-300" :
                        order.status === "delivered"    ? "bg-green-400/10 text-green-300" :
                        order.status === "cancelled"    ? "bg-red-400/10 text-red-300" :
                        "bg-zinc-800 text-zinc-300"
                      }`}>
                        {order.status === "in_warehouse" ? "In Warehouse" :
                         order.status === "on_route"     ? "On Route" :
                         order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <div className="inline-flex items-center gap-3">
                        <Link href={`/admin/orders/${order.id}`} className="inline-flex items-center text-zinc-400 hover:text-gold">
                          <Eye className="mr-1 h-4 w-4" /> View
                        </Link>
                        <button
                          onClick={() => handleDelete(order.id)}
                          disabled={isPending}
                          className="inline-flex items-center text-zinc-500 transition hover:text-red-400 disabled:opacity-50"
                          aria-label={`Delete order ${order.id}`}
                        >
                          <Trash2 className="mr-1 h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-sm text-zinc-500">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {confirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl border border-white/10 bg-zinc-900 p-6 shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-full bg-red-500/15">
                <AlertTriangle className="h-5 w-5 text-red-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-lg font-semibold text-cream">Delete order?</h3>
                <p className="mt-1 text-sm text-zinc-400">
                  <span className="font-medium text-cream">{singleDeleteOrder?.id}</span> will be removed permanently from the dashboard.
                </p>
                <p className="mt-2 text-xs text-amber-400/80">
                  This action is recorded in audit logs.
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

      {confirmBulk && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl border border-white/10 bg-zinc-900 p-6 shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-full bg-red-500/15">
                <AlertTriangle className="h-5 w-5 text-red-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-lg font-semibold text-cream">Delete {selected.size} orders?</h3>
                <p className="mt-1 text-sm text-zinc-400">
                  All selected orders will be deleted and recorded in audit logs.
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
                {isPending ? "Deleting…" : "Yes, delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {bulkProgress && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl border border-white/10 bg-zinc-900 p-6 shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-full bg-gold/15">
                <CheckSquare className="h-5 w-5 text-gold" />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-lg font-semibold text-cream">Deleting orders…</h3>
                <p className="mt-1 text-sm text-zinc-400">
                  {bulkProgress.completed} of {bulkProgress.total} orders deleted.
                </p>
              </div>
            </div>
            <div className="mt-6">
              <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                <div
                  className="h-2 rounded-full bg-gold transition-all duration-300"
                  style={{ width: `${Math.round((bulkProgress.completed / bulkProgress.total) * 100)}%` }}
                />
              </div>
              <p className="mt-2 text-right text-xs text-zinc-400">
                {Math.round((bulkProgress.completed / bulkProgress.total) * 100)}%
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
