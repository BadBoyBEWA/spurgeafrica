import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Eye } from "lucide-react";
import { formatPrice } from "@/lib/data";

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
      
      <div className="bg-zinc-900 shadow-sm border border-zinc-800 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-zinc-800">
          <thead className="bg-zinc-950">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Items</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-zinc-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800 text-sm">
            {orders.map((order) => {
              const total = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
              
              return (
                <tr key={order.id} className="hover:bg-zinc-800/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-white font-medium">{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-zinc-400">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-zinc-300">{order.customerName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-zinc-300">
                    <div className="truncate max-w-[200px]" title={order.items.map((i: any) => `${i.quantity}x ${i.product?.name || i.productName || i.productId}`).join(', ')}>
                      {order.items.map((i: any) => `${i.quantity}x ${i.product?.name || i.productName || i.productId}`).join(', ')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gold">{formatPrice(total)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      order.status === "confirmed" ? "bg-green-100/10 text-green-400" :
                      order.status === "pending" ? "bg-yellow-100/10 text-yellow-400" :
                      "bg-zinc-800 text-zinc-300"
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                    <Link href={`/admin/orders/${order.id}`} className="text-zinc-400 hover:text-gold inline-flex items-center">
                      <Eye className="h-4 w-4 mr-1" /> View
                    </Link>
                  </td>
                </tr>
              );
            })}
            
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-zinc-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
