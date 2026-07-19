"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole, Mail } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/admin/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-night text-cream">
      <div className="mx-auto grid min-h-screen w-full max-w-6xl grid-cols-1 lg:grid-cols-[1fr_440px]">
        <section className="hidden border-r border-white/10 px-10 py-12 lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className="font-display text-2xl font-bold text-gold">Spurge Africa</p>
            <div className="mt-24 max-w-xl">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-gold/80">
                Admin workspace
              </p>
              <h1 className="mt-5 font-display text-5xl font-bold leading-tight text-cream">
                Manage orders, products, tailoring, and customer messages.
              </h1>
              <p className="mt-6 max-w-lg text-base leading-7 text-cream/65">
                Sign in with your admin credentials to update the storefront and keep operations moving.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 text-sm text-cream/70">
            {["Orders", "Products", "Tailoring"].map((item) => (
              <div key={item} className="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3">
                {item}
              </div>
            ))}
          </div>
        </section>

        <main className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
          <div className="w-full max-w-md rounded-lg border border-white/10 bg-zinc-950/80 p-6 shadow-soft backdrop-blur sm:p-8">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-gold">
                Admin login
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold text-cream">
                Welcome back
              </h2>
              <p className="mt-2 text-sm leading-6 text-cream/60">
                Use the production admin email and password configured for this site.
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {error && (
                <div className="rounded-md border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {error}
                </div>
              )}

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-cream/80">Email address</span>
                <span className="relative block">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-cream/35" />
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    className="block w-full rounded-md border border-white/10 bg-white/[0.06] py-3 pl-11 pr-3 text-cream placeholder:text-cream/35 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/25"
                    placeholder="admin@spurgeafrica.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </span>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-cream/80">Password</span>
                <span className="relative block">
                  <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-cream/35" />
                  <input
                    type="password"
                    required
                    autoComplete="current-password"
                    className="block w-full rounded-md border border-white/10 bg-white/[0.06] py-3 pl-11 pr-3 text-cream placeholder:text-cream/35 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/25"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </span>
              </label>

              <button
                type="submit"
                className="flex w-full items-center justify-center rounded-md bg-gold px-4 py-3 text-sm font-semibold text-night transition hover:bg-[#e1b968] focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-zinc-950"
              >
                Sign in
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-cream/45">
              Protected administration area
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
