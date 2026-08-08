"use client";

import { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Loader2,
  MapPin,
  Package,
  RefreshCw,
  Truck,
  User,
  Warehouse,
  XCircle,
} from "lucide-react";
import { formatPrice } from "@/lib/data";

type TrackForm = {
  orderId: string;
  email: string;
};

type TrackOrderItem = {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
};

type TrackOrder = {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode?: string | null;
  deliveryMethod?: string | null;
  paymentMethod?: string | null;
  payment?: {
    status: string;
    reference: string;
    amount: number;
  } | null;
  items: TrackOrderItem[];
};

const FULFILLMENT_STEPS = [
  {
    value: "confirmed",
    label: "Confirmed",
    shortLabel: "Confirmed",
    icon: CheckCircle2,
    description: "Payment received & order confirmed",
  },
  {
    value: "processing",
    label: "Processing",
    shortLabel: "Processing",
    icon: RefreshCw,
    description: "Your order is being prepared",
  },
  {
    value: "in_warehouse",
    label: "In Warehouse",
    shortLabel: "Warehouse",
    icon: Warehouse,
    description: "Packed & ready for dispatch",
  },
  {
    value: "on_route",
    label: "On Route",
    shortLabel: "On Route",
    icon: Truck,
    description: "Out for delivery to your address",
  },
  {
    value: "delivered",
    label: "Delivered",
    shortLabel: "Delivered",
    icon: CheckCircle2,
    description: "Successfully delivered",
  },
] as const;

const STEP_VALUES = FULFILLMENT_STEPS.map((s) => s.value);

function getStepIndex(status: string): number {
  return STEP_VALUES.indexOf(status as (typeof STEP_VALUES)[number]);
}

function OrderStepper({ status }: { status: string }) {
  const activeIdx = getStepIndex(status);

  return (
    <div className="w-full">
      {/* Desktop stepper */}
      <div className="relative hidden items-start justify-between sm:flex">
        {/* Base line */}
        <div className="absolute left-0 right-0 top-5 h-0.5 bg-zinc-800" />
        {FULFILLMENT_STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isCompleted = idx < activeIdx;
          const isActive = idx === activeIdx;

          return (
            <div
              key={step.value}
              className="relative z-10 flex flex-1 flex-col items-center gap-3"
            >
              {/* Gold progress line segment (left half of each step) */}
              {idx > 0 && isCompleted && (
                <div className="absolute right-1/2 top-5 h-0.5 w-full -translate-y-px bg-gold/50" />
              )}
              {idx > 0 && isActive && (
                <div className="absolute right-1/2 top-5 h-0.5 w-full -translate-y-px bg-gold/50" />
              )}

              {/* Circle */}
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                  isCompleted
                    ? "border-gold bg-gold/20 text-gold"
                    : isActive
                    ? "border-gold bg-gold text-night shadow-lg shadow-gold/30"
                    : "border-zinc-700 bg-zinc-900 text-zinc-600"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <Icon
                    className={`h-5 w-5 ${isActive ? "text-night" : ""} ${
                      isActive && step.value === "processing" ? "animate-spin" : ""
                    }`}
                  />
                )}
              </div>

              {/* Label */}
              <p
                className={`text-center text-xs font-semibold ${
                  isActive ? "text-gold" : isCompleted ? "text-zinc-300" : "text-zinc-600"
                }`}
              >
                {step.shortLabel}
              </p>
            </div>
          );
        })}
      </div>

      {/* Mobile stepper (vertical) */}
      <div className="flex flex-col gap-0 sm:hidden">
        {FULFILLMENT_STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isCompleted = idx < activeIdx;
          const isActive = idx === activeIdx;
          const isLast = idx === FULFILLMENT_STEPS.length - 1;

          return (
            <div key={step.value} className="flex gap-4">
              {/* Icon + connector line */}
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border-2 ${
                    isCompleted
                      ? "border-gold bg-gold/20 text-gold"
                      : isActive
                      ? "border-gold bg-gold text-night shadow-md shadow-gold/30"
                      : "border-zinc-700 bg-zinc-900 text-zinc-600"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <Icon
                      className={`h-4 w-4 ${isActive ? "text-night" : ""} ${
                        isActive && step.value === "processing" ? "animate-spin" : ""
                      }`}
                    />
                  )}
                </div>
                {!isLast && (
                  <div
                    className={`mt-1 min-h-[2rem] w-0.5 flex-1 ${
                      isCompleted ? "bg-gold/40" : "bg-zinc-800"
                    }`}
                  />
                )}
              </div>

              {/* Text */}
              <div className="pb-6">
                <p
                  className={`text-sm font-semibold ${
                    isActive ? "text-gold" : isCompleted ? "text-zinc-300" : "text-zinc-600"
                  }`}
                >
                  {step.label}
                </p>
                <p
                  className={`text-xs ${
                    isCompleted || isActive ? "text-zinc-500" : "text-zinc-700"
                  }`}
                >
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function getStatusLabel(status: string) {
  const map: Record<string, string> = {
    pending: "Pending",
    confirmed: "Confirmed",
    processing: "Processing",
    in_warehouse: "In Warehouse",
    on_route: "On Route",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };
  return map[status] ?? status;
}

export default function TrackOrderPage() {
  const [form, setForm] = useState<TrackForm>({ orderId: "", email: "" });
  const [order, setOrder] = useState<TrackOrder | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setOrder(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/order-track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: form.orderId, email: form.email }),
      });

      const data = await response.json();
      if (!response.ok || !data.ok) {
        setError(data.error || "Unable to find your order. Please check your details.");
      } else {
        setOrder(data.order);
      }
    } catch {
      setError("Unable to connect to the server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const subtotal = order?.items.reduce((sum, item) => sum + item.price * item.quantity, 0) ?? 0;
  const isCancelled = order?.status === "cancelled";
  const isPending = order?.status === "pending";

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-20 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-10">
        {/* Search form */}
        <section className="rounded-3xl border border-white/10 bg-zinc-900/80 p-8 shadow-2xl shadow-black/20 backdrop-blur-xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-gold">Track your order</p>
              <h1 className="mt-3 text-4xl font-bold text-cream sm:text-5xl">Find your order status</h1>
              <p className="mt-4 max-w-2xl text-zinc-400">
                Enter your order number and the email used at checkout to see current status, shipping details, and item progress.
              </p>
            </div>
            <div className="rounded-3xl bg-zinc-950/80 p-6 shadow-lg shadow-black/20">
              <p className="text-sm uppercase tracking-[0.3em] text-zinc-400">Did you know?</p>
              <p className="mt-3 text-sm leading-6 text-zinc-300">
                You can use your order ID from the checkout confirmation page or email receipt.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-10 grid gap-4 sm:grid-cols-[1.5fr_1fr]">
            <div className="space-y-2">
              <label className="block text-sm font-semibold uppercase tracking-[0.25em] text-zinc-400">
                Order ID
              </label>
              <input
                value={form.orderId}
                onChange={(event) => setForm((prev) => ({ ...prev, orderId: event.target.value }))}
                placeholder="SA-2026-1234"
                className="w-full rounded-3xl border border-white/10 bg-zinc-950/90 px-4 py-3 text-sm text-white outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold uppercase tracking-[0.25em] text-zinc-400">
                Email address
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                placeholder="you@example.com"
                className="w-full rounded-3xl border border-white/10 bg-zinc-950/90 px-4 py-3 text-sm text-white outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20"
              />
            </div>
            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center justify-center gap-2 rounded-3xl bg-gold px-6 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-night transition hover:bg-[#f0d172] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Checking status</>
                ) : (
                  <>Track order <ArrowRight className="h-4 w-4" /></>
                )}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-4 rounded-3xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}
        </section>

        {/* Order result */}
        {order && (
          <section className="space-y-6 rounded-3xl border border-white/10 bg-zinc-900/80 p-8 shadow-2xl shadow-black/20">
            {/* Status header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-gold">Order status</p>
                <h2 className="mt-2 text-3xl font-bold text-cream">
                  {getStatusLabel(order.status)}
                </h2>
              </div>
              <div className="rounded-3xl bg-zinc-950/90 px-5 py-3 text-sm text-zinc-300">
                Last updated {new Date(order.updatedAt).toLocaleString()}
              </div>
            </div>

            {/* Cancelled banner */}
            {isCancelled && (
              <div className="flex items-start gap-4 rounded-2xl border border-red-500/30 bg-red-500/10 p-5">
                <XCircle className="mt-0.5 h-6 w-6 flex-shrink-0 text-red-400" />
                <div>
                  <p className="font-semibold text-red-300">Order Cancelled</p>
                  <p className="mt-1 text-sm text-red-400/80">
                    This order has been cancelled. Please contact support if you believe this is an error.
                  </p>
                </div>
              </div>
            )}

            {/* Pending banner */}
            {isPending && (
              <div className="flex items-start gap-4 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-5">
                <Clock className="mt-0.5 h-6 w-6 flex-shrink-0 text-yellow-400" />
                <div>
                  <p className="font-semibold text-yellow-300">Awaiting Confirmation</p>
                  <p className="mt-1 text-sm text-yellow-400/80">
                    Your order is pending payment or confirmation. This usually resolves within a few minutes.
                  </p>
                </div>
              </div>
            )}

            {/* Progress stepper */}
            {!isCancelled && !isPending && (
              <div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-6">
                <p className="mb-6 text-xs font-semibold uppercase tracking-widest text-zinc-500">
                  Fulfillment progress
                </p>
                <OrderStepper status={order.status} />
              </div>
            )}

            {/* Summary cards */}
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-zinc-950/80 p-5">
                <p className="text-xs uppercase tracking-[0.25em] text-zinc-400">Order</p>
                <p className="mt-3 text-xl font-semibold text-cream">{order.id}</p>
                <p className="mt-2 text-sm text-zinc-400">
                  Placed {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-zinc-950/80 p-5">
                <p className="text-xs uppercase tracking-[0.25em] text-zinc-400">Delivery</p>
                <p className="mt-3 text-sm text-zinc-300">
                  {order.deliveryMethod ? order.deliveryMethod : "Standard"}
                </p>
                <p className="mt-2 text-sm text-zinc-400">{order.address}</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-zinc-950/80 p-5">
                <p className="text-xs uppercase tracking-[0.25em] text-zinc-400">Payment</p>
                <p className="mt-3 text-sm text-zinc-300">{order.payment?.status ?? "Pending"}</p>
                {order.payment?.reference && (
                  <p className="mt-2 text-sm text-zinc-400">Ref: {order.payment.reference}</p>
                )}
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
              {/* Items */}
              <div className="rounded-3xl border border-white/10 bg-zinc-950/80 p-6">
                <div className="mb-5 flex items-center gap-3">
                  <Package className="h-5 w-5 text-gold" />
                  <h3 className="text-lg font-semibold text-cream">Items</h3>
                </div>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="rounded-3xl border border-white/10 bg-zinc-900/70 p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-cream">{item.productName}</p>
                          <p className="mt-1 text-sm text-zinc-400">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-semibold text-gold">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-sm text-zinc-300">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
              </div>

              {/* Customer & Shipping */}
              <div className="space-y-6">
                <div className="rounded-3xl border border-white/10 bg-zinc-950/80 p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <User className="h-5 w-5 text-gold" />
                    <h3 className="text-lg font-semibold text-cream">Customer</h3>
                  </div>
                  <div className="space-y-3 text-sm text-zinc-300">
                    <p>{order.customerName}</p>
                    <p>{order.email}</p>
                    <p>{order.phone}</p>
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-zinc-950/80 p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-gold" />
                    <h3 className="text-lg font-semibold text-cream">Shipping</h3>
                  </div>
                  <div className="space-y-3 text-sm text-zinc-300">
                    <p>{order.address}</p>
                    <p>
                      {order.city}, {order.state} {order.postalCode || ""}
                    </p>
                    <p>{order.country}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
