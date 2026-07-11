import { prisma } from "@/lib/db";
import { formatKWD } from "@/lib/utils";
import Link from "next/link";
import { ChevronLeft, Package, User, MapPin, Calendar } from "@/lib/icons";
import { OrderStatusButtons } from "@/components/admin/order-status-buttons";

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

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { customer: true, branch: true, items: { include: { product: true } } },
  });

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Order not found</p>
        <Link href="/admin/orders" className="text-[#ff6600] hover:underline text-sm mt-2 inline-block">
          ← Back to orders
        </Link>
      </div>
    );
  }

  let address: Record<string, string> | null = null;
  try {
    if (order.address) address = JSON.parse(order.address);
  } catch {}

  return (
    <div className="space-y-5 max-w-5xl">
      <div className="flex items-center gap-2">
        <Link href="/admin/orders" className="p-2 -ml-2 rounded-lg hover:bg-gray-100">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Order #{order.orderNumber.slice(0, 12)}</h2>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        <span className={`ml-auto text-xs px-3 py-1 rounded-full font-semibold ${statusColors[order.status] || "bg-gray-100"}`}>
          {order.status.replace(/_/g, " ")}
        </span>
      </div>

      <OrderStatusButtons orderId={order.id} currentStatus={order.status} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Package className="w-4 h-4" /> Items ({order.items.length})
            </h3>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                  <div className="shrink-0 w-12 h-12 rounded-lg bg-gray-50 overflow-hidden flex items-center justify-center">
                    {item.image ? (
                      <img src={item.image} alt="" className="w-full h-full object-contain" />
                    ) : (
                      <span>🐾</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity} × {formatKWD(item.price)}</p>
                  </div>
                  <p className="font-semibold text-sm text-gray-900">{formatKWD(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 mt-3 pt-3 space-y-1.5 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>{formatKWD(order.subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Delivery</span><span>{formatKWD(order.deliveryFee)}</span></div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600"><span>Discount</span><span>-{formatKWD(order.discount)}</span></div>
              )}
              <div className="flex justify-between text-base font-bold pt-1.5 border-t border-gray-100">
                <span>Total</span>
                <span className="text-[#ff6600]">{formatKWD(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <User className="w-4 h-4" /> Customer
            </h3>
            <p className="text-sm font-medium text-gray-900">{order.customer.name}</p>
            <p className="text-xs text-gray-500 mt-0.5">{order.customer.email || "—"}</p>
            <p className="text-xs text-gray-500" dir="ltr">{order.customer.phone}</p>
            <div className="mt-3 pt-3 border-t border-gray-100 text-xs space-y-1">
              <div className="flex justify-between"><span className="text-gray-500">Total orders</span><span className="font-semibold">{order.customer.totalOrders}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Total spent</span><span className="font-semibold">{formatKWD(order.customer.totalSpent)}</span></div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4" /> {order.deliveryMethod === "pickup" ? "Pickup" : "Delivery"}
            </h3>
            {order.branch && (
              <p className="text-sm font-medium text-gray-900">{order.branch.name}</p>
            )}
            {address && (
              <div className="text-xs text-gray-600 mt-2 space-y-0.5">
                {Object.entries(address).map(([k, v]) => v ? (
                  <p key={k}><span className="text-gray-400">{k}:</span> {v}</p>
                ) : null)}
              </div>
            )}
            {order.notes && (
              <p className="text-xs text-gray-500 mt-2 italic">"{order.notes}"</p>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h3 className="font-bold text-gray-900 mb-2">Payment</h3>
            <p className="text-sm text-gray-600">Method: <span className="font-medium">{order.paymentMethod}</span></p>
            <p className="text-sm mt-1">
              Status:{" "}
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                order.paymentStatus === "paid" ? "bg-green-100 text-green-700" :
                order.paymentStatus === "failed" ? "bg-red-100 text-red-700" :
                "bg-yellow-100 text-yellow-700"
              }`}>
                {order.paymentStatus}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
