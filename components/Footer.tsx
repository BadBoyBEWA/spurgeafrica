import Link from "next/link";
import { Instagram, Music2, Send } from "lucide-react";

const links = {
  Shop: ["Agbada", "Senator Wear", "Kaftan", "Wedding Collection"],
  Support: ["Size Guide", "Shipping", "Returns", "Custom Orders"],
  Brand: ["About", "Lookbook", "Contact", "Tailoring"]
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
                  <Link key={entry} href="#" className="transition hover:text-gold">
                    {entry}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mx-auto mt-12 flex max-w-7xl flex-col justify-between gap-3 border-t hairline pt-6 text-xs text-muted sm:flex-row">
        <p>© 2026 Spurge Africa. All rights reserved.</p>
        <p>Made for dark editorial commerce.</p>
      </div>
    </footer>
  );
}
