import Image from "next/image";
import Link from "next/link";
import { Instagram, Mail, Star } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import {
  categories,
  craftHighlights,
  heroImage,
  processSteps,
  products,
  testimonials
} from "@/lib/data";

export default function HomePage() {
  return (
    <main>
      <section className="relative min-h-screen overflow-hidden">
        <div
          className="absolute inset-0 scale-105 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-night/60 to-[var(--bg)]" />
        <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-4 pb-16 pt-32 sm:px-6 lg:px-8">
          <Reveal className="max-w-3xl">
            <p className="font-display text-xs uppercase tracking-[.32em] text-gold">Ready-to-wear and bespoke tailoring</p>
            <h1 className="mt-5 font-serif text-6xl leading-[.95] sm:text-7xl lg:text-8xl">Redefine African Luxury</h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-cream/78">
              Editorial silhouettes, heritage fabrics, and precision tailoring for ceremonies, boardrooms, and modern African life.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/collections" className="bg-gold px-7 py-4 text-center font-display text-xs uppercase tracking-[.22em] text-night transition hover:bg-terracotta hover:text-cream">
                Shop Collection
              </Link>
              <Link href="/tailoring" className="border border-white/25 px-7 py-4 text-center font-display text-xs uppercase tracking-[.22em] text-cream transition hover:border-gold hover:text-gold">
                Order Custom Outfit
              </Link>
            </div>
          </Reveal>
        </div>
        <div className="absolute bottom-8 left-0 right-0 overflow-hidden border-y border-white/10 py-3">
          <div className="flex w-[200%] animate-marquee gap-10 font-display text-xs uppercase tracking-[.28em] text-cream/70">
            {Array.from({ length: 12 }).map((_, index) => <span key={index}>Bespoke Agbada • Luxury Senator Wear • Wedding Tailoring</span>)}
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading kicker="Collections" title="Ceremonial presence, everyday ease" copy="Shop curated silhouettes shaped by Nigerian tailoring culture and a modern luxury lens." />
        </Reveal>
        <div className="mx-auto grid max-w-7xl gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {categories.map(category => (
            <Link key={category.title} href={category.href} className="group overflow-hidden border hairline">
              <div className="relative min-h-[24rem] overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  sizes="(max-width: 1024px) 50vw, 20vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-5 left-5 z-10 rounded-full bg-black/60 px-4 py-2 backdrop-blur-sm">
                  <h3 className="font-serif text-2xl text-cream">{category.title}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y hairline px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.9fr_1.1fr]">
          <Reveal>
            <p className="font-display text-xs uppercase tracking-[.28em] text-gold">About the atelier</p>
            <h2 className="mt-3 font-serif text-5xl">Built around fabric, fit, and quiet authority.</h2>
            <p className="mt-6 leading-8 text-muted">
              Spurge Africa creates ready-to-wear and custom pieces for men who want tradition without costume and luxury without noise.
            </p>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2">
            {craftHighlights.map(({ title, copy, icon: Icon }) => (
              <Reveal key={title} className="glass p-6">
                <Icon className="text-gold" size={26} />
                <h3 className="mt-5 font-serif text-2xl">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted">{copy}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading kicker="New arrivals" title="Fresh from the cutting table" />
        </Reveal>
        <div className="mx-auto grid max-w-7xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.slice(0, 8).map(product => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>

      <section className="bg-emerald/35 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_1.2fr]">
          <Reveal>
            <p className="font-display text-xs uppercase tracking-[.28em] text-gold">Custom tailoring</p>
            <h2 className="mt-3 font-serif text-5xl">Your measurements. Your fabric mood. Our atelier.</h2>
            <p className="mt-6 leading-8 text-cream/72">
              Start with a silhouette, upload inspiration, share measurements, and receive a tailored order plan.
            </p>
            <Link href="/tailoring" className="mt-8 inline-block bg-gold px-7 py-4 font-display text-xs uppercase tracking-[.22em] text-night">
              Start Custom Order
            </Link>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-4">
            {processSteps.map(({ title, icon: Icon }, index) => (
              <Reveal key={title} className="border border-white/15 p-5">
                <span className="text-sm text-gold">0{index + 1}</span>
                <Icon className="mt-8 text-cream" size={25} />
                <h3 className="mt-4 font-serif text-xl">{title}</h3>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading kicker="Testimonials" title="Clients in full voice" />
        </Reveal>
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
          {testimonials.map(testimonial => (
            <Reveal key={testimonial.name} className="glass p-6">
              <div className="flex gap-1 text-gold">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={16} fill="currentColor" />)}</div>
              <p className="mt-5 leading-7 text-muted">“{testimonial.review}”</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="relative h-12 w-12 overflow-hidden rounded-full">
                  <Image src={testimonial.photo} alt={`${testimonial.name} photo`} fill className="object-cover" />
                </div>
                <div>
                  <p className="font-medium">{testimonial.name}</p>
                  <p className="text-xs text-muted">{testimonial.role}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading kicker="Instagram" title="Seen in texture and motion" />
        </Reveal>
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 md:grid-cols-6">
          {products.slice(0, 6).map(product => (
            <a key={product.id} href="https://instagram.com" className="group relative aspect-square overflow-hidden">
              <div className="relative h-full w-full">
                <Image src={product.image} alt={product.name} fill className="object-cover transition duration-500 group-hover:scale-110" />
              </div>
              <span className="absolute inset-0 grid place-items-center bg-black/0 text-cream opacity-0 transition group-hover:bg-black/55 group-hover:opacity-100">
                <Instagram />
              </span>
            </a>
          ))}
        </div>
      </section>

      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-3xl text-center">
          <Mail className="mx-auto text-gold" size={30} />
          <h2 className="mt-4 font-serif text-4xl">Join the private list</h2>
          <form action="/api/newsletter" method="post" className="mt-7 flex flex-col gap-3 sm:flex-row">
            <input name="email" type="email" required placeholder="Email address" className="min-h-14 flex-1 border hairline bg-transparent px-4 outline-none" />
            <button className="bg-gold px-7 py-4 font-display text-xs uppercase tracking-[.22em] text-night">Subscribe</button>
          </form>
        </Reveal>
      </section>
    </main>
  );
}
