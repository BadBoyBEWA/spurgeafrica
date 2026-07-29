import { prisma } from "./prisma";

export async function getCollections() {
  const collections = await prisma.collection.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
  return collections;
}

export async function getAllCollections() {
  const collections = await prisma.collection.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return collections;
}
