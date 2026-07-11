import { prisma } from "@/lib/db";
import { BannersManager } from "@/components/admin/banners-manager";

export const dynamic = "force-dynamic";

export default async function ContentPage() {
  const banners = await prisma.banner.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
  return (
    <div className="space-y-5 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Banners & Content</h2>
        <p className="text-sm text-gray-500 mt-1">
          Manage hero banners and homepage content. The active hero banner appears on the homepage.
        </p>
      </div>
      <BannersManager initial={banners} />
    </div>
  );
}
