import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatPrice } from "@/lib/data";

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true, payments: true }
  });

  if (!order) {
    return <div>Order not found</div>;
  }

  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Order {order.id}</h1>
        <Link href="/admin/orders" className="text-sm text-blue-600 hover:text-blue-800">
          Back to Orders
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-medium text-gray-900">Items</h2>
            </div>
            <div className="p-6">
              <ul className="divide-y divide-gray-200">
                {order.items.map((item) => (
                  <li key={item.id} className="py-4 flex justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.productId}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                  </li>
                ))}
              </ul>
              <div className="mt-6 border-t border-gray-200 pt-4 flex justify-between">
                <span className="font-medium text-gray-900">Total</span>
                <span className="font-bold text-gray-900">{formatPrice(subtotal)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Customer</h2>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium text-gray-500">Name:</span> {order.customerName}</p>
              <p><span className="font-medium text-gray-500">Email:</span> <a href={`mailto:${order.email}`} className="text-blue-600">{order.email}</a></p>
              <p><span className="font-medium text-gray-500">Phone:</span> {order.phone}</p>
            </div>
            
            <h2 className="text-lg font-medium text-gray-900 mt-6 mb-4">Shipping</h2>
            <div className="space-y-2 text-sm">
              <p>{order.address}</p>
              <p>{order.city}, {order.state} {order.postalCode}</p>
              <p>{order.country}</p>
              <p className="mt-2"><span className="font-medium text-gray-500">Method:</span> {order.deliveryMethod || 'Standard'}</p>
            </div>
          </div>

          <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Payment</h2>
            {order.payments.length > 0 ? (
              <div className="space-y-2 text-sm">
                <p><span className="font-medium text-gray-500">Status:</span> {order.payments[0].status}</p>
                <p><span className="font-medium text-gray-500">Reference:</span> {order.payments[0].reference}</p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No payment records found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
