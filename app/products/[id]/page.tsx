import { notFound } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { ProductActions } from "@/components/ProductActions";
import { ProductCard } from "@/components/ProductCard";
import { formatPrice, products } from "@/lib/data";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = products.find(entry => entry.id === id);
  if (!product) notFound();

  const related = products.filter(entry => entry.category === product.category && entry.id !== product.id).slice(0, 3);

  return (
    <main className="px-4 pb-20 pt-32 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_.9fr]">
        <section className="grid gap-4 md:grid-cols-[92px_1fr]">
          <div className="hidden gap-3 md:grid">
            {product.gallery.map(image => <img key={image} src={image} alt="" className="aspect-square object-cover" />)}
          </div>
          <img src={product.image} alt={product.name} className="aspect-[4/5] w-full object-cover" />
        </section>
        <section className="lg:sticky lg:top-28 lg:h-fit">
          <p className="font-display text-xs uppercase tracking-[.28em] text-gold">{product.category}</p>
          <h1 className="mt-3 font-serif text-5xl">{product.name}</h1>
          <p className="mt-4 text-2xl text-gold">{formatPrice(product.price)}</p>
          <p className="mt-6 leading-8 text-muted">{product.description}</p>
          <div className="mt-7 grid gap-3 text-sm text-muted sm:grid-cols-2">
            <p><strong className="text-[var(--fg)]">Fabric:</strong> {product.fabric}</p>
            <p><strong className="text-[var(--fg)]">Color:</strong> {product.color}</p>
            <p><strong className="text-[var(--fg)]">Occasion:</strong> {product.occasion}</p>
            <p><strong className="text-[var(--fg)]">Finish:</strong> Hand detailed</p>
          </div>
          <ProductActions product={{ id: product.id, name: product.name, price: product.price, image: product.image }} />
          {["Size Guide", "Shipping Info", "Customer Reviews"].map((title, index) => (
            <details key={title} className="mt-5 border-b hairline pb-5" open={index === 0}>
              <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
                {title}<ChevronDown size={18} />
              </summary>
              <p className="mt-4 text-sm leading-7 text-muted">
                {index === 0 ? "Use your chest, shoulder, sleeve, waist, and trouser length measurements for the cleanest fit." : index === 1 ? "Delivery estimates are confirmed after fabric availability and location review." : "Verified customer notes appear here when connected to a production review system."}
              </p>
            </details>
          ))}
        </section>
      </div>
      <section className="mx-auto mt-20 max-w-7xl">
        <h2 className="font-serif text-4xl">Related pieces</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {(related.length ? related : products.slice(0, 3)).map(entry => <ProductCard key={entry.id} product={entry} />)}
        </div>
      </section>
    </main>
  );
}
