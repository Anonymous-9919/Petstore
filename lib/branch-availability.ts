// lib/branch-availability.ts — Filter products by branch stock availability
import { prisma } from "./db";

export interface BranchProduct {
  productId: string;
  stock: number;
  active: boolean;
}

export async function getBranchStockMap(branchId: string | null): Promise<Map<string, BranchProduct>> {
  if (!branchId) return new Map();
  const stocks = await prisma.branchStock.findMany({ where: { branchId } });
  const map = new Map<string, BranchProduct>();
  for (const s of stocks) {
    map.set(s.productId, { productId: s.productId, stock: s.stock, active: s.active });
  }
  return map;
}

// For delivery: show all active products
// For pickup: show only products with branch stock > 0 (and active in that branch)
export async function getAvailableProducts(
  deliveryMethod: "delivery" | "pickup",
  branchId: string | null
) {
  if (deliveryMethod === "delivery" || !branchId) {
    return prisma.product.findMany({
      where: { active: true },
      include: { category: true, images: { take: 1, orderBy: { order: "asc" } } },
      orderBy: { createdAt: "desc" },
    });
  }
  // Pickup: only products with stock in this branch
  const branchProducts = await prisma.branchStock.findMany({
    where: { branchId, active: true, stock: { gt: 0 } },
    include: {
      product: {
        include: { category: true, images: { take: 1, orderBy: { order: "asc" } } },
      },
    },
    orderBy: { product: { createdAt: "desc" } },
  });
  return branchProducts
    .filter((bp) => bp.product.active)
    .map((bp) => bp.product);
}

export async function getProductAvailability(productId: string, branchId: string | null) {
  if (!branchId) return { available: true, stock: null };
  const stock = await prisma.branchStock.findUnique({
    where: { branchId_productId: { branchId, productId } },
  });
  if (!stock || !stock.active) return { available: false, stock: 0 };
  return { available: stock.stock > 0, stock: stock.stock };
}
