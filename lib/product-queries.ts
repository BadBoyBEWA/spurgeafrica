import { prisma } from "./prisma";

export async function getProducts(filters?: { category?: string; occasion?: string }) {
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      ...(filters?.category ? { category: filters.category } : {}),
      ...(filters?.occasion ? { occasion: filters.occasion } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  return products.map((p) => ({
    ...p,
    gallery: JSON.parse(p.gallery) as string[],
  }));
}

export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug, isActive: true },
  });

  if (!product) return null;

  return {
    ...product,
    gallery: JSON.parse(product.gallery) as string[],
  };
}

export async function searchProducts(query: string) {
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      OR: [
        { name: { contains: query } },
        { description: { contains: query } },
      ],
    },
  });

  return products.map((p) => ({
    ...p,
    gallery: JSON.parse(p.gallery) as string[],
  }));
}
