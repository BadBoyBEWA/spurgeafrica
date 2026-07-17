"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Unauthorized");
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  await requireAuth();
  await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });
  revalidatePath(`/admin/orders`);
  revalidatePath(`/admin/orders/${orderId}`);
}

export async function deleteProduct(productId: string) {
  await requireAuth();
  await prisma.product.update({
    where: { id: productId },
    data: { isActive: false },
  });
  revalidatePath(`/admin/products`);
}

export async function markMessageRead(messageId: string) {
  await requireAuth();
  await prisma.contactMessage.update({
    where: { id: messageId },
    data: { isRead: true },
  });
  revalidatePath(`/admin/messages`);
}

export async function updateTailoringStatus(enquiryId: string, status: string) {
  await requireAuth();
  await prisma.tailoringEnquiry.update({
    where: { id: enquiryId },
    data: { status },
  });
  revalidatePath(`/admin/tailoring`);
}

export async function removeSubscriber(subscriberId: string) {
  await requireAuth();
  await prisma.newsletterSubscriber.delete({
    where: { id: subscriberId },
  });
  revalidatePath(`/admin/subscribers`);
}
