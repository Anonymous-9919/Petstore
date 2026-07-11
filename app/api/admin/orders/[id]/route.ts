import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { z } from "zod";

const orderUpdateSchema = z.object({
  status: z.enum(["pending", "confirmed", "preparing", "ready", "out_for_delivery", "delivered", "cancelled"]).optional(),
  paymentStatus: z.enum(["pending", "paid", "failed", "refunded"]).optional(),
});

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const parsed = orderUpdateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid data" }, { status: 400 });

  const order = await prisma.order.update({
    where: { id },
    data: parsed.data,
  });

  await prisma.activityLog.create({
    data: {
      userId: (session as { id: string }).id,
      action: "update",
      entity: "Order",
      entityId: id,
      details: `Updated order status: ${order.status}, payment: ${order.paymentStatus}`,
    },
  });

  if (parsed.data.status === "delivered" && order.paymentStatus === "paid") {
    await prisma.notification.create({
      data: {
        type: "order",
        title: "Order delivered",
        message: `Order #${order.orderNumber.slice(0, 8)} has been delivered`,
        link: `/admin/orders/${order.id}`,
      },
    });
  }

  return NextResponse.json({ ok: true });
}
