import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ProductForm } from "../../ProductForm";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) return <div>Product not found</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
        <Link href="/admin/products" className="text-sm text-blue-600 hover:text-blue-800">
          Back to Products
        </Link>
      </div>
      <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6 max-w-3xl">
        <ProductForm initialData={product} />
      </div>
    </div>
  );
}
