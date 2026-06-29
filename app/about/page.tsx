import Link from "next/link";
import { Award, Eye, Flag, Scissors } from "lucide-react";
import { products } from "@/lib/data";

export default function AboutPage() {
  return (
    <main className="px-4 pb-20 pt-32 sm:px-6 lg:px-8">
      <section className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.9fr_1.1fr]">
        <div>
          <p className="font-display text-xs uppercase tracking-[.28em] text-gold">About</p>
          <h1 className="mt-3 font-serif text-6xl leading-tight">African tailoring with modern restraint.</h1>
          <p className="mt-6 leading-8 text-muted">
            Spurge Africa designs luxury ready-to-wear and bespoke garments that carry the dignity of traditional menswear into contemporary life.
          </p>
          <Link href="/tailoring" className="mt-8 inline-block bg-gold px-7 py-4 font-display text-xs uppercase tracking-[.22em] text-night">
            Start a Custom Piece
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {products.slice(0, 4).map(product => <img key={product.id} src={product.image} alt="" className="h-72 w-full object-cover" />)}
        </div>
      </section>
      <section className="mx-auto mt-20 grid max-w-7xl gap-5 md:grid-cols-4">
        {[
          ["Mission", "To make African luxury feel exact, wearable, and deeply personal.", Flag],
          ["Vision", "A global atelier known for fabric intelligence and ceremonial craft.", Eye],
          ["Craft", "Every panel, cuff, and drape is finished with proportion in mind.", Scissors],
          ["Why Spurge", "High-touch consultation, premium materials, and dependable delivery.", Award]
        ].map(([title, copy, Icon]) => (
          <article key={String(title)} className="glass p-6">
            <Icon className="text-gold" size={28} />
            <h2 className="mt-5 font-serif text-2xl">{String(title)}</h2>
            <p className="mt-3 text-sm leading-7 text-muted">{String(copy)}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
