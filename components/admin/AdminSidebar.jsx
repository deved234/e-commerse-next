"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  Tag,
  LogOut,
  ShoppingBag,
  BadgePercent,
} from "lucide-react";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/categories", label: "Categories", icon: Tag },
  { href: "/admin/promo", label: "Promo Codes", icon: BadgePercent },
];

export default function AdminSidebar({ user }) {
  const pathname = usePathname();

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-slate-900 border-r border-slate-800 flex flex-col z-40">
      {/* Logo */}
      <div className="p-6 border-b border-slate-800">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-amber-400 rounded-lg flex items-center justify-center">
            <ShoppingBag className="w-4 h-4 text-slate-900" />
          </div>
          <div>
            <p className="text-white font-bold text-sm">ShopZone</p>
            <p className="text-amber-400 text-xs">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "bg-amber-400/10 text-amber-400 border border-amber-400/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 bg-amber-400/10 border border-amber-400/30 rounded-full flex items-center justify-center text-amber-400 font-bold text-sm">
            {user?.name?.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">
              {user?.name}
            </p>
            <p className="text-slate-500 text-xs truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-2 w-full px-3 py-2 text-rose-400 hover:text-rose-300 hover:bg-rose-400/10 rounded-xl transition-colors text-sm"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </aside>
  );
}
