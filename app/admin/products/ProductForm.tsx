"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProduct, updateProduct } from "./actions";

type ProductFormProps = {
  initialData?: any;
};

export function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    
    try {
      const formData = new FormData(event.currentTarget);
      if (initialData) {
        await updateProduct(initialData.id, formData);
      } else {
        await createProduct(formData);
      }
      router.push("/admin/products");
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input required type="text" name="name" defaultValue={initialData?.name} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-black focus:outline-none focus:ring-1 focus:ring-black sm:text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Price (₦)</label>
          <input required type="number" name="price" defaultValue={initialData?.price} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-black focus:outline-none focus:ring-1 focus:ring-black sm:text-sm" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea required name="description" rows={3} defaultValue={initialData?.description} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-black focus:outline-none focus:ring-1 focus:ring-black sm:text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select name="category" defaultValue={initialData?.category || "Agbada"} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-black focus:outline-none focus:ring-1 focus:ring-black sm:text-sm">
            <option>Agbada</option>
            <option>Senator</option>
            <option>Kaftan</option>
            <option>Casual</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Occasion</label>
          <select name="occasion" defaultValue={initialData?.occasion || "Wedding"} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-black focus:outline-none focus:ring-1 focus:ring-black sm:text-sm">
            <option>Wedding</option>
            <option>Corporate</option>
            <option>Casual</option>
            <option>Traditional</option>
            <option>Luxury</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Color</label>
          <input required type="text" name="color" defaultValue={initialData?.color} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-black focus:outline-none focus:ring-1 focus:ring-black sm:text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Fabric</label>
          <input required type="text" name="fabric" defaultValue={initialData?.fabric} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-black focus:outline-none focus:ring-1 focus:ring-black sm:text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Stock</label>
          <input required type="number" name="stock" defaultValue={initialData?.stock ?? 10} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-black focus:outline-none focus:ring-1 focus:ring-black sm:text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Product Image</label>
          <input type="file" name="image" accept="image/*" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100" />
          {initialData?.image && (
            <div className="mt-2">
              <img src={initialData.image} alt="Current" className="h-20 w-20 object-cover rounded" />
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button type="button" onClick={() => router.back()} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
        <button type="submit" disabled={loading} className="px-4 py-2 bg-black border border-transparent rounded-md text-sm font-medium text-white hover:bg-gray-800 disabled:bg-gray-400">
          {loading ? "Saving..." : "Save Product"}
        </button>
      </div>
    </form>
  );
}
