import { prisma } from "@/lib/db";
import { BarChart3, TrendingUp, Users, ShoppingCart } from "@/lib/icons";
import { formatKWD } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const now = new Date();
  const last7 = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const last30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [allOrders, totalCustomers, totalProducts, topProducts] = await Promise.all([
    prisma.order.findMany({
      where: { createdAt: { gte: last30 } },
      select: { total: true, createdAt: true, status: true, paymentStatus: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.customer.count(),
    prisma.product.count(),
    prisma.orderItem.groupBy({
      by: ["productId"],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    }),
  ]);

  // Build 7-day chart
  const days: { label: string; total: number; count: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    d.setHours(0, 0, 0, 0);
    const next = new Date(d);
    next.setDate(d.getDate() + 1);
    const dayOrders = allOrders.filter((o) => o.createdAt >= d && o.createdAt < next);
    days.push({
      label: d.toLocaleDateString("en", { weekday: "short" }),
      total: dayOrders.reduce((s, o) => s + (o.total ?? 0), 0),
      count: dayOrders.length,
    });
  }

  const total30 = allOrders.reduce((s, o) => s + o.total, 0);
  const maxDay = Math.max(...days.map((d) => d.total), 1);

  const productNames = await prisma.product.findMany({
    where: { id: { in: topProducts.map((t) => t.productId ?? "").filter(Boolean) } },
    select: { id: true, name: true },
  });
  const nameMap = new Map(productNames.map((p) => [p.id, p.name]));

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
        <p className="text-sm text-gray-500">Last 30 days performance</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Metric label="30-day Revenue" value={formatKWD(total30)} icon={TrendingUp} color="green" />
        <Metric label="30-day Orders" value={allOrders.length.toString()} icon={ShoppingCart} color="orange" />
        <Metric label="Customers" value={totalCustomers.toString()} icon={Users} color="purple" />
        <Metric label="Products" value={totalProducts.toString()} icon={BarChart3} color="blue" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <h3 className="font-bold text-gray-900 mb-4">Revenue (last 7 days)</h3>
        <div className="flex items-end gap-2 h-40">
          {days.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="text-[10px] text-gray-500">{formatKWD(d.total)}</div>
              <div
                className="w-full bg-gradient-to-t from-[#ff6600] to-[#ff8533] rounded-t transition-all"
                style={{ height: `${(d.total / maxDay) * 100}%`, minHeight: d.count > 0 ? "4px" : "0" }}
              />
              <div className="text-[10px] text-gray-500">{d.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <h3 className="font-bold text-gray-900 mb-4">Top selling products</h3>
        {topProducts.length === 0 ? (
          <p className="text-sm text-gray-500">No sales data yet</p>
        ) : (
          <div className="space-y-2">
            {topProducts.map((t, i) => (
              <div key={t.productId ?? i} className="flex items-center gap-3 p-2.5 rounded-lg bg-gray-50">
                <span className="text-sm font-bold text-gray-500 w-6">#{i + 1}</span>
                <p className="text-sm font-medium text-gray-900 flex-1 truncate">{nameMap.get(t.productId ?? "") || "—"}</p>
                <span className="text-sm font-semibold text-[#ff6600]">{t._sum.quantity} sold</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Metric({ label, value, icon: Icon, color }: { label: string; value: string; icon: React.ElementType; color: string }) {
  const colors: Record<string, string> = {
    green: "from-green-500 to-emerald-500",
    blue: "from-blue-500 to-cyan-500",
    orange: "from-orange-500 to-amber-500",
    purple: "from-purple-500 to-pink-500",
  };
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs sm:text-sm text-gray-500 truncate">{label}</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1 truncate">{value}</p>
        </div>
        <div className={`shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${colors[color]} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  );
}
