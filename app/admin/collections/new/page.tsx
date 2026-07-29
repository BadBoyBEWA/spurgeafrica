import { CollectionForm } from "../CollectionForm";

export default function NewCollectionPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-gold/80">Catalog</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-cream">Add Collection</h1>
        <p className="mt-2 text-sm text-zinc-400">Create a new featured collection or category for the storefront.</p>
      </div>

      <div className="rounded-lg border border-white/10 bg-zinc-950/70 p-6 shadow-sm">
        <CollectionForm />
      </div>
    </div>
  );
}
