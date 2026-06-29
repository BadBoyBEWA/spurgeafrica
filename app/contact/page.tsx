import { Instagram, MapPin, Music2, Phone } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="px-4 pb-20 pt-32 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.85fr_1.15fr]">
        <section>
          <p className="font-display text-xs uppercase tracking-[.28em] text-gold">Contact</p>
          <h1 className="mt-3 font-serif text-5xl">Speak with the atelier</h1>
          <p className="mt-5 leading-8 text-muted">Ask about ready-to-wear availability, custom timelines, measurements, or delivery.</p>
          <div className="mt-8 grid gap-3">
            <a href="https://wa.me/2348000000000" className="flex items-center gap-3 border hairline p-4 hover:border-gold"><Phone size={18} /> WhatsApp</a>
            <a href="https://instagram.com" className="flex items-center gap-3 border hairline p-4 hover:border-gold"><Instagram size={18} /> Instagram</a>
            <a href="https://tiktok.com" className="flex items-center gap-3 border hairline p-4 hover:border-gold"><Music2 size={18} /> TikTok</a>
          </div>
        </section>
        <section className="glass p-5 sm:p-8">
          <form action="/api/contact" method="post" className="grid gap-4">
            {["name", "email", "phone"].map(field => (
              <input key={field} name={field} required placeholder={field} className="border hairline bg-transparent px-4 py-4 capitalize outline-none" />
            ))}
            <textarea name="message" required rows={6} placeholder="Message" className="border hairline bg-transparent px-4 py-4 outline-none" />
            <button className="bg-gold px-7 py-4 font-display text-xs uppercase tracking-[.22em] text-night">Send Message</button>
          </form>
          <div className="mt-8 grid min-h-72 place-items-center border border-dashed hairline text-center text-muted">
            <span><MapPin className="mx-auto mb-3 text-gold" /> Google Map Placeholder</span>
          </div>
        </section>
      </div>
    </main>
  );
}
