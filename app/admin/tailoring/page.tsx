import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TailoringListClient } from "./TailoringListClient";

export default async function AdminTailoringPage() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const enquiries = await prisma.tailoringEnquiry.findMany({
    orderBy: { createdAt: "desc" }
  });

  return <TailoringListClient initialEnquiries={enquiries} />;
}
