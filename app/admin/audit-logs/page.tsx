import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AuditLogClient } from "./AuditLogClient";

export default async function AdminAuditLogsPage() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return <AuditLogClient logs={logs} />;
}
