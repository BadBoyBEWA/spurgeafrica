import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatPrice } from "@/lib/data";
import {
  ArrowUpRight,
  Mail,
  MessageSquare,
  Scissors,
  ShoppingBag,
  Users,
  WalletCards,
} from "lucide-react";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return null;
  }

  const [
    totalOrders,
    recentOrders,
    totalRevenueData,
    subscribers,
    pendingTailoring,
    unreadMessages,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { items: { include: { product: true } } },
    }),
    prisma.payment.aggregate({
      where: { status: "verified" },
      _sum: { amount: true },
    }),
    prisma.newsletterSubscriber.count(),
    prisma.tailoringEnquiry.count({ where: { status: "pending" } }),
    prisma.contactMessage.count({ where: { isRead: false } }),
  ]);

  const totalRevenue = totalRevenueData._sum.amount || 0;

  const stats = [
    { label: "Total Revenue", value: formatPrice(totalRevenue), icon: WalletCards, href: "/admin/orders" },
    { label: "Total Orders", value: totalOrders.toString(), icon: ShoppingBag, href: "/admin/orders" },
    { label: "Subscribers", value: subscribers.toString(), icon: Users, href: "/admin/subscribers" },
    { label: "Pending Tailoring", value: pendingTailoring.toString(), icon: Scissors, href: "/admin/tailoring" },
    { label: "Unread Messages", value: unreadMessages.toString(), icon: Mail, href: "/admin/messages" },
  ];

  const quickActions = [
    { label: "View orders", href: "/admin/orders" },
    { label: "Add product", href: "/admin/products/new" },
    { label: "Tailoring enquiries", href: "/admin/tailoring" },
    { label: "Customer messages", href: "/admin/messages" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-gold/80">
            Admin overview
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold text-cream">Dashboard</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
            Track store activity, follow up with customers, and jump into the operational queues that need attention.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex w-fit items-center rounded-md bg-gold px-4 py-2 text-sm font-semibold text-night transition hover:bg-[#e1b968]"
        >
          Add product
          <ArrowUpRight className="ml-2 h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="rounded-lg border border-white/10 bg-zinc-950/70 p-5 shadow-sm transition hover:border-gold/40 hover:bg-zinc-900"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-md border border-white/10 bg-white/[0.04] p-2 text-gold">
                  <Icon className="h-5 w-5" />
                </span>
                <ArrowUpRight className="h-4 w-4 text-zinc-600" />
              </div>
              <p className="mt-5 text-sm font-medium text-zinc-400">{stat.label}</p>
              <p className="mt-2 text-2xl font-semibold text-cream">{stat.value}</p>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_320px]">
        <div className="overflow-hidden rounded-lg border border-white/10 bg-zinc-950/70 shadow-sm">
          <div className="flex flex-col gap-3 border-b border-white/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-cream">Recent Orders</h2>
              <p className="mt-1 text-sm text-zinc-500">Latest customer purchases and their current status.</p>
            </div>
            <Link href="/admin/orders" className="inline-flex items-center text-sm font-medium text-gold hover:text-[#e1b968]">
              View all
              <ArrowUpRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-zinc-800">
              <thead className="bg-zinc-950">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">Order ID</th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">Customer</th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">Date</th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">Items</th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="transition hover:bg-zinc-900/70">
                    <td className="whitespace-nowrap px-5 py-4 text-sm font-medium text-gold">
                      <Link href={`/admin/orders/${order.id}`}>{order.id}</Link>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-cream">{order.customerName}</td>
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-zinc-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-zinc-400">
                      <div className="truncate max-w-[150px]" title={(order as any).items?.map((i: any) => `${i.quantity}x ${i.product?.name || i.productName || i.productId}`).join(', ')}>
                        {(order as any).items?.map((i: any) => `${i.quantity}x ${i.product?.name || i.productName || i.productId}`).join(', ')}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-sm">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                        order.status === "confirmed" ? "bg-green-400/10 text-green-300" :
                        order.status === "pending" ? "bg-yellow-400/10 text-yellow-300" :
                        "bg-zinc-800 text-zinc-300"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {recentOrders.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-14 text-center">
                      <ShoppingBag className="mx-auto h-8 w-8 text-zinc-700" />
                      <p className="mt-3 text-sm font-medium text-zinc-300">No orders yet</p>
                      <p className="mt-1 text-sm text-zinc-500">New customer orders will appear here.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="rounded-lg border border-white/10 bg-zinc-950/70 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="rounded-md border border-white/10 bg-white/[0.04] p-2 text-gold">
              <MessageSquare className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-semibold text-cream">Quick actions</h2>
              <p className="text-sm text-zinc-500">Common admin tasks.</p>
            </div>
          </div>
          <div className="mt-5 space-y-2">
            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="flex items-center justify-between rounded-md border border-white/10 px-3 py-3 text-sm text-zinc-300 transition hover:border-gold/40 hover:bg-white/[0.04] hover:text-gold"
              >
                {action.label}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
