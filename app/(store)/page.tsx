import Link from "next/link";
import { Mail } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { CategoryCarousel } from "@/components/CategoryCarousel";
import {
  categories,
  craftHighlights,
  heroImage,
  processSteps
} from "@/lib/data";
import { getProducts } from "@/lib/product-queries";
import { getCollections } from "@/lib/collection-queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await getProducts();
  const collections = await getCollections();

  const categoryItems = collections.length > 0
    ? collections.map(col => ({
        id: col.id,
        title: col.title,
        href: col.href,
        image: col.image,
      }))
    : categories;

  return (
    <main>
      <section className="relative min-h-screen overflow-hidden bg-night">
        {/* Mobile hero image (herosa.jpeg) */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat object-cover md:hidden"
          style={{ backgroundImage: `url('/images/herosa.jpeg')` }}
        />
        {/* Desktop hero image (herosa.png) */}
        <div
          className="absolute inset-0 hidden bg-cover bg-center bg-fixed object-cover md:block"
          style={{ backgroundImage: `url('/images/herosa.png')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-night/70 to-[var(--bg)]" />
        <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-4 pb-16 pt-32 sm:px-6 lg:px-8">
          <Reveal className="max-w-2xl">
            <p className="font-display text-xs uppercase tracking-[.32em] text-gold">Contemporary African Fashion</p>
            <h1 className="mt-5 font-serif text-5xl leading-[.95] text-cream drop-shadow-[0_4px_22px_rgba(0,0,0,.65)] sm:text-6xl lg:text-7xl">Crafted for Every Occasion</h1>
            {/* <p className="mt-6 max-w-lg text-sm leading-7 text-cream/85 drop-shadow-[0_2px_14px_rgba(0,0,0,.8)]">
              Editorial silhouettes, heritage fabrics, and precision tailoring for ceremonies, boardrooms, and modern African life.
            </p> */}
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
        {/* Marquee ticker – temporarily hidden */}
        {/* <div className="absolute bottom-0 left-0 right-0 overflow-hidden border-y border-white/10 bg-night/80 py-3 backdrop-blur">
          <div className="flex w-[200%] animate-marquee gap-10 font-display text-xs uppercase tracking-[.28em] text-cream/75">
            {Array.from({ length: 12 }).map((_, index) => <span key={index}>Bespoke Agbada • Luxury Senator Wear • Wedding Tailoring</span>)}
          </div>
        </div> */}
      </section>

      <section className="relative z-10 bg-[var(--bg)] px-4 py-20 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading kicker="" title="Explore Our Collections" />
        </Reveal>
        <CategoryCarousel items={categoryItems} />
      </section>

      <section className="border-y hairline px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.9fr_1.1fr]">
          <Reveal>
            {/* <p className="font-display text-xs uppercase tracking-[.28em] text-gold">About the atelier</p> */}
            <h2 className="mt-3 font-serif text-5xl">Rooted in Heritage. Designed for Today.</h2>
            <p className="mt-6 leading-8 text-muted">
              At Spurge Africa, we believe African fashion deserves to be experienced with the same level of craftsmanship, convenience, and attention to detail as the world&apos;s leading fashion houses.
            </p>
            <p className="mt-4 leading-8 text-muted">
              Every piece is thoughtfully designed and carefully crafted to celebrate heritage while embracing contemporary style. Whether you&apos;re choosing from our ready-to-wear collections or commissioning a bespoke garment, our commitment remains the same: exceptional quality, precise tailoring, and an experience worthy of life&apos;s most meaningful moments.
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
          <SectionHeading kicker="" title="Curated Collection" />
        </Reveal>
        <div className="mx-auto grid max-w-7xl gap-5 grid-cols-2 lg:grid-cols-4">
          {products.slice(0, 8).map(product => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>

      <section className="bg-emerald/35 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_1.2fr]">
          <Reveal>
            <p className="font-display text-xs uppercase tracking-[.28em] text-[var(--fg)]">Custom tailoring</p>
            <h2 className="mt-3 font-serif text-5xl">The entire process takes under 5 minutes.</h2>
            <p className="mt-5 font-serif text-xl text-muted italic leading-8">Not 20. Not 10. Around 5 minutes.</p>
            <p className="mt-6 leading-8 text-muted">
              We collect just enough to confidently start a conversation — choose your outfit, share inspiration, submit measurements, and we&apos;ll handle the rest.
            </p>
            <Link href="/tailoring" className="mt-8 inline-block bg-gold px-7 py-4 font-display text-xs uppercase tracking-[.22em] text-night">
              Start Custom Order
            </Link>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-5">
            {processSteps.map(({ title, icon: Icon }, index) => (
              <Reveal key={title} className="border hairline p-5">
                <span className="text-sm font-semibold text-[var(--fg)]">0{index + 1}</span>
                <Icon className="mt-8 text-[var(--fg)]" size={25} />
                <h3 className="mt-4 font-serif text-xl">{title}</h3>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials – temporarily hidden */}
      {/* <section className="px-4 py-20 sm:px-6 lg:px-8">
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
      </section> */}

      {/* Instagram feed – temporarily hidden */}
      {/* <section className="px-4 pb-20 sm:px-6 lg:px-8">
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
      </section> */}

      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-3xl text-center">
          <Mail className="mx-auto text-gold" size={30} />
          <h2 className="mt-4 font-serif text-4xl">Stay Close To The Craft</h2>
          <p className="mt-4 leading-7 text-muted">
            Be the first to know about new collections, exclusive releases, styling inspiration, and stories from the atelier.
          </p>
          <form action="/api/newsletter" method="post" className="mt-7 flex flex-col gap-3 sm:flex-row">
            <input name="email" type="email" required placeholder="Email address" className="min-h-14 flex-1 border hairline bg-transparent px-4 outline-none" />
            <button className="bg-gold px-7 py-4 font-display text-xs uppercase tracking-[.22em] text-night">Subscribe</button>
          </form>
        </Reveal>
      </section>
    </main>
  );
}

