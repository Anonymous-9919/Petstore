import { prisma } from "@/lib/db";
import { formatKWD } from "@/lib/utils";
import Link from "next/link";
import { DollarSign, ShoppingCart, Users, Package, AlertTriangle, TrendingUp, Plus, Tags, BarChart3, FileText } from "@/lib/icons";
import { StatCard } from "@/components/admin/stat-card";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [orderCount, customerCount, productCount, lowStock, recentOrders, todayRevenue, weekRevenue, pendingOrders] =
    await Promise.all([
      prisma.order.count(),
      prisma.customer.count(),
      prisma.product.count({ where: { active: true } }),
      prisma.product.findMany({
        where: { active: true, stock: { lte: 5 } },
        take: 5,
        orderBy: { stock: "asc" },
        select: { id: true, name: true, stock: true, lowStockThreshold: true },
      }),
      prisma.order.findMany({
        take: 8,
        orderBy: { createdAt: "desc" },
        include: { customer: true, branch: true },
      }),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } },
      }),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
      }),
      prisma.order.count({ where: { status: { in: ["pending", "confirmed"] } } }),
    ]);

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-blue-100 text-blue-700",
    preparing: "bg-indigo-100 text-indigo-700",
    ready: "bg-purple-100 text-purple-700",
    out_for_delivery: "bg-cyan-100 text-cyan-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  const quickActions = [
    { href: "/admin/products/new", label: "Add Product", icon: Plus, color: "bg-[#ff6600] hover:bg-[#e55b00]" },
    { href: "/admin/orders", label: "View Orders", icon: ShoppingCart, color: "bg-blue-600 hover:bg-blue-700" },
    { href: "/admin/products", label: "Manage Products", icon: Package, color: "bg-green-600 hover:bg-green-700" },
    { href: "/admin/categories", label: "Categories", icon: Tags, color: "bg-purple-600 hover:bg-purple-700" },
    { href: "/admin/inventory", label: "Inventory", icon: BarChart3, color: "bg-orange-600 hover:bg-orange-700" },
    { href: "/admin/content", label: "Edit Content", icon: FileText, color: "bg-gray-700 hover:bg-gray-800" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-sm text-gray-500 mt-1">Overview of your store performance</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Today's Revenue" value={formatKWD(todayRevenue._sum.total || 0)} icon={DollarSign} color="green" />
        <StatCard label="Week Revenue" value={formatKWD(weekRevenue._sum.total || 0)} icon={TrendingUp} color="blue" />
        <StatCard label="Total Orders" value={orderCount.toString()} icon={ShoppingCart} color="orange" />
        <StatCard label="Customers" value={customerCount.toString()} icon={Users} color="purple" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl text-white ${action.color} transition-colors text-center`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs sm:text-sm font-semibold">{action.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Recent Orders ({pendingOrders} pending)</h3>
            <Link href="/admin/orders" className="text-xs text-[#ff6600] hover:underline">View all →</Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-gray-500 py-8 text-center">No orders yet</p>
          ) : (
            <div className="space-y-2">
              {recentOrders.map((o) => (
                <Link
                  key={o.id}
                  href={`/admin/orders/${o.id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 border border-gray-100"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {o.customer.name} <span className="text-gray-400">#{o.orderNumber.slice(0, 8)}</span>
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(o.createdAt).toLocaleString()} · {o.branch?.name || "No branch"}
                    </p>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <p className="text-sm font-bold text-[#ff6600]">{formatKWD(o.total)}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColors[o.status] || "bg-gray-100 text-gray-600"}`}>
                      {o.status.replace(/_/g, " ")}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Low Stock</h3>
            <Link href="/admin/inventory" className="text-xs text-[#ff6600] hover:underline">Manage</Link>
          </div>
          {lowStock.length === 0 ? (
            <div className="text-sm text-gray-500 py-8 text-center flex flex-col items-center gap-2">
              <Package className="w-8 h-8 text-gray-300" />
              All products in stock
            </div>
          ) : (
            <div className="space-y-2">
              {lowStock.map((p) => (
                <Link
                  key={p.id}
                  href={`/admin/products/${p.id}`}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-red-50 border border-red-100 hover:bg-red-100"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                    <p className="text-xs text-gray-500">Threshold: {p.lowStockThreshold}</p>
                  </div>
                  <span className="shrink-0 inline-flex items-center gap-1 text-xs font-bold text-red-600 bg-white px-2 py-0.5 rounded-full">
                    <AlertTriangle className="w-3 h-3" /> {p.stock}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
