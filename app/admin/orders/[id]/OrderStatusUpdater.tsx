"use client";

import { useState, useTransition } from "react";
import {
  CheckCircle2,
  Clock,
  Package,
  Warehouse,
  Truck,
  XCircle,
  ChevronDown,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { updateOrderStatus } from "@/app/admin/actions";

export const ORDER_STATUSES = [
  {
    value: "pending",
    label: "Pending",
    description: "Awaiting payment or confirmation",
    icon: Clock,
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
    border: "border-yellow-400/30",
    ring: "ring-yellow-400/40",
  },
  {
    value: "confirmed",
    label: "Confirmed",
    description: "Payment confirmed, order accepted",
    icon: CheckCircle2,
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
    border: "border-cyan-400/30",
    ring: "ring-cyan-400/40",
  },
  {
    value: "processing",
    label: "Processing",
    description: "Order is being prepared",
    icon: RefreshCw,
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    border: "border-purple-400/30",
    ring: "ring-purple-400/40",
  },
  {
    value: "in_warehouse",
    label: "In Warehouse",
    description: "Ready for dispatch",
    icon: Warehouse,
    color: "text-indigo-400",
    bg: "bg-indigo-400/10",
    border: "border-indigo-400/30",
    ring: "ring-indigo-400/40",
  },
  {
    value: "on_route",
    label: "On Route",
    description: "Out for delivery",
    icon: Truck,
    color: "text-orange-400",
    bg: "bg-orange-400/10",
    border: "border-orange-400/30",
    ring: "ring-orange-400/40",
  },
  {
    value: "delivered",
    label: "Delivered",
    description: "Successfully delivered",
    icon: CheckCircle2,
    color: "text-green-400",
    bg: "bg-green-400/10",
    border: "border-green-400/30",
    ring: "ring-green-400/40",
  },
  {
    value: "cancelled",
    label: "Cancelled",
    description: "Order has been cancelled",
    icon: XCircle,
    color: "text-red-400",
    bg: "bg-red-400/10",
    border: "border-red-400/30",
    ring: "ring-red-400/40",
  },
] as const;

export type OrderStatusValue = (typeof ORDER_STATUSES)[number]["value"];

export function getStatusMeta(status: string) {
  return (
    ORDER_STATUSES.find((s) => s.value === status) ?? {
      value: status,
      label: status,
      description: "",
      icon: Package,
      color: "text-zinc-400",
      bg: "bg-zinc-800",
      border: "border-zinc-700",
      ring: "ring-zinc-600",
    }
  );
}

type Props = {
  orderId: string;
  currentStatus: string;
};

export function OrderStatusUpdater({ orderId, currentStatus }: Props) {
  const [selected, setSelected] = useState(currentStatus);
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const current = getStatusMeta(selected);
  const CurrentIcon = current.icon;

  function showToast(type: "success" | "error", message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  }

  function handleSelect(value: string) {
    setSelected(value);
    setOpen(false);
  }

  function handleSave() {
    if (selected === currentStatus) {
      showToast("error", "Status is unchanged. Select a different status to update.");
      return;
    }
    startTransition(async () => {
      try {
        await updateOrderStatus(orderId, selected);
        showToast("success", `Order status updated to "${getStatusMeta(selected).label}".`);
      } catch {
        showToast("error", "Failed to update order status. Please try again.");
        setSelected(currentStatus);
      }
    });
  }

  return (
    <section className="rounded-lg border border-white/10 bg-zinc-950/70 p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <Package className="h-5 w-5 text-gold" />
        <h2 className="text-lg font-semibold text-cream">Order Status</h2>
      </div>

      {/* Current badge */}
      <div className="mb-5">
        <p className="mb-2 text-xs font-medium uppercase tracking-widest text-zinc-500">
          Current status
        </p>
        <div
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold ${current.bg} ${current.border} ${current.color}`}
        >
          <CurrentIcon className="h-3.5 w-3.5" />
          {current.label}
        </div>
      </div>

      {/* Dropdown selector */}
      <div className="mb-4">
        <p className="mb-2 text-xs font-medium uppercase tracking-widest text-zinc-500">
          Update to
        </p>
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="flex w-full items-center justify-between rounded-lg border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-cream transition hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-gold/30"
          >
            <span className="flex items-center gap-2">
              {(() => {
                const meta = getStatusMeta(selected);
                const Icon = meta.icon;
                return (
                  <>
                    <Icon className={`h-4 w-4 ${meta.color}`} />
                    <span>{meta.label}</span>
                  </>
                );
              })()}
            </span>
            <ChevronDown
              className={`h-4 w-4 text-zinc-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            />
          </button>

          {open && (
            <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-lg border border-white/10 bg-zinc-900 shadow-2xl shadow-black/40">
              {ORDER_STATUSES.map((status) => {
                const Icon = status.icon;
                const isActive = status.value === selected;
                return (
                  <button
                    key={status.value}
                    type="button"
                    onClick={() => handleSelect(status.value)}
                    className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition hover:bg-zinc-800 ${
                      isActive ? "bg-zinc-800/70" : ""
                    }`}
                  >
                    <span
                      className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full ${status.bg} ${status.border} border`}
                    >
                      <Icon className={`h-3.5 w-3.5 ${status.color}`} />
                    </span>
                    <span className="flex-1">
                      <span className={`block font-medium ${isActive ? status.color : "text-cream"}`}>
                        {status.label}
                      </span>
                      <span className="block text-xs text-zinc-500">{status.description}</span>
                    </span>
                    {isActive && (
                      <CheckCircle2 className={`h-4 w-4 flex-shrink-0 ${status.color}`} />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Save button */}
      <button
        type="button"
        onClick={handleSave}
        disabled={isPending}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gold px-4 py-2.5 text-sm font-semibold text-night transition hover:bg-[#f0d172] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Saving…
          </>
        ) : (
          "Save Status"
        )}
      </button>

      {/* Note */}
      <p className="mt-3 text-xs text-zinc-500">
        Status changes are recorded in the audit log automatically.
      </p>

      {/* Toast */}
      {toast && (
        <div
          className={`mt-4 rounded-lg border px-4 py-3 text-sm font-medium ${
            toast.type === "success"
              ? "border-green-500/30 bg-green-500/10 text-green-300"
              : "border-red-500/30 bg-red-500/10 text-red-300"
          }`}
        >
          {toast.message}
        </div>
      )}
    </section>
  );
}
