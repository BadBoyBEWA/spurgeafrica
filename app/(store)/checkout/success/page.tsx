"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { useCart } from "@/components/Providers";

type VerifyState =
  | { status: "checking"; message: string; orderId?: string }
  | { status: "paid"; message: string; orderId: string }
  | { status: "failed"; message: string; orderId?: string };

function CheckoutSuccessInner() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const [state, setState] = useState<VerifyState>({
    status: "checking",
    message: "Confirming your payment...",
  });

  useEffect(() => {
    const reference = searchParams.get("reference") || searchParams.get("trxref");

    if (!reference) {
      setState({
        status: "failed",
        message: "We could not find a payment reference. Please contact support if you were debited.",
      });
      return;
    }

    async function verifyPayment() {
      try {
        const response = await fetch("/api/payments/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reference }),
        });
        const data = await response.json();

        if (!response.ok || data.status !== "verified") {
          throw new Error(data.error || "Payment could not be verified.");
        }

        clearCart();
        setState({
          status: "paid",
          message: "Your payment was successful and your order is now confirmed.",
          orderId: data.orderId,
        });
      } catch (error) {
        setState({
          status: "failed",
          message: error instanceof Error ? error.message : "Payment verification failed.",
        });
      }
    }

    verifyPayment();
  }, [clearCart, searchParams]);

  const isPaid = state.status === "paid";
  const isChecking = state.status === "checking";

  return (
    <main className="grid min-h-screen place-items-center px-4 pt-24">
      <div className="glass max-w-lg p-8 text-center sm:p-10">
        {isChecking ? (
          <Loader2 className="mx-auto animate-spin text-gold" size={44} />
        ) : isPaid ? (
          <CheckCircle2 className="mx-auto text-gold" size={44} />
        ) : (
          <AlertCircle className="mx-auto text-red-400" size={44} />
        )}
        <h1 className="mt-5 font-serif text-4xl sm:text-5xl">
          {isChecking ? "Checking Payment" : isPaid ? "Payment Confirmed" : "Payment Not Confirmed"}
        </h1>
        <p className="mt-4 text-muted">{state.message}</p>
        {state.orderId && <p className="mt-3 text-sm text-gold">Order number: {state.orderId}</p>}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/collections" className="bg-gold px-6 py-3 font-display text-xs uppercase tracking-[.18em] text-night">
            Continue Shopping
          </Link>
          <Link href="/contact" className="border hairline px-6 py-3 font-display text-xs uppercase tracking-[.18em]">
            Contact Support
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <main className="grid min-h-screen place-items-center px-4 pt-24">
        <div className="glass max-w-lg p-10 text-center">
          <Loader2 className="mx-auto animate-spin text-gold" size={44} />
          <h1 className="mt-5 font-serif text-5xl">Checking Payment</h1>
        </div>
      </main>
    }>
      <CheckoutSuccessInner />
    </Suspense>
  );
}
