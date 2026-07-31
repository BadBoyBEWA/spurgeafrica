import Link from "next/link";
import { Instagram, Music2, Phone, Send, MapPin } from "lucide-react";

const links = {
  Shop: [
    { label: "Agbada", href: "/collections?category=Agbada" },
    { label: "Senator Wear", href: "/collections?category=Senator" },
    { label: "Kaftans 2-piece", href: "/collections?category=Kaftan" },
    { label: "Fila", href: "/collections?category=Fila" },
    { label: "Pants", href: "/collections?category=Pants" },
    { label: "Danshiki", href: "/collections?category=Danshiki" }
  ],
  Support: [
    { label: "Size Guide", href: "/tailoring" },
    { label: "Shipping & Return Policy", href: "/policies#shipping-and-return-policy" },
    { label: "Cancellation & Refund Policy", href: "/policies#cancellation-and-refund-policy" },
    { label: "Custom Orders", href: "/tailoring" }
  ],
  Brand: [
    { label: "About", href: "/about" },
    { label: "Lookbook", href: "/lookbook" },
    { label: "Contact", href: "/contact" },
    { label: "Tailoring", href: "/tailoring" }
  ]
};

export function Footer() {
  return (
    <footer className="border-t hairline px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.4fr_2fr]">
        <div>
          <h2 className="font-serif text-4xl">Spurge <span className="text-gold">Africa</span></h2>
          <p className="mt-4 max-w-md text-sm leading-7 text-muted">
            Luxury African fashion for ready-to-wear wardrobes and bespoke ceremonial tailoring.
          </p>
          <div className="mt-5 space-y-3 text-sm text-muted">
            <a href="tel:+2348115656501" className="flex items-center gap-3 transition hover:text-gold">
              <Phone size={16} className="text-gold" /> 08115656501
            </a>
            <p className="flex items-start gap-3">
              <MapPin size={16} className="mt-0.5 shrink-0 text-gold" />
              <span>Eleganza Gardens Estate, Lekki, Lagos</span>
            </p>
          </div>
          <div className="mt-6 flex gap-3">
            {[Instagram, Music2, Send].map((Icon, index) => (
              <a key={index} href="#" aria-label="Social link" className="grid h-10 w-10 place-items-center rounded-full border hairline transition hover:border-gold hover:text-gold">
                <Icon size={17} />
              </a>
            ))}
          </div>
        </div>
        <div className="grid gap-8 sm:grid-cols-3">
          {Object.entries(links).map(([title, entries]) => (
            <div key={title}>
              <h3 className="font-display text-xs uppercase tracking-[.24em] text-gold">{title}</h3>
              <div className="mt-5 grid gap-3 text-sm text-muted">
                {entries.map(entry => (
                  <Link key={entry.label} href={entry.href} className="transition hover:text-gold">
                    {entry.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stock & Delivery Info Bar */}
      <div className="mx-auto mt-8 max-w-7xl rounded-lg border hairline bg-black/20 p-4 text-center text-sm text-muted">
        <p className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-green-500" /> In Stock: Ships in 3–7 days</span>
          <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-amber-500" /> Low Stock: Ships in 5–10 days</span>
          <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-blue-500" /> Made to Order: 2–3 weeks</span>
        </p>
      </div>

      <div className="mx-auto mt-8 flex max-w-7xl flex-col justify-between gap-3 border-t hairline pt-6 text-xs text-muted sm:flex-row">
        <p>© 2026 Spurge Africa. All rights reserved.</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          <Link href="/policies#shipping-and-return-policy" className="hover:text-gold">Shipping & Returns</Link>
          <Link href="/policies#cancellation-and-refund-policy" className="hover:text-gold">Cancellation & Refund</Link>
          <Link href="/contact" className="hover:text-gold">Contact</Link>
        </div>
      </div>
    </footer>
  );
}

