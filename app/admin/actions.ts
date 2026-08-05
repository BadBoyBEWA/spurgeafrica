"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function getAuthSession() {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function logAuditAction(params: {
  action: string;
  entityType: string;
  entityId: string;
  details?: string;
  adminEmail?: string;
}) {
  try {
    let email = params.adminEmail;
    if (!email) {
      const session = await getServerSession(authOptions);
      email = session?.user?.email ?? "system";
    }
    await prisma.auditLog.create({
      data: {
        adminEmail: email,
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId,
        details: params.details ?? null,
      },
    });
  } catch (err) {
    console.error("Failed to log audit action:", err);
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  const session = await getAuthSession();
  const oldOrder = await prisma.order.findUnique({ where: { id: orderId } });
  
  await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });

  await logAuditAction({
    adminEmail: session.user?.email ?? undefined,
    action: "ORDER_STATUS_UPDATE",
    entityType: "Order",
    entityId: orderId,
    details: `Updated order status from '${oldOrder?.status}' to '${status}'`,
  });

  revalidatePath(`/admin/orders`);
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath(`/admin/dashboard`);
}

export async function deleteProduct(productId: string) {
  const session = await getAuthSession();
  const product = await prisma.product.findUnique({ where: { id: productId } });

  await prisma.product.update({
    where: { id: productId },
    data: { isActive: false },
  });

  await logAuditAction({
    adminEmail: session.user?.email ?? undefined,
    action: "PRODUCT_DEACTIVATE",
    entityType: "Product",
    entityId: productId,
    details: `Deactivated product '${product?.name || productId}'`,
  });

  revalidatePath(`/admin/products`);
  revalidatePath(`/admin/dashboard`);
}

export async function markMessageRead(messageId: string) {
  const session = await getAuthSession();

  await prisma.contactMessage.update({
    where: { id: messageId },
    data: { isRead: true },
  });

  await logAuditAction({
    adminEmail: session.user?.email ?? undefined,
    action: "MESSAGE_READ",
    entityType: "ContactMessage",
    entityId: messageId,
    details: `Marked contact message as read`,
  });

  revalidatePath(`/admin/messages`);
  revalidatePath(`/admin/dashboard`);
}

export async function updateTailoringStatus(enquiryId: string, status: string) {
  const session = await getAuthSession();
  const oldEnquiry = await prisma.tailoringEnquiry.findUnique({ where: { id: enquiryId } });

  await prisma.tailoringEnquiry.update({
    where: { id: enquiryId },
    data: { status },
  });

  await logAuditAction({
    adminEmail: session.user?.email ?? undefined,
    action: "TAILORING_STATUS_UPDATE",
    entityType: "TailoringEnquiry",
    entityId: enquiryId,
    details: `Changed tailoring enquiry status for customer ${oldEnquiry?.name || enquiryId} from '${oldEnquiry?.status}' to '${status}'`,
  });

  revalidatePath(`/admin/tailoring`);
  revalidatePath(`/admin/tailoring/${enquiryId}`);
  revalidatePath(`/admin/dashboard`);
}

export async function updateTailoringProcessing(
  enquiryId: string,
  payload: { status?: string; priceQuote?: number | null; adminNotes?: string | null }
) {
  const session = await getAuthSession();
  const oldEnquiry = await prisma.tailoringEnquiry.findUnique({ where: { id: enquiryId } });

  const dataToUpdate: any = {};
  const changes: string[] = [];

  if (payload.status !== undefined && payload.status !== oldEnquiry?.status) {
    dataToUpdate.status = payload.status;
    changes.push(`Status changed from '${oldEnquiry?.status}' to '${payload.status}'`);
  }
  if (payload.priceQuote !== undefined && payload.priceQuote !== oldEnquiry?.priceQuote) {
    dataToUpdate.priceQuote = payload.priceQuote;
    changes.push(`Price quote set to '${payload.priceQuote !== null ? `$${payload.priceQuote}` : 'None'}'`);
  }
  if (payload.adminNotes !== undefined && payload.adminNotes !== oldEnquiry?.adminNotes) {
    dataToUpdate.adminNotes = payload.adminNotes;
    changes.push(`Updated internal admin processing notes`);
  }

  if (Object.keys(dataToUpdate).length > 0) {
    await prisma.tailoringEnquiry.update({
      where: { id: enquiryId },
      data: dataToUpdate,
    });

    await logAuditAction({
      adminEmail: session.user?.email ?? undefined,
      action: "TAILORING_PROCESSED",
      entityType: "TailoringEnquiry",
      entityId: enquiryId,
      details: `Processed enquiry for ${oldEnquiry?.name || enquiryId}: ${changes.join("; ")}`,
    });
  }

  revalidatePath(`/admin/tailoring`);
  revalidatePath(`/admin/tailoring/${enquiryId}`);
  revalidatePath(`/admin/dashboard`);
}

export async function removeSubscriber(subscriberId: string) {
  const session = await getAuthSession();
  const sub = await prisma.newsletterSubscriber.findUnique({ where: { id: subscriberId } });

  await prisma.newsletterSubscriber.delete({
    where: { id: subscriberId },
  });

  await logAuditAction({
    adminEmail: session.user?.email ?? undefined,
    action: "SUBSCRIBER_REMOVE",
    entityType: "NewsletterSubscriber",
    entityId: subscriberId,
    details: `Removed newsletter subscriber '${sub?.email || subscriberId}'`,
  });

  revalidatePath(`/admin/subscribers`);
  revalidatePath(`/admin/dashboard`);
}
