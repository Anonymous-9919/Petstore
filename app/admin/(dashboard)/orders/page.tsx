import { prisma } from "@/lib/db";
import { formatKWD } from "@/lib/utils";
import Link from "next/link";
import { Search } from "@/lib/icons";

export const dynamic = "force-dynamic";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  preparing: "bg-indigo-100 text-indigo-700",
  ready: "bg-purple-100 text-purple-700",
  out_for_delivery: "bg-cyan-100 text-cyan-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default async function OrdersPage({ searchParams }: { searchParams: Promise<{ q?: string; status?: string }> }) {
  const { q = "", status } = await searchParams;

  const where: Record<string, unknown> = {};
  if (q) {
    where.OR = [
      { orderNumber: { contains: q } },
      { customer: { name: { contains: q } } },
      { customer: { phone: { contains: q } } },
    ];
  }
  if (status && status !== "all") where.status = status;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: { customer: true, branch: true, items: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    prisma.order.count(),
  ]);

  const statuses = ["all", "pending", "confirmed", "preparing", "ready", "out_for_delivery", "delivered", "cancelled"];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Orders</h2>
        <p className="text-sm text-gray-500">{orders.length} of {total} orders</p>
      </div>

      <form className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Search by order #, customer name or phone..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6600]/30 focus:border-[#ff6600]"
          />
        </div>
        <select name="status" defaultValue={status || "all"} className="px-3 py-2 rounded-lg border border-gray-300 text-sm">
          {statuses.map((s) => (
            <option key={s} value={s}>{s === "all" ? "All statuses" : s.replace(/_/g, " ")}</option>
          ))}
        </select>
        <button type="submit" className="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg">Filter</button>
      </form>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="text-left p-3">Order</th>
                <th className="text-left p-3 hidden md:table-cell">Customer</th>
                <th className="text-left p-3 hidden lg:table-cell">Branch</th>
                <th className="text-left p-3">Total</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3 hidden sm:table-cell">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr><td colSpan={6} className="text-center p-12 text-gray-500">No orders found</td></tr>
              ) : orders.map((o) => (
                <tr key={o.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="p-3">
                    <Link href={`/admin/orders/${o.id}`} className="text-[#ff6600] hover:underline font-medium">
                      #{o.orderNumber.slice(0, 8)}
                    </Link>
                  </td>
                  <td className="p-3 hidden md:table-cell">{o.customer.name}</td>
                  <td className="p-3 hidden lg:table-cell text-gray-600">{o.branch?.name || "—"}</td>
                  <td className="p-3 font-semibold">{formatKWD(o.total)}</td>
                  <td className="p-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${statusColors[o.status] || "bg-gray-100"}`}>
                      {o.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="p-3 hidden sm:table-cell text-xs text-gray-500">
                    {new Date(o.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
