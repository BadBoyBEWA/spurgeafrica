import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatPrice } from "@/lib/data";
import { ArrowLeft, CreditCard, MapPin, Package, User } from "lucide-react";

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true, payments: true }
  });

  if (!order) {
    return <div className="text-zinc-400">Order not found</div>;
  }

  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const payment = order.payments[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-gold/80">Order detail</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-cream">Order {order.id}</h1>
          <p className="mt-2 text-sm text-zinc-400">{new Date(order.createdAt).toLocaleString()}</p>
        </div>
        <Link href="/admin/orders" className="inline-flex items-center text-sm font-medium text-zinc-400 hover:text-gold">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Orders
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <section className="overflow-hidden rounded-lg border border-white/10 bg-zinc-950/70 shadow-sm">
            <div className="flex items-center gap-3 border-b border-white/10 px-6 py-4">
              <Package className="h-5 w-5 text-gold" />
              <h2 className="text-lg font-semibold text-cream">Items</h2>
            </div>
            <div className="divide-y divide-zinc-800">
              {order.items.map((item) => (
                <div key={item.id} className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-medium text-cream">{item.productName || item.productId}</p>
                    <p className="mt-1 text-sm text-zinc-500">
                      Qty: {item.quantity}{item.productSize ? ` | Size: ${item.productSize}` : ""}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-gold">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between border-t border-white/10 bg-zinc-950 px-6 py-4">
              <span className="font-medium text-zinc-300">Total</span>
              <span className="text-lg font-bold text-cream">{formatPrice(subtotal)}</span>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-lg border border-white/10 bg-zinc-950/70 p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <User className="h-5 w-5 text-gold" />
              <h2 className="text-lg font-semibold text-cream">Customer</h2>
            </div>
            <div className="space-y-3 text-sm text-zinc-300">
              <p><span className="text-zinc-500">Name:</span> {order.customerName}</p>
              <p><span className="text-zinc-500">Email:</span> <a href={`mailto:${order.email}`} className="text-gold hover:text-[#e1b968]">{order.email}</a></p>
              <p><span className="text-zinc-500">Phone:</span> {order.phone}</p>
            </div>
          </section>

          <section className="rounded-lg border border-white/10 bg-zinc-950/70 p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <MapPin className="h-5 w-5 text-gold" />
              <h2 className="text-lg font-semibold text-cream">Shipping</h2>
            </div>
            <div className="space-y-2 text-sm text-zinc-300">
              <p>{order.address}</p>
              <p>{order.city}, {order.state} {order.postalCode}</p>
              <p>{order.country}</p>
              <p className="pt-2"><span className="text-zinc-500">Method:</span> {order.deliveryMethod || "Standard"}</p>
            </div>
          </section>

          <section className="rounded-lg border border-white/10 bg-zinc-950/70 p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-gold" />
              <h2 className="text-lg font-semibold text-cream">Payment</h2>
            </div>
            {payment ? (
              <div className="space-y-3 text-sm text-zinc-300">
                <p><span className="text-zinc-500">Status:</span> {payment.status}</p>
                <p className="break-all"><span className="text-zinc-500">Reference:</span> {payment.reference}</p>
              </div>
            ) : (
              <p className="text-sm text-zinc-500">No payment records found.</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
