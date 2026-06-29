"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { formatPrice } from "@/lib/data";
import { useCart } from "@/components/Providers";

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const [confirmed, setConfirmed] = useState(false);

  if (confirmed) {
    return (
      <main className="grid min-h-screen place-items-center px-4 pt-24">
        <div className="glass max-w-lg p-10 text-center">
          <CheckCircle2 className="mx-auto text-gold" size={44} />
          <h1 className="mt-5 font-serif text-5xl">Order Confirmed</h1>
          <p className="mt-4 text-muted">Your checkout placeholder is complete. Payment gateway integration can be connected next.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="px-4 pb-20 pt-32 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_380px]">
        <section className="glass p-5 sm:p-8">
          <p className="font-display text-xs uppercase tracking-[.28em] text-gold">Checkout</p>
          <h1 className="mt-3 font-serif text-5xl">Delivery and payment</h1>
          <div className="mt-8 grid gap-8">
            <Fieldset title="Customer info" fields={["name", "email", "phone"]} />
            <Fieldset title="Shipping address" fields={["address", "city", "state", "country", "postal code"]} />
            <div>
              <h2 className="font-serif text-2xl">Delivery method</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="border hairline p-4"><input type="radio" name="delivery" defaultChecked /> Standard delivery</label>
                <label className="border hairline p-4"><input type="radio" name="delivery" /> Express delivery</label>
              </div>
            </div>
            <div>
              <h2 className="font-serif text-2xl">Payment method</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="border hairline p-4"><input type="radio" name="payment" defaultChecked /> Paystack placeholder</label>
                <label className="border hairline p-4"><input type="radio" name="payment" /> Flutterwave placeholder</label>
              </div>
            </div>
            <button onClick={() => { clearCart(); setConfirmed(true); }} className="bg-gold px-7 py-4 font-display text-xs uppercase tracking-[.22em] text-night">
              Place Order
            </button>
          </div>
        </section>
        <aside className="glass h-fit p-5 lg:sticky lg:top-28">
          <h2 className="font-serif text-3xl">Order summary</h2>
          <div className="mt-5 grid gap-4">
            {items.length === 0 && <p className="text-sm text-muted">No cart items yet.</p>}
            {items.map(item => (
              <div key={item.id} className="flex gap-3 border-b hairline pb-4">
                <img src={item.image} alt="" className="h-16 w-16 object-cover" />
                <div className="flex-1">
                  <p className="text-sm">{item.name}</p>
                  <p className="text-xs text-muted">Qty {item.quantity}</p>
                </div>
                <p className="text-sm">{formatPrice(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 flex justify-between text-lg">
            <span>Total</span>
            <strong>{formatPrice(subtotal)}</strong>
          </div>
        </aside>
      </div>
    </main>
  );
}

function Fieldset({ title, fields }: { title: string; fields: string[] }) {
  return (
    <fieldset>
      <legend className="font-serif text-2xl">{title}</legend>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {fields.map(field => (
          <input key={field} required placeholder={field} className="border hairline bg-transparent px-4 py-4 capitalize outline-none" />
        ))}
      </div>
    </fieldset>
  );
}
