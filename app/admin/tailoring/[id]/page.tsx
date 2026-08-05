import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { TailoringDetailClient } from "./TailoringDetailClient";

export default async function AdminTailoringDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const { id } = await params;

  const [enquiry, auditLogs] = await Promise.all([
    prisma.tailoringEnquiry.findUnique({
      where: { id },
    }),
    prisma.auditLog.findMany({
      where: {
        entityType: "TailoringEnquiry",
        entityId: id,
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  if (!enquiry) {
    notFound();
  }

  return <TailoringDetailClient enquiry={enquiry} auditLogs={auditLogs} />;
}
