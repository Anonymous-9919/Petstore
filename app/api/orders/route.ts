import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const orderSchema = z.object({
  customer: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(1),
  }),
  delivery: z.object({
    method: z.enum(["delivery", "pickup"]),
    branchId: z.string().nullable().optional(),
    address: z.any().nullable().optional(),
  }),
  items: z.array(z.object({
    productId: z.string(),
    name: z.string(),
    nameAr: z.string().optional(),
    price: z.number(),
    quantity: z.number().int().min(1),
    image: z.string().optional(),
  })).min(1),
  subtotal: z.number(),
  deliveryFee: z.number(),
  total: z.number(),
  paymentMethod: z.string().default("knet"),
  notes: z.string().optional(),
  promotionCode: z.string().optional(),
});

function genOrderNumber() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `ORD-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = orderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid order", issues: parsed.error.flatten() }, { status: 400 });
    }

    const { customer, delivery, items, subtotal, deliveryFee, total, paymentMethod, notes, promotionCode } = parsed.data;

    // Find or create customer
    const customerRecord = await prisma.customer.upsert({
      where: { phone: customer.phone },
      update: {
        name: customer.name,
        email: customer.email,
      },
      create: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        totalOrders: 0,
        totalSpent: 0,
      },
    });

    // Resolve branch
    let branchId: string | null = null;
    if (delivery.branchId) {
      branchId = delivery.branchId;
    } else if (delivery.method === "pickup") {
      const firstBranch = await prisma.branch.findFirst({ where: { active: true, pickupAvailable: true } });
      branchId = firstBranch?.id || null;
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber: genOrderNumber(),
        customerId: customerRecord.id,
        branchId,
        status: "pending",
        paymentStatus: "pending",
        paymentMethod,
        deliveryMethod: delivery.method,
        subtotal,
        deliveryFee,
        total,
        address: delivery.address ? JSON.stringify(delivery.address) : null,
        notes: notes || null,
        promotionCode: promotionCode || null,
        items: {
          create: items.map((i) => ({
            productId: i.productId,
            name: i.name,
            nameAr: i.nameAr || i.name,
            price: i.price,
            quantity: i.quantity,
            image: i.image || null,
          })),
        },
      },
      include: { items: true },
    });

    // Decrement inventory + log
    for (const item of items) {
      try {
        const product = await prisma.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
        await prisma.inventoryLog.create({
          data: {
            productId: item.productId,
            change: -item.quantity,
            reason: "sale",
            orderId: order.id,
          },
        });
        if (product.stock <= product.lowStockThreshold) {
          await prisma.notification.create({
            data: {
              type: "stock",
              title: "Low stock alert",
              message: `${product.name} is now at ${product.stock} units`,
              link: `/admin/inventory`,
            },
          });
        }
      } catch {
        // product not in DB, skip
      }
    }

    // Update customer stats
    await prisma.customer.update({
      where: { id: customerRecord.id },
      data: {
        totalOrders: { increment: 1 },
        totalSpent: { increment: total },
      },
    });

    // Create notification
    await prisma.notification.create({
      data: {
        type: "order",
        title: "New order received",
        message: `Order #${order.orderNumber.slice(0, 8)} from ${customer.name} — ${total.toFixed(3)} KWD`,
        link: `/admin/orders/${order.id}`,
      },
    });

    return NextResponse.json({
      ok: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
    });
  } catch (e) {
    console.error("Checkout error:", e);
    return NextResponse.json({ error: "Order failed" }, { status: 500 });
  }
}
