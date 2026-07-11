import { prisma } from "@/lib/db";
import { PromotionsManager } from "@/components/admin/promotions-manager";

export const dynamic = "force-dynamic";

export default async function PromotionsPage() {
  const promos = await prisma.promotion.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div className="space-y-5">
      <PromotionsManager
        initial={promos.map((p) => ({
          ...p,
          startsAt: p.startsAt?.toISOString() || null,
          expiresAt: p.expiresAt?.toISOString() || null,
        }))}
      />
    </div>
  );
}
