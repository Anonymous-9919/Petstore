"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Package, Tags, ShoppingCart, Users, Store, Truck,
  BarChart3, FileText, Settings, UserCog, Bell, Menu, X, LogOut, ChevronLeft,
} from "@/lib/icons";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/products/new", label: "Add Product", icon: Package, isAction: true, parent: "/admin/products" },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/inventory", label: "Inventory", icon: Truck },
  { href: "/admin/branch-inventory", label: "Branch Stock", icon: Store },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/branches", label: "Branches", icon: Store },
  { href: "/admin/promotions", label: "Promotions", icon: Tags },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/content", label: "Content", icon: FileText },
  { href: "/admin/notifications", label: "Notifications", icon: Bell },
  { href: "/admin/staff", label: "Staff", icon: UserCog, role: "OWNER" },
  { href: "/admin/settings", label: "Settings", icon: Settings, role: "OWNER" },
];

export function AdminShell({
  children,
  user,
  unreadCount = 0,
}: {
  children: React.ReactNode;
  user: { name?: string | null; email?: string | null; role?: string };
  unreadCount?: number;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const filtered = navItems.filter((n) => !n.role || n.role === user.role);

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  };

  const handleSignOut = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const pageTitle = pathname === "/admin"
    ? "Dashboard"
    : pathname.split("/").pop()?.replace(/-/g, " ") || "Admin";

  const Sidebar = (
    <div className="flex flex-col h-full bg-white border-r border-gray-200 w-64">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between shrink-0">
        <Link href="/admin" className="flex items-center gap-2 min-w-0">
          <img src="/logo.jpg" alt="Pet Store" className="h-9 w-auto object-contain shrink-0" />
          <div className="min-w-0">
            <span className="text-sm font-bold text-gray-900 block truncate">Admin</span>
            <span className="text-[10px] text-gray-500 block truncate">Pet Store Kuwait</span>
          </div>
        </Link>
        <button onClick={() => setMobileOpen(false)} className="md:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 shrink-0" aria-label="Close menu">
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
        {filtered.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                item.isAction
                  ? "text-[#ff6600] hover:bg-orange-50 border border-dashed border-orange-200 mt-2"
                  : active
                    ? "bg-[#ff6600] text-white"
                    : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{item.label}</span>
              {item.isAction && !active && <span className="ml-auto text-[10px] bg-[#ff6600] text-white rounded-full px-1.5">+</span>}
              {!item.isAction && item.href === "/admin/notifications" && unreadCount > 0 && (
                <span className={cn("ml-auto text-[10px] font-bold rounded-full px-1.5 py-0.5 min-w-[18px] text-center", active ? "bg-white text-[#ff6600]" : "bg-red-500 text-white")}>
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-gray-200 shrink-0">
        <div className="flex items-center gap-2 mb-2 px-2">
          <div className="w-8 h-8 rounded-full bg-[#ff6600] text-white flex items-center justify-center text-xs font-bold shrink-0">
            {(user.name || user.email || "A").charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{user.name || "Admin"}</p>
            <p className="text-[10px] text-gray-500 truncate">{user.role}</p>
          </div>
        </div>
        <Link href="/" className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-500 hover:bg-gray-100">
          <ChevronLeft className="w-3.5 h-3.5" />
          Back to store
        </Link>
        <button onClick={handleSignOut} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-red-600 hover:bg-red-50">
          <LogOut className="w-3.5 h-3.5" />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="hidden md:flex md:fixed md:inset-y-0 md:left-0 md:z-40 flex-col">
        {Sidebar}
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileOpen(false)} className="fixed inset-0 bg-black/50 z-40 md:hidden" />
            <motion.aside initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", damping: 25 }} className="fixed inset-y-0 left-0 z-50 md:hidden flex flex-col">
              {Sidebar}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 md:ml-64 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => setMobileOpen(true)} className="md:hidden p-2 -ml-2 rounded-lg text-gray-600 hover:bg-gray-100 shrink-0" aria-label="Open menu">
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-base sm:text-lg font-bold text-gray-900 capitalize truncate">{pageTitle}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/admin/notifications" className="relative p-2 rounded-lg text-gray-600 hover:bg-gray-100 shrink-0">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />}
            </Link>
            <div className="hidden sm:flex items-center gap-2 px-2">
              <div className="w-7 h-7 rounded-full bg-[#ff6600] text-white flex items-center justify-center text-xs font-bold">
                {(user.name || user.email || "A").charAt(0).toUpperCase()}
              </div>
              <span className="text-xs text-gray-600 hidden lg:inline">{user.name}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
