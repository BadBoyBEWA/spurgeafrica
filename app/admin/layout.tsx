"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingBag, Box, Mail, Users, Scissors, LogOut } from "lucide-react";
import { AdminProviders } from "./AdminProviders";

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const pathname = usePathname();

  if (!session) {
    return <>{children}</>;
  }

  const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { name: "Products", href: "/admin/products", icon: Box },
    { name: "Messages", href: "/admin/messages", icon: Mail },
    { name: "Subscribers", href: "/admin/subscribers", icon: Users },
    { name: "Tailoring", href: "/admin/tailoring", icon: Scissors },
  ];

  return (
    <div className="min-h-screen bg-black flex text-white">
      <aside className="w-64 bg-zinc-950 border-r border-zinc-800 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-zinc-800">
          <span className="text-lg font-bold text-gold">Spurge Admin</span>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive ? "bg-zinc-800 text-gold" : "text-zinc-400 hover:bg-zinc-900 hover:text-gold"
                }`}
              >
                <item.icon className="mr-3 flex-shrink-0 h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-zinc-800 space-y-2">
          <Link
            href="/"
            className="flex items-center w-full px-2 py-2 text-sm font-medium text-zinc-400 rounded-md hover:bg-zinc-900 hover:text-gold"
          >
            <Box className="mr-3 flex-shrink-0 h-5 w-5" />
            Back to Store
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="flex items-center w-full px-2 py-2 text-sm font-medium text-zinc-400 rounded-md hover:bg-zinc-900 hover:text-gold"
          >
            <LogOut className="mr-3 flex-shrink-0 h-5 w-5" />
            Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="md:hidden h-16 bg-zinc-950 border-b border-zinc-800 flex items-center px-4 justify-between">
           <span className="text-lg font-bold text-gold">Spurge Admin</span>
           <button onClick={() => signOut({ callbackUrl: "/admin/login" })} className="p-2">
             <LogOut className="h-5 w-5 text-zinc-400 hover:text-gold" />
           </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProviders>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AdminProviders>
  );
}
