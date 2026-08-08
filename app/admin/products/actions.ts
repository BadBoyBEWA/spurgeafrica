"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { uploadImage } from "@/lib/cloudinary";

async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Unauthorized");
  }
}

export async function createProduct(formData: FormData) {
  await requireAuth();

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const category = formData.get("category") as string;
  const occasion = (formData.get("occasion") as string | null) ?? "";
  const color = formData.get("color") as string;
  const fabric = formData.get("fabric") as string;
  const stock = parseInt(formData.get("stock") as string, 10);
  const imageFile = formData.get("image") as File | null;
  
  let imageUrl = "";
  if (imageFile && imageFile.size > 0) {
    imageUrl = await uploadImage(imageFile);
  } else {
    // Default fallback image if none provided
    imageUrl = "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=800&auto=format&fit=crop";
  }

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();

  await prisma.product.create({
    data: {
      name,
      slug,
      description,
      price,
      image: imageUrl,
      gallery: JSON.stringify([imageUrl]),
      category,
      occasion,
      color,
      fabric,
      stock,
    },
  });

  revalidatePath(`/admin/products`);
  revalidatePath(`/collections`);
  revalidatePath(`/`);
}

export async function updateProduct(id: string, formData: FormData) {
  await requireAuth();

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const category = formData.get("category") as string;
  const occasion = (formData.get("occasion") as string | null) ?? "";
  const color = formData.get("color") as string;
  const fabric = formData.get("fabric") as string;
  const stock = parseInt(formData.get("stock") as string, 10);
  const imageFile = formData.get("image") as File | null;
  
  const data: any = {
    name,
    description,
    price,
    category,
    occasion,
    color,
    fabric,
    stock,
  };

  if (imageFile && imageFile.size > 0) {
    const imageUrl = await uploadImage(imageFile);
    data.image = imageUrl;
    data.gallery = JSON.stringify([imageUrl]);
  }

  await prisma.product.update({
    where: { id },
    data,
  });

  revalidatePath(`/admin/products`);
  revalidatePath(`/collections`);
  revalidatePath(`/`);
}

export async function hardDeleteProduct(productId: string) {
  await requireAuth();
  // If the product has order history, soft-delete to preserve data integrity
  const orderCount = await prisma.orderItem.count({ where: { productId } });
  if (orderCount > 0) {
    await prisma.product.update({
      where: { id: productId },
      data: { isActive: false },
    });
  } else {
    await prisma.product.delete({ where: { id: productId } });
  }
  revalidatePath(`/admin/products`);
  revalidatePath(`/collections`);
  revalidatePath(`/`);
}

export async function bulkDeleteProducts(productIds: string[]) {
  await requireAuth();
  if (!productIds.length) return;
  // Separate products with and without order history
  const withOrders = await prisma.orderItem.findMany({
    where: { productId: { in: productIds } },
    select: { productId: true },
    distinct: ["productId"],
  });
  const withOrderIds = withOrders.map((i) => i.productId);
  const withoutOrderIds = productIds.filter((id) => !withOrderIds.includes(id));
  if (withOrderIds.length > 0) {
    await prisma.product.updateMany({
      where: { id: { in: withOrderIds } },
      data: { isActive: false },
    });
  }
  if (withoutOrderIds.length > 0) {
    await prisma.product.deleteMany({
      where: { id: { in: withoutOrderIds } },
    });
  }
  revalidatePath(`/admin/products`);
  revalidatePath(`/collections`);
  revalidatePath(`/`);
}
