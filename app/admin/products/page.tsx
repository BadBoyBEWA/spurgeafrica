import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getProducts } from "@/lib/product-queries";
import Link from "next/link";
import { formatPrice } from "@/lib/data";
import { ArrowUpRight, Pencil, Plus } from "lucide-react";

export default async function AdminProductsPage() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const products = await getProducts();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-gold/80">Catalog</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-cream">Products</h1>
          <p className="mt-2 text-sm text-zinc-400">Manage product listings, images, stock, and pricing.</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex w-fit items-center rounded-md bg-gold px-4 py-2 text-sm font-semibold text-night transition hover:bg-[#e1b968]"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border border-white/10 bg-zinc-950/70 shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-zinc-800">
            <thead className="bg-zinc-950">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">Stock</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-zinc-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {products.map((product) => (
                <tr key={product.id} className="transition hover:bg-zinc-900/70">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      <img className="h-11 w-11 rounded-md object-cover" src={product.image} alt="" />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-cream">{product.name}</div>
                        <Link href={`/products/${product.slug}`} className="mt-1 inline-flex items-center text-xs text-zinc-500 hover:text-gold">
                          View storefront
                          <ArrowUpRight className="ml-1 h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-400">{product.category}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gold">{formatPrice(product.price)}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-400">{product.stock}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <Link href={`/admin/products/${product.id}/edit`} className="inline-flex items-center text-zinc-400 hover:text-gold">
                      <Pencil className="mr-1 h-4 w-4" />
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-sm text-zinc-500">No products found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
