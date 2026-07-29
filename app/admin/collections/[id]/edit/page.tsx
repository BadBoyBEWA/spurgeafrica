import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { CollectionForm } from "../../CollectionForm";

export default async function EditCollectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const collection = await prisma.collection.findUnique({
    where: { id },
  });

  if (!collection) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-gold/80">Catalog</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-cream">Edit Collection</h1>
        <p className="mt-2 text-sm text-zinc-400">Update collection details, image, or target link.</p>
      </div>

      <div className="rounded-lg border border-white/10 bg-zinc-950/70 p-6 shadow-sm">
        <CollectionForm initialData={collection} />
      </div>
    </div>
  );
}
