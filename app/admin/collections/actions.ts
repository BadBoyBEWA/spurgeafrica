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

export async function createCollection(formData: FormData) {
  await requireAuth();

  const title = formData.get("title") as string;
  const href = formData.get("href") as string;
  const sortOrder = parseInt(formData.get("sortOrder") as string, 10) || 0;
  const imageFile = formData.get("image") as File | null;

  let imageUrl = "";
  if (imageFile && imageFile.size > 0) {
    imageUrl = await uploadImage(imageFile);
  } else {
    imageUrl = "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80";
  }

  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now();

  await prisma.collection.create({
    data: {
      title,
      slug,
      href,
      image: imageUrl,
      sortOrder,
    },
  });

  revalidatePath(`/admin/collections`);
  revalidatePath(`/`);
}

export async function updateCollection(id: string, formData: FormData) {
  await requireAuth();

  const title = formData.get("title") as string;
  const href = formData.get("href") as string;
  const sortOrder = parseInt(formData.get("sortOrder") as string, 10) || 0;
  const imageFile = formData.get("image") as File | null;

  const data: any = {
    title,
    href,
    sortOrder,
  };

  if (imageFile && imageFile.size > 0) {
    const imageUrl = await uploadImage(imageFile);
    data.image = imageUrl;
  }

  await prisma.collection.update({
    where: { id },
    data,
  });

  revalidatePath(`/admin/collections`);
  revalidatePath(`/`);
}

export async function deleteCollection(id: string) {
  await requireAuth();
  await prisma.collection.delete({
    where: { id },
  });
  revalidatePath(`/admin/collections`);
  revalidatePath(`/`);
}

export async function bulkDeleteCollections(ids: string[]) {
  await requireAuth();
  if (!ids.length) return;
  await prisma.collection.deleteMany({
    where: { id: { in: ids } },
  });
  revalidatePath(`/admin/collections`);
  revalidatePath(`/`);
}
