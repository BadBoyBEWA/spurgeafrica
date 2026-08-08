import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { OrdersTable } from "./OrdersTable";

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: { include: { product: true } } },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gold mb-6">Orders</h1>
      <OrdersTable
        orders={orders.map((order) => ({
          id: order.id,
          createdAt: order.createdAt.toISOString(),
          customerName: order.customerName,
          email: order.email,
          status: order.status,
          items: order.items.map((item) => ({
            id: item.id,
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantity,
            price: item.price,
            product: item.product ? { name: item.product.name ?? "" } : null,
          })),
        }))}
      />
    </div>
  );
}
