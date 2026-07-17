import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { ProductForm } from "../ProductForm";

export default async function NewProductPage() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
        <Link href="/admin/products" className="text-sm text-blue-600 hover:text-blue-800">
          Back to Products
        </Link>
      </div>
      <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6 max-w-3xl">
        <ProductForm />
      </div>
    </div>
  );
}
