import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getAllCollections } from "@/lib/collection-queries";
import Link from "next/link";
import { Plus } from "lucide-react";
import { CollectionsTable } from "./CollectionsTable";

export default async function AdminCollectionsPage() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const collections = await getAllCollections();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-gold/80">Catalog</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-cream">Collections</h1>
          <p className="mt-2 text-sm text-zinc-400">
            {collections.length} collection{collections.length !== 1 ? "s" : ""} — manage featured store categories and custom collection links.
          </p>
        </div>
        <Link
          href="/admin/collections/new"
          className="inline-flex w-fit items-center rounded-md bg-gold px-4 py-2 text-sm font-semibold text-night transition hover:bg-[#e1b968]"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Collection
        </Link>
      </div>

      <CollectionsTable collections={collections} />
    </div>
  );
}
