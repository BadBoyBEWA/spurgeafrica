"use client";

import { useMemo, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { formatPrice } from "@/lib/data";
import { useCart } from "@/components/Providers";

type FormState = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  deliveryMethod: "standard" | "express";
  paymentMethod: "paystack" | "flutterwave";
};

const initialForm: FormState = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  country: "",
  postalCode: "",
  deliveryMethod: "standard",
  paymentMethod: "paystack"
};

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const [form, setForm] = useState<FormState>(initialForm);
  const [confirmed, setConfirmed] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setForm(current => ({ ...current, [name]: value }));
  };

  const handleSubmit = async () => {
    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: form.name,
          email: form.email,
          phone: form.phone,
          address: form.address,
          city: form.city,
          state: form.state,
          country: form.country,
          postalCode: form.postalCode,
          items: items.map(item => ({ productId: item.id, quantity: item.quantity, price: item.price })),
          deliveryMethod: form.deliveryMethod,
          paymentMethod: form.paymentMethod
        })
      });

      const orderData = await orderResponse.json();
      if (!orderResponse.ok) {
        throw new Error(orderData.error ?? "Unable to create order.");
      }

      const paymentResponse = await fetch("/api/payments/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          amount: subtotal,
          orderId: orderData.orderId,
          metadata: { deliveryMethod: form.deliveryMethod, paymentMethod: form.paymentMethod }
        })
      });

      const paymentData = await paymentResponse.json();
      if (!paymentResponse.ok) {
        throw new Error(paymentData.error ?? "Unable to initialize payment.");
      }

      clearCart();
      setOrderId(orderData.orderId);
      setConfirmed(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isComplete = useMemo(() => {
    return Boolean(form.name && form.email && form.phone && form.address && form.city && form.state && form.country);
  }, [form]);

  if (confirmed) {
    return (
      <main className="grid min-h-screen place-items-center px-4 pt-24">
        <div className="glass max-w-lg p-10 text-center">
          <CheckCircle2 className="mx-auto text-gold" size={44} />
          <h1 className="mt-5 font-serif text-5xl">Order Confirmed</h1>
          <p className="mt-4 text-muted">Your order has been created and payment initialization has been requested.</p>
          <p className="mt-3 text-sm text-gold">Order number: {orderId}</p>
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
            <fieldset>
              <legend className="font-serif text-2xl">Customer info</legend>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Input label="Full name" name="name" value={form.name} onChange={handleChange} />
                <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
                <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} />
              </div>
            </fieldset>
            <fieldset>
              <legend className="font-serif text-2xl">Shipping address</legend>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Input label="Address" name="address" value={form.address} onChange={handleChange} />
                <Input label="City" name="city" value={form.city} onChange={handleChange} />
                <Input label="State" name="state" value={form.state} onChange={handleChange} />
                <Input label="Country" name="country" value={form.country} onChange={handleChange} />
                <Input label="Postal code" name="postalCode" value={form.postalCode} onChange={handleChange} />
              </div>
            </fieldset>
            <div>
              <h2 className="font-serif text-2xl">Delivery method</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="border hairline p-4"><input type="radio" name="deliveryMethod" value="standard" checked={form.deliveryMethod === "standard"} onChange={handleChange} /> Standard delivery</label>
                <label className="border hairline p-4"><input type="radio" name="deliveryMethod" value="express" checked={form.deliveryMethod === "express"} onChange={handleChange} /> Express delivery</label>
              </div>
            </div>
            <div>
              <h2 className="font-serif text-2xl">Payment method</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="border hairline p-4"><input type="radio" name="paymentMethod" value="paystack" checked={form.paymentMethod === "paystack"} onChange={handleChange} /> Paystack</label>
                <label className="border hairline p-4"><input type="radio" name="paymentMethod" value="flutterwave" checked={form.paymentMethod === "flutterwave"} onChange={handleChange} /> Flutterwave</label>
              </div>
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button disabled={!isComplete || isSubmitting} onClick={handleSubmit} className="bg-gold px-7 py-4 font-display text-xs uppercase tracking-[.22em] text-night disabled:opacity-40">
              {isSubmitting ? "Processing..." : "Place Order"}
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

function Input({ label, name, type = "text", value, onChange }: { label: string; name: string; type?: string; value: string; onChange: (event: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <label className="grid gap-2 text-sm capitalize text-muted">
      {label}
      <input name={name} type={type} value={value} onChange={onChange} required className="border hairline bg-transparent px-4 py-4 text-[var(--fg)] outline-none" />
    </label>
  );
}
