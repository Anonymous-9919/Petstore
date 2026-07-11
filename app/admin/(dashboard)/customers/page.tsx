import { prisma } from "@/lib/db";
import { formatKWD } from "@/lib/utils";
import { Search } from "@/lib/icons";

export const dynamic = "force-dynamic";

export default async function CustomersPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const customers = await prisma.customer.findMany({
    where: q
      ? { OR: [{ name: { contains: q } }, { phone: { contains: q } }, { email: { contains: q } }] }
      : {},
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Customers</h2>
        <p className="text-sm text-gray-500">{customers.length} customers</p>
      </div>

      <form className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Search by name, phone, email..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6600]/30 focus:border-[#ff6600]"
          />
        </div>
        <button type="submit" className="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg">Search</button>
      </form>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="text-left p-3">Customer</th>
                <th className="text-left p-3 hidden sm:table-cell">Phone</th>
                <th className="text-left p-3 hidden md:table-cell">Email</th>
                <th className="text-left p-3">Orders</th>
                <th className="text-left p-3">Total Spent</th>
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 ? (
                <tr><td colSpan={5} className="text-center p-12 text-gray-500">No customers yet</td></tr>
              ) : customers.map((c) => (
                <tr key={c.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#ff6600]/10 text-[#ff6600] flex items-center justify-center text-xs font-bold">
                        {c.name.charAt(0).toUpperCase()}
                      </div>
                      <p className="font-medium text-gray-900">{c.name}</p>
                    </div>
                  </td>
                  <td className="p-3 hidden sm:table-cell text-gray-600" dir="ltr">{c.phone}</td>
                  <td className="p-3 hidden md:table-cell text-gray-600">{c.email || "—"}</td>
                  <td className="p-3">{c.totalOrders}</td>
                  <td className="p-3 font-semibold text-[#ff6600]">{formatKWD(c.totalSpent)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
