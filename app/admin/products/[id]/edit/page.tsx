import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ProductForm } from "../../ProductForm";
import { ArrowLeft } from "lucide-react";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) return <div className="text-zinc-400">Product not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-gold/80">Catalog</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-cream">Edit Product</h1>
          <p className="mt-2 text-sm text-zinc-400">{product.name}</p>
        </div>
        <Link href="/admin/products" className="inline-flex items-center text-sm font-medium text-zinc-400 hover:text-gold">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Link>
      </div>
      <div className="max-w-3xl rounded-lg border border-white/10 bg-zinc-950/70 p-6 shadow-sm">
        <ProductForm initialData={product} />
      </div>
    </div>
  );
}
