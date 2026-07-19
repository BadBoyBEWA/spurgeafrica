"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProduct, updateProduct } from "./actions";

type ProductFormProps = {
  initialData?: any;
};

const inputClass =
  "mt-1 block w-full rounded-md border border-white/10 bg-white/[0.06] px-3 py-2.5 text-cream placeholder:text-zinc-600 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 sm:text-sm";
const labelClass = "block text-sm font-medium text-zinc-300";

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
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className={labelClass}>Name</label>
          <input required type="text" name="name" defaultValue={initialData?.name} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Price (NGN)</label>
          <input required type="number" name="price" defaultValue={initialData?.price} className={inputClass} />
        </div>
        <div className="md:col-span-2">
          <label className={labelClass}>Description</label>
          <textarea required name="description" rows={4} defaultValue={initialData?.description} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Category</label>
          <select name="category" defaultValue={initialData?.category || "Agbada"} className={inputClass}>
            <option>Agbada</option>
            <option>Senator</option>
            <option>Kaftan</option>
            <option>Casual</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Occasion</label>
          <select name="occasion" defaultValue={initialData?.occasion || "Wedding"} className={inputClass}>
            <option>Wedding</option>
            <option>Corporate</option>
            <option>Casual</option>
            <option>Traditional</option>
            <option>Luxury</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Color</label>
          <input required type="text" name="color" defaultValue={initialData?.color} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Fabric</label>
          <input required type="text" name="fabric" defaultValue={initialData?.fabric} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Stock</label>
          <input required type="number" name="stock" defaultValue={initialData?.stock ?? 10} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Product Image</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            className="mt-1 block w-full rounded-md border border-white/10 bg-white/[0.06] text-sm text-zinc-400 file:mr-4 file:border-0 file:bg-gold file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-night hover:file:bg-[#e1b968]"
          />
          {initialData?.image && (
            <div className="mt-3 flex items-center gap-3 rounded-md border border-white/10 bg-white/[0.04] p-3">
              <img src={initialData.image} alt="Current product" className="h-16 w-16 rounded-md object-cover" />
              <span className="text-sm text-zinc-400">Current image</span>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-5 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="rounded-md border border-white/10 px-4 py-2 text-sm font-medium text-zinc-300 transition hover:border-zinc-700 hover:bg-white/[0.04] hover:text-cream"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="rounded-md border border-transparent bg-gold px-4 py-2 text-sm font-semibold text-night transition hover:bg-[#e1b968] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save Product"}
        </button>
      </div>
    </form>
  );
}
